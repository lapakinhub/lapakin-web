'use client'

import {useState} from 'react'
import {useForm, Controller} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Checkbox} from "@/components/ui/checkbox"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Column} from "@/components/wrapper/Column";
import {useRouter} from "next/navigation";

const propertyCategories = [
    "Halaman",
    "Ruko/Kios",
    "Gedung/Mall",
    "Stan/Booth",
    "Kantin",
    "Gudang",
    "Tanah Kosong"
] as const

const durations = ["Harian", "Mingguan", "Bulanan", "Tahunan"] as const

const facilities = [
    "Parkir",
    "AC",
    "Koneksi Internet",
    "Akses 24/7",
    "Listrik",
    "Air"
] as const

const allowedBusinessTypes = [
    "Kuliner",
    "Ritel",
    "Digital Store",
    "Jasa",
    "Lainnya"
] as const

const formSchema = z.object({
    title: z.string().min(5, {message: "Judul harus minimal 5 karakter"}),
    category: z.enum(propertyCategories, {required_error: "Pilih kategori properti"}),
    address: z.string().min(5, {message: "Alamat harus diisi"}),
    description: z.string().min(20, {message: "Deskripsi minimal 20 karakter"}),
    price: z.string().min(1, {message: "Harga harus diisi"}),
    duration: z.enum(durations, {required_error: "Pilih durasi sewa"}),
    area: z.string().min(1, {message: "Luas area harus diisi"}),
    facilities: z.array(z.enum(facilities)).min(1, {message: "Pilih minimal satu fasilitas"}),
    images: z.string().min(1, {message: "Masukkan URL gambar"}),
    specialConditions: z.string().optional(),
    allowedBusinessTypes: z.array(z.enum(allowedBusinessTypes)).min(1, {message: "Pilih minimal satu jenis usaha"}),
    transactionType: z.enum(["sewa", "bagi hasil"]),
    security: z.string().optional(),
    availability: z.string().min(1, {message: "Masukkan ketersediaan properti"}),
    rentalRequirements: z.string().min(1, {message: "Masukkan persyaratan sewa"}),
    flexibility: z.string().optional(),
    ownerName: z.string().min(1, {message: "Nama pemilik harus diisi"}),
    phoneNumber: z.string().min(10, {message: "Nomor telepon harus diisi"}),
    email: z.string().email({message: "Email tidak valid"}),
})

type FormValues = z.infer<typeof formSchema>

export default function AddPropertyListingForm() {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            category: "Halaman",
            address: "",
            description: "",
            price: "",
            duration: "Harian",
            area: "",
            facilities: [],
            images: "",
            specialConditions: "",
            allowedBusinessTypes: [],
            transactionType: "sewa",
            security: "",
            availability: "",
            rentalRequirements: "",
            flexibility: "",
            ownerName: "",
            phoneNumber: "",
            email: "",
        },
    })

    function onSubmit(values: FormValues) {
        setIsSubmitting(true)
        // Here you would typically send the form service to your API
        console.log(values)
        setTimeout(() => {
            setIsSubmitting(false)
            // Handle success or error
            alert("Property listing added successfully!")
            form.reset()
        }, 2000)
    }

    return (
        <Column className={'max-w-5xl w-full mx-auto'}>
            <Button variant={'secondary'} className={'mb-4'} onClick={() => router.back()}>Kembali</Button>
            <Card className="w-full mx-auto">
                <CardHeader>
                    <CardTitle>Add New Property Listing</CardTitle>
                    <CardDescription>Enter the details of the property you want to list.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Judul Properti</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Sewa Ruko Jl. Stasiun Kota Kediri" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Kategori Properti</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih kategori properti"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {propertyCategories.map((category) => (
                                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="address"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Alamat Properti</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Jl. Stasiun No. 123, Kota Kediri" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Deskripsi Properti</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Deskripsi detail properti..." {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Harga Sewa / Bagi Hasil</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Rp 5.000.000 / bulan" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="duration"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Durasi Sewa</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih durasi sewa"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {durations.map((duration) => (
                                                        <SelectItem key={duration}
                                                                    value={duration}>{duration}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="area"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Luas Area (m²)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="100" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="facilities"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Fasilitas</FormLabel>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {facilities.map((facility) => (
                                                <FormField
                                                    key={facility}
                                                    control={form.control}
                                                    name="facilities"
                                                    render={({field}) => {
                                                        return (
                                                            <FormItem
                                                                key={facility}
                                                                className="flex flex-row items-start space-x-3 space-y-0"
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(facility)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked
                                                                                ? field.onChange([...field.value, facility])
                                                                                : field.onChange(
                                                                                    field.value?.filter(
                                                                                        (value) => value !== facility
                                                                                    )
                                                                                )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">
                                                                    {facility}
                                                                </FormLabel>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="images"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>URL Gambar/Video Properti</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com/image.jpg" {...field} />
                                        </FormControl>
                                        <FormDescription>Masukkan URL gambar atau video properti</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="specialConditions"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Kondisi Khusus</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Kondisi khusus properti..." {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="allowedBusinessTypes"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Jenis Usaha yang Diizinkan</FormLabel>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {allowedBusinessTypes.map((type) => (
                                                <FormField
                                                    key={type}
                                                    control={form.control}
                                                    name="allowedBusinessTypes"
                                                    render={({field}) => {
                                                        return (
                                                            <FormItem
                                                                key={type}
                                                                className="flex flex-row items-start space-x-3 space-y-0"
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(type)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked
                                                                                ? field.onChange([...field.value, type])
                                                                                : field.onChange(
                                                                                    field.value?.filter(
                                                                                        (value) => value !== type
                                                                                    )
                                                                                )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">
                                                                    {type}
                                                                </FormLabel>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="transactionType"
                                render={({field}) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Tipe Transaksi</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-col space-y-1"
                                            >
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="sewa"/>
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        Sewa
                                                    </FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="bagi hasil"/>
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        Bagi Hasil
                                                    </FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="security"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Keamanan Properti</FormLabel>
                                        <FormControl>
                                            <Input placeholder="CCTV, Security, dll." {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="availability"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Ketersediaan Properti</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="rentalRequirements"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Persyaratan Sewa</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Persyaratan sewa properti..." {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="flexibility"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Fleksibilitas</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Fleksibilitas negosiasi..." {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="ownerName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Nama Pemilik Properti</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nama Pemilik" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Nomor Telepon</FormLabel>
                                        <FormControl>
                                            <Input type="tel" placeholder="+62 812-3456-7890" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="email@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Add Property Listing'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </Column>
    )
}