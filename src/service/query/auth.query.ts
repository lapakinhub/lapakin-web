import {useMutation} from "@tanstack/react-query";
import {LoginBody} from "@/types/login-body";
import {loginWithEmailPassword, registerWithEmailPassword} from "@/service/remote/auth.remote";
import {RegisterBody} from "@/types/register-body";
import {UserCredential} from "firebase/auth";
import {setCookie} from "typescript-cookie";

export const useLogin = () => useMutation<UserCredential, Error, {loginBody: LoginBody}>(
    {
        mutationKey:['auth', 'login'],
        mutationFn: ({ loginBody }: { loginBody: LoginBody }) => loginWithEmailPassword(loginBody),
        onSuccess: async (data) => {
            setCookie('auth-token', JSON.stringify(await data.user.getIdToken()), {expires: 7});
            window.location.href = "/"
        }
    }
)

export const useRegister = () => useMutation<UserCredential, Error, {registerBody: RegisterBody}>(
    {
        mutationKey: ['auth', 'register'],
        mutationFn: ({ registerBody }: { registerBody: RegisterBody }) => registerWithEmailPassword(registerBody),
        onSuccess: async (data) => {
            setCookie('auth-token', JSON.stringify(await data.user.getIdToken()), {expires: 7});
            window.location.href = "/"
        }
    }
)