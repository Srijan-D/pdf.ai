import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";


let pinecone: Pinecone | null = null;

export const getPineconeClient = async () => {
    if (!pinecone) {
        pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY!,
            environment: process.env.PINECONE_ENVIRONMENT!,
        });
    }
    return pinecone;
}

export async function getMatchesFromEmbeddings(embeddings: number[], fileKey: string) {
    try {
        const client = await getPineconeClient();
        const pineconeIndex = await client.Index("ai-pdf");
        const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
        const queryResult = await namespace.query({
            topK: 5,
            vector: embeddings,
            includeMetadata: true,
        });
        return queryResult.matches || [];
    } catch (error) {
        console.log("error querying embeddings", error);
        throw error;
    }
}

export async function getContext(query: string, fileKey: string) {//filkey for the namespace
    const queryEmbeddings = await getEmbeddings(query)
    const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey)

    const qualifiedMatches = matches.filter((match) => {
        return (match.score && match.score > 0.7)
    })

    type Metadata = {
        text: string,
        pageNumber: number,
    }

    let docs = qualifiedMatches.map(match => (match.metadata as Metadata).text)
    return docs.join("\n").substring(0, 3000)
}