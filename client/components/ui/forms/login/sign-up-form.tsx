"use client"

import { Button, SubmitButton } from "@/components/ui/buttons"
import {
	Checkbox,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Separator,
	UserNameGenerator,
} from "@/components/ui"
import { signUpFormSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/forms"
import { Input } from "@/components/ui/input"
import { Dispatch, SetStateAction, useState } from "react"
import Link from "next/link"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { generateUserName, handleAuthApiError } from "@/utils"
import { toast } from "sonner"
import { AuthApiError } from "@/utils/errors"
import type { AuthApiError as AuthApiErrorType } from "@/lib/types"

interface Props {
	setFormType: Dispatch<SetStateAction<string | undefined>>
}

type SignUpPayload = {
	userName: string
	password: string
}

export function SignUpForm({ setFormType }: Props) {
	const queryClient = useQueryClient()

	const form = useForm<z.infer<typeof signUpFormSchema>>({
		resolver: zodResolver(signUpFormSchema),
		defaultValues: {
			userName: generateUserName(),
			password: "",
			confirmPassword: "",
			acceptTerms: false,
		},
	})

	const onSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
		const payload: SignUpPayload = {
			userName: values.userName,
			password: values.password,
		}
		mutation.mutate(payload)
	}

	const handleFormChange = () => {
		setFormType("signin")
	}

	const mutation = useMutation({
		mutationFn: async (data: SignUpPayload) => {
			const url = new URL(`${process.env.NEXT_PUBLIC_URL}/api/register`)
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
			form.reset()
			handleFormChange()
		},
	})

	return (
		<>
			<h3 className="text-2xl font-semibold leading-none tracking-tight break-words font-epilogue text-center">
				sign up
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
									<UserNameGenerator {...field} />
								</FormControl>
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
					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>confirm password</FormLabel>
								<FormControl>
									<Input type="password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="acceptCredentialsSaved"
						render={({ field }) => (
							<FormItem>
								<div className="flex flex-row items-start space-x-3 space-y-0">
									<FormControl>
										<Checkbox checked={field.value} onCheckedChange={field.onChange} />
									</FormControl>
									<FormLabel>credentials have been stored</FormLabel>
								</div>
								<FormDescription>
									you acknowledge that we DO NOT support account recovery and that you have stored you username and
									password in a safe place.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="acceptTerms"
						render={({ field }) => (
							<FormItem>
								<div className="flex flex-row items-start space-x-3 space-y-0">
									<FormControl>
										<Checkbox checked={field.value} onCheckedChange={field.onChange} />
									</FormControl>
									<FormLabel>accept terms and conditions</FormLabel>
								</div>
								<FormDescription>
									you agree to our{" "}
									<Link
										href="/terms"
										className="hover:underline text-primary"
										target="_blank"
										rel="noopener noreferrer"
									>
										terms of service
									</Link>{" "}
									and{" "}
									<Link
										href="/privacy"
										className="hover:underline text-primary"
										target="_blank"
										rel="noopener noreferrer"
									>
										privacy policy
									</Link>
									.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<SubmitButton pending={mutation.isPending} pendingText="signing up...">
						sign up
					</SubmitButton>
				</form>
			</Form>
			<div className="flex flex-row justify-center items-center">
				have an account?
				<Button onClick={handleFormChange} variant="link" className="text-md text-muted-foreground" size="sm">
					sign in
				</Button>
			</div>
		</>
	)
}
