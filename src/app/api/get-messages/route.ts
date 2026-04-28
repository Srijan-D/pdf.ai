import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { chats, messages } from "@/lib/db/schema";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
export const runtime = "edge";
//as drizzle orm is edge compatible

export const POST = async (req: NextRequest) => {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const { chatId } = await req.json();

    const messageList = await db
      .select({
        id: messages.id,
        content: messages.content,
        role: messages.role,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .innerJoin(chats, eq(messages.chatId, chats.id))
      .where(and(eq(messages.chatId, chatId), eq(chats.userId, userId)));
    return NextResponse.json(messageList);
}; 