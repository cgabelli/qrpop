import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import path from "path";
import fs from "fs/promises";

// DELETE - elimina creatività
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;

  const creativita = await prisma.creativita.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!creativita) {
    return NextResponse.json({ error: "Creatività non trovata" }, { status: 404 });
  }

  // Elimina file dal disco
  try {
    const filePath = path.join(process.cwd(), "public", creativita.filePath);
    await fs.unlink(filePath);
  } catch (e) {
    console.error("File delete error:", e);
  }

  await prisma.creativita.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

// PATCH - aggiorna status, publishAt, expiresAt
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const creativita = await prisma.creativita.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!creativita) {
    return NextResponse.json({ error: "Creatività non trovata" }, { status: 404 });
  }

  const updated = await prisma.creativita.update({
    where: { id },
    data: {
      title: body.title ?? creativita.title,
      publishAt: body.publishAt !== undefined ? (body.publishAt ? new Date(body.publishAt) : null) : creativita.publishAt,
      expiresAt: body.expiresAt !== undefined ? (body.expiresAt ? new Date(body.expiresAt) : null) : creativita.expiresAt,
      status: body.status ?? creativita.status,
    },
  });

  return NextResponse.json(updated);
}
