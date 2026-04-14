import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const ADMIN_EMAIL = "cgabelli@gmail.com";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const {
    businessName, firstName, lastName, email, phone,
    address, city, province, zipCode,
    fiscalCode, vatNumber, sdiCode,
    isActive, isCompany,
  } = body;

  const updated = await prisma.user.update({
    where: { id },
    data: {
      businessName, firstName, lastName, email, phone,
      address, city, province, zipCode,
      fiscalCode, vatNumber, sdiCode,
      isActive, isCompany,
    },
  });

  return NextResponse.json({ ok: true, user: updated });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  
  await prisma.user.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
