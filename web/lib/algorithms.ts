// Algorithm metadata registry
// All algorithms with rich learning content

import type { AlgorithmMetadata } from "./types";
import { TAGS } from "./tags";

export const ALGORITHMS: Record<string, AlgorithmMetadata> = {
	// ==================== SORTING ALGORITHMS ====================

	bubble_sort: {
		id: "bubble_sort",
		name: "Bubble Sort",
		category: "sorting",
		difficulty: "easy",
		tags: [TAGS.COMPARISON_BASED, TAGS.STABLE, TAGS.IN_PLACE, TAGS.O_N_SQUARED, TAGS.FOUNDATIONAL],
		complexity: {
			time: {
				best: "O(n)",
				average: "O(n²)",
				worst: "O(n²)",
			},
			space: "O(1)",
			explanation:
				"Best case O(n) when array is already sorted (with optimization). Average and worst cases are O(n²) due to nested loops. Space is O(1) as it sorts in-place.",
		},
		description:
			"Simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they're in the wrong order.",
		howItWorks:
			"Bubble sort works by repeatedly passing through the array, comparing each pair of adjacent items and swapping them if they are in the wrong order. After each pass, the largest unsorted element 'bubbles up' to its correct position at the end of the array. The process repeats until no swaps are needed, indicating the array is sorted.",
		keyInsights: [
			"The name comes from how larger elements 'bubble' to the end of the array",
			"Each pass guarantees at least one element is in its final position",
			"Can be optimized to stop early if no swaps occur in a pass",
			"Stable sort - maintains relative order of equal elements",
		],
		edgeCases: [
			{
				name: "Already sorted array",
				description: "Best case - O(n) with early termination optimization",
				input: [1, 2, 3, 4, 5],
			},
			{
				name: "Reverse sorted array",
				description: "Worst case - O(n²) with maximum swaps",
				input: [5, 4, 3, 2, 1],
			},
			{
				name: "All duplicates",
				description: "No swaps needed, terminates quickly",
				input: [5, 5, 5, 5, 5],
			},
			{
				name: "Single element",
				description: "Already sorted, returns immediately",
				input: [42],
			},
		],
		whenToUse: [
			"Educational purposes - great for teaching sorting concepts",
			"Small datasets where simplicity matters more than performance",
			"Nearly sorted data (with optimization)",
			"When stable sorting is required and dataset is small",
		],
		interviewTips: [
			"Mention the early termination optimization for already-sorted arrays",
			"Discuss stability - bubble sort maintains relative order of equal elements",
			"Compare with other O(n²) sorts: insertion sort is usually faster in practice",
			"Know that it's rarely used in production due to poor performance on large datasets",
		],
		prerequisites: [],
		relatedAlgorithms: ["insertion_sort", "selection_sort", "quick_sort", "merge_sort"],
		visualizationType: "array",
		path: "/algorithms/sorting/bubble-sort",
		pythonModule: "sorting.bubble_sort",
	},

	quick_sort: {
		id: "quick_sort",
		name: "Quick Sort",
		category: "sorting",
		difficulty: "medium",
		tags: [
			TAGS.DIVIDE_AND_CONQUER,
			TAGS.IN_PLACE,
			TAGS.COMPARISON_BASED,
			TAGS.O_N_LOG_N,
			TAGS.INTERVIEW_FAVORITE,
		],
		complexity: {
			time: {
				best: "O(n log n)",
				average: "O(n log n)",
				worst: "O(n²)",
			},
			space: "O(log n)",
			explanation:
				"Average case O(n log n) with balanced partitions. Worst case O(n²) occurs with poor pivot selection (already sorted with first/last pivot). Space is O(log n) for recursion stack.",
		},
		description:
			"Efficient divide-and-conquer sorting algorithm that picks a pivot, partitions the array around it, and recursively sorts the subarrays.",
		howItWorks:
			"Quick sort selects a 'pivot' element and partitions the array so that elements less than the pivot are on the left, and elements greater are on the right. It then recursively applies this process to the left and right subarrays. The choice of pivot greatly affects performance.",
		keyInsights: [
			"Unlike merge sort, quick sort does the heavy lifting during partitioning, not merging",
			"Pivot selection strategy dramatically affects performance",
			"In-place sorting with excellent cache locality",
			"Average case is faster than merge sort in practice despite same Big-O",
		],
		edgeCases: [
			{
				name: "Already sorted (bad pivot)",
				description: "Worst case O(n²) if using first/last element as pivot",
				input: [1, 2, 3, 4, 5, 6, 7, 8],
			},
			{
				name: "All equal elements",
				description: "Can cause poor partitioning, but 3-way partition handles well",
				input: [5, 5, 5, 5, 5],
			},
			{
				name: "Two distinct values",
				description: "Tests partition handling of duplicates",
				input: [1, 2, 1, 2, 1, 2],
			},
		],
		whenToUse: [
			"General-purpose sorting for large datasets",
			"When average-case performance matters more than worst-case guarantees",
			"Memory is limited (in-place sorting)",
			"Built-in sort in many languages (C's qsort, Java's Arrays.sort for primitives)",
		],
		interviewTips: [
			"Discuss pivot selection strategies: first, last, middle, random, median-of-three",
			"Explain why it's O(n²) worst case and how to mitigate (randomized pivot)",
			"Mention 3-way partitioning for handling duplicates efficiently",
			"Compare with merge sort: quick sort is in-place but not stable",
		],
		prerequisites: ["bubble_sort"],
		relatedAlgorithms: ["merge_sort", "heap_sort", "insertion_sort"],
		visualizationType: "array",
		path: "/algorithms/sorting/quick-sort",
		pythonModule: "sorting.quick_sort",
	},

	merge_sort: {
		id: "merge_sort",
		name: "Merge Sort",
		category: "sorting",
		difficulty: "medium",
		tags: [
			TAGS.DIVIDE_AND_CONQUER,
			TAGS.STABLE,
			TAGS.COMPARISON_BASED,
			TAGS.O_N_LOG_N,
			TAGS.REAL_WORLD,
		],
		complexity: {
			time: {
				best: "O(n log n)",
				average: "O(n log n)",
				worst: "O(n log n)",
			},
			space: "O(n)",
			explanation:
				"Guaranteed O(n log n) in all cases due to balanced divide-and-conquer. Requires O(n) extra space for temporary arrays during merging.",
		},
		description:
			"Stable divide-and-conquer sorting algorithm that recursively divides the array into halves, sorts them, and merges the sorted halves back together.",
		howItWorks:
			"Merge sort divides the array into two halves, recursively sorts each half, then merges the two sorted halves into a single sorted array. The merge operation compares elements from both halves and places them in order, guaranteeing O(n log n) performance.",
		keyInsights: [
			"Guaranteed O(n log n) performance regardless of input - no worst case degradation",
			"Stable sort - preserves relative order of equal elements",
			"Predictable performance makes it ideal for external sorting (disk-based)",
			"Used in Java's Arrays.sort() for objects and Python's sorted()",
		],
		edgeCases: [
			{
				name: "Already sorted",
				description: "Still O(n log n) - no optimization for sorted input",
				input: [1, 2, 3, 4, 5],
			},
			{
				name: "Reverse sorted",
				description: "Still O(n log n) - consistent performance",
				input: [5, 4, 3, 2, 1],
			},
		],
		whenToUse: [
			"When guaranteed O(n log n) performance is required",
			"Sorting linked lists (can be done in-place with O(1) space)",
			"External sorting (sorting data that doesn't fit in memory)",
			"When stable sorting is required",
		],
		interviewTips: [
			"Emphasize guaranteed O(n log n) vs quick sort's O(n²) worst case",
			"Discuss space trade-off: O(n) extra space vs quick sort's O(log n)",
			"Mention stability advantage over quick sort",
			"Can be optimized for linked lists to use O(1) space",
		],
		prerequisites: ["bubble_sort"],
		relatedAlgorithms: ["quick_sort", "heap_sort"],
		visualizationType: "array",
		path: "/algorithms/sorting/merge-sort",
		pythonModule: "sorting.merge_sort",
	},

	insertion_sort: {
		id: "insertion_sort",
		name: "Insertion Sort",
		category: "sorting",
		difficulty: "easy",
		tags: [TAGS.COMPARISON_BASED, TAGS.STABLE, TAGS.IN_PLACE, TAGS.O_N_SQUARED, TAGS.FOUNDATIONAL],
		complexity: {
			time: {
				best: "O(n)",
				average: "O(n²)",
				worst: "O(n²)",
			},
			space: "O(1)",
			explanation:
				"Best case O(n) when array is already sorted. Average and worst O(n²). Very efficient for small or nearly-sorted arrays. Space is O(1) as it sorts in-place.",
		},
		description:
			"Simple sorting algorithm that builds the final sorted array one item at a time by inserting each element into its correct position.",
		howItWorks:
			"Insertion sort iterates through the array, taking one element at a time and inserting it into its correct position in the already-sorted portion. Like sorting playing cards in your hand - you pick up one card at a time and insert it where it belongs.",
		keyInsights: [
			"Efficient for small datasets and nearly-sorted data",
			"Online algorithm - can sort data as it arrives",
			"Adaptive - performance improves with partially sorted input",
			"Used as base case in Timsort (Python's sort) for small subarrays",
		],
		edgeCases: [
			{
				name: "Already sorted",
				description: "Best case O(n) - each element already in place",
				input: [1, 2, 3, 4, 5],
			},
			{
				name: "Reverse sorted",
				description: "Worst case O(n²) - maximum shifts needed",
				input: [5, 4, 3, 2, 1],
			},
		],
		whenToUse: [
			"Small datasets (typically n < 10-20)",
			"Nearly sorted data",
			"Online sorting (data arrives over time)",
			"As a base case in hybrid algorithms like Timsort",
		],
		interviewTips: [
			"Emphasize efficiency on small and nearly-sorted arrays",
			"Mention use in Timsort (Python/Java) for small subarrays",
			"Discuss adaptive behavior - faster on partially sorted input",
			"Compare with bubble sort: insertion sort is generally faster",
		],
		prerequisites: [],
		relatedAlgorithms: ["bubble_sort", "selection_sort"],
		visualizationType: "array",
		path: "/algorithms/sorting/insertion-sort",
		pythonModule: "sorting.insertion_sort",
	},

	selection_sort: {
		id: "selection_sort",
		name: "Selection Sort",
		category: "sorting",
		difficulty: "easy",
		tags: [TAGS.COMPARISON_BASED, TAGS.IN_PLACE, TAGS.O_N_SQUARED, TAGS.FOUNDATIONAL],
		complexity: {
			time: {
				best: "O(n²)",
				average: "O(n²)",
				worst: "O(n²)",
			},
			space: "O(1)",
			explanation:
				"Always O(n²) regardless of input due to unconditional nested loops. Makes fewer swaps than bubble sort (exactly n-1). Space is O(1) as it sorts in-place.",
		},
		description:
			"Simple sorting algorithm that repeatedly finds the minimum element from the unsorted portion and places it at the beginning.",
		howItWorks:
			"Selection sort divides the array into sorted and unsorted portions. It repeatedly selects the smallest element from the unsorted portion and swaps it with the first unsorted element, growing the sorted portion by one.",
		keyInsights: [
			"Minimizes number of swaps - exactly n-1 swaps",
			"Not adaptive - always O(n²) even on sorted input",
			"Not stable - may change relative order of equal elements",
			"Useful when writes (swaps) are expensive",
		],
		edgeCases: [
			{
				name: "Already sorted",
				description: "Still O(n²) - no optimization for sorted input",
				input: [1, 2, 3, 4, 5],
			},
			{
				name: "All duplicates",
				description: "Still performs all comparisons",
				input: [5, 5, 5, 5, 5],
			},
		],
		whenToUse: [
			"When number of writes/swaps must be minimized",
			"Small datasets where simplicity matters",
			"Memory is extremely limited",
			"Educational purposes",
		],
		interviewTips: [
			"Emphasize minimal swaps (exactly n-1)",
			"Mention lack of adaptivity - always O(n²)",
			"Compare with insertion sort: insertion is usually better",
			"Not stable unlike bubble and insertion sort",
		],
		prerequisites: [],
		relatedAlgorithms: ["bubble_sort", "insertion_sort"],
		visualizationType: "array",
		path: "/algorithms/sorting/selection-sort",
		pythonModule: "sorting.selection_sort",
	},

	heap_sort: {
		id: "heap_sort",
		name: "Heap Sort",
		category: "sorting",
		difficulty: "medium",
		tags: [TAGS.COMPARISON_BASED, TAGS.IN_PLACE, TAGS.O_N_LOG_N, TAGS.REAL_WORLD],
		complexity: {
			time: {
				best: "O(n log n)",
				average: "O(n log n)",
				worst: "O(n log n)",
			},
			space: "O(1)",
			explanation:
				"Guaranteed O(n log n) in all cases. Builds a heap in O(n), then extracts max n times at O(log n) each. In-place with O(1) extra space.",
		},
		description:
			"Efficient comparison-based sorting algorithm that uses a binary heap data structure to sort in-place with guaranteed O(n log n) performance.",
		howItWorks:
			"Heap sort first builds a max heap from the input data, then repeatedly extracts the maximum element (root) and places it at the end of the array, rebuilding the heap with the remaining elements.",
		keyInsights: [
			"Combines best of merge sort (O(n log n) guarantee) and quick sort (in-place)",
			"Not stable - relative order of equal elements may change",
			"Poor cache locality compared to quick sort",
			"Foundation for priority queues",
		],
		whenToUse: [
			"When guaranteed O(n log n) and O(1) space are both required",
			"Embedded systems with limited memory",
			"As part of priority queue implementation",
			"When worst-case performance matters more than average case",
		],
		interviewTips: [
			"Explain heap structure and max heap property",
			"Discuss heapify operation and building heap in O(n)",
			"Compare with quick sort and merge sort",
			"Mention use in priority queues",
		],
		prerequisites: [],
		relatedAlgorithms: ["quick_sort", "merge_sort"],
		usesDataStructures: ["heap"],
		visualizationType: "array",
		path: "/algorithms/sorting/heap-sort",
		pythonModule: "sorting.heap_sort",
	},

	// ==================== GRAPH ALGORITHMS ====================

	bfs: {
		id: "bfs",
		name: "Breadth-First Search (BFS)",
		category: "graphs",
		difficulty: "medium",
		tags: [TAGS.FOUNDATIONAL, TAGS.INTERVIEW_FAVORITE, TAGS.REAL_WORLD, "queue-based"],
		complexity: {
			time: {
				best: "O(V + E)",
				average: "O(V + E)",
				worst: "O(V + E)",
			},
			space: "O(V)",
			explanation:
				"Visits each vertex once and each edge once, giving O(V + E). Space is O(V) for the queue and visited set in worst case.",
		},
		description:
			"Graph traversal algorithm that explores all neighbors at the current depth before moving to nodes at the next depth level.",
		howItWorks:
			"BFS starts at a source node and explores all neighbors at distance k before exploring neighbors at distance k+1. Uses a queue to track nodes to visit, ensuring level-by-level exploration.",
		keyInsights: [
			"Finds shortest path in unweighted graphs",
			"Level-order traversal - visits nodes layer by layer",
			"Uses queue (FIFO) vs DFS's stack (LIFO)",
			"Guarantees shortest path in terms of number of edges",
		],
		whenToUse: [
			"Finding shortest path in unweighted graphs",
			"Level-order traversal of trees",
			"Finding connected components",
			"Web crawling, social network friend suggestions",
		],
		interviewTips: [
			"Emphasize shortest path property in unweighted graphs",
			"Compare with DFS: BFS for shortest path, DFS for exploration",
			"Discuss space trade-off: BFS uses more space than DFS",
			"Mention applications: GPS navigation, social networks",
		],
		prerequisites: [],
		relatedAlgorithms: ["dfs", "dijkstra"],
		usesDataStructures: ["queue", "hash-set"],
		visualizationType: "graph",
		path: "/algorithms/graphs/bfs",
		pythonModule: "graphs.traversal.bfs",
	},

	dfs: {
		id: "dfs",
		name: "Depth-First Search (DFS)",
		category: "graphs",
		difficulty: "medium",
		tags: [TAGS.FOUNDATIONAL, TAGS.INTERVIEW_FAVORITE, TAGS.RECURSIVE, "stack-based"],
		complexity: {
			time: {
				best: "O(V + E)",
				average: "O(V + E)",
				worst: "O(V + E)",
			},
			space: "O(V)",
			explanation:
				"Visits each vertex once and each edge once. Space is O(V) for recursion stack or explicit stack in worst case (linear graph).",
		},
		description:
			"Graph traversal algorithm that explores as far as possible along each branch before backtracking.",
		howItWorks:
			"DFS starts at a node and explores as deep as possible along each branch before backtracking. Can be implemented recursively (implicit stack) or iteratively (explicit stack).",
		keyInsights: [
			"Explores one path completely before trying alternatives",
			"Uses stack (explicit or implicit via recursion)",
			"Better for topological sorting and cycle detection",
			"Uses less memory than BFS in wide graphs",
		],
		whenToUse: [
			"Detecting cycles in graphs",
			"Topological sorting",
			"Finding connected components",
			"Maze solving, puzzle solving",
		],
		interviewTips: [
			"Discuss both recursive and iterative implementations",
			"Compare with BFS: DFS for cycle detection, BFS for shortest path",
			"Mention pre-order, in-order, post-order traversals for trees",
			"Applications: maze solving, puzzle games, topological sort",
		],
		prerequisites: [],
		relatedAlgorithms: ["bfs"],
		usesDataStructures: ["stack", "hash-set"],
		visualizationType: "graph",
		path: "/algorithms/graphs/dfs",
		pythonModule: "graphs.traversal.dfs",
	},

	dijkstra: {
		id: "dijkstra",
		name: "Dijkstra's Algorithm",
		category: "graphs",
		difficulty: "medium",
		tags: [TAGS.GREEDY, TAGS.INTERVIEW_FAVORITE, TAGS.REAL_WORLD, "shortest-path"],
		complexity: {
			time: {
				best: "O((V + E) log V)",
				average: "O((V + E) log V)",
				worst: "O((V + E) log V)",
			},
			space: "O(V)",
			explanation:
				"With binary heap priority queue: O((V + E) log V). Each vertex is extracted once (V log V), and each edge is relaxed once (E log V). Space is O(V) for distances and priority queue.",
		},
		description:
			"Greedy algorithm that finds the shortest path from a source node to all other nodes in a weighted graph with non-negative edge weights.",
		howItWorks:
			"Dijkstra's algorithm maintains a set of nodes whose shortest distance from source is known. It repeatedly selects the unvisited node with smallest tentative distance, marks it as visited, and updates distances to its neighbors.",
		keyInsights: [
			"Greedy approach - always picks closest unvisited node",
			"Only works with non-negative edge weights",
			"Priority queue is crucial for efficiency",
			"Generalizes BFS to weighted graphs",
		],
		whenToUse: [
			"Shortest path in weighted graphs (non-negative weights)",
			"GPS navigation and routing",
			"Network routing protocols (OSPF)",
			"Game AI pathfinding with uniform costs",
		],
		interviewTips: [
			"Emphasize non-negative weight requirement",
			"Discuss priority queue implementation choices",
			"Compare with Bellman-Ford (handles negative weights but slower)",
			"Real-world application: Google Maps, network routing",
		],
		prerequisites: ["bfs"],
		relatedAlgorithms: ["bfs", "bellman-ford", "a-star"],
		usesDataStructures: ["priority-queue", "hash-map"],
		visualizationType: "graph",
		path: "/algorithms/graphs/dijkstra",
		pythonModule: "graphs.shortest_path.dijkstra",
	},

	num_islands: {
		id: "num_islands",
		name: "Number of Islands",
		category: "graphs",
		difficulty: "medium",
		tags: [TAGS.INTERVIEW_FAVORITE, "graph-problem", "connected-components"],
		complexity: {
			time: {
				best: "O(m × n)",
				average: "O(m × n)",
				worst: "O(m × n)",
			},
			space: "O(m × n)",
			explanation:
				"Must visit each cell once. Space is O(m × n) for recursion stack in worst case (all land cells connected).",
		},
		description:
			"Classic graph problem that counts the number of connected components (islands) in a 2D grid using BFS or DFS.",
		howItWorks:
			"Treats the 2D grid as a graph where each land cell is a node connected to adjacent land cells. Performs DFS/BFS from each unvisited land cell, marking all connected cells as visited. Each DFS/BFS call represents one island.",
		keyInsights: [
			"Converts 2D grid problem to graph problem",
			"DFS and BFS both work - DFS is more concise",
			"Visited tracking prevents counting same island twice",
			"Can modify input for O(1) space if allowed",
		],
		whenToUse: [
			"Technical interviews (very common problem)",
			"Image processing (connected components)",
			"Game development (region detection)",
			"Geographic information systems",
		],
		interviewTips: [
			"Discuss both DFS and BFS solutions",
			"Mention space optimization by modifying input",
			"Consider edge cases: all water, all land, empty grid",
			"Variations: max island area, perimeter, distinct islands",
		],
		prerequisites: ["bfs", "dfs"],
		relatedAlgorithms: ["bfs", "dfs"],
		visualizationType: "grid",
		path: "/algorithms/graphs/num-islands",
		pythonModule: "graphs.problems.num_islands",
	},

	// ==================== SEARCH ALGORITHMS ====================

	binary_search: {
		id: "binary_search",
		name: "Binary Search",
		category: "searching",
		difficulty: "easy",
		tags: [TAGS.DIVIDE_AND_CONQUER, TAGS.FOUNDATIONAL, TAGS.INTERVIEW_FAVORITE, TAGS.O_LOG_N],
		complexity: {
			time: {
				best: "O(1)",
				average: "O(log n)",
				worst: "O(log n)",
			},
			space: "O(1)",
			explanation:
				"Best case O(1) if target is at middle. Average and worst O(log n) as search space halves each iteration. Iterative version uses O(1) space.",
		},
		description:
			"Efficient search algorithm that finds the position of a target value in a sorted array by repeatedly dividing the search interval in half.",
		howItWorks:
			"Binary search compares the target value to the middle element of the array. If they match, return the position. If target is smaller, search the left half; if larger, search the right half. Repeat until found or search space is empty.",
		keyInsights: [
			"Requires sorted input - preprocessing cost matters",
			"Logarithmic time means incredibly efficient: 1B elements in ~30 comparisons",
			"Foundation for many algorithms and data structures",
			"Can be adapted to find first/last occurrence, insertion point",
		],
		whenToUse: [
			"Searching in sorted arrays",
			"Finding insertion point for maintaining sorted order",
			"Implementing lower_bound/upper_bound operations",
			"As subroutine in more complex algorithms",
		],
		interviewTips: [
			"Handle edge cases: empty array, element not found, duplicates",
			"Discuss integer overflow: use mid = left + (right - left) / 2",
			"Mention variations: find first/last, rotated array search",
			"Compare with linear search: when is binary search worth it?",
		],
		prerequisites: [],
		relatedAlgorithms: ["linear_search"],
		visualizationType: "array",
		path: "/algorithms/search/binary-search",
		pythonModule: "searching.binary_search",
	},

	linear_search: {
		id: "linear_search",
		name: "Linear Search",
		category: "searching",
		difficulty: "easy",
		tags: [TAGS.FOUNDATIONAL, TAGS.O_N],
		complexity: {
			time: {
				best: "O(1)",
				average: "O(n)",
				worst: "O(n)",
			},
			space: "O(1)",
			explanation:
				"Best case O(1) if target is first element. Average and worst O(n) as may need to check all elements. Space is O(1).",
		},
		description:
			"Simple sequential search algorithm that checks each element in order until the target is found or the end is reached.",
		howItWorks:
			"Linear search iterates through the array from start to end, comparing each element with the target. Returns the index if found, or indicates not found if the end is reached.",
		keyInsights: [
			"Only search algorithm that works on unsorted data",
			"Simple to implement and understand",
			"No preprocessing required unlike binary search",
			"Optimal when array is small or rarely searched",
		],
		whenToUse: [
			"Unsorted data",
			"Small datasets (n < 100)",
			"One-time searches (no preprocessing benefit)",
			"Linked lists (random access not available)",
		],
		interviewTips: [
			"Mention when linear is better than binary: unsorted data, small n",
			"Discuss trade-offs: O(n) search vs O(n log n) sort + O(log n) search",
			"Simple baseline for comparison",
		],
		prerequisites: [],
		relatedAlgorithms: ["binary_search"],
		visualizationType: "array",
		path: "/algorithms/search/linear-search",
		pythonModule: "searching.linear_search",
	},

	// ==================== TREE ALGORITHMS ====================

	bst_insert: {
		id: "bst_insert",
		name: "BST Insert",
		category: "trees",
		difficulty: "medium",
		tags: [TAGS.FOUNDATIONAL, TAGS.RECURSIVE, "binary-search-tree"],
		complexity: {
			time: {
				best: "O(log n)",
				average: "O(log n)",
				worst: "O(n)",
			},
			space: "O(log n)",
			explanation:
				"Average O(log n) for balanced tree. Worst O(n) for skewed tree (degenerates to linked list). Space is O(log n) for recursion stack.",
		},
		description:
			"Inserts a new value into a Binary Search Tree while maintaining the BST property (left < parent < right).",
		howItWorks:
			"Starting from root, compare new value with current node. If smaller, go left; if larger, go right. When reaching null, insert new node there. BST property ensures efficient search and insertion.",
		keyInsights: [
			"BST property: all left descendants < node < all right descendants",
			"No rebalancing - may create skewed tree",
			"Recursive and iterative implementations both work well",
			"Foundation for balanced trees like AVL and Red-Black",
		],
		whenToUse: [
			"Maintaining sorted data with dynamic insertions",
			"When search, insert, and delete are all needed",
			"Building BST from scratch",
			"As foundation before learning balanced trees",
		],
		interviewTips: [
			"Discuss both recursive and iterative approaches",
			"Mention worst case O(n) and need for balancing",
			"BST vs sorted array: BST has O(log n) insert vs O(n)",
			"Compare with AVL/Red-Black trees",
		],
		prerequisites: [],
		relatedAlgorithms: ["bst-search", "bst-delete"],
		visualizationType: "tree",
		path: "/algorithms/trees/bst-insert",
		pythonModule: "trees.operations.bst_insert",
	},

	bst_search: {
		id: "bst_search",
		name: "BST Search",
		category: "trees",
		difficulty: "medium",
		tags: [TAGS.FOUNDATIONAL, TAGS.RECURSIVE, "binary-search-tree"],
		complexity: {
			time: {
				best: "O(1)",
				average: "O(log n)",
				worst: "O(n)",
			},
			space: "O(log n)",
			explanation:
				"Best O(1) if target is root. Average O(log n) for balanced tree. Worst O(n) for skewed tree. Space is O(log n) for recursion.",
		},
		description:
			"Searches for a value in a Binary Search Tree by leveraging the BST property to efficiently navigate the tree.",
		howItWorks:
			"Compare target with current node. If equal, found. If target is smaller, search left subtree; if larger, search right subtree. BST property eliminates half the tree at each step.",
		keyInsights: [
			"Similar to binary search but on a tree structure",
			"Efficient due to BST property - like binary search in array",
			"No need to visit all nodes unlike unsorted tree",
			"Average case much better than worst case",
		],
		whenToUse: [
			"Searching in dynamically changing sorted data",
			"When tree is reasonably balanced",
			"Dictionary/map implementations",
			"Priority queues with search capability",
		],
		interviewTips: [
			"Explain how BST property enables O(log n) search",
			"Discuss degenerate case (linked list)",
			"Compare with hash table: BST provides ordering",
			"Mention self-balancing trees for guaranteed performance",
		],
		prerequisites: [],
		relatedAlgorithms: ["bst-insert", "binary-search"],
		visualizationType: "tree",
		path: "/algorithms/trees/bst-search",
		pythonModule: "trees.operations.bst_search",
	},

	tree_traversals: {
		id: "tree_traversals",
		name: "Tree Traversals",
		category: "trees",
		difficulty: "easy",
		tags: [TAGS.FOUNDATIONAL, TAGS.RECURSIVE, "traversal"],
		complexity: {
			time: {
				best: "O(n)",
				average: "O(n)",
				worst: "O(n)",
			},
			space: "O(h)",
			explanation:
				"Must visit each node once, giving O(n). Space is O(h) for recursion stack where h is height (O(log n) balanced, O(n) skewed).",
		},
		description:
			"Three fundamental ways to traverse a binary tree: in-order (left-root-right), pre-order (root-left-right), and post-order (left-right-root).",
		howItWorks:
			"Tree traversals define the order in which nodes are visited. In-order visits left subtree, then root, then right. Pre-order visits root first, then subtrees. Post-order visits subtrees before root. Each is useful for different applications.",
		keyInsights: [
			"In-order gives sorted sequence for BST",
			"Pre-order useful for copying tree or serialization",
			"Post-order useful for tree deletion or evaluation",
			"Level-order (BFS) visits nodes level by level",
		],
		whenToUse: [
			"In-order: printing BST in sorted order, expression evaluation",
			"Pre-order: copying tree, serialization, prefix expressions",
			"Post-order: deleting tree, postfix expressions",
			"Level-order: BFS, finding shortest path",
		],
		interviewTips: [
			"Know all three traversals and their applications",
			"Discuss iterative implementations using stack/queue",
			"Morris traversal for O(1) space",
			"Mention relationship with expression evaluation",
		],
		prerequisites: [],
		relatedAlgorithms: ["bfs", "dfs"],
		visualizationType: "tree",
		path: "/algorithms/trees/traversals",
		pythonModule: "trees.traversal.tree_traversals",
	},

	// ==================== DYNAMIC PROGRAMMING ====================

	fibonacci_memo: {
		id: "fibonacci_memo",
		name: "Fibonacci (Memoization)",
		category: "dynamic_programming",
		difficulty: "easy",
		tags: [TAGS.MEMOIZATION, TAGS.RECURSIVE, TAGS.FOUNDATIONAL, "top-down"],
		complexity: {
			time: {
				best: "O(n)",
				average: "O(n)",
				worst: "O(n)",
			},
			space: "O(n)",
			explanation:
				"Each Fibonacci number computed once and cached, giving O(n). Space is O(n) for cache plus O(n) recursion stack.",
		},
		description:
			"Computes Fibonacci numbers using top-down dynamic programming with memoization to cache previously computed values.",
		howItWorks:
			"Recursive approach with caching. When computing fib(n), first check cache. If not found, recursively compute fib(n-1) and fib(n-2), store result in cache, and return. Avoids exponential redundant computation.",
		keyInsights: [
			"Top-down DP: start from problem, recurse to subproblems",
			"Memoization = recursion + caching",
			"Transforms O(2^n) naive recursion to O(n)",
			"Natural recursive structure makes it intuitive",
		],
		whenToUse: [
			"Learning DP fundamentals",
			"Problems with natural recursive structure",
			"When not all subproblems need solving",
			"Easier to write than tabulation for some problems",
		],
		interviewTips: [
			"Compare with naive O(2^n) recursion",
			"Discuss memoization vs tabulation trade-offs",
			"Mention space optimization: only need last 2 values",
			"Foundation for understanding DP",
		],
		prerequisites: [],
		relatedAlgorithms: ["fibonacci_tab"],
		visualizationType: "array",
		path: "/algorithms/dynamic-programming/fibonacci-memoization",
		pythonModule: "dynamic_programming.fibonacci_memoization",
	},

	fibonacci_tab: {
		id: "fibonacci_tab",
		name: "Fibonacci (Tabulation)",
		category: "dynamic_programming",
		difficulty: "easy",
		tags: [TAGS.TABULATION, TAGS.ITERATIVE, TAGS.FOUNDATIONAL, "bottom-up"],
		complexity: {
			time: {
				best: "O(n)",
				average: "O(n)",
				worst: "O(n)",
			},
			space: "O(n)",
			explanation:
				"Iterates from 0 to n, computing each value once. Space is O(n) for DP table (can be optimized to O(1)).",
		},
		description:
			"Computes Fibonacci numbers using bottom-up dynamic programming, building the solution iteratively from base cases.",
		howItWorks:
			"Iterative approach that builds solutions from smallest to largest. Initialize base cases fib(0)=0, fib(1)=1. For each i from 2 to n, compute fib(i) = fib(i-1) + fib(i-2). No recursion needed.",
		keyInsights: [
			"Bottom-up DP: start from base cases, build up to solution",
			"Tabulation = iteration + table",
			"No recursion overhead, better space constants",
			"Easier to optimize space (rolling array)",
		],
		whenToUse: [
			"When all subproblems must be solved anyway",
			"To avoid recursion stack overflow",
			"When space optimization is priority",
			"Production code (more predictable than recursion)",
		],
		interviewTips: [
			"Discuss space optimization to O(1) using two variables",
			"Compare with memoization: tabulation often faster in practice",
			"Mention no stack overflow risk",
			"Show both O(n) space and O(1) space versions",
		],
		prerequisites: [],
		relatedAlgorithms: ["fibonacci_memo"],
		visualizationType: "array",
		path: "/algorithms/dynamic-programming/fibonacci-tabulation",
		pythonModule: "dynamic_programming.fibonacci_tabulation",
	},

	knapsack: {
		id: "knapsack",
		name: "0/1 Knapsack",
		category: "dynamic_programming",
		difficulty: "medium",
		tags: [TAGS.TABULATION, TAGS.INTERVIEW_FAVORITE, TAGS.REAL_WORLD, "optimization"],
		complexity: {
			time: {
				best: "O(n × W)",
				average: "O(n × W)",
				worst: "O(n × W)",
			},
			space: "O(n × W)",
			explanation:
				"Fills a 2D DP table of size n × W where n is number of items and W is capacity. Can be optimized to O(W) space using 1D array.",
		},
		description:
			"Classic DP problem that maximizes value of items in a knapsack with limited capacity, where each item can be taken at most once.",
		howItWorks:
			"Build 2D DP table where dp[i][w] represents max value using first i items with capacity w. For each item, decide: include it (if it fits) or exclude it. Take maximum of both choices.",
		keyInsights: [
			"Classic DP problem demonstrating optimal substructure",
			"Each item has include/exclude choice",
			"2D table can be optimized to 1D",
			"Foundation for many resource allocation problems",
		],
		whenToUse: [
			"Resource allocation with constraints",
			"Budget optimization",
			"Investment portfolio selection",
			"Memory/disk space optimization",
		],
		interviewTips: [
			"Start with recursive solution, then memoization, then tabulation",
			"Discuss space optimization to 1D array",
			"Explain why greedy doesn't work",
			"Mention variations: fractional knapsack, unbounded knapsack",
		],
		prerequisites: ["fibonacci_tab"],
		relatedAlgorithms: ["fibonacci_tab"],
		visualizationType: "grid",
		path: "/algorithms/dynamic-programming/knapsack",
		pythonModule: "dynamic_programming.knapsack",
	},

	lcs: {
		id: "lcs",
		name: "Longest Common Subsequence",
		category: "dynamic_programming",
		difficulty: "medium",
		tags: [TAGS.TABULATION, TAGS.INTERVIEW_FAVORITE, "string-matching"],
		complexity: {
			time: {
				best: "O(m × n)",
				average: "O(m × n)",
				worst: "O(m × n)",
			},
			space: "O(m × n)",
			explanation:
				"Fills 2D DP table of size m × n where m and n are string lengths. Can be optimized to O(min(m,n)) space.",
		},
		description:
			"Finds the longest subsequence common to two strings using 2D dynamic programming.",
		howItWorks:
			"Build 2D DP table where dp[i][j] represents LCS length of first i characters of string1 and first j characters of string2. If characters match, extend LCS; otherwise, take max of skipping from either string.",
		keyInsights: [
			"Subsequence allows gaps, unlike substring",
			"Classic 2D DP problem",
			"Foundation for diff tools and version control",
			"Can reconstruct actual subsequence by backtracking",
		],
		whenToUse: [
			"Comparing text files (diff, git)",
			"DNA sequence alignment",
			"Plagiarism detection",
			"Version control systems",
		],
		interviewTips: [
			"Explain difference between subsequence and substring",
			"Show how to backtrack to find actual LCS",
			"Discuss space optimization",
			"Mention edit distance as related problem",
		],
		prerequisites: ["fibonacci_tab"],
		relatedAlgorithms: ["knapsack", "edit_distance"],
		visualizationType: "grid",
		path: "/algorithms/dynamic-programming/lcs",
		pythonModule: "dynamic_programming.lcs",
	},
};

/**
 * Get algorithm by ID
 */
export function getAlgorithm(id: string): AlgorithmMetadata | undefined {
	return ALGORITHMS[id];
}

/**
 * Get all algorithms
 */
export function getAllAlgorithms(): AlgorithmMetadata[] {
	return Object.values(ALGORITHMS);
}

/**
 * Get algorithms by category
 */
export function getAlgorithmsByCategory(category: string): AlgorithmMetadata[] {
	return getAllAlgorithms().filter((algo) => algo.category === category);
}

/**
 * Get algorithms by difficulty
 */
export function getAlgorithmsByDifficulty(difficulty: string): AlgorithmMetadata[] {
	return getAllAlgorithms().filter((algo) => algo.difficulty === difficulty);
}

/**
 * Get algorithms by tag
 */
export function getAlgorithmsByTag(tag: string): AlgorithmMetadata[] {
	return getAllAlgorithms().filter((algo) => algo.tags.includes(tag));
}

/**
 * Search algorithms by query (name, description, tags)
 */
export function searchAlgorithms(query: string): AlgorithmMetadata[] {
	const lowerQuery = query.toLowerCase();
	return getAllAlgorithms().filter(
		(algo) =>
			algo.name.toLowerCase().includes(lowerQuery) ||
			algo.description.toLowerCase().includes(lowerQuery) ||
			algo.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
			algo.category.toLowerCase().includes(lowerQuery) ||
			algo.complexity.time.average.toLowerCase().includes(lowerQuery),
	);
}
