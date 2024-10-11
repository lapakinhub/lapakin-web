"use client"

import AppLogo from '@/assets/app_logo.svg'
import Image from "next/image";
import {useRouter} from "next/navigation";
import {ComponentProps} from "react";
import {cn} from "@/lib/utils";

export const AppLogoWBg = ({className, width,...props}: {width?: number} & ComponentProps<'div'>) => {
    const router = useRouter();
    return (
        <div onClick={() => router.push("/")} className={cn('cursor-pointer', className)} {...props}>
            <Image src={AppLogo} alt={'app-logo-w-bg'} width={width ?? 70}/>
        </div>
    );
};