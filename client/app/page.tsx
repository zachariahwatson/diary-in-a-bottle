"use client"

import { useUser } from "@/hooks/state"

export default function Home() {
	const { data: user, isLoading } = useUser()

	return (
		<div className="max-w-sm md:max-w-4xl w-full relative">
			{isLoading ? "user loading..." : JSON.stringify(user, null, 2)}
		</div>
	)
}
