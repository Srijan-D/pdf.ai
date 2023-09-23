"use client"
import { Inbox } from 'lucide-react'
import { useDropzone } from 'react-dropzone'


const FileUpload = () => {
    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'application/pdf': [".pdf"] },
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            console.log(acceptedFiles)
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