"use client"

import AppLogo from '@/assets/logo_app.png'
import Image from "next/image";
import {useRouter} from "next/navigation";
import {ComponentProps} from "react";
import {cn} from "@/lib/utils";

export const AppLogoWBg = ({className, width,...props}: {width?: number} & ComponentProps<'div'>) => {
    const router = useRouter();
    return (
        <div onClick={() => router.push("/")} className={cn('', className)} {...props}>
            <Image src={AppLogo} alt={'app-logo-w-bg'} width={width ?? 70}/>
        </div>
    );
};