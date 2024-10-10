"use client"

import Link from "next/link"

export function Nav() {
	return (
		<nav className="flex justify-center h-16 sticky top-0">
			<div className="px-6 md:px-8 py-4 flex flex-row items-center w-full justify-between max-w-5xl">
				<Link href="/">diary in a bottle</Link>
				<Link href="/login">login</Link>
			</div>
		</nav>
	)
}
