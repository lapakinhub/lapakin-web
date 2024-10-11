import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Commodity} from "@/types/commodity";
import {
    deleteCommodity,
    getAllCommodity, getAllCommodityFilter,
    getAllCommodityByOwner, getAllCommodityFilterOwner,
    getCommodityById,
    storeComodity, updateCommodity
} from "@/service/remote/comodity.remote";
import toast from "react-hot-toast";
import {FirebaseError} from "@firebase/util";
import {useRouter} from "next/navigation";

export const useCommodityStore = () => useMutation<string, FirebaseError, { comodity: Commodity, files: File[] }>({
    mutationKey: ['commodity', 'store'],
    mutationFn: async ({comodity, files}: { comodity: Commodity, files: File[] }) => storeComodity(comodity, files),
    onSuccess: async () => {
        toast.success('Commodity added successfully');
        window.location.href = `/my-comodity`;
    }
});

export const useUpdateCommodity = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation<string, FirebaseError, { id: string, comodity: Commodity, files: File[] }>({
        mutationKey: ['commodity', 'update'],
        mutationFn: async ({id, comodity, files}: { id: string, comodity: Commodity, files: File[] }) => {
            return await updateCommodity(id, comodity, files);
        },
        onSuccess: async () => {

            router.push(`/my-comodity`);

            await queryClient.invalidateQueries({queryKey: ['commodities', 'owner']});

            toast.success('Commodity updated successfully');
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
}

export const useGetAllCommodity = (type?: "filter" | "all", query?: string, location?: string, sort?: 'newest' | 'oldest', page: number = 1) => useQuery<Commodity[]>({
    queryKey: ['commodities', type, query, location, sort, page],
    queryFn: async () => {

        if (type === "filter" && query || location) {
            return await getAllCommodityFilter(query, location, sort, page)
        }

        return await getAllCommodity(sort, page);
    }
})

export const useGetAllCommodityByOwner = (type?: "filter" | "all", query?: string, location?: string, sort?: 'newest' | 'oldest', page: number = 1) => useQuery<Commodity[]>({
    queryKey: ['commodities', 'owner', type, query, location, sort, page],
    queryFn: async () => {
        if (type === "filter" && query || location) {
            return await getAllCommodityFilterOwner(query, location, sort, page)
        }
        return await getAllCommodityByOwner(sort, page)
    },
})

export const useGetCommodity = (id: string) => useQuery<Commodity, FirebaseError>({
    queryKey: ['commodity', id],
    queryFn: async () => {
        return await getCommodityById(id);
    },
    gcTime: 0,
})

export const useDeleteCommodity = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, { id: string }>({
        mutationKey: ['commodity', 'delete'],
        mutationFn: async ({id}) => {
            await deleteCommodity(id);
        },
        onSuccess: () => {
            toast.success('Commodity deleted successfully');

            queryClient.invalidateQueries({queryKey: ['commodities', 'owner']});
        },
    });
};