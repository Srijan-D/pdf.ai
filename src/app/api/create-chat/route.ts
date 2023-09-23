import { NextResponse } from "next/server"

export async function POST(req: Request, res: NextResponse) {

    try {
        const body = await req.json();
        const { file_key, file_name } = body;

    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: "internal server error" }, { status: 500 }
        )

    }
}