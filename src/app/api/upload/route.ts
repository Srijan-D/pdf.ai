import AWS from "aws-sdk";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: "ap-south-1",
  });

  const file_key = `uploads/${Date.now()}-${file.name.replace(/\s/g, "-")}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await s3
    .putObject({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: file_key,
      Body: buffer,
      ContentType: file.type,
    })
    .promise();

    return NextResponse.json({ file_key, file_name: file.name });
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
