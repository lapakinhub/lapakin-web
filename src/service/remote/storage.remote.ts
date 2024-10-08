import {getStorage, ref, getDownloadURL, uploadBytes} from 'firebase/storage';
import {firebaseApp} from "@/lib/firebase";

const storage = getStorage(firebaseApp);

interface UploadFileProps {
    file: File;
    folder: string;
}

export const uploadFile = async ({file, folder}: UploadFileProps): Promise<string> => {
    const storageRef = ref(storage, `${folder ? folder + '/' : ''}${file.name}`);

    const uploadTask = await uploadBytes(storageRef, file);

    return getDownloadURL(uploadTask.ref);
};