import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canUpload } from "@/lib/plans";
import path from "path";
import fs from "fs/promises";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = parseInt(process.env.MAX_FILE_SIZE_MB ?? "50") * 1024 * 1024;

// GET - lista creatività dell'utente
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const creativita = await prisma.creativita.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(creativita);
}

// POST - carica nuova creatività
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });

  // Controlla limite upload
  if (!canUpload(user.plan, user.baseCredits, user.purchasedCredits)) {
    return NextResponse.json({ error: "Crediti di upload esauriti. Ricarica il tuo piano per continuare." }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const title = formData.get("title") as string | null;
  const publishAt = formData.get("publishAt") as string | null;
  const expiresAt = formData.get("expiresAt") as string | null;

  if (!file) {
    return NextResponse.json({ error: "Nessun file caricato" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: `File troppo grande (max ${process.env.MAX_FILE_SIZE_MB}MB)` }, { status: 413 });
  }

  const mimeType = file.type;
  const isImage = mimeType.startsWith("image/");
  const isVideo = mimeType.startsWith("video/");
  const isPdf = mimeType === "application/pdf";

  if (!isImage && !isVideo && !isPdf) {
    return NextResponse.json({ error: "Tipo file non supportato (solo immagini, video o PDF)" }, { status: 400 });
  }

  const plan = user.plan;
  if (isPdf && plan === "media") {
    return NextResponse.json({ error: "Il piano 'Media' non supporta l'upload di PDF. Fai l'upgrade al piano 'Pdf'." }, { status: 403 });
  }

  // Salva file
  const ext = path.extname(file.name);
  const fileName = `${user.id}_${Date.now()}${ext}`;
  const userDir = path.join(UPLOAD_DIR, user.id);
  await fs.mkdir(userDir, { recursive: true });
  const filePath = path.join(userDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  const relativePath = `/uploads/${user.id}/${fileName}`;

  // Determina status
  let status = "active";
  if (publishAt && new Date(publishAt) > new Date()) {
    status = "scheduled";
  }

  const fileTypeStr = isPdf ? "pdf" : isVideo ? "video" : "image";

  const creativita = await prisma.$transaction(async (tx: any) => {
    const created = await tx.creativita.create({
      data: {
        userId: user.id,
        type: fileTypeStr,
        filePath: relativePath,
        fileName: file.name,
        fileSize: file.size,
        title: title ?? file.name,
        publishAt: publishAt ? new Date(publishAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        status,
      },
    });

    // Deduct credit
    const isUnlimited = user.plan === "unlimited";
    if (!isUnlimited) {
       if (user.baseCredits > 0) {
          await tx.user.update({
            where: { id: user.id },
            data: { baseCredits: { decrement: 1 } },
          });
       } else if (user.purchasedCredits > 0) {
          await tx.user.update({
            where: { id: user.id },
            data: { purchasedCredits: { decrement: 1 } },
          });
       }
    }

    return created;
  });

  return NextResponse.json(creativita, { status: 201 });
}
