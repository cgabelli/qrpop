import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canUploadType } from "@/lib/plans";
import path from "path";
import fs from "fs/promises";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = parseInt(process.env.MAX_FILE_SIZE_MB ?? "50") * 1024 * 1024;

// GET - lista creatività dell'utente (opzionalmente filtrata per qrSpotId)
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const qrSpotId = searchParams.get("qrSpotId");

  const where: Record<string, unknown> = { userId: session.user.id };
  if (qrSpotId) where.qrSpotId = qrSpotId;

  const creativita = await prisma.creativita.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(creativita);
}

// POST - carica nuova creatività verso uno specifico QRSpot
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const title = formData.get("title") as string | null;
  const publishAt = formData.get("publishAt") as string | null;
  const expiresAt = formData.get("expiresAt") as string | null;
  const qrSpotId = formData.get("qrSpotId") as string | null;

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

  const fileTypeStr: "image" | "video" | "pdf" = isPdf ? "pdf" : isVideo ? "video" : "image";

  // Verifica che il QRSpot appartenga all'utente e sia attivo
  if (qrSpotId) {
    const qrSpot = await prisma.qRSpot.findFirst({
      where: { id: qrSpotId, userId: user.id },
    });

    if (!qrSpot) {
      return NextResponse.json({ error: "QR Spot non trovato" }, { status: 404 });
    }

    if (qrSpot.status !== "active") {
      return NextResponse.json({ error: "Il QR Spot non è attivo. Rinnova l'abbonamento per continuare." }, { status: 403 });
    }

    // Verifica che il tipo di file sia consentito dal QRSpot
    if (!canUploadType(qrSpot.type, fileTypeStr)) {
      return NextResponse.json({
        error: `Questo QR Spot supporta solo file di tipo "${qrSpot.type}". Hai caricato un file "${fileTypeStr}".`
      }, { status: 403 });
    }
  }

  // Salva file su disco
  const ext = path.extname(file.name);
  const fileName = `${user.id}_${Date.now()}${ext}`;
  const userDir = path.join(UPLOAD_DIR, user.id);
  await fs.mkdir(userDir, { recursive: true });
  const filePath = path.join(userDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  const relativePath = `/api/uploads/${user.id}/${fileName}`;

  // Determina status
  let status = "active";
  if (publishAt && new Date(publishAt) > new Date()) {
    status = "scheduled";
  }

  const creativita = await prisma.creativita.create({
    data: {
      userId: user.id,
      qrSpotId: qrSpotId ?? undefined,
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

  return NextResponse.json(creativita, { status: 201 });
}
