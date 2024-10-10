'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Commodity } from "@/types/commodity"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import AppLogo from '@/assets/logo_app.png'
import {formatToRupiah} from "@/lib/number-format";

interface ProductCardProps {
    commodity?: Commodity
    onClick?: () => void
}

export default function ProductCard({ commodity, onClick }: ProductCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const images = commodity?.images || [AppLogo.src]

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation()
        setCurrentImageIndex((prevIndex) =>
            (prevIndex + 1) % images.length
        )
    }

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation()
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        )
    }

    return (
        <Card
            onClick={onClick}
            className="w-full cursor-pointer transition-shadow duration-300 hover:shadow-lg"
        >
            <CardHeader className="p-0 relative">
                <AspectRatio ratio={1}>
                    <img
                        src={images[currentImageIndex] == null ? AppLogo.src : images[currentImageIndex]}
                        alt="Product image"
                        className="object-cover w-full h-full rounded-t-lg"
                    />
                </AspectRatio>
                <Badge className="absolute left-4 bottom-4 bg-white text-black">
                    Siap dipesan
                </Badge>
                <Badge
                    className="absolute right-4 top-4 bg-white/80 hover:bg-white text-black rounded-full"
                >
                    {commodity?.location}
                </Badge>
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
                                    className={`w-2 h-2 rounded-full ${
                                        index === currentImageIndex ? 'bg-black' : 'bg-black/30'
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </CardHeader>
            <CardContent className="p-4">
                <CardTitle className="text-base font-semibold line-clamp-1">
                    {commodity?.title || 'Ikuti Konser di Ruang Tamu bersam...'}
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                    Dilayani oleh {commodity?.ownerName || 'Doja Cat'}
                </p>
                <p className="mt-2 text-sm">
                    <span className="font-semibold">
                        Rp {formatToRupiah(commodity?.price ?? 0)}
                    </span> per {commodity?.rentalDuration}
                </p>
            </CardContent>
        </Card>
    )
}