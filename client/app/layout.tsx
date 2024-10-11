import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import Providers from "./providers"
import { Nav } from "@/components/ui/nav"
import { version } from "@/lib/version"
import Link from "next/link"
import { Button } from "@/components/ui"

const AzeretMono = localFont({
	variable: "--font-azeret-mono",
	src: [
		{ path: "./../public/fonts/azeret-mono/AzeretMono-Variable.ttf", style: "normal" },
		{ path: "./../public/fonts/azeret-mono/AzeretMono-Variable.woff", style: "normal" },
		{ path: "./../public/fonts/azeret-mono/AzeretMono-Variable.woff2", style: "normal" },
		{ path: "./../public/fonts/azeret-mono/AzeretMono-VariableItalic.ttf", style: "italic" },
		{ path: "./../public/fonts/azeret-mono/AzeretMono-VariableItalic.woff", style: "italic" },
		{ path: "./../public/fonts/azeret-mono/AzeretMono-VariableItalic.woff2", style: "italic" },
	],
	weight: "100 900",
	display: "swap",
})

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_URL || ""),
	title: "diary in a bottle",
	description: "anonymous diaries",
	applicationName: "diary in a bottle",
	// keywords: [
	// 	"thispage",
	// 	"book club",
	// 	"book club site",
	// 	"book club app",
	// 	"online book clubs",
	// 	"book discussions",
	// 	"book readings",
	// 	"reading goals",
	// 	"book comments",
	// 	"book posts",
	// 	"book club polls",
	// 	"reading progress tracking",
	// 	"page tracking",
	// 	"section tracking",
	// 	"incremental reading goals",
	// 	"goal completion",
	// 	"book club community",
	// 	"collaborative reading",
	// 	"discussion posts",
	// 	"reading polls",
	// 	"book discussions online",
	// 	"group reading goals",
	// ],
	creator: "Zachariah Watson",
	icons: {
		icon: [
			{ rel: "icon", sizes: "16x16", url: "/images/favicon-16x16.png" },
			{ rel: "icon", sizes: "32x32", url: "/images/favicon-32x32.png" },
		],
		other: [
			{ rel: "apple-touch-icon", sizes: "180x180", url: "/images/apple-touch-icon.png" },
			{ rel: "icon", sizes: "192x192", url: "/images/android-chrome-192x192.png" },
			{ rel: "icon", sizes: "512x512", url: "/images/android-chrome-512x512.png" },
		],
	},
	// openGraph: {
	// 	title: "diary in a bottle",
	// 	description: "a simple book club site",
	// 	url: "https://thispa.ge",
	// 	siteName: "thispage",
	// 	locale: "en_US",
	// 	type: "website",
	// 	// images: [
	// 	// 	{
	// 	// 		url: "https://thispa.ge/images/twitter-img.png",
	// 	// 		width: 512,
	// 	// 		height: 512,
	// 	// 		alt: "a gray book with a red bookmark in it",
	// 	// 	},
	// 	// ],
	// },
	// twitter: {
	// 	card: "summary",
	// 	title: "thispage",
	// 	description: "a simple book club site",
	// 	creator: "@zchwtsn",
	// 	creatorId: "1365452328501927936",
	// 	// images: [
	// 	// 	{
	// 	// 		url: "https://thispa.ge/images/twitter-img.png",
	// 	// 		width: 512,
	// 	// 		height: 512,
	// 	// 		alt: "a gray book with a red bookmark in it",
	// 	// 	},
	// 	// ],
	// },
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html className={`${AzeretMono.variable}`} lang="en" suppressHydrationWarning>
			<Providers>
				<body className="font-azeret-mono antialiased min-h-screen">
					<Nav />
					<main className="min-h-[calc(100vh-4rem)] flex flex-col items-center p-6 md:p-12 md:pt-12 space-y-12 pb-12 w-full">
						{children}
					</main>
					<footer className="absolute bottom-0 flex flex-col md:flex-row justify-center items-center md:text-sm text-xs mb-4 px-2 w-full">
						<span>© 2024 ❤️ Zachariah Watson </span>
						<div>
							<span className="ml-1">
								<span className="hidden md:inline">|</span>{" "}
								<Button variant="link" className="p-0 text-muted-foreground h-5">
									<Link href="https://github.com/zachariahwatson/thispage" target="_blank" rel="noopener noreferrer">
										github
									</Link>
								</Button>{" "}
							</span>
							<span>
								|{" "}
								<Button variant="link" className="p-0 text-muted-foreground h-5">
									<Link href="/terms">terms</Link>
								</Button>{" "}
							</span>
							<span>
								|{" "}
								<Button variant="link" className="p-0 text-muted-foreground h-5">
									<Link href="/privacy">privacy</Link>
								</Button>{" "}
							</span>
							<span>
								|{" "}
								<Button variant="link" className="p-0 text-muted-foreground h-5">
									<Link
										href="https://github.com/zachariahwatson/thispage/blob/main/CHANGELOG.md"
										target="_blank"
										rel="noopener noreferrer"
									>
										v {version}
									</Link>
								</Button>{" "}
							</span>
						</div>
					</footer>
				</body>
			</Providers>
		</html>
	)
}
