import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const qrSpot = await prisma.qRSpot.findUnique({ where: { id } });

  if (!qrSpot || qrSpot.userId !== session.user.id) {
    return NextResponse.json({ error: "QR Spot non trovato" }, { status: 404 });
  }

  const allowedFields = ["name", "redirectUrl"];
  const updateData: any = {};

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
       // Validazione opzionale per l'URL del redirect
       if (field === "redirectUrl" && body[field] && body[field].length > 0) {
          try {
             new URL(body[field]);
             updateData[field] = body[field];
          } catch (e) {
             return NextResponse.json({ error: "L'URL di reindirizzamento non è valido. Assicurati che includa http:// o https://" }, { status: 400 });
          }
       } else {
          updateData[field] = body[field];
       }
    }
  }

  const updatedSpot = await prisma.qRSpot.update({
    where: { id },
    data: updateData
  });

  return NextResponse.json({ spot: updatedSpot });
}
