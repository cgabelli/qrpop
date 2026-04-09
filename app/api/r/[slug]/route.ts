import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const user = await prisma.user.findUnique({
    where: { slug, isActive: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  }

  const now = new Date();

  // Aggiorna status creatività scadute
  await prisma.creativita.updateMany({
    where: {
      userId: user.id,
      status: { in: ["active", "scheduled"] },
      expiresAt: { lt: now },
    },
    data: { status: "expired" },
  });

  // Attiva creatività schedulate
  await prisma.creativita.updateMany({
    where: {
      userId: user.id,
      status: "scheduled",
      publishAt: { lte: now },
    },
    data: { status: "active" },
  });

  // Trova la creatività attiva più recente
  const creativita = await prisma.creativita.findFirst({
    where: {
      userId: user.id,
      status: "active",
    },
    orderBy: { publishAt: "desc" },
  });

  return NextResponse.json({
    user: { businessName: user.businessName, slug: user.slug },
    creativita,
  });
}
