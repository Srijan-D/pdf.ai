"use client";
// client component for stripe subscription
import { DrizzleChat } from "@/lib/db/schema";
import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { PlusCircle, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import SubscriptionButton from "./SubscriptionButton";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
  isPro: boolean;
};

const ChatSidebar = ({ chats, chatId, isPro }: Props) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full h-screen p-4 text-gray-200 bg-gray-900 flex flex-col">
      <Link href="/">
        <Button className="w-full border-dashed border-white border">
          <PlusCircle className="mr-3 h-4 w-4 cursor-pointer" />
          New Chat
        </Button>
      </Link>

      {/* SCROLLABLE LIST */}
      <div className="flex-1 overflow-y-auto mt-5 space-y-2">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
                "bg-blue-600 text-white": chat.id === chatId,
                "hover:text-white hover:bg-blue-600": chat.id !== chatId,
              })}
            >
              <MessageCircle className="mr-2" />
              <p className="w-full truncate text-sm">{chat.pdfName}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="pt-4">
        <SubscriptionButton isPro={isPro} />
      </div>
    </div>
  );
};

export default ChatSidebar;
