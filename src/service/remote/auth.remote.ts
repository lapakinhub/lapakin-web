import {LoginBody} from "@/types/login-body";
import {signInWithEmailAndPassword, getAuth, createUserWithEmailAndPassword, UserCredential} from "firebase/auth";
import {doc, getFirestore, serverTimestamp, setDoc} from "firebase/firestore";
import {firebaseApp} from "@/lib/firebase";
import {RegisterBody} from "@/types/register-body";

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export const loginWithEmailPassword = async (body: LoginBody): Promise<UserCredential> => {
    return await signInWithEmailAndPassword(auth, body.email, body.password);
};

export const registerWithEmailPassword = async (body: RegisterBody): Promise<UserCredential> => {
    const result = await createUserWithEmailAndPassword(auth, body.email, body.password);

    await setDoc(doc(db, 'users', result.user.uid), {
        ...body,
        createdAt: serverTimestamp(),
    });

    return result;
};