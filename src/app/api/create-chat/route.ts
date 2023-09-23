import { loadS3IntoPinecone } from "@/lib/pinecone";
import { NextResponse } from "next/server"

export async function POST(req: Request, res: NextResponse) {

    try {
        const body = await req.json();
        const { file_key, file_name } = body;
        console.log(file_key, file_name)
        await loadS3IntoPinecone(file_key)
        return NextResponse.json({ message: "success" }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: "internal server error" }, { status: 500 }
        )

    }
}