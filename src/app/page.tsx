import { Button } from "@/components/ui/button"
import { UserButton, auth } from "@clerk/nextjs"
import { LogIn } from "lucide-react"
import FileUpload from "@/components/ui/FileUpload";
import { checkSubscription } from "@/lib/subscription";
import SubscriptionButton from "@/components/SubscriptionButton";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import Link from 'next/link'
import { chats } from "@/lib/db/schema";

export default async function Home() {
  const { userId } = await auth();
  const isPro = await checkSubscription();
  const isAuth = !!userId;
  let firstChat;
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId))
    if (firstChat) {
      firstChat = firstChat[0]
    }
  }

  return (
    <div className="w-screen min-h-screen bg-[conic-gradient(at_right,_var(--tw-gradient-stops))] from-red-900 via-violet-200 to-orange-500">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center ">
            <h1 className="mr-3 text-5xl font-semibold">Chat with your PDF</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          <div className="flex mt-3">
            {isAuth && firstChat &&
              <Link href={`/chat/${firstChat.id}`}>
                <Button className="border-2 "> Go to Chats</Button>
              </Link>
            }
            {isAuth &&
              <div className="ml-2">
                <SubscriptionButton isPro={isPro} />
              </div>
            }
          </div>
          <p className="max-w-xl mt-2 text-base text-slate-700">
            AI-powered PDF Chatbot: Seamlessly converse with uploaded PDFs, extracting and discussing their content intelligently.
          </p>
          <div className="w-full mt-4">
            {isAuth ? (
              <FileUpload />
            ) : <Link href="/sign-in">
              <Button>
                Login to get Started!
                <LogIn className="w-4 h-4 ml-2" />
              </Button>
            </Link>}
          </div>
        </div>
      </div>
    </div >
  )
}


