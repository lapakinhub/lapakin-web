import {useMutation} from "@tanstack/react-query";
import {uploadFile} from "@/service/remote/storage.remote";

export const useUploadFile = () => {
    return useMutation<String, Error, {file: File}>( {
        mutationKey: ['file', 'upload'],
        mutationFn: async ({file}) => uploadFile({file, folder: 'images'}),
        onSuccess: (downloadURL) => {
            console.log('File uploaded successfully:', downloadURL);
        },
        onError: (error) => {
            console.error('Upload error:', error);
        },
    });
};