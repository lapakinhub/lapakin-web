'use client'

import {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Button} from "@/components/ui/button"
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "@/components/ui/card"
import {Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage} from "@/components/ui/form"
import {Checkbox} from "@/components/ui/checkbox"
import {CalendarIcon, Plus, Search, X, ChevronLeft, ChevronRight} from 'lucide-react'
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {cn} from "@/lib/utils"
import {format} from "date-fns"
import {Calendar} from "@/components/ui/calendar"
import {useGetCommodity, useUpdateCommodity} from "@/service/query/comodity-query"
import {Commodity} from "@/types/commodity"
import LocationPicker from "@/components/molecules/LocationPicker"
import {Column} from "@/components/wrapper/Column"
import {useRouter, useSearchParams} from "next/navigation"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Badge} from "@/components/ui/badge"
import {formatToRupiah} from "@/lib/number-format"
import {firebaseApp} from "@/lib/firebase"
import {getAuth} from "firebase/auth"
import {useGetAuthUser} from "@/service/query/auth.query"
import LoaderOverlay from "@/components/molecules/LoadingOverlay"
import {Progress} from "@/components/ui/progress"
import ImageUpload from "@/components/molecules/ImageUpload";
import {CommodityFormData, propertySchema} from "@/data/schema";

const defaultOptions = {
    facilities: ['Parkir', 'AC', 'Koneksi Internet', 'Akses 24/7', 'Listrik', 'Air'],
    allowedBusinessTypes: ['Kuliner', 'Ritel', 'Digital Store', 'Jasa', 'Kantor'],
    security: ['CCTV', 'Security', 'Sistem Alarm'],
    rentalRequirements: ['Pembayaran di Muka', 'Deposit', 'Surat Perjanjian'],
    flexibility: ['Negosiasi Harga', 'Durasi Sewa Fleksibel', 'Jenis Bisnis Fleksibel'],
    specialConditions: ['Larangan Bisnis Tertentu', 'Waktu Operasional Terbatas'],
}

const steps = [
    {title: "Informasi Dasar", fields: ["title", "type", "location", "address"]},
    {title: "Deskripsi & Harga", fields: ["description", "price", "rentalDuration", "area"]},
    {title: "Media", fields: ["images", "videoUrl"]},
    {title: "Transaksi & Ketersediaan", fields: ["transactionType", "availability"]},
    {title: "Informasi Pemilik", fields: ["ownerName", "phoneNumber", "email"]},
    {
        title: "Fasilitas & Kondisi",
        fields: ["facilities", "specialConditions", "allowedBusinessTypes", "security", "rentalRequirements", "flexibility"]
    },
]

export default function EditCommodityForm() {
    const [currentStep, setCurrentStep] = useState(0)
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const [customOptions, setCustomOptions] = useState({
        facilities: '',
        allowedBusinessTypes: '',
        security: '',
        rentalRequirements: '',
        flexibility: '',
        specialConditions: ''
    })

    const searchParams = useSearchParams()

    const commodityId = searchParams.get('id') as string

    const {data: commodity, isLoading: isLoadingCommodity} = useGetCommodity(commodityId)

    const auth = getAuth(firebaseApp)
    const {data: authUser, isLoading: isLoadUser} = useGetAuthUser()

    const {mutate: updateCommodity, isPending} = useUpdateCommodity()

    const form = useForm<CommodityFormData>({
        resolver: zodResolver(propertySchema),
        defaultValues: {
            facilities: [],
            specialConditions: [],
            allowedBusinessTypes: [],
            security: [],
            rentalRequirements: [],
            flexibility: [],
            images: [],
            videoUrl: "",
            location: "",
            ownerName: "",
            email: auth.currentUser?.email ?? "",
            transactionType: "Sewa",
            availability: new Date(),
            description: "",
            address: "",
            type: "Halaman"
        }
    })

    useEffect(() => {
        if (commodity) {
            form.reset(commodity)
            setImagePreviews(commodity.images || [])
        }
    }, [commodity, form])

    useEffect(() => {
        form.setValue('ownerName', authUser?.fullName ?? '')
        form.setValue('phoneNumber', authUser?.phoneNumber ?? '')
    }, [authUser, form])

    const onSubmit = async (    data: CommodityFormData) => {
        const updatedCommodity: Commodity = {
            ...data,
            images: data.images.filter((img: string) => !img.startsWith('blob:')),
            id: commodityId
        }

        updateCommodity({id: commodityId, comodity: updatedCommodity, files: imageFiles});
    }

    const route = useRouter()

    const [searchTerm, setSearchTerm] = useState('')
    const [isAdding, setIsAdding] = useState(false)

    const renderCheckboxGroup = (field: keyof typeof customOptions, label: string) => (
        <FormField
            control={form.control}
            name={field}
            render={() => (
                <FormItem className="space-y-2">
                    <FormLabel>{label.charAt(0).toUpperCase() + label.slice(1)}</FormLabel>
                    <FormControl>
                        <div className="space-y-4 rounded-md border p-4">
                            <div className="flex items-center space-x-2">
                                <Search className="text-muted-foreground h-5 w-5"/>
                                <Input
                                    placeholder={`Cari ${label.toLowerCase()}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-grow"
                                />
                            </div>
                            <ScrollArea className="h-fit">
                                <div className="space-y-2">
                                    {Array.from(new Set([...defaultOptions[field], ...form.watch(field)]))
                                        .filter(option => option.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map((option) => (
                                            <div key={option} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`${field}-${option}`}
                                                    checked={form.watch(field).includes(option)}
                                                    onCheckedChange={(checked) => {
                                                        const currentValues = form.getValues(field)
                                                        if (checked) {
                                                            form.setValue(field, Array.from(new Set([...currentValues, option])))
                                                        } else {
                                                            form.setValue(field, currentValues.filter((v) => v !== option))
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor={`${field}-${option}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {option}
                                                </label>
                                                {!defaultOptions[field].includes(option) && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            const currentValues = form.getValues(field)
                                                            form.setValue(field, currentValues.filter((v) => v !== option))
                                                        }}
                                                        className="ml-auto h-6 w-6 rounded-full p-0"
                                                    >
                                                        <X className="h-4 w-4"/>
                                                        <span className="sr-only">Hapus {option}</span>
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </ScrollArea>
                            {isAdding ? (
                                <div className="flex items-center space-x-2">
                                    <Input
                                        placeholder={`Tambah ${label.toLowerCase()} baru`}
                                        value={customOptions[field]}
                                        onChange={(e) => setCustomOptions({...customOptions, [field]: e.target.value})}
                                        className="flex-grow"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            if (customOptions[field].trim()) {
                                                const currentValues = form.getValues(field)
                                                form.setValue(field, Array.from(new Set([...currentValues, customOptions[field].trim()])))
                                                setCustomOptions({...customOptions, [field]: ''})
                                            }
                                            setIsAdding(false)
                                        }}
                                        size="sm"
                                    >
                                        Tambah
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsAdding(false)}
                                        size="sm"
                                    >
                                        Batal
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAdding(true)}
                                    className="w-full"
                                >
                                    <Plus className="h-4 w-4 mr-2"/>
                                    Tambah {label.toLowerCase()} baru
                                </Button>
                            )}
                        </div>
                    </FormControl>
                    <div className="flex flex-wrap gap-2">
                        {form.watch(field).map((option) => (
                            <Badge key={option} variant="secondary" className="text-xs">
                                {option}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        const currentValues = form.getValues(field)
                                        form.setValue(field, currentValues.filter((v) => v !== option))
                                    }}
                                    className="h-4 w-4 ml-1 p-0"
                                >
                                    <X className="h-3 w-3"/>
                                    <span className="sr-only">Hapus {option}</span>
                                </Button>
                            </Badge>
                        ))}
                    </div>
                    <FormDescription className="text-xs text-muted-foreground">
                        Pilih atau tambahkan {label.toLowerCase()} yang sesuai.
                    </FormDescription>
                    <FormMessage/>
                </FormItem>
            )}
        />
    )

    const renderStepContent = (step: number) => {
        const {fields} = steps[step]
        return (
            <div className="space-y-6">
                {fields.map((field) => {
                    if (field === "images") {
                        return (
                            <ImageUpload
                                onImageUpload={(imgFile, img) => {
                                    setImagePreviews(img)
                                    form.setValue('images', img)
                                    setImageFiles(imgFile)
                                }}
                                onDeleteAllImages={() => {
                                    setImagePreviews([])
                                    setImageFiles([])
                                    form.setValue('images', [])
                                }}
                                images={imagePreviews}
                                files={imageFiles}
                                onDeleteImage={
                                    (imgFile, img) => {
                                        setImagePreviews(img)
                                        setImageFiles(imgFile)
                                        form.setValue('images', img)
                                    }
                                }
                            />
                        )
                    }
                    if (field === "price") {
                        return <FormField
                            control={form.control}
                            name="price"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Harga Sewa / Bagi Hasil</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Masukkan harga dalam Rupiah"
                                            value={field.value ? `Rp ${formatToRupiah(field.value)}` : ''}
                                            onChange={(e) => {
                                                const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                                field.onChange(rawValue ? parseFloat(rawValue) : 0);
                                            }}
                                        />
                                    </FormControl>

                                    <FormDescription>
                                        Masukkan harga sewa atau persentase bagi hasil sesuai kesepakatan.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    }
                    if (field === "area") {
                        return <FormField
                            control={form.control}
                            name="area"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Luas Area (m²)</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="number" min="0"
                                               placeholder="Masukkan luas area dalam meter persegi"
                                               onChange={(e) => field.onChange(parseFloat(e.target.value))}/>
                                    </FormControl>
                                    <FormDescription>Masukkan luas area comodity dalam meter persegi.</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />;
                    }

                    if (field === "location") {
                        return <LocationPicker key={field} form={form}/>
                    }
                    if (["facilities", "specialConditions", "allowedBusinessTypes", "security", "rentalRequirements", "flexibility"].includes(field)) {
                        const translatedProperties: Record<string, string> = {
                            "facilities": "Fasilitas",
                            "specialConditions": "Kondisi Khusus",
                            "allowedBusinessTypes": "Jenis Usaha yang Diizinkan",
                            "security": "Keamanan",
                            "rentalRequirements": "Persyaratan Sewa",
                            "flexibility": "Fleksibilitas"
                        };
                        return renderCheckboxGroup(field as keyof typeof customOptions, translatedProperties[field])
                    }
                    return (
                        <FormField
                            key={field}
                            control={form.control}
                            name={field as any}
                            render={({field: formField}) => (
                                <FormItem>
                                    <FormLabel>{getFieldLabel(field)}</FormLabel>
                                    <FormControl>
                                        {field === "description" ? (
                                            <Textarea {...formField} placeholder={getFieldPlaceholder(field)}/>
                                        ) : field === "type" || field === "rentalDuration" || field === "transactionType" ? (
                                            <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={getFieldPlaceholder(field)}/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {getFieldOptions(field).map(option => (
                                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : field === "availability" ? (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        type={"button"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !formField.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {formField.value ? format(formField.value, "PPP") :
                                                            <span>Pilih tanggal</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={formField.value}
                                                        onSelect={formField.onChange}
                                                        disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        ) : (
                                            <Input {...formField} placeholder={getFieldPlaceholder(field)}/>
                                        )}
                                    </FormControl>
                                    <FormDescription>{getFieldDescription(field)}</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    )
                })}
            </div>
        )
    }

    const getFieldLabel = (field: string): string => {
        const labels: { [key: string]: string } = {
            title: "Judul Properti",
            type: "Kategori Properti",
            address: "Alamat Properti",
            description: "Deskripsi Properti",
            price: "Harga Sewa / Bagi Hasil",
            rentalDuration: "Durasi Sewa",
            area: "Luas Area (m²)",
            videoUrl: "URL Video",
            transactionType: "Tipe Transaksi",
            availability: "Ketersediaan",
            ownerName: "Nama Pemilik Properti",
            phoneNumber: "Nomor Telepon",
            email: "Email",
        }
        return labels[field] || field.charAt(0).toUpperCase() + field.slice(1)
    }

    const getFieldPlaceholder = (field: string): string => {
        const placeholders: { [key: string]: string } = {
            title: "Contoh: Sewa Ruko Jl. Stasiun Kota Kediri",
            type: "Pilih kategori comodity",
            address: "Masukkan alamat lengkap properti",
            description: "Jelaskan detail properti seperti ukuran, fasilitas, aksesibilitas, kondisi, dll.",
            price: "Masukkan harga dalam Rupiah",
            rentalDuration: "Pilih durasi sewa",
            area: "Masukkan luas area dalam meter persegi",
            videoUrl: "https://www.youtube.com/watch?v=...",
            transactionType: "Pilih tipe transaksi",
            availability: "Pilih tanggal",
            ownerName: "Masukkan nama pemilik atau tim pengelola",
            phoneNumber: "Contoh: 081234567890",
            email: "contoh@email.com",
        }
        return placeholders[field] || `Masukkan ${field}`
    }

    const getFieldDescription = (field: string): string => {
        const descriptions: { [key: string]: string } = {
            title: "Masukkan judul yang menarik dan deskriptif untuk properti Anda.",
            type: "Pilih kategori yang paling sesuai dengan properti Anda.",
            address: "Berikan alamat fisik atau digital yang jelas untuk properti Anda.",
            description: "Berikan deskripsi yang lengkap dan menarik tentang properti Anda.",
            price: "Masukkan harga sewa atau persentase bagi hasil sesuai kesepakatan.",
            rentalDuration: "Pilih durasi sewa yang tersedia untuk properti ini.",
            area: "Masukkan luas area properti dalam meter persegi.",
            videoUrl: "Masukkan URL video YouTube atau platform serupa jika ada.",
            transactionType: "Pilih jenis transaksi yang ditawarkan untuk properti ini.",
            availability: "Pilih tanggal ketersediaan properti.",
            ownerName: "Masukkan nama pemilik properti atau tim yang mengelola.",
            phoneNumber: "Masukkan nomor telepon yang dapat dihubungi.",
            email: "Masukkan alamat email untuk komunikasi non-telepon.",
        }
        return descriptions[field] || `Masukkan informasi ${field}`
    }

    const getFieldOptions = (field: string): string[] => {
        const options: { [key: string]: string[] } = {
            type: ['Halaman', 'Ruko/Kios', 'Gedung/Mall', 'Stan/Booth', 'Kantin', 'Gudang', 'Tanah Kosong'],
            rentalDuration: ['Harian', 'Mingguan', 'Bulanan', 'Tahunan'],
            transactionType: ['Sewa', 'Bagi Hasil'],
        }
        return options[field] || []
    }

    return (
        <Column className={'max-w-3xl mx-auto w-full'}>
            <LoaderOverlay isLoading={isLoadUser || isLoadingCommodity || isPending}/>
            <Button type={"button"} className={'my-4'} variant={'secondary'}
                    onClick={() => route.back()}>Kembali</Button>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Edit Comodity</CardTitle>
                    <CardDescription>Ubah informasi comodity yang sudah ada.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between mb-2">
                                    {steps.map((step, index) => (
                                        <Button
                                            key={index}
                                            type={"button"}
                                            variant={currentStep === index ? "default" : "outline"}
                                            onClick={() => setCurrentStep(index)}
                                            className="px-2 py-1 text-sm"
                                        >
                                            {index + 1}
                                        </Button>
                                    ))}
                                </div>
                                <Progress value={(currentStep + 1) / steps.length * 100} className="w-full"/>
                            </div>
                            <h2 className="text-lg font-semibold mb-4">{steps[currentStep].title}</h2>
                            {renderStepContent(currentStep)}
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                        type="button"
                        onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                        disabled={currentStep === 0}
                        variant="outline"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4"/> Sebelumnya
                    </Button>
                    {currentStep === steps.length - 1 ? (
                        <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                            Simpan Perubahan
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                        >
                            Selanjutnya <ChevronRight className="ml-2 h-4 w-4"/>
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </Column>
    )
}