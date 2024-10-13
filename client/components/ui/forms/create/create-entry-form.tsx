"use client"

import { Checkbox, Input, Textarea } from "@/components/ui"
import { Button } from "@/components/ui/buttons"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/forms"
//import { useClubMembership, useReading } from "@/contexts"
import { createEntryFormSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { z } from "zod"

export function CreateEntryForm() {
	//const readingData = useReading()
	//const clubMembership = useClubMembership()
	const router = useRouter()
	const queryClient = useQueryClient()
	const postMutation = useMutation({
		mutationFn: async (data: { content: string }) => {
			const url = new URL(`${process.env.NEXT_PUBLIC_URL}/api/new`)
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
			if (!response.ok) {
				const body = await response.json()
				throw new Error(body.message)
			}

			return await response.json()
		},
		onError: (error: any) => {
			toast.error(error.message, { description: error.code })
		},
		onSuccess: (body: any) => {
			toast.success(body.message)
			//queryClient.invalidateQueries(["posts", clubMembership?.club.id, readingData?.id])
		},
	})

	// 1. Define your form.
	const form = useForm<z.infer<typeof createEntryFormSchema>>({
		resolver: zodResolver(createEntryFormSchema),
		defaultValues: {
			content: "",
		},
	})

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof createEntryFormSchema>) {
		postMutation.mutate({
			//diary_id: readingData?.id || null,
			content: values.content,
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 grow flex flex-col">
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem className="grow flex flex-col">
							<FormControl className="grow">
								<Textarea className="h-full" placeholder="write your entry here" {...field}></Textarea>
							</FormControl>
							<FormMessage className="shrink-0" />
						</FormItem>
					)}
				/>
				<div className="flex flex-col md:flex-row-reverse float-right w-full space-y-2 md:space-y-0 shrink-0">
					{postMutation.isPending ? (
						<Button disabled>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-6 animate-spin mr-2"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
								/>
							</svg>
							posting...
						</Button>
					) : (
						<Button type="submit">post</Button>
					)}
					<Button
						variant="outline"
						className="md:mr-2"
						onClick={(event) => {
							event.preventDefault()
							router.push("/")
						}}
					>
						cancel
					</Button>
				</div>
			</form>
		</Form>
	)
}
