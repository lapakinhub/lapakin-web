"use client"

import AppLogo from '@/assets/logo_no_bg.png'
import Image from "next/image";
import {useRouter} from "next/navigation";
import {ComponentProps} from "react";
import {cn} from "@/lib/utils";

export const AppLogoWBg = ({className,...props}: ComponentProps<'div'>) => {
    const router = useRouter();
    return (
        <div onClick={() => router.push("/")} className={cn('bg-red-600 w-fit rounded-lg cursor-pointer', className)} {...props}>
            <Image src={AppLogo} alt={'app-logo-w-bg'} width={55}/>
        </div>
    );
};