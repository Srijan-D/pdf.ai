import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { chats } from "@/lib/db/schema";
import { eq } from 'drizzle-orm';

type Props = {
    params: {
        chatId: string
    }
}

const ChatPage = async ({ params: { chatId } }: Props) => {
    const { userId } = await auth()
    if (!userId) {
        return redirect('/sign-in')
    }
    const chatList = await db.select().from(chats).where(eq(chats.userId, userId))
    if (!chatList) {
        return redirect('/')
    }

    if (!chatList.find(chat => chat.id === parseInt(chatId))) {
        return redirect('/')
    }

    return (
        <div>{chatId}</div>
    )
}

export default ChatPage