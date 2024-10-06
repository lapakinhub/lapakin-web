"use client"

import {useState} from "react"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"
import {Save, Loader2} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {Textarea} from "@/components/ui/textarea"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {toast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import Navbar from "@/components/molecules/Navbar";
import {Column} from "@/components/wrapper/Column";

const formSchema = z.object({
    fullName: z.string().min(2, {message: "Name must be at least 2 characters."}),
    username: z.string().min(3, {message: "Username must be at least 3 characters."}),
    email: z.string().email({message: "Invalid email address."}),
    phoneNumber: z.string().regex(/^\+?[0-9\s]{10,14}$/, {message: "Invalid phone number."}),
    address: z.string().min(5, {message: "Address must be at least 5 characters."}),
    userType: z.enum(["personal", "business"], {required_error: "Please select a user type."}),
    description: z.string().max(500, {message: "Description must not exceed 500 characters."}),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    facebook: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function EditProfilePage() {
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "John Doe",
            username: "johndoe123",
            email: "john.doe@example.com",
            phoneNumber: "+62 812 3456 7890",
            address: "Jakarta, Indonesia",
            userType: "personal",
            description: "Passionate real estate enthusiast with 5 years of experience in property management and sales.",
            instagram: "johndoe_realestate",
            linkedin: "johndoe-realestate",
            facebook: "johndoerealestate",
        },
    })

    function onSubmit(data: FormValues) {
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            console.log(data)
            setIsLoading(false)
            toast({
                title: "Profile updated",
                description: "Your profile has been successfully updated.",
            })
        }, 2000)
    }

    return (
        <Column className={"w-full max-w-5xl mx-auto"}>
            <Navbar/>
            <div className="container mx-auto px-4 py-8">
                <Card className="w-full mx-auto">
                    <CardHeader>
                        <CardTitle>Edit Profile</CardTitle>
                        <CardDescription>Update your profile information</CardDescription>
                    </CardHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <Avatar className="w-24 h-24">
                                        <AvatarImage src="/placeholder.svg" alt="Profile picture"/>
                                        <AvatarFallback>JD</AvatarFallback>
                                    </Avatar>
                                    <Button variant="outline">Change Picture</Button>
                                </div>

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
                                    <FormField
                                        control={form.control}
                                        name="instagram"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Instagram</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Your Instagram username" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="linkedin"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>LinkedIn</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Your LinkedIn profile URL or username" {...field} />
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
                                                    <Input
                                                        placeholder="Your Facebook profile URL or username" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
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
            </div>
        </Column>
    )
}