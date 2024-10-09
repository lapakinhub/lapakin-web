import {Suspense} from "react";
import DetailCommodity from "@/components/templates/DetailCommodity";
import {Loading} from "@/components/molecules/Loading";

export default function page() {
    return <Suspense fallback={<Loading/>}>
        <DetailCommodity/>
    </Suspense>
}