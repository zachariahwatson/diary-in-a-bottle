"use client"

import { useUser } from "@/hooks/state"
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Switch,
} from "@/components/ui"
import Link from "next/link"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ModeToggle } from "@/components/ui/buttons/mode-toggle"
import { useMediaQuery } from "@/hooks"
import { useTheme } from "next-themes"
import { useState } from "react"

export function Nav() {
	const queryClient = useQueryClient()
	const { data: user, isLoading: userLoading } = useUser()
	const { theme, setTheme } = useTheme()
	const [checked, setChecked] = useState<boolean>(theme === "light")
	const isVertical = useMediaQuery("(max-width: 768px)")

	const handleSwitch = (checked: boolean) => {
		setTheme(checked ? "light" : "dark")
		setChecked(checked)
	}

	const handleSignOut = () => {
		mutation.mutate()
	}

	const mutation = useMutation({
		mutationFn: async () => {
			const url = new URL(`${process.env.NEXT_PUBLIC_URL}/api/logout`)
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
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
		},
	})

	return (
		<nav className="flex justify-center h-16 sticky top-0 border-b">
			<div className="px-6 md:px-8 py-4 flex flex-row items-center w-full justify-between max-w-5xl">
				<Link href="/">diary in a bottle</Link>
				{user ? (
					<div className="flex flex-row space-x-2 items-center justify-end">
						{!isVertical && <h1>{user.userName}</h1>}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="p-2">
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
											d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
										/>
									</svg>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" sideOffset={11}>
								<DropdownMenuItem asChild>
									<Link href="/new" className="flex flex-row items-center cursor-pointer">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="size-6 mr-2"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
											/>
										</svg>
										new entry
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/diary" className="flex flex-row items-center cursor-pointer">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="size-6 mr-2"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
											/>
										</svg>
										my diary
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onSelect={(e) => e.preventDefault()}
									className="flex flex-row justify-between items-center"
								>
									{checked ? (
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
												d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
											/>
										</svg>
									) : (
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
												d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
											/>
										</svg>
									)}
									<Switch defaultChecked={checked} onCheckedChange={handleSwitch} />
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onSelect={handleSignOut}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="size-6 mr-2"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
										/>
									</svg>
									sign out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				) : (
					<Link href="/login">login</Link>
				)}
			</div>
		</nav>
	)
}
