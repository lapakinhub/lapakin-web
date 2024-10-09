'use client'

import {useCallback, useEffect, useState} from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Upload } from "lucide-react"
import {UseFormReturn} from "react-hook-form";
import {UserFormValues} from "@/app/profile/page";
import {useDropzone} from "react-dropzone";

interface ProfileImageUploadProps {
    form: UseFormReturn<UserFormValues>;
    onImageUpload: (file: File) => void;
}

export default function ProfileImageUpload(props: ProfileImageUploadProps) {
    const { form, onImageUpload } = props
    const [imagePreview, setImagePreview] = useState<string | undefined>(form.getValues('image'))

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
            onImageUpload(file)
        }
    }, [])

    useEffect(() => {
        setImagePreview(form.getValues('image'))
    }, [form.getValues('image')]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif']
        },
        multiple: false
    })

    return (
        <div className="flex flex-col items-center space-y-4">
            <FormField
                control={form.control}
                name="image"
                render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                        <FormControl>
                            <div
                                {...getRootProps()}
                                className={`cursor-pointer transition-all duration-200 ease-in-out ${
                                    isDragActive ? 'scale-105' : ''
                                }`}
                            >
                                <input {...getInputProps()} onChange={(event) => {
                                    const file = event.target.files?.[0]
                                    if (file) {
                                        onDrop([file])
                                    }
                                }} />
                                <Avatar className="w-32 h-32 relative group">
                                    <AvatarImage src={imagePreview || "/placeholder.svg"} alt="Profile picture" />
                                    <AvatarFallback>
                                        {form.getValues("fullName")
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()}
                                    </AvatarFallback>
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <Upload className="text-white w-8 h-8" />
                                    </div>
                                </Avatar>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {isDragActive && (
                <div className="text-sm text-muted-foreground">Drop the image here ...</div>
            )}
            {!isDragActive && (
                <div className="text-sm text-muted-foreground">Click or drag and drop to change picture</div>
            )}
        </div>
    )
}