'use client'

import * as React from "react"
import { useState, useEffect } from "react"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { CommodityFormData } from "@/app/add-product/page"
import { Search, MapPin } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

const locations = [
    { value: "jakarta", label: "Jakarta" },
    { value: "surabaya", label: "Surabaya" },
    { value: "bandung", label: "Bandung" },
    { value: "medan", label: "Medan" },
    { value: "semarang", label: "Semarang" },
    { value: "makassar", label: "Makassar" },
    { value: "palembang", label: "Palembang" },
    { value: "tangerang", label: "Tangerang" },
    { value: "depok", label: "Depok" },
    { value: "bekasi", label: "Bekasi" },
    { value: "bali", label: "Bali" },
    { value: "yogyakarta", label: "Yogyakarta" },
]

export default function LocationPicker({ form }: { form: UseFormReturn<CommodityFormData> }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredLocations, setFilteredLocations] = useState(locations)
    const [isCustomLocation, setIsCustomLocation] = useState(false)

    useEffect(() => {
        const filtered = locations.filter(location =>
            location.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredLocations(filtered)
    }, [searchTerm])

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
    }

    return (
        <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel>Lokasi Properti</FormLabel>
                    <FormControl>
                        <div className="space-y-2">
                            {!isCustomLocation ? (
                                <Select
                                    onValueChange={(value) => {
                                        if (value === "other") {
                                            setIsCustomLocation(true)
                                            field.onChange("")
                                        } else {
                                            field.onChange(value)
                                        }
                                    }}
                                    value={field.value}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih lokasi properti" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <div className="flex items-center space-x-2 px-3 py-2 border-b">
                                            <Search className="h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Cari lokasi..."
                                                value={searchTerm}
                                                onChange={handleSearch}
                                                className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                            />
                                        </div>
                                        <ScrollArea className="h-[200px]">
                                            {filteredLocations.map((location) => (
                                                <SelectItem key={location.value} value={location.value}>
                                                    {location.label}
                                                </SelectItem>
                                            ))}
                                            <SelectItem value="other">Lainnya</SelectItem>
                                        </ScrollArea>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Input
                                        placeholder="Masukkan lokasi custom"
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        className="flex-grow"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                            setIsCustomLocation(false)
                                            field.onChange("")
                                        }}
                                    >
                                        <MapPin className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </FormControl>
                    <FormDescription>
                        Pilih lokasi properti dari daftar atau masukkan lokasi kustom jika tidak tercantum.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}