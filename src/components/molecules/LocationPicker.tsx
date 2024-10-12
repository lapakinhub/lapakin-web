'use client'

import * as React from "react"
import {useState, useMemo, useRef, useCallback, useEffect} from "react"
import {FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage} from "@/components/ui/form"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Input} from "@/components/ui/input"
import {UseFormReturn} from "react-hook-form"
import {CommodityFormData} from "@/app/add-product/page"
import {Search, MapPin} from 'lucide-react'
import {ScrollArea} from "@/components/ui/scroll-area"
import {Button} from "@/components/ui/button"
import {useDebounce} from "@/hooks/use-debounce"
import {locationData} from "@/data/location";

const locations = locationData

export default function LocationPicker({form}: { form: UseFormReturn<CommodityFormData> }) {
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null)
    const [provinceSearchTerm, setProvinceSearchTerm] = useState("")
    const [citySearchTerm, setCitySearchTerm] = useState("")
    const [isCustomLocation, setIsCustomLocation] = useState(false)
    const [isProvinceOpen, setIsProvinceOpen] = useState(false)
    const [isCityOpen, setIsCityOpen] = useState(false)

    const provinceSearchRef = useRef<HTMLInputElement>(null)
    const citySearchRef = useRef<HTMLInputElement>(null)

    const debouncedProvinceSearchTerm = useDebounce(provinceSearchTerm, 300)
    const debouncedCitySearchTerm = useDebounce(citySearchTerm, 300)

    const filteredProvinces = useMemo(() => {
        return Object.keys(locations).filter(province =>
            province.toLowerCase().includes(debouncedProvinceSearchTerm.toLowerCase())
        )
    }, [debouncedProvinceSearchTerm])

    const filteredCities = useMemo(() => {
        if (!selectedProvince) return []
        return locations[selectedProvince as keyof typeof locations].filter(city =>
            city.toLowerCase().includes(debouncedCitySearchTerm.toLowerCase())
        )
    }, [selectedProvince, debouncedCitySearchTerm])

    const handleProvinceSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setProvinceSearchTerm(event.target.value)
    }, [])

    const handleCitySearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setCitySearchTerm(event.target.value)
    }, [])

    const handleProvinceChange = useCallback((province: string) => {
        setSelectedProvince(province)
        setCitySearchTerm("")
        setIsProvinceOpen(false)
        if (form.getValues("location") === null) {
            setTimeout(() => setIsCityOpen(true), 0)
        }
    }, [form])

    const handleCityChange = useCallback((city: string) => {
        if (city === "other") {
            setIsCustomLocation(true)
            form.setValue("location", "")
        } else {
            form.setValue("location", city)
        }
        setIsCityOpen(false)
    }, [form])

    useEffect(() => {
        if (isProvinceOpen) {
            setTimeout(() => provinceSearchRef.current?.focus(), 0)
        }
    }, [isProvinceOpen])

    useEffect(() => {
        if (isCityOpen) {
            setTimeout(() => citySearchRef.current?.focus(), 0)
        }
    }, [isCityOpen])

    const handleProvinceKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && filteredProvinces.length > 0) {
            event.preventDefault()
            handleProvinceChange(filteredProvinces[0])
        }
    }, [filteredProvinces, handleProvinceChange])

    const handleCityKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && filteredCities.length > 0) {
            event.preventDefault()
            handleCityChange(filteredCities[0])
        }
    }, [filteredCities, handleCityChange])

    useEffect(() => {
        const initialCity = form.getValues("location")
        console.log(form.getValues("location"))
        if (initialCity) {
            const foundProvince = Object.entries(locations).find(([_, cities]) =>
                cities.includes(initialCity)
            )
            console.log(foundProvince ? foundProvince[0] : "")
            setSelectedProvince(foundProvince ? foundProvince[0] : "Jawa Timur")

        }
    }, [form.getValues('location'), selectedProvince])

    return (
        <FormField
            control={form.control}
            name="location"
            render={({field}) => (
                <FormItem className="space-y-2">
                    <FormLabel>Lokasi Properti</FormLabel>
                    <FormControl>
                        <div className="space-y-2">
                            {!isCustomLocation ? (
                                <>
                                    <Select
                                        open={isProvinceOpen}
                                        onOpenChange={setIsProvinceOpen}
                                        onValueChange={handleProvinceChange}
                                        value={selectedProvince || ""}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih Provinsi"/>
                                        </SelectTrigger>
                                        <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                                            <div className="flex items-center space-x-2 px-3 py-2 border-b">
                                                <Search className="h-4 w-4 text-muted-foreground"/>
                                                <Input
                                                    ref={provinceSearchRef}
                                                    placeholder="Cari provinsi..."
                                                    value={provinceSearchTerm}
                                                    onChange={handleProvinceSearch}
                                                    onKeyDown={handleProvinceKeyDown}
                                                    className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                                />
                                            </div>
                                            <ScrollArea className="h-[200px]">
                                                {filteredProvinces.map((province) => (
                                                    <SelectItem
                                                        key={province}
                                                        value={province}
                                                        onMouseDown={(e) => {
                                                            e.preventDefault()
                                                            handleProvinceChange(province)
                                                        }}
                                                    >
                                                        {province}
                                                    </SelectItem>
                                                ))}
                                            </ScrollArea>
                                        </SelectContent>
                                    </Select>

                                    {selectedProvince && (
                                        <Select
                                            open={isCityOpen}
                                            onOpenChange={setIsCityOpen}
                                            onValueChange={handleCityChange}
                                            value={form.getValues("location")}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Pilih Kota/Kabupaten"/>
                                            </SelectTrigger>
                                            <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                                                <div className="flex items-center space-x-2 px-3 py-2 border-b">
                                                    <Search className="h-4 w-4 text-muted-foreground"/>
                                                    <Input
                                                        ref={citySearchRef}
                                                        placeholder="Cari kota/kabupaten..."
                                                        value={citySearchTerm}
                                                        onChange={handleCitySearch}
                                                        onKeyDown={handleCityKeyDown}
                                                        className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                                    />
                                                </div>
                                                <ScrollArea className="h-[200px]">
                                                    {filteredCities.map((city) => (
                                                        <SelectItem
                                                            key={city}
                                                            value={city}
                                                            onMouseDown={(e) => {
                                                                e.preventDefault()
                                                                handleCityChange(city)
                                                            }}
                                                        >
                                                            {city}
                                                        </SelectItem>
                                                    ))}
                                                    <SelectItem
                                                        value="other"
                                                        onMouseDown={(e) => {
                                                            e.preventDefault()
                                                            handleCityChange("other")
                                                        }}
                                                    >
                                                        Lainnya
                                                    </SelectItem>
                                                </ScrollArea>
                                            </SelectContent>
                                        </Select>
                                    )}
                                </>
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
                                            setSelectedProvince(null)
                                            field.onChange("")
                                        }}
                                    >
                                        <MapPin className="h-4 w-4"/>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </FormControl>
                    <FormDescription>
                        Pilih lokasi properti dari daftar provinsi dan kota/kabupaten, atau masukkan lokasi kustom jika
                        tidak tercantum.
                    </FormDescription>
                    <FormMessage/>
                </FormItem>
            )}
        />
    )
}