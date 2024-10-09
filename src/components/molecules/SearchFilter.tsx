'use client'

import { ChangeEvent, useCallback, useState } from 'react'
import { Search, MapPin, ChevronDown } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import debounce from 'lodash/debounce'

const locations = [
    { id: 'all', name: 'Semua Lokasi' },
    { id: 'jakarta', name: 'Jakarta' },
    { id: 'surabaya', name: 'Surabaya' },
    { id: 'bandung', name: 'Bandung' },
    { id: 'medan', name: 'Medan' },
    { id: 'semarang', name: 'Semarang' },
]

interface SearchBarProps {
    onSearch: (query: string) => void;
    onFilter: (location: string) => void;
}

export default function IntegratedSearchBar({ onSearch, onFilter }: SearchBarProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedLocation, setSelectedLocation] = useState(locations[0])
    const [isOpen, setIsOpen] = useState(false)

    const debouncedSearch = useCallback(
        debounce((query) => {
            console.log('Mencari:', query);
            onSearch(query);
        }, 500),
        []
    );

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        debouncedSearch(e.target.value);
    };

    const handleLocationSelect = (locationId: string) => {
        const location = locations.find(loc => loc.id === locationId)
        if (location) {
            setSelectedLocation(location)
            onFilter(location.id)
            setIsOpen(false)
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
                <div className="bg-white shadow-lg rounded-full p-2 flex items-center border border-gray-200 hover:shadow-md transition-shadow duration-300">
                    <Search className="absolute left-4 text-gray-400 h-5 w-5" />
                    <Input
                        type="text"
                        placeholder="Cari apa saja..."
                        value={searchQuery}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-32 py-3 text-lg rounded-full border-none shadow-none focus-visible:outline-0 focus-visible:ring-0"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" className="text-sm py-2 px-3 rounded-full hover:bg-gray-100 transition-colors">
                                    <MapPin className="mr-1 h-4 w-4 text-primary" />
                                    <span className="font-medium truncate max-w-[100px]">{selectedLocation.name}</span>
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold text-center">Pilih Lokasi</DialogTitle>
                                </DialogHeader>
                                <RadioGroup value={selectedLocation.id} onValueChange={handleLocationSelect} className="gap-4 mt-4">
                                    {locations.map((location) => (
                                        <div key={location.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                            <RadioGroupItem value={location.id} id={location.id} className="border-2 border-primary text-primary" />
                                            <Label htmlFor={location.id} className="text-lg font-medium cursor-pointer flex-grow">{location.name}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
            {searchQuery && (
                <div className="mt-4 flex items-center bg-gray-100 rounded-full px-4 py-2 text-sm">
                    <span className="mr-2">Mencari: {searchQuery}</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto p-1 h-auto rounded-full hover:bg-gray-200"
                        onClick={() => {
                            setSearchQuery('')
                            onSearch('')
                        }}
                    >
                        <span className="sr-only">Hapus pencarian</span>
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    )
}