import { auth } from "@clerk/nextjs"
import { userSubscriptions } from "./db/schema"
import { eq } from "drizzle-orm"
import { db } from "./db"

export const checkSubscription = async () => {
    const { userId } = await auth()
    if (!userId) return false


    const _userSubscriptions = await db.select().from(userSubscriptions).where(eq(userSubscriptions.userId, userId));

    if (!_userSubscriptions[0]) return false

    const userSubscription = _userSubscriptions[0]

    const isValid = userSubscription.stripePriceId && userSubscription.stripeCurrentPeriodEnd?.getTime()! + 1000 * 60 * 60 * 24 > Date.now()

    return !!isValid
}