import AWS from 'aws-sdk';
import fs from 'fs';
export async function downloadFromS3(file_key: string) {
    try {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY
        });
        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME3333
            },
            region: "ap-south-1"
        });
        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: file_key,
        }
        const obj = await s3.getObject(params).promise();
        const file_name = `D:/Codes/temp/pdf-${Date.now()}.pdf`

        fs.writeFileSync(file_name, obj.Body as Buffer) // write the file to the temp folder Buffer for Typescript
        return file_name;
    } catch (error) {
        console.log(error)
        return null;
    }
}