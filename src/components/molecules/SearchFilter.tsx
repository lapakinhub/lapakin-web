'use client'

import { ChangeEvent, useCallback, useState } from 'react'
import { Search, MapPin, ChevronDown, SortAsc } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import debounce from 'lodash/debounce'
import { IoMdClose } from "react-icons/io"
import { locationData } from "@/data/location"

interface SearchBarProps {
    onSearch: (query: string) => void
    onFilter: (city: string) => void
    onSort: (sortOption: 'newest' | 'oldest') => void
}

export default function IntegratedSearchBar({ onSearch, onFilter, onSort }: SearchBarProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedProvince, setSelectedProvince] = useState<string>('')
    const [selectedCity, setSelectedCity] = useState<string>('')
    const [isOpen, setIsOpen] = useState(false)
    const [sortOption, setSortOption] = useState<'newest' | 'oldest' | undefined>(undefined)

    const debouncedSearch = useCallback(
        debounce((query) => {
            console.log('Mencari:', query)
            onSearch(query)
        }, 500),
        [onSearch]
    )

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
        debouncedSearch(e.target.value)
    }

    const handleProvinceChange = (province: string) => {
        setSelectedProvince(province)
        setSelectedCity('')
    }

    const handleCityChange = (city: string) => {
        setSelectedCity(city)
    }

    const handleApplyFilter = () => {
        onFilter(selectedCity)
        setIsOpen(false)
    }

    const handleSortChange = (option: 'newest' | 'oldest') => {
        setSortOption(option)
        onSort(option)
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
                <div className="bg-white shadow-lg rounded-2xl p-2 sm:p-3 flex flex-col sm:flex-row items-center border border-gray-200 hover:shadow-md transition-shadow duration-300">
                    <div className="relative w-full mb-2 sm:mb-0">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                            type="text"
                            placeholder="Cari apa saja..."
                            value={searchQuery}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-3 py-2 text-base sm:text-lg rounded-full border-none shadow-none focus-visible:outline-0 focus-visible:ring-0"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                        <Select onValueChange={handleSortChange} value={sortOption}>
                            <SelectTrigger className="w-full sm:w-[140px]">
                                <SortAsc className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Urutkan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Terbaru</SelectItem>
                                <SelectItem value="oldest">Terlama</SelectItem>
                            </SelectContent>
                        </Select>
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" className="w-full sm:w-auto text-sm py-2 px-3 rounded-full hover:bg-gray-100 transition-colors">
                                    <MapPin className="mr-1 h-4 w-4 text-primary" />
                                    <span className="font-medium truncate max-w-[100px]">
                    {selectedCity || selectedProvince || "Pilih Lokasi"}
                  </span>
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold text-center">Pilih Lokasi</DialogTitle>
                                </DialogHeader>
                                <div className="mt-4 space-y-4">
                                    <Button variant={'secondary'} className={"w-full"} onClick={() => {
                                        setSelectedProvince('')
                                        setSelectedCity('')
                                        setIsOpen(false)
                                        onFilter('')
                                    }}>Semua Lokasi</Button>

                                    <Select onValueChange={handleProvinceChange} value={selectedProvince}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih Provinsi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(locationData).map((province) => (
                                                <SelectItem key={province} value={province}>
                                                    {province}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {selectedProvince && (
                                        <Select onValueChange={handleCityChange} value={selectedCity}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Pilih Kota/Kabupaten" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {locationData[selectedProvince].map((city) => (
                                                    <SelectItem key={city} value={city}>
                                                        {city}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                    <Button
                                        className="w-full"
                                        onClick={handleApplyFilter}
                                        disabled={!selectedProvince || selectedCity.length === 0}
                                    >
                                        Terapkan Filter
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
            {(searchQuery || selectedProvince || selectedCity) && (
                <div className="mt-4 flex flex-wrap items-center bg-gray-100 rounded-full px-3 py-2 text-sm">
                    {searchQuery && (
                        <span className="mr-2 mb-1 bg-white rounded-full px-2 py-1">Mencari: {searchQuery}</span>
                    )}
                    {selectedCity && (
                        <span className="mr-2 mb-1 bg-white rounded-full px-2 py-1">Kota/Kabupaten: {selectedCity}</span>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto p-1 h-auto rounded-full hover:bg-gray-200"
                        onClick={() => {
                            setSearchQuery('')
                            setSelectedProvince('')
                            setSelectedCity('')
                            setSortOption('newest')
                            onSearch('')
                            onFilter('')
                            onSort('newest')
                        }}
                    >
                        <IoMdClose />
                    </Button>
                </div>
            )}
        </div>
    )
}