import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { NextResponse } from 'next/server'
export const runtime = 'edge'

const config = new Configuration({
    apiKey: process.env.OPEN_AI_KEY
})

const openai = new OpenAIApi(config)


export async function POST(req: Request) {
    try {
        const { messages } = await req.json()
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages,
            stream: true,
        })
        const stream = OpenAIStream(response)
        return new StreamingTextResponse(stream)
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "internal server error" }, { status: 500 }
        )

    }
}