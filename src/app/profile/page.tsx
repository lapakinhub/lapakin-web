'use client'

import {useEffect, useState} from "react"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"
import {Save, Loader2, Upload, Instagram, Linkedin, Facebook} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {Textarea} from "@/components/ui/textarea"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {toast} from "@/hooks/use-toast"
import {useRouter} from "next/navigation"
import Navbar from "@/components/molecules/Navbar"
import {Column} from "@/components/wrapper/Column"
import {Row} from "@/components/wrapper/Row"
import {ConfirmationDialog} from "@/components/molecules/ConfirmationDialog"
import {signOut} from "@firebase/auth"
import {removeCookie} from "typescript-cookie"
import {getAuth} from "firebase/auth"
import {firebaseApp} from "@/lib/firebase"
import {useGetAuthUser, useUpdateProfile} from "@/service/query/auth.query"
import LoaderOverlay from "@/components/molecules/LoadingOverlay"
import ProfileImageUpload from "@/components/molecules/ProfileImageUpload";

const formSchema = z.object({
    fullName: z.string().min(2, {message: "Name must be at least 2 characters."}),
    username: z.string().min(3, {message: "Username must be at least 3 characters."}),
    email: z.string().email({message: "Invalid email address."}),
    phoneNumber: z.string().regex(/^\+?[0-9\s]{10,14}$/, {message: "Invalid phone number."}),
    address: z.string(),
    userType: z.enum(["personal", "business"], {required_error: "Please select a user type."}),
    description: z.string().max(500, {message: "Description must not exceed 500 characters."}),
    instagram: z.string().optional(),
    linkedIn: z.string().optional(),
    facebook: z.string().optional(),
    image: z.string().optional(),
})

export type UserFormValues = z.infer<typeof formSchema>

const auth = getAuth(firebaseApp)

export default function EditProfilePage() {
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | undefined>(undefined)

    const router = useRouter()

    const {data: authUser, isLoading: loadUser} = useGetAuthUser()

    const form = useForm<UserFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            username: "",
            email: "",
            phoneNumber: "",
            address: "",
            userType: "personal",
            image: "",
            description: "",
            instagram: "",
            linkedIn: "",
            facebook: "",
        },
    })

    useEffect(() => {
        if (authUser) {
            form.reset({
                fullName: authUser.fullName,
                username: authUser.username,
                email: authUser.email,
                phoneNumber: authUser.phoneNumber,
                address: authUser.address,
                userType: authUser.userType,
                description: authUser.description,
                instagram: authUser.socialMediaLinks?.instagram,
                linkedIn: authUser.socialMediaLinks?.linkedIn,
                facebook: authUser.socialMediaLinks?.facebook,
                image: authUser.image,
            })
            setImagePreview(authUser.image || null)
        }
    }, [authUser, form])

    const {mutate: doUpdateProfile, isPending} = useUpdateProfile()

    function onSubmit(data: UserFormValues) {
        console.log(data)
        doUpdateProfile({
            user: {
                ...data,
                socialMediaLinks: {
                    instagram: data.instagram,
                    linkedIn: data.linkedIn,
                    facebook: data.facebook,
                }
            }, file: imageFile
        })
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <Column className="w-full max-w-5xl mx-auto px-4 py-8">
            <Navbar/>

            <LoaderOverlay isLoading={loadUser || isPending}/>

            <ConfirmationDialog
                isOpen={open}
                setIsOpen={setOpen}
                title="Are you sure?"
                description="Do you want to logout from this account?"
                onResult={async (result) => {
                    if (result) {
                        await signOut(auth)
                        removeCookie('auth-token')
                        router.refresh()
                    }
                }}
            />

            <Row className="justify-end my-8">
                <Button onClick={() => setOpen(true)} className={"bg-red-600 text-white hover:text-white hover:bg-red-500"} variant="outline">Logout</Button>
            </Row>

            <Card className="w-full mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Edit Profile</CardTitle>
                    <CardDescription>Update your profile information</CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-8">
                            <ProfileImageUpload form={form} onImageUpload={(file) => {
                                setImageFile(file)
                            }}/>

                            <div className="grid gap-6 sm:grid-cols-2">
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
                                                <Input placeholder="Enter your username" {...field} />
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
                                                <Input disabled type="email"
                                                       placeholder="Enter your email" {...field} />
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
                                    name="address"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your address" {...field} />
                                            </FormControl>
                                            <FormDescription>Primarily city and region for easier property
                                                search.</FormDescription>
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
                                                    className="flex space-x-4"
                                                >
                                                    <FormItem className="flex items-center space-x-2">
                                                        <FormControl>
                                                            <RadioGroupItem value="personal"/>
                                                        </FormControl>
                                                        <FormLabel className="font-normal">Personal</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-2">
                                                        <FormControl>
                                                            <RadioGroupItem value="business"/>
                                                        </FormControl>
                                                        <FormLabel className="font-normal">Business</FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter a brief description about yourself or your business"
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>Maximum 500 characters.</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Social Media Links (Optional)</h3>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <FormField
                                        control={form.control}
                                        name="instagram"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Instagram</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Instagram
                                                            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                                                        <Input className="pl-10"
                                                               placeholder="Your Instagram username" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="linkedIn"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>LinkedIn</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Linkedin
                                                            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                                                        <Input className="pl-10"
                                                               placeholder="Your LinkedIn profile URL" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="facebook"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Facebook</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Facebook
                                                            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                                                        <Input className="pl-10"
                                                               placeholder="Your Facebook profile URL" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        Saving changes...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4"/>
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </Column>
    )
}