// this file contains backend billing of stripe
import { userSubscriptions } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const return_url = process.env.NEXT_BASE_URL + "/";

export async function GET() {
    try {
        const { userId } = await auth();

        const user = await currentUser();

        if (!userId) {
            return new NextResponse("unauthorized", { status: 401 });
        }

        const _userSubscriptions = await db.select().from(userSubscriptions).where(eq(userSubscriptions.userId, userId));
        if (_userSubscriptions[0] && _userSubscriptions[0].stripeCustomerId) {
            // trying to cancel at the billing portal
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: _userSubscriptions[0].stripeCustomerId,
                return_url,
            });
            return NextResponse.json({ url: stripeSession.url });
        }

        //subscribing for the first time
        const stripeSession = await stripe.checkout.sessions.create({
            success_url: return_url,
            cancel_url: return_url,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user?.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data: {
                        currency: "INR",
                        product_data: {
                            name: "Ai-PDF Pro",
                            description: 'countless hours of time saved',
                        },
                        unit_amount: 160000,
                        recurring: {
                            interval: "month",
                        },
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId,
            },
        });
        return NextResponse.json({ url: stripeSession.url });
    } catch (error) {
        console.log(error); return new NextResponse("internal server error", { status: 500 });
    }
}