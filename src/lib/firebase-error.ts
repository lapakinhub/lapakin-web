export const  firebaseErrorMapping: Record<string, string> = {
    'auth/email-already-in-use': 'Email sudah digunakan',
    'auth/invalid-credential': 'Data kredensial tidak valid',
    "auth/username-already-in-use": "Username sudah digunakan",
}

export const getFirebaseError = (code: string) => {
    return firebaseErrorMapping[code] || 'Terjadi kesalahan'
}