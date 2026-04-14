import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { 
      email, password, plan,
      isCompany, businessName, firstName, lastName,
      address, city, province, zipCode, phone,
      fiscalCode, vatNumber, sdiCode 
    } = data;

    // Validazione base
    if (!email || !password || !address || !city || !zipCode || !province) {
      return NextResponse.json({ error: "Compila tutti i campi obbligatori dell'indirizzo e account" }, { status: 400 });
    }

    if (isCompany) {
      if (!businessName || !vatNumber || !sdiCode) {
        return NextResponse.json({ error: "Ragione sociale, Partita IVA e SDI sono obbligatori per le aziende" }, { status: 400 });
      }
    } else {
      if (!firstName || !lastName || !fiscalCode) {
        return NextResponse.json({ error: "Nome, Cognome e Codice Fiscale sono obbligatori per i privati" }, { status: 400 });
      }
    }
    
    if (password.length < 8) {
      return NextResponse.json({ error: "La password deve essere di almeno 8 caratteri" }, { status: 400 });
    }

    // Controlla se email già esistente
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email già registrata" }, { status: 409 });
    }

    // Genera slug univoco
    const nameForSlug = isCompany ? businessName : `${firstName} ${lastName}`;
    let baseSlug = nameForSlug
      .toLowerCase()
      .replace(/[àáâä]/g, "a").replace(/[èéêë]/g, "e")
      .replace(/[ìíîï]/g, "i").replace(/[òóôö]/g, "o")
      .replace(/[ùúûü]/g, "u").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    let slug = baseSlug;
    let counter = 1;
    while (await prisma.user.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        slug,
        isActive: true,
        businessName: isCompany ? businessName : `${firstName} ${lastName}`,
        isCompany,
        firstName,
        lastName,
        address,
        city,
        province,
        zipCode,
        fiscalCode,
        vatNumber,
        sdiCode,
        phone,
        verificationToken
      },
    });

    // Crea un QRSpot predefinito basato sul piano scelto
    const spotType = plan && ["free", "image", "video", "pdf", "unlimited"].includes(plan) ? plan : "free";
    
    let spotSlug = `${slug}-qr`;
    let spotCounter = 1;
    while (await prisma.qRSpot.findUnique({ where: { slug: spotSlug } })) {
      spotSlug = `${slug}-qr-${spotCounter++}`;
    }

    await prisma.qRSpot.create({
      data: {
        userId: user.id,
        name: `Il mio QR ${spotType.toUpperCase()}`,
        slug: spotSlug,
        type: spotType,
        status: spotType === "free" ? "active" : "inactive", 
      }
    });

    // TEMPORANEAMENTE DISABILITATO 
    // Invia email di verifica
    // await sendVerificationEmail(email, verificationToken);

    return NextResponse.json({ success: true, message: "Account salvato con successo (Email disabilitata)" });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
