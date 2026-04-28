import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
// import { downloadFromS3 } from "./s3-server";
// import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { WebPDFLoader } from "langchain/document_loaders/web/pdf";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import md5 from "md5";
import { convertToAscii } from "./utils";
// import fs from "fs";
import { getS3Url } from "./s3";
let pinecone: Pinecone | null = null;

export const getPineconeClient = async () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pinecone;
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function loadS3IntoPinecone(fileKey: string) {
  //download the pdf from s3
  console.log("downloading from s3...");
  // const file_name = await downloadFromS3(fileKey);
  // if (!file_name) {
  //   throw new Error("unable to download file from s3");
   try {
  // const loader = new PDFLoader(file_name);
  // const pages = (await loader.load()) as PDFPage[];

    //  fs.unlinkSync(file_name); 
      // can avoid piping/file disk storage by using webpdfloader path->
      const response = await fetch(getS3Url(fileKey));
      const blob = await response.blob();
      const loader = new WebPDFLoader(blob);
      const pages = await loader.load() as PDFPage[];
  //now we split the document into smaller segments
  const documents = await Promise.all(pages.map(prepareDocument));

  //vectorize and embed each document
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  //now we upload the vectors to pinecone
  const client = await getPineconeClient();
  const pineconeIndex = await client.Index("aipdf");
  const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
  console.log("uploading to pinecone...");

  await namespace.upsert(vectors);
  return documents[0];
} catch (error) {
  // if (fs.existsSync(file_name)) {
  //   fs.unlinkSync(file_name);
  // }
  throw error;
}
}

async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent); //this is the unique id for the document
    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.log(error);
    throw new Error("unable to embed document");
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  const encodedBytes = enc.encode(str);
  const truncatedBytes = encodedBytes.slice(0, bytes);
  const decoder = new TextDecoder("utf-8");
  const truncatedString = decoder.decode(truncatedBytes);
  return truncatedString;
};

async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;

  pageContent = pageContent.replace(/\n/g, ""); //remove new lines
  //splitting the document
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    //it is an array of documents
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000), //as this is the limit of pinecone
      },
    }),
  ]);
  return docs;
}
