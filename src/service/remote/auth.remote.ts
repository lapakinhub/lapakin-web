import {LoginBody} from "@/types/login-body";
import {signInWithEmailAndPassword, getAuth, createUserWithEmailAndPassword, UserCredential} from "firebase/auth";
import {
    collection,
    doc,
    getDocs,
    getFirestore,
    serverTimestamp,
    setDoc,
    where,
    query,
    getDoc
} from "firebase/firestore";
import {firebaseApp} from "@/lib/firebase";
import {RegisterBody} from "@/types/register-body";
import {FirebaseError} from "@firebase/util";
import {User} from "@/types/user";

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export const loginWithEmailPassword = async (body: LoginBody): Promise<UserCredential> => {
    return await signInWithEmailAndPassword(auth, body.email, body.password);
};

export const registerWithEmailPassword = async (body: RegisterBody): Promise<UserCredential> => {
    const userRef = collection(db, 'users')
    const userQuery = query(userRef, where('username', '==', body.username));

    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
        throw new FirebaseError("auth/username-already-in-use", "Username already exist");
    }

    const result = await createUserWithEmailAndPassword(auth, body.email, body.password);

    await setDoc(doc(db, 'users', result.user.uid), {
        ...body,
        createdAt: serverTimestamp(),
    });

    return result;
};

export const getAuthUser = async (): Promise<User> => {
    const userDocRef = doc(db, 'users', auth.currentUser?.uid ?? "");

    const userDoc = await getDoc(userDocRef);

    return {...userDoc.data()} as User;
};