import e from 'express'
import { OpenAIApi, Configuration } from 'openai-edge'


const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config)

export async function getEmbeddings(text: string) {
    try {
        const response = await openai.createEmbedding({
            model: 'text-embedding-ada-002',
            input: text.replace(/\n/g, ' ')
        })
        const result = await response.json()
        return result.data[0].embedding as number[]; //as it is multidimensional number array
    } catch (error) {
        console.log(error)
        throw error;
    }
}