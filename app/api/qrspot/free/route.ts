import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });

  // Verifica che l'utente non abbia già troppi QR spot gratuiti (es. massimo 3)
  const freeSpotsCount = await prisma.qRSpot.count({
    where: { userId: user.id, type: "free" }
  });

  if (freeSpotsCount >= 10) {
    return NextResponse.json({ error: "Hai raggiunto il limite massimo di associazioni gratuite." }, { status: 403 });
  }

  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  // Genera base slug
  let slug = `${user.slug || user.id}-free-${Date.now().toString().slice(-4)}`;
  let counter = 1;
  while (await prisma.qRSpot.findUnique({ where: { slug } })) {
    slug = `${user.slug || user.id}-free-${Date.now().toString().slice(-4)}-${counter}`;
    counter++;
  }

  const newSpot = await prisma.qRSpot.create({
    data: {
      userId: user.id,
      slug,
      name: "QR Link",
      type: "free",
      status: "active",
      expiresAt: expiresAt,
    },
  });

  return NextResponse.json({ spot: newSpot });
}
