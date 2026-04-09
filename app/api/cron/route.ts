import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// API per aggiornare lo status delle creatività (opzionale via cron)
export async function GET() {
  const now = new Date();

  const expired = await prisma.creativita.updateMany({
    where: { status: "active", expiresAt: { lt: now } },
    data: { status: "expired" },
  });

  const activated = await prisma.creativita.updateMany({
    where: { status: "scheduled", publishAt: { lte: now } },
    data: { status: "active" },
  });

  return NextResponse.json({
    expired: expired.count,
    activated: activated.count,
    timestamp: now.toISOString(),
  });
}
