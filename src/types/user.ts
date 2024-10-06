export interface User {
    fullName?: string; // Nama lengkap atau nama bisnis
    username?: string; // Username untuk profil publik
    email?: string; // Email (opsional, untuk verifikasi)
    phoneNumber?: string; // Nomor telepon (untuk komunikasi atau button ke WA)
    address?: {
        city: string; // Kota
        region: string; // Wilayah
    }; // Alamat, terutama untuk pencarian properti di area terdekat
    profilePictureUrl?: string; // Foto profil atau logo bisnis (opsional)
    userType?: 'personal' | 'business'; // Jenis pengguna: perorangan atau bisnis
    shortDescription?: string; // Deskripsi singkat pengguna
    socialMediaLinks?: {
        instagram?: string;
        linkedIn?: string;
        facebook?: string;
    }; // Link media sosial (opsional)
}
