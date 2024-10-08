/**
 * v0 by Vercel.
 * @see https://v0.dev/t/ACvFdYhJRHd
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

"use client"

import {Button} from "@/components/ui/button";
import {Column} from "@/components/wrapper/Column";
import Navbar from "@/components/molecules/Navbar";
import {useRouter} from "next/navigation";
import {ConfirmationDialog} from "@/components/molecules/ConfirmationDialog";
import {useState} from "react";
import {ProductCardwAct} from "@/components/molecules/ProductCardwAct";
import {useDeleteCommodity, useGetAllCommodityByOwner} from "@/service/query/comodity-query";
import LoaderOverlay from "@/components/molecules/LoadingOverlay";
import {Loading} from "@/components/molecules/Loading";

export default function Component() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const {data: commodities, isLoading} = useGetAllCommodityByOwner();
    const {mutate: doDeleteCommodity, isPending: isPendingDelete,} = useDeleteCommodity();
    const [commodityId, setCommodityId] = useState<string | undefined>(undefined);

    return (
        <Column className={"w-full max-w-5xl mx-auto"}>
            <Navbar/>

            <LoaderOverlay isLoading={isPendingDelete}/>

            <ConfirmationDialog
                setIsOpen={setOpen}
                isOpen={open}
                description={"Delete this item ?"} onResult={(result) => {
                if (result && commodityId != undefined) {
                    doDeleteCommodity({id: commodityId});
                }
            }}
                title={"Are you sure ?"}
            />

            <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Comodity</h1>
                    <Button onClick={() => router.push("/add-product")} size="sm">Create New Comodity</Button>
                </div>

                {
                    commodities?.length === 0 && (
                        <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
                            <div className="flex items-center justify-center gap-x-4">
                                <h1 className="text-2xl font-bold">You don't have any comodity yet</h1>
                                <Button onClick={() => router.push("/add-product")} size="sm">Create New Comodity</Button>
                            </div>
                        </div>
                    )
                }

                {
                    isLoading && <Loading className={'my-4'}/>
                }

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {commodities?.map((commodity) => (
                        <ProductCardwAct
                            commodity={commodity}
                            onDelete={() => {
                                setCommodityId(commodity.id)
                                setOpen(true)
                            }}
                            onEdit={() => router.push(`/edit-product?id=${commodity.id}`)}
                        />
                    ))}
                </div>
            </div>
        </Column>
    );
}

