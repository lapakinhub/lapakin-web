import {FieldValue} from "@firebase/firestore";


export type PropertyType = 'Halaman' | 'Ruko/Kios' | 'Gedung/Mall' | 'Stan/Booth' | 'Kantin' | 'Gudang' | 'Tanah Kosong';
export type TransactionType = 'Sewa' | 'Bagi Hasil';
export type RentalDuration = 'Harian' | 'Mingguan' | 'Bulanan' | 'Tahunan';

export interface Commodity {
    id?: string;
    title: string;
    type: PropertyType;
    address: string;
    location?: string;
    description: string;
    price: number;
    rentalDuration: RentalDuration;
    area: number;
    facilities: string[];
    images?: string[];
    videoUrl?: string;
    specialConditions?: string[];
    allowedBusinessTypes: string[];
    transactionType: TransactionType;
    security?: string[];
    availability: Date;
    rentalRequirements?: string[];
    flexibility?: string[];
    ownerName: string;
    ownerId?: string;
    phoneNumber: string;
    email?: string;
    lastModified?: Date | FieldValue;
    totalPages?: number
}