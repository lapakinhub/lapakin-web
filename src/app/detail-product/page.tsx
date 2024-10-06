"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, MapPin, DollarSign, Maximize, Shield, Clock, Phone, Mail, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import {useRouter} from "next/navigation";

interface PropertyDetail {
    title: string
    category: string
    address: string
    description: string
    price: string
    duration: string
    area: string
    facilities: string[]
    images: string[]
    specialConditions: string
    allowedBusinessTypes: string[]
    transactionType: string
    security: string
    availability: string
    rentalRequirements: string[]
    flexibility: string
    ownerName: string
    phoneNumber: string
    email: string
}

const propertyData: PropertyDetail = {
    title: "Sewa Ruko Jl. Stasiun Kota Kediri",
    category: "Ruko/Kios",
    address: "Jl. Stasiun No. 123, Kota Kediri, Jawa Timur",
    description: "Ruko strategis 2 lantai dengan luas bangunan 100m2. Lokasi ramai, cocok untuk berbagai jenis usaha. Bangunan terawat dengan baik dan siap huni.",
    price: "Rp 25.000.000 / tahun",
    duration: "Tahunan",
    area: "100 m²",
    facilities: ["Parkir", "AC", "Koneksi Internet", "Akses 24/7", "Listrik", "Air"],
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    specialConditions: "Tidak diperbolehkan untuk usaha yang menimbulkan suara bising di atas jam 10 malam",
    allowedBusinessTypes: ["Kuliner", "Ritel", "Kantor"],
    transactionType: "Sewa",
    security: "CCTV dan Satpam 24 jam",
    availability: "Tersedia mulai 1 Juli 2024",
    rentalRequirements: ["Pembayaran di muka", "Deposit 3 bulan", "Surat perjanjian"],
    flexibility: "Harga dan durasi sewa dapat dinegosiasikan",
    ownerName: "Budi Santoso",
    phoneNumber: "+62 812 3456 7890",
    email: "budi.santoso@example.com"
}

export default function PropertyDetailPage() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const router = useRouter();

    return (
        <div className="container mx-auto w-full max-w-5xl px-4 py-8">
            <Button onClick={() => router.back()} variant={'secondary'} className={'mb-4'} >Kembali</Button>
            <Card className="mx-auto">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl md:text-3xl">{propertyData.title}</CardTitle>
                            <CardDescription className="mt-2">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                    {propertyData.address}
                </span>
                            </CardDescription>
                        </div>
                        <Badge>{propertyData.category}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Carousel className="w-full max-w-xl mx-auto">
                        <CarouselContent>
                            {propertyData.images.map((image, index) => (
                                <CarouselItem key={index}>
                                    <div className="relative aspect-video">
                                        <Image
                                            src={image}
                                            alt={`Property image ${index + 1}`}
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-lg"
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <DollarSign className="w-5 h-5 mr-2" />
                            <span className="font-semibold">{propertyData.price}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="w-5 h-5 mr-2" />
                            <span>{propertyData.duration}</span>
                        </div>
                        <div className="flex items-center">
                            <Maximize className="w-5 h-5 mr-2" />
                            <span>{propertyData.area}</span>
                        </div>
                        <div className="flex items-center">
                            <Shield className="w-5 h-5 mr-2" />
                            <span>{propertyData.security}</span>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Deskripsi</h3>
                        <p>{propertyData.description}</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Fasilitas</h3>
                        <div className="flex flex-wrap gap-2">
                            {propertyData.facilities.map((facility, index) => (
                                <Badge key={index} variant="secondary">{facility}</Badge>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Jenis Usaha yang Diizinkan</h3>
                        <div className="flex flex-wrap gap-2">
                            {propertyData.allowedBusinessTypes.map((type, index) => (
                                <Badge key={index} variant="outline">{type}</Badge>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Informasi Tambahan</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Tipe Transaksi: {propertyData.transactionType}</li>
                                <li>Ketersediaan: {propertyData.availability}</li>
                                <li>Kondisi Khusus: {propertyData.specialConditions}</li>
                                <li>Fleksibilitas: {propertyData.flexibility}</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">Persyaratan Sewa</h3>
                            <ul className="list-disc list-inside space-y-1">
                                {propertyData.rentalRequirements.map((req, index) => (
                                    <li key={index}>{req}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="font-semibold">{propertyData.ownerName}</h3>
                        <div className="flex items-center mt-2">
                            <Phone className="w-4 h-4 mr-2" />
                            <span>{propertyData.phoneNumber}</span>
                        </div>
                        <div className="flex items-center mt-1">
                            <Mail className="w-4 h-4 mr-2" />
                            <span>{propertyData.email}</span>
                        </div>
                    </div>
                    <Button className="w-full sm:w-auto">Hubungi Pemilik</Button>
                </CardFooter>
            </Card>
        </div>
    )
}