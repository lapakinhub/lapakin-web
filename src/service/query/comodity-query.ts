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
        toast.success('Berhasil menambah komoditas');
        window.location.href = `/my-comodity`;
    },
    onError: (error) => {
        toast.error(error.message);
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

            toast.success('Berhasil mengubah komoditas');
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
}

export const useGetAllCommodity = (type?: "filter" | "all", query?: string, location?: string, sort?: 'newest' | 'oldest' | 'cheap', page: number = 1) => useQuery<Commodity[]>({
    queryKey: ['commodities', type, query, location, sort, page],
    queryFn: async () => {

        if (query || location || sort) {
            if(query || location || sort == 'cheap') {
                return await getAllCommodityFilter(query, location, sort, page, 9999)
            }
            return await getAllCommodityFilter(query, location, sort, page, 12)
        }

        return await getAllCommodity(sort, page, 12);
    },
    gcTime: 0,
})

export const useGetAllCommodityByOwner = (type?: "filter" | "all", query?: string, location?: string, sort?: 'newest' | 'oldest' | 'cheap', page: number = 1, limit: number = 12) => useQuery<Commodity[]>({
    queryKey: ['commodities', 'owner', type, query, location, sort, page],
    queryFn: async () => {
        if (query || location || sort) {
            if(query || location || sort == 'cheap') {
                return await getAllCommodityFilterOwner(query, location, sort, page, 9999)
            }
            return await getAllCommodityFilterOwner(query, location, sort, page, limit)
        }
        return await getAllCommodityByOwner(sort, page, 12)
    },
    gcTime: 0,
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
            toast.success('Berhasil menghapus komoditas');

            queryClient.invalidateQueries({queryKey: ['commodities', 'owner']});
        },
    });
};