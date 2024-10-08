'use client'

import { useState } from 'react'
import { Search, MapPin, X } from 'lucide-react'
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

const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'jakarta', name: 'Jakarta' },
    { id: 'surabaya', name: 'Surabaya' },
    { id: 'bandung', name: 'Bandung' },
    { id: 'medan', name: 'Medan' },
    { id: 'semarang', name: 'Semarang' },
]

export default function AestheticSearchBar() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedLocation, setSelectedLocation] = useState(locations[0])
    const [isOpen, setIsOpen] = useState(false)

    const handleSearch = () => {
        console.log('Search query:', searchQuery)
        console.log('Selected location:', selectedLocation.name)
        // Implement your search logic here
    }

    const handleLocationSelect = (locationId: string) => {
        const location = locations.find(loc => loc.id === locationId)
        if (location) {
            setSelectedLocation(location)
            setIsOpen(false)
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-lg rounded-full p-2 sm:p-4 flex flex-col sm:flex-row gap-4 sm:gap-2 items-center">
                <div className="relative w-full">
                    <Input
                        type="text"
                        placeholder="Search for anything..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 text-lg rounded-full border-none focus:ring-2 focus:ring-primary"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                </div>
                <div className="flex w-full sm:w-auto justify-between sm:justify-start gap-2">
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full sm:w-auto text-base py-3 px-6 rounded-full border-2 border-primary hover:bg-primary hover:text-white transition-colors">
                                <MapPin className="mr-2 h-5 w-5" />
                                <span className="truncate max-w-[120px] sm:max-w-none">{selectedLocation.name}</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-center">Choose Location</DialogTitle>
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
                    <Button onClick={handleSearch} className="w-full sm:w-auto text-base py-3 px-8 rounded-full bg-primary hover:bg-primary/90 transition-colors">
                        Filter
                    </Button>
                </div>
            </div>
            {searchQuery && (
                <div className="mt-4 flex items-center bg-gray-100 rounded-full px-4 py-2 text-sm">
                    <span className="mr-2">Searching for: {searchQuery}</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto p-1 h-auto rounded-full hover:bg-gray-200"
                        onClick={() => setSearchQuery('')}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear search</span>
                    </Button>
                </div>
            )}
        </div>
    )
}