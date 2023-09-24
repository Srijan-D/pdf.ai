import { Pinecone } from '@pinecone-database/pinecone'
import { downloadFromS3 } from './s3-server';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { Document, RecursiveCharacterTextSplitter } from '@pinecone-database/doc-splitter'
// import { Text } from 'lucide-react';

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
type PDFPage = {
    pageContent: string,
    metadata: {
        loc: { pageNumber: number }
    }
}

export async function loadS3IntoPinecone(fileKey: string) {
    //download the pdf from s3
    console.log("downloading from s3...")
    const file_name = await downloadFromS3(fileKey);
    if (!file_name) {
        throw new Error("unable to download file from s3")
    }
    const loader = new PDFLoader(file_name)
    const pages = (await loader.load()) as PDFPage[]

    //now we split the document into smaller chunks
    const documents = await Promise.all(pages.map(prepareDocument))
}

export const truncateStringByBytes = (str: string, bytes: number) => {
    const enc = new TextEncoder();
    return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes));
}


async function prepareDocument(page: PDFPage) {
    let { pageContent, metadata } = page;

    pageContent = pageContent.replace(/\n/g, '');
    //splitting the document 
    const splitter = new RecursiveCharacterTextSplitter();
    const docs = await splitter.splitDocuments([ //it is an array of documents
        new Document({
            pageContent,
            metadata: {
                pageNumber: metadata.loc.pageNumber,
                text: truncateStringByBytes(pageContent, 36000) //as this is the limit of pinecone
            }
        })
    ])
    return docs;
}