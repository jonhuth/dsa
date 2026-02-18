"use client";

import { Github, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SearchDialog } from "./SearchDialog";

export function Header() {
	const [searchOpen, setSearchOpen] = useState(false);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				setSearchOpen(true);
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<>
			<header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container flex h-16 items-center justify-between gap-4 px-4 max-w-7xl mx-auto">
					{/* Logo */}
					<Link
						href="/"
						className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
					>
						<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
							<span className="text-white font-bold text-sm">DS</span>
						</div>
						<span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent hidden sm:inline">
							DSA Visualizer
						</span>
					</Link>

					{/* Centered Search Button */}
					<button
						onClick={() => setSearchOpen(true)}
						className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm text-muted-foreground border border-border rounded-lg hover:bg-accent transition-colors flex-1 max-w-md mx-auto touch-manipulation"
					>
						<Search className="w-4 h-4 shrink-0" />
						<span className="flex-1 text-left truncate">Search algorithms...</span>
						<kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
							<span className="text-xs">⌘</span>K
						</kbd>
					</button>

					{/* GitHub Link */}
					<a
						href="https://github.com/jonhuth/dsa"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground border border-border rounded-lg hover:bg-accent transition-colors shrink-0"
						aria-label="View source on GitHub"
					>
						<Github className="w-4 h-4" />
						<span className="hidden lg:inline">GitHub</span>
					</a>
				</div>
			</header>

			<SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
		</>
	);
}
