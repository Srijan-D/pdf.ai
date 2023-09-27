import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { messages } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export const runtime = "edge";
//as drizzle orm is edge compatible

export const POST = async (req: Request) => {
    const { chatId } = await req.json();
    const messageList = await db.select().from(messages).where(eq(messages.chatId, chatId));
    return NextResponse.json(messageList);
};