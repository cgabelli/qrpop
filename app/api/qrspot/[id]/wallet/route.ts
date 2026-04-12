import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  try {
    const data = await req.json();
    
    // Auth check
    const spot = await prisma.qRSpot.findUnique({ where: { id: params.id } });
    if (!spot || spot.userId !== session.user.id) {
      return NextResponse.json({ error: "Accesso negato" }, { status: 403 });
    }

    const template = await prisma.walletTemplate.upsert({
      where: { qrSpotId: params.id },
      update: {
        fidelityCardUrl: data.fidelityCardUrl
      },
      create: {
        qrSpotId: params.id,
        fidelityCardUrl: data.fidelityCardUrl
      }
    });

    return NextResponse.json({ success: true, template });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore salvataggio template" }, { status: 500 });
  }
}
