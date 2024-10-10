import type {Metadata} from "next";
import "./globals.css";
import {ReactQueryClientProvider} from "@/components/provider/ReactQueryProvider";
import React from "react";
import {Toaster} from 'react-hot-toast';
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

import localFont from 'next/font/local'

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
    title: "Ecommerce",
    description: "Ecommerce App",
};

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ReactQueryClientProvider>
            <html lang="en">
            <body
                className={`${airBncFont.className} flex flex-col items-start mx-auto w-full antialiased p-4`}
            >
            {children}
            <Toaster/>
            <ReactQueryDevtools/>
            </body>
            </html>
        </ReactQueryClientProvider>
    );
}
