"use client";

import { Binary, Calculator, GitBranch, Search, Sigma, TreePine, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";

interface Algorithm {
	id: string;
	name: string;
	category: string;
	difficulty: string;
	timeComplexity: string;
	description: string;
	path: string;
}

const algorithms: Algorithm[] = [
	{
		id: "bubble-sort",
		name: "Bubble Sort",
		category: "Sorting",
		difficulty: "Easy",
		timeComplexity: "O(n²)",
		description: "Simple comparison-based sorting with adjacent element swaps",
		path: "/algorithms/sorting/bubble-sort",
	},
	{
		id: "quick-sort",
		name: "Quick Sort",
		category: "Sorting",
		difficulty: "Medium",
		timeComplexity: "O(n log n)",
		description: "Efficient divide-and-conquer sorting with in-place partitioning",
		path: "/algorithms/sorting/quick-sort",
	},
	{
		id: "merge-sort",
		name: "Merge Sort",
		category: "Sorting",
		difficulty: "Medium",
		timeComplexity: "O(n log n)",
		description: "Stable divide-and-conquer with guaranteed O(n log n) performance",
		path: "/algorithms/sorting/merge-sort",
	},
	{
		id: "insertion-sort",
		name: "Insertion Sort",
		category: "Sorting",
		difficulty: "Easy",
		timeComplexity: "O(n²)",
		description: "Simple sorting by inserting elements into sorted portion",
		path: "/algorithms/sorting/insertion-sort",
	},
	{
		id: "selection-sort",
		name: "Selection Sort",
		category: "Sorting",
		difficulty: "Easy",
		timeComplexity: "O(n²)",
		description: "Sorting by repeatedly selecting minimum element",
		path: "/algorithms/sorting/selection-sort",
	},
	{
		id: "heap-sort",
		name: "Heap Sort",
		category: "Sorting",
		difficulty: "Medium",
		timeComplexity: "O(n log n)",
		description: "In-place sorting using binary heap data structure",
		path: "/algorithms/sorting/heap-sort",
	},
	{
		id: "bfs",
		name: "Breadth-First Search",
		category: "Graphs",
		difficulty: "Medium",
		timeComplexity: "O(V + E)",
		description: "Level-order graph traversal finding shortest paths",
		path: "/algorithms/graphs/bfs",
	},
	{
		id: "dfs",
		name: "Depth-First Search",
		category: "Graphs",
		difficulty: "Medium",
		timeComplexity: "O(V + E)",
		description: "Depth-first graph traversal with backtracking",
		path: "/algorithms/graphs/dfs",
	},
	{
		id: "dijkstra",
		name: "Dijkstra's Algorithm",
		category: "Graphs",
		difficulty: "Medium",
		timeComplexity: "O((V+E) log V)",
		description: "Shortest path in weighted graphs using greedy approach",
		path: "/algorithms/graphs/dijkstra",
	},
	{
		id: "num-islands",
		name: "Number of Islands",
		category: "Graphs",
		difficulty: "Medium",
		timeComplexity: "O(m×n)",
		description: "Count connected components in 2D grid using BFS/DFS",
		path: "/algorithms/graphs/num-islands",
	},
	{
		id: "binary-search",
		name: "Binary Search",
		category: "Search",
		difficulty: "Easy",
		timeComplexity: "O(log n)",
		description: "Efficient divide-and-conquer search in sorted arrays",
		path: "/algorithms/search/binary-search",
	},
	{
		id: "linear-search",
		name: "Linear Search",
		category: "Search",
		difficulty: "Easy",
		timeComplexity: "O(n)",
		description: "Simple sequential search checking each element",
		path: "/algorithms/search/linear-search",
	},
	{
		id: "bst-insert",
		name: "BST Insert",
		category: "Trees",
		difficulty: "Medium",
		timeComplexity: "O(log n)",
		description: "Insert values into Binary Search Tree maintaining BST property",
		path: "/algorithms/trees/bst-insert",
	},
	{
		id: "bst-search",
		name: "BST Search",
		category: "Trees",
		difficulty: "Medium",
		timeComplexity: "O(log n)",
		description: "Search Binary Search Tree leveraging sorted property",
		path: "/algorithms/trees/bst-search",
	},
	{
		id: "fibonacci-memoization",
		name: "Fibonacci (Memoization)",
		category: "Dynamic Programming",
		difficulty: "Easy",
		timeComplexity: "O(n)",
		description: "Top-down DP with caching to avoid redundant computations",
		path: "/algorithms/dynamic-programming/fibonacci-memoization",
	},
	{
		id: "fibonacci-tabulation",
		name: "Fibonacci (Tabulation)",
		category: "Dynamic Programming",
		difficulty: "Easy",
		timeComplexity: "O(n)",
		description: "Bottom-up DP computing Fibonacci numbers iteratively",
		path: "/algorithms/dynamic-programming/fibonacci-tabulation",
	},
	{
		id: "knapsack",
		name: "0/1 Knapsack",
		category: "Dynamic Programming",
		difficulty: "Medium",
		timeComplexity: "O(n×W)",
		description: "Maximize value in capacity-constrained knapsack using DP",
		path: "/algorithms/dynamic-programming/knapsack",
	},
	{
		id: "lcs",
		name: "Longest Common Subsequence",
		category: "Dynamic Programming",
		difficulty: "Medium",
		timeComplexity: "O(m*n)",
		description: "Find longest subsequence common to two strings using 2D DP",
		path: "/algorithms/dynamic-programming/lcs",
	},
	// Information Theory exhibits. These are hand-written pages rather than
	// registry algorithms, so they have no complexity/difficulty of their own —
	// the fields below are display-only labels for the command palette.
	{
		id: "entropy",
		name: "Shannon Entropy",
		category: "Information Theory",
		difficulty: "Foundations",
		timeComplexity: "bits",
		description: "Surprise measured in bits — drag a distribution and watch H change",
		path: "/information-theory/entropy",
	},
	{
		id: "cross-entropy",
		name: "Cross-Entropy & KL Divergence",
		category: "Information Theory",
		difficulty: "Foundations",
		timeComplexity: "bits",
		description: "The cost of believing the wrong distribution, and the gap it opens",
		path: "/information-theory/cross-entropy",
	},
	{
		id: "mutual-information",
		name: "Mutual Information",
		category: "Information Theory",
		difficulty: "Foundations",
		timeComplexity: "bits",
		description: "How much knowing one variable tells you about another",
		path: "/information-theory/mutual-information",
	},
	{
		id: "max-entropy",
		name: "Maximum Entropy",
		category: "Information Theory",
		difficulty: "Foundations",
		timeComplexity: "bits",
		description: "The least-committal distribution consistent with what you know",
		path: "/information-theory/max-entropy",
	},
	{
		id: "kolmogorov",
		name: "Kolmogorov Complexity",
		category: "Information Theory",
		difficulty: "Foundations",
		timeComplexity: "incomputable",
		description: "The shortest program that reproduces a string",
		path: "/information-theory/kolmogorov",
	},
];

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
	Sorting: TrendingUp,
	Graphs: GitBranch,
	Search: Binary,
	Trees: TreePine,
	"Dynamic Programming": Calculator,
	"Information Theory": Sigma,
};

// Difficulty badge colors. "Foundations" marks the Information Theory exhibits,
// which aren't graded Easy/Medium/Hard — without its own case it would fall
// through to the red "Hard" styling.
const difficultyClass: Record<string, string> = {
	Easy: "bg-green-500/10 text-green-500",
	Medium: "bg-yellow-500/10 text-yellow-500",
	Foundations: "bg-violet-500/10 text-violet-400",
};

// Group algorithms by category
const categories = Array.from(new Set(algorithms.map((a) => a.category)));

interface SearchDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
	const router = useRouter();

	// Handle keyboard shortcut
	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				onOpenChange(!open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [open, onOpenChange]);

	const handleSelect = (path: string) => {
		onOpenChange(false);
		router.push(path);
	};

	return (
		<CommandDialog open={open} onOpenChange={onOpenChange}>
			<CommandInput placeholder="Search algorithms & concepts..." />
			<CommandList className="max-h-[60vh] sm:max-h-[400px]">
				<CommandEmpty>No results found.</CommandEmpty>

				{categories.map((category) => {
					const categoryAlgos = algorithms.filter((a) => a.category === category);
					const Icon = categoryIcons[category] || Search;

					return (
						<CommandGroup key={category} heading={category}>
							{categoryAlgos.map((algo) => (
								<CommandItem
									key={algo.id}
									value={`${algo.name} ${algo.category} ${algo.description} ${algo.timeComplexity}`}
									onSelect={() => handleSelect(algo.path)}
									className="flex items-start gap-2 sm:gap-3 py-3 px-2 sm:px-3"
								>
									<div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
										<Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
									</div>
									<div className="flex-1 min-w-0 space-y-1">
										<div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
											<span className="text-sm font-medium">{algo.name}</span>
											<span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-purple-500/10 text-purple-500 rounded">
												{algo.timeComplexity}
											</span>
											<span
												className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded ${
													difficultyClass[algo.difficulty] ?? "bg-red-500/10 text-red-500"
												}`}
											>
												{algo.difficulty}
											</span>
										</div>
										<p className="text-xs text-muted-foreground line-clamp-2 sm:line-clamp-1">
											{algo.description}
										</p>
									</div>
								</CommandItem>
							))}
						</CommandGroup>
					);
				})}
			</CommandList>
		</CommandDialog>
	);
}
