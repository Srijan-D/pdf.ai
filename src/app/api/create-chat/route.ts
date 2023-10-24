import { db } from "@/lib/db";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3";
import { NextResponse, NextRequest } from "next/server";
import { chats } from "@/lib/db/schema";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json(
      { error: "Authentication error" },
      {
        status: 401,
      }
    );
  }

  try {
    const body = await req.json();
    const { file_key, file_name } = body;
    // console.log(file_key, file_name)
    await loadS3IntoPinecone(file_key);
    // return NextResponse.json({ pages }, { status: 200 })
    const chat_id = await db
      .insert(chats)
      .values({
        fileKey: file_key,
        pdfName: file_name,
        pdfUrl: getS3Url(file_key),
        userId: userId,
      })
      .returning({
        insertedId: chats.id,
      });
    return NextResponse.json(
      {
        chat_id: chat_id[0].insertedId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
