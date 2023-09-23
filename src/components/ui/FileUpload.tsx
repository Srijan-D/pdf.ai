"use client"
import { uploadToS3 } from '@/lib/s3'
import { useMutation } from '@tanstack/react-query'
import { Inbox } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'

const FileUpload = () => {
    const { mutate } = useMutation({
        mutationFn: async ({ file_key, file_name }: { file_key: string, file_name: string }) => {
            const response = await axios.post('/api/create-chat', { file_key, file_name })
            return response.data
        }
    })

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'application/pdf': [".pdf"] },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            console.log(acceptedFiles)
            const file = acceptedFiles[0]
            if (file.size > 10 * 1024 * 1024) {//>10 MB
                alert("File size too large. Please upload a file less than 10 MB.")
                return
            }
            try {
                const data = await uploadToS3(file)
                if (!data?.file_key || !data?.file_name) {
                    alert("error uploading file")
                    return
                }
                mutate(data, {
                    onSuccess: (data) => {
                        console.log(data)
                    },
                    onError: (error) => {
                        console.log(error)
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }
    })
    return (
        <div className='p-4 bg-white rounded-xl'>
            <div className=' border-dashed border-2 rounded-xl cursor-pointer flex flex-col items-center text-center bg-gray-50 py-8'
                {...getRootProps({

                })}
            >
                <input type="text" {...getInputProps()} />
                <>
                    <Inbox className='w-8 h-8 text-blue-500' />
                    <p className='mt-2 text-sm text-slate-400'>Drop PDF here</p>
                </>
            </div>
        </div>
    )
}

export default FileUpload