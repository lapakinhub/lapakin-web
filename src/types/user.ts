export interface User {
    fullName?: string; // Nama lengkap atau nama bisnis
    username?: string; // Username untuk profil publik
    email?: string; // Email (opsional, untuk verifikasi)
    phoneNumber?: string;
    address?: string;
    image?: string; // Foto profil atau logo bisnis (opsional)
    userType?: 'personal' | 'business'; // Jenis pengguna: perorangan atau bisnis
    description?: string; // Deskripsi singkat pengguna
    socialMediaLinks?: {
        instagram?: string;
        linkedIn?: string;
        facebook?: string;
    }; // Link media sosial (opsional)
}
