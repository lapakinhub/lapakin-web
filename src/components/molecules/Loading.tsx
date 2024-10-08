import {Loader2} from "lucide-react";
import {Row} from "@/components/wrapper/Row";
import {ComponentProps} from "react";
import {cn} from "@/lib/utils";

export const Loading = ({className,...props}: ComponentProps<'div'>) => {
    return (
        <Row className={cn("w-full justify-center items-center", className)} {...props}>
            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            Loading...
        </Row>
    );
};