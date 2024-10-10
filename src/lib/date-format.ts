export function timeAgo(dateString: string): string {
    const sekarang = new Date();
    const waktuLalu = new Date(dateString);
    const selisihDetik = Math.floor((sekarang.getTime() - waktuLalu.getTime()) / 1000);

    const satuanWaktu = [
        { unit: "tahun", detik: 31536000 },
        { unit: "bulan", detik: 2592000 },
        { unit: "minggu", detik: 604800 },
        { unit: "hari", detik: 86400 },
        { unit: "jam", detik: 3600 },
        { unit: "menit", detik: 60 },
        { unit: "detik", detik: 1 }
    ];

    for (const { unit, detik } of satuanWaktu) {
        const interval = Math.floor(selisihDetik / detik);
        if (interval >= 1) {
            return interval === 1 ? `1 ${unit} yang lalu` : `${interval} ${unit} yang lalu`;
        }
    }

    return "barusan";
}
