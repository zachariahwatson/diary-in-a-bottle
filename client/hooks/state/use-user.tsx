"use client"

import { useQuery } from "@tanstack/react-query"

export function useUser() {
	const { data, isLoading } = useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			const url = new URL(`${process.env.NEXT_PUBLIC_URL}/api/manage/info`)
			const response = await fetch(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			})

			if (!response.ok) {
				const body = await response.json()
				throw new Error(body.error)
			}

			return await response.json()
		},
	})

	return { data, isLoading }
}
