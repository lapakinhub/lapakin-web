import type {Metadata} from "next";
import "./globals.css";
import {ReactQueryClientProvider} from "@/components/provider/ReactQueryProvider";
import React from "react";
import {Toaster} from 'react-hot-toast';
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import { Analytics } from "@vercel/analytics/react"

import localFont from 'next/font/local'
import Footer from "@/components/atoms/Footer";

const airBncFont = localFont({
    src: [
        {
            path: './airbnb-font.otf',
            weight: '500'
        },
        {
            path: './airbnb-font-bold.otf',
            weight: '700'
        }
    ]
})

export const metadata: Metadata = {
    title: "Lapakin - Cari Lapak Untuk Jualan",
    description: "Cari Lapak Untuk Jualan",
};

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ReactQueryClientProvider>
            <html lang="en">
            <body
                className={`${airBncFont.className} antialiased p-4`}
            >
            <Analytics/>
            <div className={'flex flex-col items-start mx-auto w-full min-h-screen h-full'}>
                {children}
            </div>
            <Footer/>
            <Toaster/>
            <ReactQueryDevtools/>
            </body>
            </html>
        </ReactQueryClientProvider>
    );
}
