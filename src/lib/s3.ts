import AWS from 'aws-sdk';
import toast from 'react-hot-toast';

export async function uploadToS3(file: File) {
    try {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY
        });
        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME
            },
            region: "ap-south-1"
        });
        const file_key = 'uploads/' + Date.now().toString() + file.name.replace(" ", "-");

        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: file_key,
            Body: file,
        }

        const upload = s3.putObject(params).on('httpUploadProgress', evt => {
            console.log('upload progress', parseInt((evt.loaded * 100 / evt.total).toString()) + '%')
        }).promise();

        await upload.then(data => {
            toast.success('File uploaded successfully')
            // console.log('upload success', file_key)
        })

        return Promise.resolve({
            //to save it to the database
            file_key,
            file_name: file.name
        })

    } catch (error) {

    }
}

export function getS3Url(file_key: string) {
    return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${file_key}`
}