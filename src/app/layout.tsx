import type {Metadata} from "next";
import {Lato} from "next/font/google";
import "./globals.css";
import {ReactQueryClientProvider} from "@/components/provider/ReactQueryProvider";
import React from "react";
import {Toaster} from 'react-hot-toast';
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

const lato = Lato(
    {
        weight: ['400', '700', '900'],
        subsets: ['latin'],
        display: 'swap'
    }
);

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
                className={`${lato.className} flex flex-col items-start mx-auto w-full antialiased p-4`}
            >
            {children}
            <Toaster/>
            <ReactQueryDevtools/>
            </body>
            </html>
        </ReactQueryClientProvider>
    );
}
