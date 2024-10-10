"use client"

import { Button, SubmitButton } from "@/components/ui/buttons"
//import { signIn, signInWithGoogle } from "@/actions/login"
import { signInFormSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/forms/form"
import { Input } from "@/components/ui/input"
import { Dispatch, SetStateAction } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Props {
	setFormType: Dispatch<SetStateAction<string | undefined>>
}

type SignInPayload = {
	userName: string
	password: string
}

export function SignInForm({ setFormType }: Props) {
	const queryClient = useQueryClient()
	const router = useRouter()

	const form = useForm<z.infer<typeof signInFormSchema>>({
		resolver: zodResolver(signInFormSchema),
		defaultValues: {
			userName: "",
			password: "",
		},
	})

	const onSubmit = async (values: z.infer<typeof signInFormSchema>) => {
		const payload: SignInPayload = {
			userName: values.userName,
			password: values.password,
		}
		mutation.mutate(payload)
		//await signIn(values)
		//queryClient.invalidateQueries(["user"])
	}

	const handleFormChange = () => {
		setFormType("signup")
	}

	const mutation = useMutation({
		mutationFn: async (data: SignInPayload) => {
			const url = new URL(`${process.env.NEXT_PUBLIC_URL}/api/login`)
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
			if (!response.ok) {
				const body = await response.json()
				throw new Error(JSON.stringify(body, null, 2))
			}

			return await response.json()
		},
		onError: (error: any) => {
			console.error(error)
			toast.error(error.message, { description: error.code })
		},
		// onSettled: () => {
		// 	//setVisible(false)
		// 	console.log("settled")
		// },
		onSuccess: (body: any) => {
			toast.success(body.message)
			router.push("/")
		},
	})

	return (
		<>
			<h3 className="text-2xl font-semibold leading-none tracking-tight break-words font-epilogue text-center">
				sign in
			</h3>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex justify-center flex-col">
					<div>
						<FormField
							control={form.control}
							name="userName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>username</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>password</FormLabel>
									<FormControl>
										<Input type="password" placeholder="••••••••" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div>
						<div className="flex flex-col items-end">
							<SubmitButton className="w-full" pending={mutation.isPending} pendingText="signing in...">
								sign in
							</SubmitButton>
							{/* <Button
								onClick={handleResetFormChange}
								variant="link"
								className="text-md p-0 text-muted-foreground"
								size="sm"
							>
								forgot password?
							</Button> */}
						</div>
					</div>
				</form>
			</Form>
			<div className="flex flex-row justify-center items-center">
				don't have an account?
				<Button onClick={handleFormChange} variant="link" className="text-md text-muted-foreground" size="sm">
					sign up
				</Button>
			</div>
		</>
	)
}
