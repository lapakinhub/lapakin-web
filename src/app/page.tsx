"use client"

import {Button} from "@/components/ui/button";
import {Column} from "@/components/wrapper/Column";
import ProductCard from "@/components/molecules/ProductCard";
import Navbar from "@/components/molecules/Navbar";
import {useRouter} from "next/navigation";
import SearchBarWithFilter from "@/components/molecules/SearchFilter";
import {useGetAllCommodity} from "@/service/query/comodity-query";
import {Loading} from "@/components/molecules/Loading";

export default function Home() {
    const router = useRouter();

    const {data: commoedities, isLoading} = useGetAllCommodity();


    return (
        <Column className={'w-full mx-auto max-w-5xl'}>
            <Navbar/>

            <div className={'my-2'}></div>

            <SearchBarWithFilter/>

            {commoedities && commoedities.length === 0 && (
                <div className={'text-center'}>
                    <h1 className={'text-2xl'}>No Commodity Found</h1>
                    <Button onClick={() => {
                        router.push('/add-product')
                    }}>Add Commodity</Button>
                </div>
            )}

            {isLoading && <Loading className={'my-10'}/>}


            <div
                className={'mt-4 w-full grid sm:grid-cols-3 items-center justify-center grid-cols-2 md:grid-cols-4 gap-5'}>
                {
                    commoedities?.map((commodity) => (
                        <ProductCard
                            commodity={commodity}
                            key={commodity.id}
                            onClick={() => {
                                router.push(`/detail-product?id=${commodity.id}`)
                            }}
                        />
                    ))
                }
            </div>
        </Column>
    );
}
