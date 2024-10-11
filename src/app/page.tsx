"use client"

import {Column} from "@/components/wrapper/Column";
import ProductCard from "@/components/molecules/ProductCard";
import Navbar from "@/components/molecules/Navbar";
import {useRouter} from "next/navigation";
import SearchBarWithFilter from "@/components/molecules/SearchFilter";
import {useGetAllCommodity} from "@/service/query/comodity-query";
import {Loading} from "@/components/molecules/Loading";
import {useState} from "react";
import {Row} from "@/components/wrapper/Row";
import {Button} from "@/components/ui/button";
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import LoaderOverlay from "@/components/molecules/LoadingOverlay";

export default function Home() {
    const router = useRouter();

    const [type, setType] = useState<"all" | "filter">("all")
    const [query, setQuery] = useState<string>()
    const [location, setLocation] = useState<string>()
    const [sort, setSort] = useState<'newest' | 'oldest'>('newest')
    const [currentPage, setCurrentPage] = useState<number>(1);

    const {data: commodities, isLoading} = useGetAllCommodity(type, query, location, sort, currentPage);

    const handlePageChange = async (page: number) => {
        setCurrentPage(page);
    };

    if (commodities === undefined) {
        return <LoaderOverlay isLoading={true}/>
    }


    return (
        <Column className={'w-full mx-auto max-w-5xl mb-10'}>
            <Navbar/>

            <div className={'my-2'}></div>

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

            {commodities && commodities.length === 0 && (
                <Row className={'w-full justify-center my-4 text-center'}>
                    <h1 className={'text-2xl'}>No Commodity Found</h1>
                </Row>
            )}

            {isLoading && <Loading className={'my-10'}/>}


            <div
                className={'mt-4 w-full grid sm:grid-cols-3 items-center justify-center grid-cols-2 md:grid-cols-4 gap-5'}>
                {
                    commodities?.map((commodity) => (
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


            <Pagination className={"my-10"}>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={currentPage !== 1 ? () => handlePageChange(currentPage - 1) : () => {}}
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
                        <PaginationNext onClick={currentPage !== commodities![0]?.totalPages ? () => handlePageChange(currentPage + 1) : () => {}}
                                        isActive={currentPage !== commodities![0]?.totalPages}/>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>


        </Column>
    );
}
