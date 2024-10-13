"use client"

import { useUser } from "@/hooks/state"

export default function Home() {
	const { data: user, isLoading } = useUser()

	return <div>{isLoading ? "user loading..." : JSON.stringify(user, null, 2)}</div>
}
