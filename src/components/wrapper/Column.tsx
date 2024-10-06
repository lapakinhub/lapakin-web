import {ComponentProps} from "react";
import {cn} from "@/lib/utils";


export const Column = ({className, children, ...props}: ComponentProps<'div'>) => {
    return (
        <div className={cn('flex items-start flex-col w-full', className)} {...props}>
            {children}
        </div>
    );
};