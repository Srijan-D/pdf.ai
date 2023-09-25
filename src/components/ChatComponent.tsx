"use client"
import { useChat } from 'ai/react'
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Send } from 'lucide-react'
type Props = {}

const ChatComponent = (props: Props) => {
    const { input, handleInputChange, handleSubmit } = useChat()
    return (
        <div className="relative max-h-screen overflow-scroll">
            <div className="sticky top-0 inset-x-0 p-2 bg-white ">
                <h3 className="text-xl font-bold">Chat</h3>
            </div>
            <form onSubmit={handleSubmit} className='sticky bottom-0 px-2 py-2 inset-x-0 bg-white'>
                <Input value={input} onChange={handleInputChange} placeholder='Ask GPT...' className='w-full' />
                <Button className='bg-blue-600 m-2'>
                    <Send className='h-4 w-4' />
                </Button>
            </form>
        </div>
    )
}

export default ChatComponent