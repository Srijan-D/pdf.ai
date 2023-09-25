import { messages } from '@/lib/db/schema'
import { cn } from '@/lib/utils'
import { Message } from 'ai/react'
import React from 'react'

type Props = {
    messages: Message[]
}

const MessageList = ({ messages }: Props) => {
    if (!messages) return <></>
    return (

        <div className="flex flex-col gap-2 px-4">
            {messages.map((message) => {
                return (
                    <div
                        key={message.id}
                        className={cn("flex", {
                            "justify-end pl-10": message.role === "user",
                            "justify-start pr-10 mb-2": message.role === "assistant",
                        })}
                    >
                        <div
                            className={cn(
                                "rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10",
                                {
                                    "bg-blue-600 text-white": message.role === "user",
                                }
                            )}
                        >
                            <p>{message.content}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default MessageList