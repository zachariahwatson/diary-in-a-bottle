"use client"

import { Button, SubmitButton } from "@/components/ui/buttons"
import { Checkbox, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Separator } from "@/components/ui"
import { signUpFormSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/forms"
import { Input } from "@/components/ui/input"
import { Dispatch, SetStateAction, useState } from "react"
import Link from "next/link"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { generateUserName } from "@/utils"
import { toast } from "sonner"

interface Props {
	setFormType: Dispatch<SetStateAction<string | undefined>>
}

type SignUpPayload = {
	userName: string
	password: string
}

export function SignUpForm({ setFormType }: Props) {
	const queryClient = useQueryClient()

	const [delimiter, setDelimiter] = useState<string>("-")
	const [userNameSeed, setUserNameSeed] = useState<{ adj1: number; adj2: number; noun: number }>({
		adj1: Math.random(),
		adj2: Math.random(),
		noun: Math.random(),
	})

	const form = useForm<z.infer<typeof signUpFormSchema>>({
		resolver: zodResolver(signUpFormSchema),
		defaultValues: {
			userName: generateUserName(userNameSeed, delimiter),
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

	const handleRegenerateUserName = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault()
		const newUserNameSeed = {
			adj1: Math.random(),
			adj2: Math.random(),
			noun: Math.random(),
		}
		setUserNameSeed(newUserNameSeed)
		const newUserName = generateUserName(newUserNameSeed, delimiter)
		form.setValue("userName", newUserName)
	}

	const handleDelimiter = (value: string) => {
		setDelimiter(value)
		const newUserName = generateUserName(userNameSeed, value)
		form.setValue("userName", newUserName)
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
				const body = await response.json()
				throw new Error(JSON.stringify(body, null, 2))
			}

			return await response.json()
		},
		onError: (error: any) => {
			console.error(error)
			toast.error(error.message, { description: error.code })
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
					<div>
						<FormField
							control={form.control}
							name="userName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>username</FormLabel>
									<FormControl>
										<div className="flex flex-row space-x-2">
											<Input {...field} readOnly disabled />
											<Select onValueChange={handleDelimiter} defaultValue="-">
												<SelectTrigger className="w-32">
													<SelectValue placeholder="-" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="none">none</SelectItem>
													<SelectItem value="-">-</SelectItem>
													<SelectItem value="_">_</SelectItem>
													<SelectItem value="+">+</SelectItem>
													<SelectItem value=">">{">"}</SelectItem>
													<SelectItem value="?">?</SelectItem>
													<SelectItem value="/">/</SelectItem>
													<SelectItem value="\">\</SelectItem>
													<SelectItem value="|">|</SelectItem>
													<SelectItem value=":">:</SelectItem>
													<SelectItem value=";">;</SelectItem>
													<SelectItem value="!">!</SelectItem>
													<SelectItem value="@">@</SelectItem>
													<SelectItem value="#">#</SelectItem>
													<SelectItem value="$">$</SelectItem>
													<SelectItem value="%">%</SelectItem>
													<SelectItem value="^">^</SelectItem>
													<SelectItem value="&">&</SelectItem>
													<SelectItem value="*">*</SelectItem>
												</SelectContent>
											</Select>
											<Button onClick={handleRegenerateUserName}>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													strokeWidth={1.5}
													stroke="currentColor"
													className="size-6"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
													/>
												</svg>
											</Button>
										</div>
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
					</div>
					<FormField
						control={form.control}
						name="acceptCredentialsSaved"
						render={({ field }) => (
							<FormItem>
								<div className="flex flex-row items-start space-x-3 space-y-0">
									<FormControl>
										<Checkbox checked={field.value} onCheckedChange={field.onChange} />
									</FormControl>
									<FormLabel>credentials have been saved</FormLabel>
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
