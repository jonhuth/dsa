"use client";
import Link from "next/link";
import { useState } from "react";
import registry from "@/lib/registry";
import type { AlgorithmMetadata, Category } from "@/lib/types";

interface Props {
	initialAlgorithms: AlgorithmMetadata[];
}

const difficultyColor = (difficulty: string) => {
	switch (difficulty.toLowerCase()) {
		case "easy":
			return "bg-green-500/10 text-green-500";
		case "medium":
			return "bg-yellow-500/10 text-yellow-500";
		case "hard":
			return "bg-red-500/10 text-red-500";
		default:
			return "bg-gray-500/10 text-gray-500";
	}
};

const categoryDisplayName = (category: Category) => {
	return registry.categories.get(category)?.name || category;
};

export function AlgorithmSearch({ initialAlgorithms }: Props) {
	const [query, setQuery] = useState("");

	const results = query.trim() ? registry.algorithms.search(query) : initialAlgorithms;

	return (
		<>
			<div className="relative w-full">
				<input
					type="search"
					placeholder="Search algorithms... (e.g. 'sort', 'graph', 'O(n)')"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary pr-8"
				/>
				{query && (
					<button
						type="button"
						onClick={() => setQuery("")}
						className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-lg leading-none"
						aria-label="Clear search"
					>
						×
					</button>
				)}
			</div>

			{results.length === 0 && query.trim() ? (
				<p className="text-muted-foreground text-sm text-center py-8">
					No algorithms found for &quot;{query}&quot;
				</p>
			) : (
				<div className="grid gap-3 sm:gap-4">
					{results.map((algo) => (
						<Link
							key={algo.id}
							href={algo.path}
							className="p-4 sm:p-6 border border-border rounded-lg hover:bg-accent transition-colors group"
						>
							<div className="flex items-start justify-between gap-3 sm:gap-4">
								<div className="flex-1 min-w-0">
									<div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
										<h3 className="text-lg sm:text-2xl font-semibold group-hover:text-primary transition-colors">
											{algo.name}
										</h3>
										<span className="text-xs text-muted-foreground px-2 py-1 bg-background border border-border rounded">
											{categoryDisplayName(algo.category)}
										</span>
									</div>
									<p className="text-sm text-muted-foreground mb-3 line-clamp-2">
										{algo.description}
									</p>
									<div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
										<span
											className={`px-2 sm:px-3 py-1 rounded ${difficultyColor(algo.difficulty)}`}
										>
											{algo.difficulty.charAt(0).toUpperCase() + algo.difficulty.slice(1)}
										</span>
										<span className="px-2 sm:px-3 py-1 bg-purple-500/10 text-purple-500 rounded">
											{algo.complexity.time.average}
										</span>
									</div>
								</div>
								<div className="text-muted-foreground group-hover:text-primary transition-colors shrink-0">
									→
								</div>
							</div>
						</Link>
					))}
				</div>
			)}
		</>
	);
}
