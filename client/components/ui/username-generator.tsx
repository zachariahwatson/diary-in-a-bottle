"use client"

import { generateUserName } from "@/utils"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui"

export function UserNameGenerator({ ...props }) {
	const form = useFormContext()

	const [delimiter, setDelimiter] = useState<string>("-")
	const [userNameSeed, setUserNameSeed] = useState<{ adj1: number; adj2: number; noun: number }>({
		adj1: Math.random(),
		adj2: Math.random(),
		noun: Math.random(),
	})

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

	return (
		<div className="flex flex-row space-x-2">
			<Input {...props} readOnly disabled />
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
	)
}
