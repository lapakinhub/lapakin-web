import {User} from "@/types/user";

export interface RegisterBody extends User {
    email: string;
    password: string;
}