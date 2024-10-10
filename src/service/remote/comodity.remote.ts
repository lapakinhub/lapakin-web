import {
    addDoc,
    collection, deleteDoc, doc, getDoc,
    getDocs,
    getFirestore,
    orderBy,
    query,
    QueryConstraint,
    serverTimestamp, setDoc,
    where
} from "firebase/firestore";
import {firebaseApp} from "@/lib/firebase";
import {Commodity} from "@/types/commodity";
import {uploadFile} from "@/service/remote/storage.remote";
import {getAuth} from "firebase/auth";
import {FirebaseError} from "@firebase/util";

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp)

export const storeComodity = async (propertyData: Commodity, files: File[]) => {
    const images: string[] = [];
    for (const file of files) {
        const url = await uploadFile({file, folder: 'images'});
        images.push(url);
    }

    const uploadedData: Commodity = {
        ...propertyData,
        images,
        ownerId: auth.currentUser?.uid,
        lastModified: serverTimestamp(),
    }

    const result = await addDoc(collection(db, 'commodities'), uploadedData);
    return result.id;
};

export const updateCommodity = async (commodityId: string, propertyData: Commodity, files: File[]) => {
    const images: string[] = [...(propertyData.images ?? [])];

    for (const file of files) {
        const url = await uploadFile({file, folder: 'images'});
        images.unshift(url);
    }

    const uploadedData: Commodity = {
        ...propertyData,
        images,
        ownerId: auth.currentUser?.uid,
        lastModified: serverTimestamp(),
    }

    const docRef = doc(db, 'commodities', commodityId);
    await setDoc(docRef, uploadedData, {merge: true});

    return commodityId;
}

const fetchCommodities = async (constraints: QueryConstraint[]): Promise<Commodity[]> => {
    const commoditiesCollection = collection(db, 'commodities');

    const q = query(commoditiesCollection, ...constraints); // Apply query constraints

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
        const data = doc.data() as Commodity;

        if (data.lastModified && (data.lastModified as any).toDate) {
            data.lastModified = (data.lastModified as any).toDate();
        }

        return {...data, id: doc.id};
    });
};

export const getAllCommodity = async (sort?: "newest" | "oldest"): Promise<Commodity[]> => {
    console.log(sort)
    return fetchCommodities([orderBy("lastModified", sort === 'newest' ? "desc" : "asc")]);
};

export const getAllCommodityByOwner = async (sort?: "newest" | "oldest"): Promise<Commodity[]> => {
    const ownerId = auth.currentUser?.uid;
    return fetchCommodities([ where("ownerId", "==", ownerId), orderBy("lastModified", sort === 'newest' ? "desc" : "asc"),]);
};

export const getAllCommodityFilterOwner = async (name?: string, location?: string, sort?: 'newest' | 'oldest'): Promise<Commodity[]> => {
    const commodities = await getAllCommodityByOwner(sort);

    return commodities.filter(commodity => {
        const matchesName = name
            ? commodity.title.toLowerCase().includes(name.toLowerCase())
            : true;

        const matchesLocation = location
            ? commodity.location?.toLowerCase().includes(location.toLowerCase())
            : true;

        return matchesName && matchesLocation;
    });
};


export const getAllCommodityByLocation = async (location: string): Promise<Commodity[]> => {
    return fetchCommodities([where("location", "==", location)]);
}

export const getAllCommodityByName = async (name?: string, location?: string, sort?: 'newest' | 'oldest'): Promise<Commodity[]> => {
    const commodities = await getAllCommodity(sort);

    return commodities.filter(commodity => {
        const matchesName = name
            ? commodity.title.toLowerCase().includes(name.toLowerCase())
            : true;

        const matchesLocation = location
            ? commodity.location?.toLowerCase().includes(location.toLowerCase())
            : true;

        return matchesName && matchesLocation;
    });
};


export const getCommodityById = async (commodityId: string): Promise<Commodity> => {
    const docRef = doc(db, 'commodities', commodityId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        throw new FirebaseError("commodity/not-found", "Commodity not found");
    }

    const data = docSnap.data() as Commodity;

    console.log(data.availability)

    if (data.availability && (data.availability as any).toDate) {
        data.availability = (data.availability as any).toDate()
    }

    if (data.lastModified && (data.lastModified as any).toDate) {
        data.lastModified = (data.lastModified as any).toDate();
    }


    return {...data, id: docSnap.id};
}

export const deleteCommodity = async (commodityId: string) => {
    const docRef = doc(db, 'commodities', commodityId);
    await deleteDoc(docRef);
}