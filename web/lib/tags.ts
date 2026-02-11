// Tag definitions and utilities for categorizing algorithms

export const TAG_CATEGORIES = {
	TECHNIQUE: "technique",
	PATTERN: "pattern",
	USE_CASE: "use_case",
	COMPLEXITY: "complexity",
} as const;

export const TAGS = {
	// Techniques
	DIVIDE_AND_CONQUER: "divide-and-conquer",
	GREEDY: "greedy",
	TWO_POINTERS: "two-pointers",
	SLIDING_WINDOW: "sliding-window",
	BACKTRACKING: "backtracking",
	MEMOIZATION: "memoization",
	TABULATION: "tabulation",
	RECURSION: "recursion",
	ITERATION: "iteration",

	// Patterns
	IN_PLACE: "in-place",
	STABLE: "stable",
	COMPARISON_BASED: "comparison-based",
	NON_COMPARISON: "non-comparison",
	RECURSIVE: "recursive",
	ITERATIVE: "iterative",

	// Use Cases
	INTERVIEW_FAVORITE: "interview-favorite",
	REAL_WORLD: "real-world",
	FOUNDATIONAL: "foundational",
	OPTIMIZATION: "optimization",

	// Complexity Classes
	O_1: "O(1)",
	O_LOG_N: "O(log n)",
	O_N: "O(n)",
	O_N_LOG_N: "O(n log n)",
	O_N_SQUARED: "O(n²)",
	O_N_CUBED: "O(n³)",
	O_2_POW_N: "O(2^n)",
} as const;

export type Tag = (typeof TAGS)[keyof typeof TAGS];

export interface TagDefinition {
	id: Tag;
	name: string;
	category: (typeof TAG_CATEGORIES)[keyof typeof TAG_CATEGORIES];
	description: string;
	color?: string;
}

export const TAG_DEFINITIONS: TagDefinition[] = [
	// Techniques
	{
		id: TAGS.DIVIDE_AND_CONQUER,
		name: "Divide and Conquer",
		category: TAG_CATEGORIES.TECHNIQUE,
		description: "Break problem into smaller subproblems, solve recursively, combine",
		color: "blue",
	},
	{
		id: TAGS.GREEDY,
		name: "Greedy",
		category: TAG_CATEGORIES.TECHNIQUE,
		description: "Make locally optimal choice at each step",
		color: "green",
	},
	{
		id: TAGS.TWO_POINTERS,
		name: "Two Pointers",
		category: TAG_CATEGORIES.TECHNIQUE,
		description: "Use two pointers to traverse data structure",
		color: "purple",
	},
	{
		id: TAGS.SLIDING_WINDOW,
		name: "Sliding Window",
		category: TAG_CATEGORIES.TECHNIQUE,
		description: "Maintain window of elements while traversing",
		color: "cyan",
	},
	{
		id: TAGS.BACKTRACKING,
		name: "Backtracking",
		category: TAG_CATEGORIES.TECHNIQUE,
		description: "Try all possibilities, backtrack on failure",
		color: "red",
	},
	{
		id: TAGS.MEMOIZATION,
		name: "Memoization",
		category: TAG_CATEGORIES.TECHNIQUE,
		description: "Top-down DP with caching",
		color: "yellow",
	},
	{
		id: TAGS.TABULATION,
		name: "Tabulation",
		category: TAG_CATEGORIES.TECHNIQUE,
		description: "Bottom-up DP with iteration",
		color: "yellow",
	},

	// Patterns
	{
		id: TAGS.IN_PLACE,
		name: "In-Place",
		category: TAG_CATEGORIES.PATTERN,
		description: "Modifies input without extra space",
		color: "indigo",
	},
	{
		id: TAGS.STABLE,
		name: "Stable",
		category: TAG_CATEGORIES.PATTERN,
		description: "Preserves relative order of equal elements",
		color: "teal",
	},
	{
		id: TAGS.COMPARISON_BASED,
		name: "Comparison-Based",
		category: TAG_CATEGORIES.PATTERN,
		description: "Uses comparisons to determine order",
		color: "orange",
	},

	// Use Cases
	{
		id: TAGS.INTERVIEW_FAVORITE,
		name: "Interview Favorite",
		category: TAG_CATEGORIES.USE_CASE,
		description: "Commonly asked in technical interviews",
		color: "pink",
	},
	{
		id: TAGS.FOUNDATIONAL,
		name: "Foundational",
		category: TAG_CATEGORIES.USE_CASE,
		description: "Core algorithm to learn first",
		color: "slate",
	},
	{
		id: TAGS.REAL_WORLD,
		name: "Real World",
		category: TAG_CATEGORIES.USE_CASE,
		description: "Widely used in production systems",
		color: "emerald",
	},

	// Complexity
	{
		id: TAGS.O_1,
		name: "O(1)",
		category: TAG_CATEGORIES.COMPLEXITY,
		description: "Constant time",
	},
	{
		id: TAGS.O_LOG_N,
		name: "O(log n)",
		category: TAG_CATEGORIES.COMPLEXITY,
		description: "Logarithmic time",
	},
	{
		id: TAGS.O_N,
		name: "O(n)",
		category: TAG_CATEGORIES.COMPLEXITY,
		description: "Linear time",
	},
	{
		id: TAGS.O_N_LOG_N,
		name: "O(n log n)",
		category: TAG_CATEGORIES.COMPLEXITY,
		description: "Linearithmic time",
	},
	{
		id: TAGS.O_N_SQUARED,
		name: "O(n²)",
		category: TAG_CATEGORIES.COMPLEXITY,
		description: "Quadratic time",
	},
];

/**
 * Get tag definition by ID
 */
export function getTagDefinition(tagId: Tag): TagDefinition | undefined {
	return TAG_DEFINITIONS.find((t) => t.id === tagId);
}

/**
 * Get all tags in a category
 */
export function getTagsByCategory(
	category: (typeof TAG_CATEGORIES)[keyof typeof TAG_CATEGORIES],
): TagDefinition[] {
	return TAG_DEFINITIONS.filter((t) => t.category === category);
}

/**
 * Get color for a tag
 */
export function getTagColor(tagId: Tag): string {
	const def = getTagDefinition(tagId);
	return def?.color || "gray";
}
