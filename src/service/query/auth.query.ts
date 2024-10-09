import {useMutation, useQuery} from "@tanstack/react-query";
import {LoginBody} from "@/types/login-body";
import {
    getAuthUser,
    loginWithEmailPassword,
    registerWithEmailPassword,
    updateUserProfile
} from "@/service/remote/auth.remote";
import {RegisterBody} from "@/types/register-body";
import {UserCredential} from "firebase/auth";
import {setCookie} from "typescript-cookie";
import toast from "react-hot-toast";
import {FirebaseError} from "@firebase/util";
import {getFirebaseError} from "@/lib/firebase-error";
import {User} from "@/types/user";

export const useLogin = () => useMutation<UserCredential, FirebaseError, {loginBody: LoginBody}>(
    {
        mutationKey:['auth', 'login'],
        mutationFn: ({ loginBody }: { loginBody: LoginBody }) => loginWithEmailPassword(loginBody),
        onSuccess: async (data) => {
            setCookie('auth-token', JSON.stringify(await data.user.getIdToken()), {expires: 7});
            toast.success('Login Success');
            window.location.href = "/"
        },
        onError: (error) => {
            toast.error(getFirebaseError(error.code));
        }
    }
)

export const useRegister = () => useMutation<UserCredential, FirebaseError, {registerBody: RegisterBody}>(
    {
        mutationKey: ['auth', 'register'],
        mutationFn: ({ registerBody }: { registerBody: RegisterBody }) => registerWithEmailPassword(registerBody),
        onSuccess: async (data) => {
            setCookie('auth-token', JSON.stringify(await data.user.getIdToken()), {expires: 7});
            window.location.href = "/"
        },
        onError: (error) => {
            console.log(error.code);
            toast.error(getFirebaseError(error.code));
        }

    }
)

export const useUpdateProfile = () => useMutation<void, FirebaseError, { user: User }>({
    mutationKey: ['auth', 'update'],
    mutationFn: async ({ user }: { user: User }) => {
        return await updateUserProfile(user);
    },
    onSuccess: async () => {
        toast.success('Profile Updated');
    },
    onError: (error) => {
        toast.error(getFirebaseError(error.code));
    }
})

export const useGetAuthUser = () => useQuery<User, FirebaseError>(
    {
        queryKey: ['auth', 'user'],
        queryFn: async () => {
            return await getAuthUser();
        },
        gcTime: 0,
    }
)