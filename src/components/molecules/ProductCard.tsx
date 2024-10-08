import {AspectRatio} from "@/components/ui/aspect-ratio"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Commodity} from "@/types/commodity";

interface ProductCardProps {
    commodity?: Commodity
    onClick?: () => void
}

export default function ProductCard({commodity, onClick}: ProductCardProps) {
    return (
        <Card onClick={() => {
            if (onClick) {
                onClick()
            }
        }} className="w-full cursor-pointer">
            <CardHeader className="p-0">
                <AspectRatio ratio={4 / 3}>
                    <img
                        src={commodity?.images != undefined && commodity.images.length > 0 ? commodity.images[0] : "https://avatars.githubusercontent.com/u/124599?v=4"}
                        alt="Product image"
                        className="object-cover w-full h-full rounded-t-lg"
                    />
                </AspectRatio>
            </CardHeader>
            <CardContent className="p-4 text-ellipsis">
                <CardTitle className="text-lg font-bold">{commodity?.title}</CardTitle>
                <p className="mt-2 text-lg text-primary font-semibold">Rp {commodity?.price}</p>
            </CardContent>
        </Card>
    )
}