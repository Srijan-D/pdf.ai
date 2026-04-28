import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature");
  let event: Stripe.Event;

  if (!signature) {
    return new NextResponse("missing stripe signature", { status: 400 });
  }

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
      undefined,
      Stripe.createSubtleCryptoProvider()
    );
  } catch (error) {
    console.error("webhook verify failed", error);
    return new NextResponse("webhook error", { status: 400 });
  }

  // new subscription created
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (!session.subscription || !session?.metadata?.userId) {
      return new NextResponse("no userid", { status: 400 });
    }

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    await db
      .insert(userSubscriptions)
      .values({
        userId: session.metadata.userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      })
      .onConflictDoUpdate({
        target: userSubscriptions.userId,
        set: {
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    if (!invoice.subscription) {
      return new NextResponse(null, { status: 200 });
    }

    const subscription = await stripe.subscriptions.retrieve(
      invoice.subscription as string
    );
    await db
      .update(userSubscriptions)
      .set({
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      })
      .where(eq(userSubscriptions.stripeSubscriptionId, subscription.id));
  }

  return new NextResponse(null, { status: 200 });
}
