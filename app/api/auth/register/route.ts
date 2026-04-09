import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { PLAN_TYPES, PlanId, BillingInterval } from "@/lib/plans";

export async function POST(req: NextRequest) {
  try {
    const { businessName, email, password, plan, billingInterval = "monthly" } = await req.json();

    // Validazione
    if (!businessName || !email || !password || !plan) {
      return NextResponse.json({ error: "Tutti i campi sono obbligatori" }, { status: 400 });
    }
    if (!PLAN_TYPES[plan as PlanId]) {
      return NextResponse.json({ error: "Piano non valido" }, { status: 400 });
    }
    if (!["monthly", "annual"].includes(billingInterval)) {
      return NextResponse.json({ error: "Intervallo di fatturazione non valido" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "La password deve essere di almeno 8 caratteri" }, { status: 400 });
    }

    // Controlla se email già esistente
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email già registrata" }, { status: 409 });
    }

    // Genera slug univoco dal nome del locale
    let baseSlug = businessName
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

    const user = await prisma.user.create({
      data: {
        businessName,
        email,
        password: passwordHash,
        slug,
        plan,
        billingInterval: billingInterval as BillingInterval,
        uploadResetDate: new Date(),
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, userId: user.id, slug: user.slug });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
