import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
	title: "DSA Visualizer - Interactive Data Structures & Algorithms",
	description:
		"Learn data structures and algorithms through interactive visualizations, AI-powered tutoring, and comprehensive learning resources.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<body className="antialiased">
				<Header />
				{children}
			</body>
		</html>
	);
}
