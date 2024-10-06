import {AspectRatio} from "@/components/ui/aspect-ratio"
import {Button} from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {ShoppingCart} from "lucide-react"

interface ProductCardProps {
    image?: string
    onClick?: () => void
}

export default function ProductCard({image, onClick}: ProductCardProps) {
    return (
        <Card onClick={() => {
            if (onClick) {
                onClick()
            }
        }} className="w-full cursor-pointer">
            <CardHeader className="p-0">
                <AspectRatio ratio={4 / 3}>
                    <img
                        src={image ?? "https://avatars.githubusercontent.com/u/124599?v=4"}
                        alt="Product image"
                        className="object-cover w-full h-full rounded-t-lg"
                    />
                </AspectRatio>
            </CardHeader>
            <CardContent className="p-4 text-ellipsis">
                <CardTitle className="text-lg font-bold">Ergonomic Chair</CardTitle>
                <p className="mt-2 text-lg font-semibold">$199.99</p>
            </CardContent>
        </Card>
    )
}