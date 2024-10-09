import {LoginBody} from "@/types/login-body";
import {
    signInWithEmailAndPassword,
    getAuth,
    createUserWithEmailAndPassword,
    UserCredential,
    updateProfile, updateEmail
} from "firebase/auth";
import {
    collection,
    doc,
    getDocs,
    getFirestore,
    serverTimestamp,
    setDoc,
    where,
    query,
    getDoc, updateDoc
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

export const updateUserProfile = async (
    body: User
): Promise<void> => {
    const userDocRef = doc(db, "users", auth.currentUser?.uid ?? "");

    const currentUser = auth.currentUser;

    if (!currentUser) {
        throw new FirebaseError("auth/not-authenticated","User is not authenticated");
    }

    if (body.fullName || body.profilePictureUrl) {
        await updateProfile(currentUser, {
            displayName: body.fullName || currentUser.displayName,
            photoURL: body.profilePictureUrl || currentUser.photoURL,
        });
    }

    if (body.email && body.email !== currentUser.email) {
        await updateEmail(currentUser, body.email);
    }

    await updateDoc(userDocRef, {
        ...body,
        updatedAt: serverTimestamp(),
    });
};

export const getAuthUser = async (): Promise<User> => {
    const userDocRef = doc(db, 'users', auth.currentUser?.uid ?? "");

    const userDoc = await getDoc(userDocRef);

    return {...userDoc.data()} as User;
};