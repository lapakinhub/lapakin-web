import {cn} from "@/lib/utils";
import {ComponentProps} from "react";

export const Row = ({className, children, ...props}: ComponentProps<'div'>) => {
    return (
        <div className={cn('flex w-full items-center', className)} {...props}>
            {children}
        </div>
    );
};