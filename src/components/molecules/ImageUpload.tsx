"use client"

import {useState} from 'react'
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImagePlus, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    onImageUpload: (files: File[], images: string[]) => void,
    onDeleteImage: (file: File[], images: string[]) => void,
    onDeleteAllImages: () => void,
    images: string[],
    files: File[]
}

export default function ImageUpload(props: ImageUploadProps) {
    const { onImageUpload, onDeleteImage, onDeleteAllImages, files, images } = props
    const [dragActive, setDragActive] = useState(false)

    const handleImageUpload = (fileList: FileList | null) => {
        if (fileList) {
            const newImages: string[] = []
            const selectedFiles: File[] = []
            for (let i = 0; i < Math.min(fileList.length, 3 - images.length); i++) {
                const file = fileList[i]
                const imageUrl = URL.createObjectURL(file)
                newImages.push(imageUrl)
                selectedFiles.push(file)
            }
            onImageUpload([...selectedFiles, ...files], [...newImages, ...images]);
        }
    }

    const handleImageDelete = (index: number) => {
        const newImages = [...images]
        const newFiles = [...files]
        newImages.splice(index, 1)
        newFiles.splice(index, 1)
        onDeleteImage(newFiles, newImages)
    }

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files)
        }
    }

    return (
        <FormItem className="space-y-2">
            <FormLabel>Gambar Comodity</FormLabel>
            <FormControl>
                <div
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                        dragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:bg-gray-50",
                        images.length >= 3 && "opacity-50 cursor-not-allowed"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-upload')?.click()}
                >
                    <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e.target.files)}
                        disabled={images.length >= 3}
                    />
                    <ImagePlus className="w-8 h-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Klik atau seret gambar ke sini</p>
                </div>
            </FormControl>
            <FormDescription className="text-center">
                Unggah maksimal 3 gambar untuk menampilkan comodity Anda. {images.length}/3 gambar diunggah.
            </FormDescription>
            {images.length > 0 && (
                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <Carousel className="w-full">
                            <CarouselContent>
                                {images.map((image, index) => (
                                    <CarouselItem key={index} className="basis-full sm:basis-1/2 md:basis-1/3">
                                        <div className="relative p-1">
                                            <img
                                                src={image}
                                                alt={`Comodity ${index + 1}`}
                                                className="w-full aspect-square object-cover rounded-md"
                                            />
                                            <Button
                                                variant="destructive"
                                                type={"button"}
                                                size="icon"
                                                className="absolute top-2 right-2"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleImageDelete(index)
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Delete image</span>
                                            </Button>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    </CardContent>
                </Card>
            )}
            {images.length > 0 && (
                <div className="flex justify-end">
                    <Button
                        variant="outline"
                        type={"button"}
                        onClick={onDeleteAllImages}
                        className="flex items-center"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Hapus Semua Gambar
                    </Button>
                </div>
            )}
        </FormItem>
    )
}