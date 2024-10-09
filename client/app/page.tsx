"use client"

import { useQuery } from "@tanstack/react-query"

export default function Home() {
	const { data, isLoading } = useQuery({
		queryKey: ["weather"],
		queryFn: async () => {
			const url = new URL(`${process.env.NEXT_PUBLIC_URL}/api/weatherforecast`)
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

	return (
		<div className="max-w-sm md:max-w-4xl w-full relative">
			{isLoading ? "loading..." : JSON.stringify(data, null, 2)}
		</div>
	)
}
