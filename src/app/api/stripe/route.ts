// this file contains backend billing of stripe
import { auth, currentUser } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { userSubscriptions } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { stripe } from "@/lib/stripe"

const return_url = process.env.NEXT_PUBLIC_URL + "/billing"

export async function GET() {
    try {
        const { userId } = await auth()
        const user = await currentUser()

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        //we will check if the subscription is there or user is subscribing for the first time

        const _userSubscriptions = await db.select().from(userSubscriptions).where(eq(userSubscriptions.userId, userId))

        //checking if cancelling the subscription

        if (_userSubscriptions[0] && _userSubscriptions[0].stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: _userSubscriptions[0].stripeCustomerId,
                return_url: return_url
            })
            return NextResponse.json({ url: stripeSession.url })
        }

        //subscribing for the first time
        const stripeSession = await stripe.checkout.sessions.create({
            success_url: return_url,
            cancel_url: return_url,
            payment_method_types: ['card'],
            mode: 'subscription',
            customer_email: user?.emailAddresses[0].emailAddress,
            billing_address_collection: 'auto',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Ai-PDF Pro',
                            description: 'countless hours of time saved',
                        },
                        unit_amount: 1500,
                        recurring: {
                            interval: 'month'
                        }
                    },
                    quantity: 1
                }
            ],
            // this is required as stripe sends back webhook at our endpoint again 
            metadata: {
                userId: userId
            }
        })
        return NextResponse.json({ url: stripeSession.url })
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Server Error", { status: 500 })

    }
}