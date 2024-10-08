import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Commodity} from "@/types/commodity";
import {
    deleteCommodity,
    getAllCommodity,
    getAllCommodityByOwner,
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

            toast.success('Commodity updated successfully');

            await queryClient.invalidateQueries({queryKey: ['commodity', 'owner']});
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
}

export const useGetAllCommodity = () => useQuery<Commodity[]>({
    queryKey: ['commodities', 'all'],
    queryFn: async () => {
        return await getAllCommodity();
    }
})

export const useGetAllCommodityByOwner = () => useQuery<Commodity[]>({
    queryKey: ['commodities', 'owner'],
    queryFn: async () => {
        return await getAllCommodityByOwner();
    }
})

export const useGetCommodity = (id: string) => useQuery<Commodity, FirebaseError>({
    queryKey: ['commodity', id],
    queryFn: async () => {
        return await getCommodityById(id);
    }
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