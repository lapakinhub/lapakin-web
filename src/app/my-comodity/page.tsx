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
import {useEffect, useState} from "react";
import {useDeleteCommodity, useGetAllCommodityByOwner} from "@/service/query/comodity-query";
import LoaderOverlay from "@/components/molecules/LoadingOverlay";
import {Loading} from "@/components/molecules/Loading";
import ProductCardwAct from "@/components/molecules/ProductCardwAct";
import SearchBarWithFilter from "@/components/molecules/SearchFilter";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";

export default function Component() {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const [type, setType] = useState<"all" | "filter">("all");
    const [query, setQuery] = useState<string>();
    const [location, setLocation] = useState<string>();
    const [sort, setSort] = useState<'newest' | 'oldest' | 'cheap'>('newest');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 12; // Set to show 12 items per page
    const [totalPage, setTotalPage] = useState(0);

    // Fetch the commodities, assuming it fetches all items
    const {data: commodities, isLoading} = useGetAllCommodityByOwner(type, query, location, sort, 1, 9999);

    const {mutate: doDeleteCommodity, isPending: isPendingDelete} = useDeleteCommodity();
    const [commodityId, setCommodityId] = useState<string | undefined>(undefined);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        if (commodities && commodities.length > 0) {
            setTotalPage(Math.ceil(commodities.length / itemsPerPage)); // Total number of pages
        }
    }, [commodities]);

    const currentCommodities = commodities?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <Column className={"w-full max-w-5xl mx-auto mb-10"}>
            <Navbar/>

            <LoaderOverlay isLoading={isPendingDelete}/>

            <ConfirmationDialog
                setIsOpen={setOpen}
                isOpen={open}
                description={"Delete this item?"} onResult={(result) => {
                if (result && commodityId != undefined) {
                    doDeleteCommodity({id: commodityId});
                }
            }}
                title={"Are you sure?"}
            />

            <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Komoditas Saya</h1>
                    <Button onClick={() => router.push("/add-product")} size="sm">Buat Komoditas Baru</Button>
                </div>

                <div className={'mb-4'}>
                    <SearchBarWithFilter
                        onSort={(sortOption: 'newest' | 'oldest' | 'cheap') => {
                            setSort(sortOption)
                        }}
                        onSearch={(query: string) => {
                            if (query.length === 0) {
                                setQuery(undefined);
                                return;
                            }
                            setType('filter');
                            setQuery(query);
                        }}
                        onFilter={(location: string) => {
                            if (location === 'all') {
                                setLocation(undefined);
                                return;
                            }
                            setType('filter');
                            setLocation(location);
                        }}
                    />
                </div>

                {commodities?.length === 0 && (
                    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
                        <div className="flex items-center justify-center gap-x-4">
                            <h1 className="text-2xl font-bold">You don't have any commodity yet</h1>
                            <Button onClick={() => router.push("/add-product")} size="sm">Create New Commodity</Button>
                        </div>
                    </div>
                )}

                {isLoading && <Loading className={'my-4'}/>}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {currentCommodities?.map((commodity) => (
                        <ProductCardwAct
                            key={commodity.id}
                            commodity={commodity}
                            onDelete={() => {
                                setCommodityId(commodity.id);
                                setOpen(true);
                            }}
                            onEdit={() => router.push(`/edit-product?id=${commodity.id}`)}
                        />
                    ))}
                </div>
            </div>

            {/* Pagination Component */}
            {commodities && totalPage > 1 && (
                <Pagination className={"my-10"}>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={currentPage !== 1 ? () => handlePageChange(currentPage - 1) : undefined}
                                isActive={currentPage !== 1}
                            />
                        </PaginationItem>

                        {Array.from({ length: totalPage }).map((_, index) => {
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
                            <PaginationNext
                                onClick={currentPage !== totalPage ? () => handlePageChange(currentPage + 1) : undefined}
                                isActive={currentPage !== totalPage}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </Column>
    );
}



