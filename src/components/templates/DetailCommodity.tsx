"use client"

import {useRouter, useSearchParams} from 'next/navigation'
import Image from 'next/image'
import {useGetCommodity} from "@/service/query/comodity-query"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel"
import {formatToRupiah} from "@/lib/number-format"
import {CalendarIcon, MapPin, Mail, Info, ArrowLeft, Home, Briefcase, FileText, Phone} from 'lucide-react'
import LoaderOverlay from "@/components/molecules/LoadingOverlay"
import {FaWhatsapp} from "react-icons/fa"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"

export default function DetailCommodity() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const commodityId = searchParams.get('id') as string

    const {data: komoditas, isLoading} = useGetCommodity(commodityId)

    if (isLoading) {
        return <LoaderOverlay isLoading={true}/>
    }

    if (!komoditas) {
        return (
            <div className="flex flex-col items-center justify-center h-screen p-4">
                <h2 className="text-xl font-bold mb-4 text-center">Komoditas tidak ditemukan</h2>
                <Button onClick={() => router.back()}>Kembali</Button>
            </div>
        )
    }

    const handleChatSekarang = () => {
        const formattedPhone = komoditas.phoneNumber.startsWith('0')
            ? '62' + komoditas.phoneNumber.slice(1)
            : komoditas.phoneNumber
        const whatsappUrl = `https://wa.me/${formattedPhone}`
        window.open(whatsappUrl, '_blank')
    }

    return (
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 mb-20">
            <Button onClick={() => router.back()} variant="ghost" className="mb-4 p-0 h-auto hover:bg-transparent">
                <ArrowLeft className="mr-2 h-4 w-4"/>
                <span className="text-sm">Kembali</span>
            </Button>

            <Card className="w-full max-w-4xl mx-auto shadow-lg overflow-hidden bg-white dark:bg-gray-800">
                <Carousel className="w-full">
                    <CarouselContent>
                        {komoditas.images?.map((image, index) => (
                            <CarouselItem key={index}>
                                <div className="aspect-[16/9] relative overflow-hidden rounded-t-lg">
                                    <Image
                                        src={image}
                                        alt={`Gambar komoditas ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2"/>
                    <CarouselNext className="right-2"/>
                </Carousel>

                <CardHeader className="space-y-2 p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4">
                        <div className="w-full sm:w-3/4">
                            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 line-clamp-2">
                                {komoditas.title}
                            </CardTitle>
                            <CardDescription className="flex items-start sm:items-center space-x-2 text-sm">
                                <MapPin className="h-4 w-4 flex-shrink-0 mt-1 sm:mt-0"/>
                                <span className="line-clamp-2 sm:line-clamp-1">{komoditas.address}</span>
                            </CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-sm whitespace-nowrap">
                            {komoditas.type}
                        </Badge>
                    </div>
                    <div className="mt-4">
                        <p className="text-2xl sm:text-3xl font-bold text-primary">{formatToRupiah(komoditas.price)}</p>
                        <p className="text-sm text-muted-foreground">per {komoditas.rentalDuration}</p>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <Tabs defaultValue="deskripsi" className="w-full">
                        <TabsList className="w-full flex justify-between bg-muted rounded-none border-b p-0">
                            {['deskripsi', 'fasilitas', 'persyaratan', 'kontak'].map((tab) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className="flex-1 py-3 px-1 text-xs sm:text-sm capitalize rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-all duration-200"
                                >
                                    {tab === 'deskripsi' && <Home className="h-4 w-4 mr-2 sm:mr-2"/>}
                                    {tab === 'fasilitas' && <Briefcase className="h-4 w-4 mr-2 sm:mr-2"/>}
                                    {tab === 'persyaratan' && <FileText className="h-4 w-4 mr-2 sm:mr-2"/>}
                                    {tab === 'kontak' && <Phone className="h-4 w-4 mr-2 sm:mr-2"/>}
                                    <span className="hidden sm:inline">{tab}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <TabsContent value="deskripsi" className="p-6 space-y-6">
                            <div>
                                <h3 className="font-semibold mb-3 text-lg">Deskripsi</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{komoditas.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-6 bg-muted p-4 rounded-lg text-sm">
                                <div>
                                    <h4 className="font-semibold mb-1 text-muted-foreground">Luas Area</h4>
                                    <p>{komoditas.area} m²</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1 text-muted-foreground">Jenis Transaksi</h4>
                                    <Badge variant="outline">{komoditas.transactionType}</Badge>
                                </div>
                                <div className="col-span-2">
                                    <h4 className="font-semibold mb-1 text-muted-foreground">Ketersediaan</h4>
                                    <p className="flex items-center">
                                        <CalendarIcon className="mr-2" size={14}/>
                                        {new Date(komoditas.availability).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="fasilitas" className="p-6 space-y-6">
                            <div>
                                <h3 className="font-semibold mb-3 text-lg">Fasilitas</h3>
                                <div className="flex flex-wrap gap-2">
                                    {komoditas.facilities.map((facility, index) => (
                                        <Badge key={index} variant="secondary"
                                               className="text-xs px-3 py-1">{facility}</Badge>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-3 text-lg">Jenis Usaha yang Diizinkan</h3>
                                <div className="flex flex-wrap gap-2">
                                    {komoditas.allowedBusinessTypes.map((type, index) => (
                                        <Badge key={index} variant="outline"
                                               className="text-xs px-3 py-1">{type}</Badge>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="persyaratan" className="p-6 space-y-6">
                            <div>
                                <h3 className="font-semibold mb-3 text-lg">Persyaratan Sewa</h3>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                                    {komoditas.rentalRequirements?.map((req, index) => (
                                        <li key={index}>{req}</li>
                                    ))}
                                </ul>
                            </div>
                        </TabsContent>
                        <TabsContent value="kontak" className="p-6 space-y-6">
                            <h3 className="font-semibold mb-4 text-lg">Informasi Kontak</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex items-center space-x-3 bg-muted p-4 rounded-lg">
                                    <Info className="text-primary" size={20}/>
                                    <div>
                                        <p className="font-medium text-sm">Pemilik</p>
                                        <p className="text-sm text-muted-foreground">{komoditas.ownerName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 bg-muted p-4 rounded-lg">
                                    <FaWhatsapp className="text-primary" size={20}/>
                                    <div>
                                        <p className="font-medium text-sm">WhatsApp</p>
                                        <p className="text-sm text-muted-foreground">{komoditas.phoneNumber}</p>
                                    </div>
                                </div>
                                {komoditas.email && (
                                    <div className="flex items-center space-x-3 bg-muted p-4 rounded-lg">
                                        <Mail className="text-primary" size={20}/>
                                        <div>
                                            <p className="font-medium text-sm">Email</p>
                                            <p className="text-sm text-muted-foreground">{komoditas.email}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center space-x-3 bg-muted p-4 rounded-lg">
                                    <MapPin className="text-primary" size={20}/>
                                    <div>
                                        <p className="font-medium text-sm">Lokasi</p>
                                        <p className="text-sm text-muted-foreground">{komoditas.location}</p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Fixed bottom bar for mobile */}
            <div className="fixed bottom-0 flex justify-center left-0 right-0 bg-background border-t p-4">
                <Button
                    className="w-full max-w-5xl mx-auto bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                    onClick={handleChatSekarang}
                >
                    <FaWhatsapp className="mr-2 h-5 w-5"/> Chat Sekarang
                </Button>
            </div>
        </div>
    )
}