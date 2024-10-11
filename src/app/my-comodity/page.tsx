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
import {useDeleteCommodity, useGetAllCommodityByOwner} from "@/service/query/comodity-query";
import LoaderOverlay from "@/components/molecules/LoadingOverlay";
import {Loading} from "@/components/molecules/Loading";
import ProductCardwAct from "@/components/molecules/ProductCardwAct";
import SearchBarWithFilter from "@/components/molecules/SearchFilter";
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";

export default function Component() {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const [type, setType] = useState<"all" | "filter">("all")
    const [query, setQuery] = useState<string>()
    const [location, setLocation] = useState<string>()
    const [sort, setSort] = useState<'newest' | 'oldest'>('newest')
    const [currentPage, setCurrentPage] = useState<number>(1);

    const {data: commodities, isLoading} = useGetAllCommodityByOwner(type, query, location, sort, currentPage);

    const {mutate: doDeleteCommodity, isPending: isPendingDelete} = useDeleteCommodity();
    const [commodityId, setCommodityId] = useState<string | undefined>(undefined);

    const handlePageChange = async (page: number) => {
        setCurrentPage(page);
    };
    if (commodities === undefined) {
        return <LoaderOverlay isLoading={true}/>
    }

    return (
        <Column className={"w-full max-w-5xl mx-auto mb-10"}>
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
                    <h1 className="text-2xl font-bold">Komoditas ku</h1>
                    <Button onClick={() => router.push("/add-product")} size="sm">Buat Komoditas Baru</Button>
                </div>

                <div className={'mb-4'}>
                    <SearchBarWithFilter
                        onSort={(sortOption: 'newest' | 'oldest') => {
                            setSort(sortOption)
                        }}
                        onSearch={(query: string) => {
                            if (query.length === 0) {
                                setQuery(undefined)
                                return
                            }
                            setType('filter')
                            setQuery(query)
                        }} onFilter={
                        (location: string) => {
                            console.log(location)
                            if (location === 'all') {
                                setLocation(undefined)
                                return
                            }
                            setType('filter')
                            setLocation(location)
                        }
                    }/>
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

            {commodities.length >= 12 && <Pagination className={"my-10"}>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={currentPage !== 1 ? () => handlePageChange(currentPage - 1) : () => {
                            }}
                            isActive={currentPage !== 1}/>
                    </PaginationItem>

                    {[...Array(commodities![0]?.totalPages || 0)].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                            <PaginationItem key={pageNumber}>
                                <PaginationLink
                                    isActive={currentPage === pageNumber}
                                    onClick={() => handlePageChange(pageNumber)}
                                >
                                    {pageNumber}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })}

                    <PaginationItem>
                        <PaginationEllipsis/>
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationNext
                            onClick={currentPage !== commodities![0]?.totalPages ? () => handlePageChange(currentPage + 1) : () => {
                            }}
                            isActive={currentPage !== commodities![0]?.totalPages}/>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>}
        </Column>
    );
}

