import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PLAN_TYPES, PlanId } from "@/lib/plans";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { planId, isAddon = false } = await req.json();
  const plan = PLAN_TYPES[planId as PlanId];

  if (!plan) {
    return NextResponse.json({ error: "Piano non valido" }, { status: 400 });
  }

  const stripePriceId = isAddon ? plan.addon?.stripePriceId : plan.stripePriceId;

  if (!stripePriceId) {
    return NextResponse.json({ error: "Prezzo Stripe non configurato per questo piano/addon" }, { status: 500 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });

  if (isAddon && user.plan !== planId) {
     return NextResponse.json({ error: "Puoi comprare l'add-on solo per il piano che possiedi." }, { status: 400 });
  }

  // Crea o recupera customer Stripe
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.businessName,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: isAddon ? "payment" : "subscription",
    line_items: [{ price: stripePriceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/abbonamento?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/abbonamento?canceled=1`,
    metadata: { userId: user.id, planId, isAddon: isAddon ? "true" : "false" },
    ...(isAddon && { payment_intent_data: { metadata: { userId: user.id, isAddon: "true", planId } } })
  });

  return NextResponse.json({ url: checkoutSession.url });
}
