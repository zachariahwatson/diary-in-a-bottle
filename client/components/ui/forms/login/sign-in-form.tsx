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
import { handleAuthApiError } from "@/utils"
import type { AuthApiError as AuthApiErrorType } from "@/lib/types"
import { AuthApiError } from "@/utils/errors"

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
	}

	const handleFormChange = () => {
		setFormType("signup")
	}

	const mutation = useMutation({
		mutationFn: async (data: SignInPayload) => {
			const url = new URL(`${process.env.NEXT_PUBLIC_URL}/api/login?useSessionCookies=true`)
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
			if (!response.ok) {
				const body: AuthApiErrorType = await response.json()
				throw new AuthApiError(body)
			}

			return await response.json()
		},
		onError: (error: AuthApiErrorType) => {
			console.error(error)
			handleAuthApiError(error)
		},
		onSuccess: (body: any) => {
			queryClient.invalidateQueries({ queryKey: ["user"] })
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
					<FormField
						control={form.control}
						name="userName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>username</FormLabel>
								<FormControl>
									<Input {...field} showCharacterCount={false} />
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
									<Input type="password" placeholder="••••••••" {...field} showCharacterCount={false} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<SubmitButton className="w-full" pending={mutation.isPending} pendingText="signing in...">
						sign in
					</SubmitButton>
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
