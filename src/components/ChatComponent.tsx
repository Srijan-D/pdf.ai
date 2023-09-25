"use client"
import { useChat } from 'ai/react'
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Send } from 'lucide-react'
import MessageList from './MessageList'
type Props = {}

const ChatComponent = (props: Props) => {
    const { input, handleInputChange, handleSubmit, messages } = useChat({
        api: '/api/chat'
    })
    return (
        <div
            className="relative max-h-screen overflow-hidden"
            id="message-container"
        >
            {/* header */}
            <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
                <h3 className="text-xl font-bold">Chat</h3>
            </div>

            {/* message list */}
            <MessageList messages={messages} />

            <form
                onSubmit={handleSubmit}
                className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white"
            >
                <div className="flex">
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask any question..."
                        className="w-full"
                    />
                    <Button className="bg-blue-600 ml-2">
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default ChatComponent