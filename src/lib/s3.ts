import toast from 'react-hot-toast';

export async function uploadToS3(file: File) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    const data = await res.json();
    toast.success("File uploaded successfully");
    return data;
  } catch (error) {
    toast.error("Error uploading file");
    throw error;
  }
}

export function getS3Url(file_key: string) {
  return `https://${process.env.S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${file_key}`;
}
