/**
 * v0 by Vercel.
 * @see https://v0.dev/t/ACvFdYhJRHd
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

"use client"

import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import Image from "next/image";
import {Column} from "@/components/wrapper/Column";
import Navbar from "@/components/molecules/Navbar";
import {useRouter} from "next/navigation";
import {ConfirmationDialog} from "@/components/molecules/ConfirmationDialog";
import {useState} from "react";

// Define the product type
interface Product {
    id: number;
    image: string;
    name: string;
    description: string;
    price: number;
}

export default function Component() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const products: Product[] = [
        {
            id: 1,
            image: "/placeholder.svg",
            name: "Gamer Gear Pro Controller",
            description: "High-performance gaming controller",
            price: 59.99,
        },
        {
            id: 2,
            image: "/placeholder.svg",
            name: "Ergonomic Office Chair",
            description: "Comfortable and supportive office chair",
            price: 199.99,
        },
        {
            id: 3,
            image: "/placeholder.svg",
            name: "Wireless Charging Pad",
            description: "Fast and convenient wireless charging",
            price: 29.99,
        },
        {
            id: 4,
            image: "/placeholder.svg",
            name: "Smart Home Hub",
            description: "Control your smart home devices",
            price: 99.99,
        },
    ];

    return (
        <Column className={"w-full max-w-5xl mx-auto"}>
            <Navbar/>

            <ConfirmationDialog
                setIsOpen={setOpen}
                isOpen={open}
                description={"Delete this item ?"} onResult={() => {
            }}
                title={"Are you sure ?"}
            />

            <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Comodity</h1>
                    <Button onClick={() => router.push("/add-product")} size="sm">Create New Comodity</Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Card key={product.id} className="relative">
                            <Image
                                src={product.image}
                                alt={product.name}
                                width={400}
                                height={300}
                                className="rounded-t-lg object-cover w-full h-48"
                                style={{aspectRatio: "400/300", objectFit: "cover"}}
                            />
                            <CardContent className="p-4">
                                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                                <p className="text-muted-foreground mb-4">{product.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-primary font-semibold">${product.price}</span>
                                    <div className="flex items-center gap-2">
                                        <Button size="icon" variant="outline"
                                                onClick={() => router.push("/edit-product")}>
                                            <FilePenIcon className="w-5 h-5"/>
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                        <Button onClick={() => setOpen(true)} size="icon" variant="outline">
                                            <TrashIcon className="w-5 h-5"/>
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </Column>
    );
}

// Define the icon components with props typed
function FilePenIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10"/>
            <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
            <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z"/>
        </svg>
    );
}

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 6h18"/>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
        </svg>
    );
}
