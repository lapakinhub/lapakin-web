'use client'

import { useState } from 'react'
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Commodity } from "@/types/commodity"
import { timeAgo } from "@/lib/date-format"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {formatToRupiah} from "@/lib/number-format";

interface ProductCardwActProps {
    commodity?: Commodity
    onDelete?: () => void
    onEdit?: () => void
}

function FilePenIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10"/>
            <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
            <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z"/>
        </svg>
    )
}

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 6h18"/>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
        </svg>
    )
}

export default function ProductCardwAct({ commodity, onEdit, onDelete }: ProductCardwActProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const images = commodity?.images || ["https://avatars.githubusercontent.com/u/124599?v=4"]

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation()
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation()
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
    }

    return (
        <Card className="w-full overflow-hidden">
            <div className="relative aspect-square">
                <Image
                    src={images[currentImageIndex]}
                    alt={commodity?.title || "Product image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {images.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
                            onClick={prevImage}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
                            onClick={nextImage}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 bg-white/80 rounded-full p-1">
                            {images.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-1.5 h-1.5 rounded-full ${
                                        index === currentImageIndex ? 'bg-black' : 'bg-black/30'
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold truncate">{commodity?.title}</h3>
                    <div className="flex items-center gap-2">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={onEdit}
                            className="h-8 w-8"
                        >
                            <FilePenIcon className="w-4 h-4" />
                            <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={onDelete}
                            className="h-8 w-8"
                        >
                            <TrashIcon className="w-4 h-4" />
                            <span className="sr-only">Delete</span>
                        </Button>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{`Diubah ${timeAgo(commodity?.lastModified?.toString() ?? "")}`}</p>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold overflow-ellipsis max-w-full">
                        Rp. {formatToRupiah(commodity?.price ?? 0)}
                        <span className="text-xs overflow-ellipsis font-normal">/ {commodity?.rentalDuration}</span>
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}