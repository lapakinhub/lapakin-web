"use client"

import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import {Loader2} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {AppLogoWBg} from "@/components/atoms/AppLogoWBg";
import {useRegister} from "@/service/query/auth.query";

const registerSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().regex(/^\+?[0-9\s]{10,14}$/, "Invalid phone number"),
    userType: z.enum(["personal", "business"], {required_error: "Please select a user type"}),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            username: "",
            email: "",
            phoneNumber: "",
            userType: "personal",
            password: "",
            confirmPassword: "",
        },
    });

    const {mutate: callRegister, isPending, isSuccess} = useRegister();

     function onSubmit(data: RegisterFormValues) {
        callRegister({
            registerBody: {
                ...data
            }
        })
    }

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <AppLogoWBg width={100} className={"mb-4 mx-auto"}/>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>Create your account to start using our services</CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Full Name / Business Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your full name or business name" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="username"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Choose a username" {...field} />
                                        </FormControl>
                                        <FormDescription>This will be your public profile URL.</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="Enter your email" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your phone number" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="userType"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>User Type</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-col space-y-1"
                                            >
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="personal"/>
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        Personal
                                                    </FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="business"/>
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        Business
                                                    </FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Create a password" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Confirm your password" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        Registering...
                                    </>
                                ) : (
                                    "Register"
                                )}
                            </Button>
                            <p className="text-sm text-center text-gray-600">
                                Already have an account?{" "}
                                <Link href="/login" className="text-primary hover:underline">
                                    Log in here
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    )
}