"use client";
import React from "react";
import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        //>10 MB
        // alert("File size too large. Please upload a file less than 10 MB.")
        toast.error(
          "File size too large. Please upload a file less than 10 MB."
        );
        return;
      }
      try {
        setUploading(true);
        const data = await uploadToS3(file);
        if (!data?.file_key || !data?.file_name) {
          toast.error("Error uploading file");
          // alert("error uploading file")
          return;
        }
        mutate(data, {
          onSuccess: ({ chat_id }) => {
            toast.success("Chat created successfully! Redirecting...");
            router.push(`/chat/${chat_id}`);
          },
          onError: (error) => {
            console.log(error);
            toast.error("Error creating chat");
          },
        });
      } catch (error) {
        console.log(error);
      } finally {
        setUploading(false);
      }
    },
  });
  return (
    <div className="p-4 bg-white rounded-xl">
      <div
        className=" border-dashed border-2 border-slate-500  rounded-xl cursor-pointer flex flex-col items-center text-center bg-gray-50 py-8"
        {...getRootProps({})}
      >
        <input type="text" {...getInputProps()} />
        {uploading || isPending ? (
          <>
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p>GPT is going through your PDF...</p>
          </>
        ) : (
          <>
            <Inbox className="w-8 h-8 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Drop PDF here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
