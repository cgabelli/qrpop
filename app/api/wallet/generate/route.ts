import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PKPass } from "passkit-generator";
import path from "path";
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    const { qrSpotId, firstName, lastName, email } = await req.json();

    if (!qrSpotId || !email || !firstName) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    const qrSpot = await prisma.qRSpot.findUnique({
      where: { id: qrSpotId },
      include: { walletTemplate: true, user: true },
    });

    if (!qrSpot || qrSpot.type !== "wallet") {
      return NextResponse.json({ error: "QR Spot non valido" }, { status: 400 });
    }

    const template = qrSpot.walletTemplate;
    if (!template) {
      return NextResponse.json({ error: "Modello Wallet non esistente" }, { status: 400 });
    }

    // Crea il lead nel database
    const passSerial = `PASS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const lead = await prisma.customerLead.create({
      data: {
        qrSpotId,
        firstName,
        lastName,
        email,
        passSerial,
        points: 0,
      },
    });

    // ------------------------------------------------------------------------
    // GENERAZIONE PKPASS (Mock / Scaffolding)
    // ------------------------------------------------------------------------
    
    // In un ambiente i produzione, qui leggiamo i certificati Apple Developer:
    // const certPath = path.resolve('./certs');
    // const pass = new PKPass({
    //   "passTypeIdentifier": "pass.com.qrpop.loyalty",
    //   "teamIdentifier": "XXXXXXXXXX"
    // }, {
    //   wwdr: fs.readFileSync(path.join(certPath, 'wwdr.pem')),
    //   signerCert: fs.readFileSync(path.join(certPath, 'signerCert.pem')),
    //   signerKey: fs.readFileSync(path.join(certPath, 'signerKey.pem')),
    //   signerKeyPassphrase: 'password_certificato'
    // });
    
    // pass.type = "storeCard";
    // pass.primaryFields.push({ key: "points", label: "PUNTI", value: lead.points });
    // pass.secondaryFields.push({ key: "name", label: "NOME", value: `${lead.firstName} ${lead.lastName || ""}`});
    // pass.backFields.push({ key: "info", label: "Contatti", value: qrSpot.user.businessName });
    // pass.barcode = { format: "PKBarcodeFormatQR", message: passSerial, messageEncoding: "iso-8859-1" };
    
    // pass.backgroundColor = template.backgroundColor;
    // pass.labelColor = template.textColor;
    // pass.foregroundColor = template.textColor;
    // pass.logoText = template.brandName || qrSpot.name;
    
    // const buffer = await pass.getAsBuffer();
    // return new NextResponse(buffer, {
    //   headers: {
    //     "Content-Type": "application/vnd.apple.pkpass",
    //     "Content-Disposition": `attachment; filename=pass.pkpass`,
    //   },
    // });
    // ------------------------------------------------------------------------

    // MOCK RESPONSE
    return NextResponse.json({ 
      success: true, 
      message: "Lead acquisito con successo! I certificati Apple non sono ancora configurati, quindi il download della PKPass è stato temporaneamente mockato. Per sbloccare la generazione reale fornire i file .pem.",
      leadId: lead.id,
      passSerial: lead.passSerial
    });

  } catch (error) {
    console.error("Generazione Pass Errore:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
