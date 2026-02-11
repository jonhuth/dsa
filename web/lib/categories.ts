// Category metadata for organizing algorithms

import type { Category, CategoryMetadata } from "./types";
import { getAlgorithmsByCategory } from "./algorithms";

export const CATEGORIES: Record<Category, CategoryMetadata> = {
	sorting: {
		id: "sorting",
		name: "Sorting Algorithms",
		description:
			"Algorithms that arrange elements in a specific order (ascending, descending, custom)",
		icon: "↕️",
		algorithmCount: 0, // Will be computed dynamically
	},
	searching: {
		id: "searching",
		name: "Search Algorithms",
		description: "Algorithms that find specific elements or patterns in data structures",
		icon: "🔍",
		algorithmCount: 0,
	},
	graphs: {
		id: "graphs",
		name: "Graph Algorithms",
		description: "Algorithms for traversing, searching, and analyzing graph structures",
		icon: "🕸️",
		algorithmCount: 0,
	},
	trees: {
		id: "trees",
		name: "Tree Algorithms",
		description: "Algorithms for binary trees, BSTs, heaps, and other tree structures",
		icon: "🌳",
		algorithmCount: 0,
	},
	dynamic_programming: {
		id: "dynamic_programming",
		name: "Dynamic Programming",
		description:
			"Optimization algorithms using memoization and tabulation to avoid redundant computation",
		icon: "🧮",
		algorithmCount: 0,
	},
	data_structures: {
		id: "data_structures",
		name: "Data Structures",
		description: "Fundamental data structures for organizing and storing data efficiently",
		icon: "📦",
		algorithmCount: 0,
	},
	strings: {
		id: "strings",
		name: "String Algorithms",
		description: "Algorithms for pattern matching, manipulation, and analysis",
		icon: "📝",
		algorithmCount: 0,
	},
	heaps: {
		id: "heaps",
		name: "Heap Algorithms",
		description: "Priority queue implementations and heap-based algorithms",
		icon: "⛰️",
		algorithmCount: 0,
	},
	linked_lists: {
		id: "linked_lists",
		name: "Linked Lists",
		description: "Algorithms for singly, doubly, and circular linked list operations",
		icon: "🔗",
		algorithmCount: 0,
	},
	hash_tables: {
		id: "hash_tables",
		name: "Hash Tables",
		description: "Hash-based data structures for efficient key-value lookups",
		icon: "#️⃣",
		algorithmCount: 0,
	},
	stacks_queues: {
		id: "stacks_queues",
		name: "Stacks & Queues",
		description: "LIFO and FIFO data structures and their applications",
		icon: "📚",
		algorithmCount: 0,
	},
	problems: {
		id: "problems",
		name: "Problems",
		description: "LeetCode-style problems combining multiple algorithms and data structures",
		icon: "🎯",
		algorithmCount: 0,
	},
	mini_systems: {
		id: "mini_systems",
		name: "Mini Systems",
		description: "Complex systems combining multiple algorithms and data structures",
		icon: "🏗️",
		algorithmCount: 0,
	},
};

/**
 * Get category by ID with computed algorithm count
 */
export function getCategory(id: Category): CategoryMetadata {
	const category = CATEGORIES[id];
	return {
		...category,
		algorithmCount: getAlgorithmsByCategory(id).length,
	};
}

/**
 * Get all categories with computed algorithm counts
 */
export function getAllCategories(): CategoryMetadata[] {
	return Object.values(CATEGORIES).map((cat) => getCategory(cat.id));
}

/**
 * Get only categories that have algorithms
 */
export function getActiveCategories(): CategoryMetadata[] {
	return getAllCategories().filter((cat) => cat.algorithmCount > 0);
}
