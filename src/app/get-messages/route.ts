import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { messages } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export const runtime = "edge"
//as drizzle is edge compatible we can use it in edge runtime


export const POST = async (req: Request) => {

    const { chatId } = await req.json()
    const messageList = await db.select().from(messages).where(eq(messages.id, chatId));
    return NextResponse.json(messageList)
}