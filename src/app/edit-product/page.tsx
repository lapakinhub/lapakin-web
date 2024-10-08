import EditCommodityForm from "@/components/templates/EditCommodityForm";
import {Suspense} from "react";
import {Loading} from "@/components/molecules/Loading";

export default function Page()  {
    return (
        <Suspense fallback={<Loading/>}>
            <EditCommodityForm/>
        </Suspense>
    )
}