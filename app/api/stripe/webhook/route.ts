import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { getQRSpotType } from "@/lib/plans";

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
      const spotTypeId = session.metadata?.spotTypeId;
      const spotName = session.metadata?.spotName || "Nuovo QR";
      const subscriptionId = session.subscription as string;

      if (userId && spotTypeId) {
        const spotType = getQRSpotType(spotTypeId);
        
        let subDetails: Stripe.Subscription | undefined;
        if (subscriptionId) {
          subDetails = (await stripe.subscriptions.retrieve(subscriptionId)) as Stripe.Subscription;
        }

        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);

        // Genera base slug
        const user = await prisma.user.findUnique({ where: { id: userId } });
        let slug = `${user?.slug || userId}-${spotTypeId}-${Date.now().toString().slice(-4)}`;
        let counter = 1;
        while (await prisma.qRSpot.findUnique({ where: { slug } })) {
          slug = `${user?.slug || userId}-${spotTypeId}-${Date.now().toString().slice(-4)}-${counter}`;
          counter++;
        }

        await prisma.qRSpot.create({
          data: {
            userId,
            slug,
            name: spotName,
            type: spotTypeId,
            status: "active",
            stripeSubscriptionId: subscriptionId || null,
            stripePriceId: spotType.stripePriceId || null,
            expiresAt: subDetails ? new Date(subDetails.current_period_end * 1000) : expiresAt,
          },
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      
      const qrSpot = await prisma.qRSpot.findFirst({
        where: { stripeSubscriptionId: sub.id }
      });

      if (qrSpot) {
        await prisma.qRSpot.update({
          where: { id: qrSpot.id },
          data: {
            status: sub.status === "active" || sub.status === "trialing" ? "active" : "inactive",
            expiresAt: new Date((sub.current_period_end as number) * 1000),
          },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await prisma.qRSpot.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: { status: "expired" },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
