"use client"

import {Button} from "@/components/ui/button";
import {Column} from "@/components/wrapper/Column";
import ProductCard from "@/components/molecules/ProductCard";
import Navbar from "@/components/molecules/Navbar";
import {useRouter} from "next/navigation";
import SearchBarWithFilter from "@/components/molecules/SearchFilter";

export default function Home() {
    const router = useRouter();

    return (
        <Column className={'w-full mx-auto max-w-5xl'}>
            <Navbar />

            <div className={'my-2'}></div>

            <SearchBarWithFilter/>

            <div
                className={'mt-4 w-full grid sm:grid-cols-3 items-center justify-center grid-cols-2 md:grid-cols-4 gap-5'}>
                <ProductCard onClick={() => {
                    router.push('/detail-product')
                }}/> <ProductCard onClick={() => {
                router.push('/detail-product')
            }}/> <ProductCard onClick={() => {
                router.push('/detail-product')
            }}/> <ProductCard onClick={() => {
                router.push('/detail-product')
            }}/> <ProductCard onClick={() => {
                router.push('/detail-product')
            }}/> <ProductCard onClick={() => {
                router.push('/detail-product')
            }}/>
            </div>
        </Column>
    );
}
