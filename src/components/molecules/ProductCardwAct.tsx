import Image from "next/image";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import { Commodity } from "@/types/commodity";
import {timeAgo} from "@/lib/date-format";

interface ProductCardwAct {
    commodity?: Commodity;
    onDelete?: () => void;
    onEdit?: () => void;

}

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


export const ProductCardwAct = ({commodity, onEdit, onDelete}: ProductCardwAct) => {
    return (
        <Card key={commodity?.id} className="relative">
            <Image
                src={commodity?.images != undefined && commodity.images.length > 0 ? commodity.images[0] : "https://avatars.githubusercontent.com/u/124599?v=4"}
                alt={"Product image"}
                width={400}
                height={300}
                className="rounded-t-lg object-cover w-full h-48"
                style={{aspectRatio: "400/300", objectFit: "cover"}}
            />
            <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">{commodity?.title}</h3>
                <p className="text-muted-foreground mb-4">{`Added ${timeAgo(commodity?.lastModified?.toString() ?? "")}`}</p>
                <div className="flex items-center justify-between">
                    <span className="text-primary font-semibold">${commodity?.price}</span>
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline"
                                onClick={onEdit}>
                            <FilePenIcon className="w-5 h-5"/>
                            <span className="sr-only">Edit</span>
                        </Button>
                        <Button onClick={onDelete} size="icon" variant="outline">
                            <TrashIcon className="w-5 h-5"/>
                            <span className="sr-only">Delete</span>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};