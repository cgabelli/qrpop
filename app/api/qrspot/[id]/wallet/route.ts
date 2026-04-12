import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  try {
    const { id } = await params;
    const data = await req.json();
    
    // Auth check
    const spot = await prisma.qRSpot.findUnique({ where: { id } });
    if (!spot || spot.userId !== session.user.id) {
      return NextResponse.json({ error: "Accesso negato" }, { status: 403 });
    }

    const template = await prisma.walletTemplate.upsert({
      where: { qrSpotId: id },
      update: {
        backgroundColor: data.backgroundColor,
        textColor: data.textColor,
        brandName: data.brandName
      },
      create: {
        qrSpotId: id,
        backgroundColor: data.backgroundColor || "#7c3aed",
        textColor: data.textColor || "#ffffff",
        brandName: data.brandName || "My Brand"
      }
    });

    return NextResponse.json({ success: true, template });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore salvataggio template" }, { status: 500 });
  }
}
