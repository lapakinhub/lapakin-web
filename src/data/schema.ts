import * as z from "zod";

export const propertySchema = z.object({
    title: z.string({message: "Wajib diisi"}).min(1, 'Judul comodity harus diisi'),
    type: z.enum(['Halaman', 'Ruko/Kios', 'Gedung/Mall', 'Stan/Booth', 'Kantin', 'Gudang', 'Tanah Kosong'] as const, {message: "Wajib diisi"}),
    address: z.string({message: "Wajib diisi"}).min(1, 'Alamat comodity harus diisi'),
    description: z.string({message: "Wajib diisi"}).optional(),
    price: z.number({message: "Wajib diisi"}).min(0, 'Harga tidak boleh negatif'),
    rentalDuration: z.enum(['Harian', 'Mingguan', 'Bulanan', 'Tahunan'] as const, {message: "Wajib diisi"}),
    area: z.number({message: "Wajib diisi"}).min(0, 'Luas area tidak boleh negatif'),
    facilities: z.array(z.string()).min(1, "Data wajib diisi"),
    videoUrl: z.string({message: "Wajib diisi"}).url('URL video tidak valid').optional().or(z.literal('')),
    specialConditions: z.array(z.string()),
    allowedBusinessTypes: z.array(z.string()),
    transactionType: z.enum(['Sewa', 'Bagi Hasil'] as const, {message: "Wajib diisi"}),
    security: z.array(z.string()),
    availability: z.date(),
    rentalRequirements: z.array(z.string()).min(1, "Data wajib diisi"),
    flexibility: z.array(z.string()),
    ownerName: z.string({message: "Wajib diisi"}).min(1, 'Nama pemilik comodity harus diisi'),
    phoneNumber: z.string({message: "Wajib diisi"}).min(10, 'Nomor telepon tidak valid'),
    images: z.array(z.string()),
    email: z.string({message: "Wajib diisi"}).email('Email tidak valid').optional().or(z.literal('')),
    location: z.string({message: "Wajib diisi"}).min(1, 'Lokasi comodity harus diisi'),
})
export type CommodityFormData = z.infer<typeof propertySchema>