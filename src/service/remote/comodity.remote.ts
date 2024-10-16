import {
    addDoc,
    collection, deleteDoc, doc, DocumentSnapshot, getDoc,
    getDocs,
    getFirestore,
    orderBy,
    query,
    QueryConstraint,
    serverTimestamp, setDoc, startAfter,
    limit,
    where, updateDoc, increment
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

const fetchCommodities = async (
    constraints: QueryConstraint[],
    limitValue: number = 12,
    startAfterDoc?: DocumentSnapshot
): Promise<Commodity[]> => {
    const commoditiesCollection = collection(db, 'commodities');

    const allDocsSnapshot = await getDocs(commoditiesCollection);
    const totalDocuments = allDocsSnapshot.size;
    const totalPages = Math.ceil(totalDocuments / limitValue);

    const q = query(
        commoditiesCollection,
        ...constraints,
        limit(limitValue),
        ...(startAfterDoc ? [startAfter(startAfterDoc)] : [])
    );

    const snapshot = await getDocs(q);


    if (snapshot.empty) {
        return []; // Return an empty array if no documents found
    }

    return snapshot.docs.map((doc) => {
        const data = doc.data() as Commodity;

        if (data.lastModified && (data.lastModified as any).toDate) {
            data.lastModified = (data.lastModified as any).toDate();
        }

        return {...data, id: doc.id, totalPages};
    });
};


const getLastVisibleDoc = async (constraints: QueryConstraint[], limitValue: number, page: number) => {
    const commoditiesCollection = collection(db, 'commodities');
    const q = query(commoditiesCollection, ...constraints, limit(limitValue));

    const snapshot = await getDocs(q);

    return snapshot.docs[snapshot.docs.length - 1];
};

export const getAllCommodity = async (
    sort?: "newest" | "oldest" | "cheap",
    page: number = 1,
    limitValue: number = 12
): Promise<Commodity[]> => {
    const constraints = [orderBy("lastModified", "desc")];

    const startAfterDoc = page && page > 1 ? await getLastVisibleDoc(constraints, limitValue, page - 1) : undefined;

    return fetchCommodities(constraints, limitValue, startAfterDoc);
};

export const getAllCommodityByOwner = async (
    sort?: "newest" | "oldest" | "cheap",
    page: number = 1,
    limitValue: number = 12
): Promise<Commodity[]> => {
    const ownerId = auth.currentUser?.uid;
    const constraints = [where("ownerId", "==", ownerId), orderBy("lastModified", "desc"),]
    const startAfterDoc = page && page > 1 ? await getLastVisibleDoc(constraints, limitValue, page - 1) : undefined;
    return fetchCommodities(constraints, limitValue, startAfterDoc);
};

export const getAllCommodityFilterOwner = async (
    name?: string, location?: string,
    sort?: 'newest' | 'oldest' | 'cheap',
    page: number = 1,
    limitValue: number = 12): Promise<Commodity[]> => {
    const commodities = await getAllCommodityByOwner(sort, page, limitValue);

    const filtered = commodities.filter(commodity => {
        const matchesName = name
            ? commodity.title!.toLowerCase().includes(name.toLowerCase())
            : true;

        const matchesLocation = location
            ? commodity.location?.toLowerCase().includes(location.toLowerCase())
            : true;


        return matchesName && matchesLocation;
    });

    if (sort === 'cheap') {
        return filtered.sort((a, b) => a.price! - b!.price!); // Ascending order (cheapest first)
    }

    return filtered
};

export const getAllCommodityFilter = async (
    name?: string,
    location?: string,
    sort?: 'newest' | 'oldest' | 'cheap',
    page: number = 1,
    limitValue: number = 12
): Promise<Commodity[]> => {
    const commodities = await getAllCommodity(sort, page, limitValue);

    const filteredCommodities = commodities.filter(commodity => {
        const matchesName = name
            ? commodity.title?.toLowerCase().includes(name.toLowerCase())
            : true;

        const matchesLocation = location
            ? commodity.location?.toLowerCase().includes(location.toLowerCase())
            : true;

        return matchesName && matchesLocation;
    });

    if (sort === 'cheap') {
        return filteredCommodities.sort((a, b) => a.price! - b.price!);
    }


    return filteredCommodities;
};


export const getCommodityById = async (commodityId: string): Promise<Commodity> => {
    const docRef = doc(db, 'commodities', commodityId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        throw new FirebaseError("commodity/not-found", "Commodity not found");
    }

    const data = docSnap.data() as Commodity;


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

export const incrementClickPage =  async (commodityId: string) => {
    const docRef = doc(db, 'commodities', commodityId);
    await updateDoc(docRef, {
        clickPage: increment(1)
    })
}

export const incrementClickOrder =  async (commodityId: string) => {
    const docRef = doc(db, 'commodities', commodityId);
    await updateDoc(docRef, {
        clickOrder: increment(1)
    })
}