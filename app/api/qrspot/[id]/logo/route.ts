import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;
  const qrSpot = await prisma.qRSpot.findUnique({ where: { id } });

  if (!qrSpot || qrSpot.userId !== session.user.id) {
    return NextResponse.json({ error: "QR Spot non trovato" }, { status: 404 });
  }

  // Se esiste già un logo, rimuoviamo il vecchio file per pulizia
  if (qrSpot.customLogoPath) {
    try {
      const oldFilePath = path.join(process.cwd(), "public", qrSpot.customLogoPath.replace(/^\//, ""));
      await fs.unlink(oldFilePath);
    } catch (e) {
      // Ignora errori di unlink (es. file già rimosso)
    }
  }

  const formData = await req.formData();
  const file = formData.get("logo") as File;

  if (!file) {
    return NextResponse.json({ error: "Nessun file caricato" }, { status: 400 });
  }

  // Verifica dimensione massima: 2MB per i logo
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: "L'immagine del logo non può superare i 2MB" }, { status: 413 });
  }

  if (file.type !== "image/png" && file.type !== "image/jpeg") {
    return NextResponse.json({ error: "Sono ammessi solo file PNG o JPG per il logo" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Genera nome file sicuro
  const fileName = `logo_${qrSpot.id}_${Date.now()}.png`; // Esportiamo sempre in PNG forzato
  const userDir = path.join(process.cwd(), "public", "uploads", "logos", session.user.id);
  await fs.mkdir(userDir, { recursive: true });
  const filePath = path.join(userDir, fileName);

  try {
    // Ridimensiona in un quadrato 150x150, aggiungendo bordi bianchi (per loghi non quadrati) o trasparenti
    await sharp(buffer)
      .resize(150, 150, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 } // Trasparente
      })
      .png()
      .toFile(filePath);
      
    const publicUrl = `/uploads/logos/${session.user.id}/${fileName}`;

    await prisma.qRSpot.update({
      where: { id },
      data: { customLogoPath: publicUrl }
    });

    return NextResponse.json({ success: true, customLogoPath: publicUrl });
  } catch (error) {
    console.error("Errore elaborazione logo:", error);
    return NextResponse.json({ error: "Errore durante l'elaborazione dell'immagine" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;
  const qrSpot = await prisma.qRSpot.findUnique({ where: { id } });

  if (!qrSpot || qrSpot.userId !== session.user.id) {
    return NextResponse.json({ error: "QR Spot non trovato" }, { status: 404 });
  }

  if (qrSpot.customLogoPath) {
    try {
      // Elimina il file fisicamente dal server
      const filePath = path.join(process.cwd(), "public", qrSpot.customLogoPath.replace(/^\//, ""));
      await fs.unlink(filePath);
    } catch (e) {
      console.warn("Errore durante l'eliminazione fisica del logo (probabilmente non esisteva già)", e);
    }
  }

  await prisma.qRSpot.update({
    where: { id },
    data: { customLogoPath: null }
  });

  return NextResponse.json({ success: true });
}
