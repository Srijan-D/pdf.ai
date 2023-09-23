import { Pinecone } from '@pinecone-database/pinecone'
import { downloadFromS3 } from './s3-server';

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

export async function loadS3IntoPinecone(fileKey: string) {
    //download the pdf from s3
    console.log("downloading from s3...")
    const file_name = await downloadFromS3(fileKey);


}