import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Stripe webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const planId = session.metadata?.planId;
      const isAddon = session.metadata?.isAddon === "true";
      const subscriptionId = session.subscription as string;

      if (userId && planId) {
        if (isAddon) {
           await prisma.user.update({
             where: { id: userId },
             data: { purchasedCredits: { increment: 10 } }
           });
        } else {
           await prisma.user.update({
             where: { id: userId },
             data: {
               plan: planId,
               billingInterval: "annual",
               stripeSubscriptionId: subscriptionId,
               isActive: true,
             },
           });
        }
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customer = await stripe.customers.retrieve(sub.customer as string);
      if ("metadata" in customer) {
        const userId = customer.metadata?.userId;
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              stripeSubscriptionId: sub.id,
              isActive: sub.status === "active",
            },
          });
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await prisma.user.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: { isActive: false },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
