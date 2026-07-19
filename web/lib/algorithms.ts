// Algorithm metadata registry
// All algorithms with rich learning content

import { TAGS } from "./tags";
import type { AlgorithmMetadata } from "./types";

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
	kadane: {
		id: "kadane",
		name: "Kadane's Maximum Subarray",
		category: "dynamic_programming",
		difficulty: "medium",
		tags: [
			"dynamic-programming",
			"arrays",
			"greedy",
			"kadane",
			"maximum-subarray",
			"interview-favorite",
			"optimization",
		],
		complexity: {
			time: {
				best: "O(n)",
				average: "O(n)",
				worst: "O(n)",
			},
			space: "O(1)",
			explanation:
				"A single left-to-right pass computes the answer, tracking only a few running scalars (current_sum, best_sum, and window indices), so time is linear and extra space is constant.",
		},
		description:
			"Kadane's algorithm finds the contiguous subarray with the largest sum in an integer array (which may contain negatives) in a single linear pass. It maintains current_sum, the best subarray sum ending at the current index, and resets the window whenever the running sum drops below the current element.",
		howItWorks:
			"Initialize current_sum and best_sum to the first element. For each subsequent element i, set current_sum = max(nums[i], current_sum + nums[i]): if the running prefix has gone negative it can only reduce future sums, so drop it and restart the window at i. Whenever current_sum exceeds best_sum, record best_sum and the window [best_start, best_end]. After one pass, best_sum is the maximum contiguous subarray sum.",
		keyInsights: [
			"current_sum represents the maximum subarray sum that ENDS at the current index i.",
			"A negative running prefix can only hurt future sums, so it is optimal to discard it and start a fresh window at nums[i].",
			"Initialize best_sum to the first element (not 0) so all-negative arrays correctly return the largest single element rather than an empty subarray.",
			"Tracking start/end indices alongside the sum lets you recover the actual subarray, not just its total.",
		],
		edgeCases: [
			{
				name: "All negative numbers",
				description:
					"When every element is negative, the answer is the single largest element; initializing best to the first element (not 0) handles this correctly.",
				input: "[-5, -2, -8, -1]",
			},
			{
				name: "Single element",
				description: "An array with one element returns that element as the maximum subarray sum.",
				input: "[7]",
			},
			{
				name: "Mixed positives and negatives",
				description:
					"The canonical case where the running window resets after negative dips, e.g. the maximum subarray is [4, -1, 2, 1] with sum 6.",
				input: "[-2, 1, -3, 4, -1, 2, 1, -5, 4]",
			},
		],
		whenToUse: [
			"Finding the maximum profit over a contiguous window (e.g. the best run of daily gains).",
			"Any 'largest contiguous sum' subproblem embedded in a larger DP or greedy solution.",
			"The 2D maximum-sum-rectangle problem, which runs Kadane over collapsed column sums.",
			"When you need linear time and constant space instead of an explicit DP table.",
		],
		interviewTips: [
			"Explicitly state the reset rule: current_sum = max(nums[i], current_sum + nums[i]).",
			"Call out the all-negative edge case and why best must start at nums[0], not 0.",
			"If asked to return the subarray itself (not just the sum), track start/end indices as the window updates.",
			"Mention that Kadane is the classic O(1)-space DP and generalizes to the 2D max-rectangle problem.",
		],
		prerequisites: ["arrays", "dynamic-programming"],
		relatedAlgorithms: ["fibonacci_tab", "knapsack", "lcs"],
		visualizationType: "array",
		path: "/algorithms/dynamic-programming/kadane",
		pythonModule: "dynamic_programming.kadane_viz",
	},
	coin_change: {
		id: "coin_change",
		name: "Coin Change",
		category: "dynamic_programming",
		difficulty: "medium",
		tags: [
			"dynamic-programming",
			"bottom-up",
			"tabulation",
			"unbounded-knapsack",
			"optimization",
			"interview-favorite",
		],
		complexity: {
			time: { best: "O(amount * coins)", average: "O(amount * coins)", worst: "O(amount * coins)" },
			space: "O(amount)",
			explanation:
				"A 1D DP table of size (amount + 1) is filled once; for each amount every denomination is tried a single time, giving O(amount * number_of_coins) time and O(amount) space.",
		},
		description:
			"Given a set of coin denominations and a target amount, find the minimum number of coins needed to make that amount (or -1 if it is impossible). Coins may be reused an unlimited number of times, making this a classic unbounded-knapsack dynamic programming problem.",
		howItWorks:
			"Build a 1D table dp where dp[a] is the minimum number of coins to make amount a. Initialize dp[0] = 0 and every other amount as unreachable (infinity, shown as -1). For each amount a from 1 to the target, try every coin c <= a: if dp[a - c] is reachable, then dp[a - c] + 1 is a candidate, and dp[a] keeps the smallest candidate. After filling the table, dp[amount] is the answer, or -1 if it stayed unreachable. The chosen coins can be reconstructed by tracing which coin last improved each cell.",
		keyInsights: [
			"Optimal substructure: dp[a] = 1 + min(dp[a - c]) over all coins c <= a, so the best solution is built from best sub-solutions.",
			"Overlapping subproblems: each dp[a] is reused by every larger amount, which is exactly what makes tabulation efficient.",
			"Greedy (always take the largest coin) can fail — e.g. coins [1,3,4] for amount 6 gives 4+1+1=3 greedily but DP finds 3+3=2.",
			"Iterating amount in the outer loop and coins in the inner loop naturally allows each denomination to be reused an unlimited number of times.",
		],
		edgeCases: [
			{
				name: "Amount is zero",
				description:
					"Making amount 0 always needs 0 coins; dp[0] is the base case and the answer is 0.",
				input: "coins = [1, 2, 5], amount = 0",
			},
			{
				name: "Impossible amount",
				description:
					"When no combination of coins can sum to the target, every candidate stays unreachable and the result is -1.",
				input: "coins = [2], amount = 3",
			},
			{
				name: "Greedy would fail",
				description:
					"Denominations where the largest-coin-first heuristic is not optimal, proving DP is required.",
				input: "coins = [1, 3, 4], amount = 6",
			},
		],
		whenToUse: [
			"Making change with the fewest coins or bills at a register or vending machine",
			"ATM / cash-dispensing systems that must minimize the number of notes handed out",
			"Any 'minimum items to reach a target sum' unbounded-knapsack style optimization",
			"Teaching or interviewing on bottom-up DP over a 1D table",
		],
		interviewTips: [
			"State the recurrence explicitly: dp[a] = min(dp[a - c] + 1) over all coins c <= a, base case dp[0] = 0.",
			"Use amount + 1 (or infinity) as the 'unreachable' sentinel so a real minimum always beats it, then map it back to -1 at the end.",
			"Call out that greedy fails for arbitrary denominations — this is the most common follow-up.",
			"Know the variants: 'coin change II' counts the number of ways instead of the minimum, and the bounded version limits coin counts.",
			"Mention reconstruction (tracking the chosen coin per cell) if asked which coins were used, not just how many.",
		],
		prerequisites: ["fibonacci_tab"],
		relatedAlgorithms: ["fibonacci_tab", "knapsack", "lcs"],
		visualizationType: "array",
		path: "/algorithms/dynamic-programming/coin-change",
		pythonModule: "dynamic_programming.coin_change_viz",
	},
	climbing_stairs: {
		id: "climbing_stairs",
		name: "Climbing Stairs",
		category: "dynamic_programming",
		difficulty: "easy",
		tags: [
			"dynamic-programming",
			"recurrence",
			"fibonacci",
			"counting",
			"bottom-up",
			"interview-favorite",
			"beginner-friendly",
		],
		complexity: {
			time: { best: "O(n)", average: "O(n)", worst: "O(n)" },
			space: "O(n)",
			explanation:
				"Each step's count is computed exactly once by summing the two previous counts, giving linear time. The dp array uses O(n) space, reducible to O(1) by keeping only the last two values.",
		},
		description:
			"Count the number of distinct ways to climb a staircase of n steps when you can take either 1 or 2 steps at a time. It is the Fibonacci recurrence framed as a staircase: ways[i] = ways[i-1] + ways[i-2].",
		howItWorks:
			"Set the base cases ways[0] = 1 (stand still, one way) and ways[1] = 1 (a single 1-step). Then fill the table bottom-up: to reach step i you must have arrived from step i-1 (a 1-step) or step i-2 (a 2-step), so ways[i] = ways[i-1] + ways[i-2]. The answer is ways[n].",
		keyInsights: [
			"This is the Fibonacci sequence in disguise: ways[n] equals Fibonacci(n+1).",
			"Exhibits the two hallmarks of DP: optimal substructure (ways[i] built from smaller subproblems) and overlapping subproblems (each ways[i] reused twice).",
			"Bottom-up tabulation replaces exponential O(2^n) naive recursion with linear O(n) time.",
			"Space can be optimized from O(n) to O(1) by tracking only the previous two counts.",
		],
		edgeCases: [
			{
				name: "Zero steps",
				description:
					"A staircase with no steps has exactly one way to 'climb' it: do nothing. ways[0] = 1.",
				input: "0",
			},
			{
				name: "Single step",
				description: "With one step there is exactly one way: a single 1-step. ways[1] = 1.",
				input: "1",
			},
			{
				name: "Two steps",
				description:
					"First case where the recurrence kicks in: 1+1 or a single 2-step, giving 2 ways.",
				input: "2",
			},
		],
		whenToUse: [
			"As a first introduction to 1D dynamic programming and recurrence relations.",
			"Counting-paths problems where each state depends additively on a few prior states.",
			"Interview warm-ups that lead into harder DP such as coin change, tiling, and grid path counting.",
			"Any decomposition where choices at each stage combine by summing sub-counts.",
		],
		interviewTips: [
			"Recognize immediately that this is Fibonacci shifted by one; state that relationship up front.",
			"Start from the recurrence ways[i] = ways[i-1] + ways[i-2] and nail down the base cases before coding.",
			"Mention the O(1) space optimization (two rolling variables) as a follow-up improvement.",
			"Be ready for the generalization to steps of size 1, 2, or k, where you sum the last k counts.",
		],
		prerequisites: ["fibonacci_tab"],
		relatedAlgorithms: ["fibonacci_tab", "fibonacci_memo", "num_ways_to_make_change"],
		visualizationType: "array",
		path: "/algorithms/dynamic-programming/climbing-stairs",
		pythonModule: "dynamic_programming.climbing_stairs_viz",
	},
	house_robber: {
		id: "house_robber",
		name: "House Robber",
		category: "dynamic_programming",
		difficulty: "medium",
		tags: [
			"dynamic-programming",
			"1d-dp",
			"array",
			"optimization",
			"interview-favorite",
			"bottom-up",
		],
		complexity: {
			time: { best: "O(n)", average: "O(n)", worst: "O(n)" },
			space: "O(n)",
			explanation:
				"One left-to-right pass makes a single O(1) decision per house, so time is linear in the number of houses. The dp table uses O(n) space, which can be reduced to O(1) by keeping only the last two dp values.",
		},
		description:
			"Given a row of houses each holding some money, find the maximum amount you can rob without ever robbing two adjacent houses (adjacent alarms are linked). A classic 1D dynamic programming problem solved with the recurrence dp[i] = max(dp[i-1], dp[i-2] + nums[i]).",
		howItWorks:
			"Set base cases dp[0] = nums[0] and dp[1] = max(nums[0], nums[1]). Then for each house i from 2 onward, choose the better of two mutually exclusive options: SKIP house i and inherit the best-so-far dp[i-1], or ROB house i by taking nums[i] plus dp[i-2] (the best total that skips the immediate neighbor). Record dp[i] = max(dp[i-1], dp[i-2] + nums[i]). The maximum loot is dp[n-1].",
		keyInsights: [
			"Each house reduces to a binary choice: rob it (and skip its neighbor) or skip it.",
			"The 'rob' branch reaches back to dp[i-2], never dp[i-1], because adjacent houses cannot both be taken.",
			"dp[i] represents the optimal loot considering only houses 0..i, giving optimal substructure over overlapping subproblems.",
			"Only the last two dp values are ever needed, so the O(n) table collapses to O(1) space.",
		],
		edgeCases: [
			{
				name: "Empty street",
				description: "No houses to rob, so the maximum loot is 0.",
				input: "[]",
			},
			{
				name: "Single house",
				description:
					"With one house the answer is simply its value; no adjacency constraint applies.",
				input: "[5]",
			},
			{
				name: "Two houses",
				description: "Cannot rob both, so pick the larger of the two.",
				input: "[2, 1]",
			},
		],
		whenToUse: [
			"When maximizing a sum of non-adjacent elements in a sequence.",
			"Scheduling non-overlapping jobs or bookings along a timeline for maximum value.",
			"Selecting items under a 'no two in a row' or cooldown constraint.",
			"As the foundation for related variants like House Robber II (circular street) and House Robber III (binary tree).",
		],
		interviewTips: [
			"State the recurrence dp[i] = max(dp[i-1], dp[i-2] + nums[i]) before coding; it signals you see the rob-vs-skip choice.",
			"Mention you can optimize space from O(n) to O(1) using two rolling variables (prev, prev2).",
			"Handle empty and single-element inputs explicitly to avoid index errors on the base cases.",
			"Be ready to extend to House Robber II by running the linear solution twice: once excluding the first house and once excluding the last, then taking the max.",
		],
		prerequisites: ["fibonacci_tab"],
		relatedAlgorithms: [
			"fibonacci_tab",
			"fibonacci_memo",
			"max_subset_sum_no_adjacent",
			"kadanes_algorithm",
		],
		visualizationType: "array",
		path: "/algorithms/dynamic-programming/house-robber",
		pythonModule: "dynamic_programming.house_robber_viz",
	},
	edit_distance: {
		id: "edit_distance",
		name: "Edit Distance (Levenshtein)",
		category: "dynamic_programming",
		difficulty: "hard",
		tags: [
			"dynamic-programming",
			"strings",
			"grid",
			"2d-dp",
			"interview-favorite",
			"levenshtein",
			"sequence-alignment",
		],
		complexity: {
			time: { best: "O(m × n)", average: "O(m × n)", worst: "O(m × n)" },
			space: "O(m × n)",
			explanation:
				"Fills an (m+1)×(n+1) DP table with one O(1) transition per cell, giving O(m × n) time in all cases. Space is O(m × n) for the full table, reducible to O(min(m, n)) with a rolling one-row array since each cell depends only on the previous row and the current row's left neighbor.",
		},
		description:
			"Compute the minimum number of single-character edits — insertions, deletions, or replacements — needed to transform one string into another. A canonical 2D dynamic programming problem where dp[i][j] is the edit distance between the first i characters of word1 and the first j characters of word2.",
		howItWorks:
			"Build a 2D table where dp[i][j] = edit distance between word1[:i] and word2[:j]. Base cases: dp[i][0] = i (delete i chars) and dp[0][j] = j (insert j chars). For each cell, if word1[i-1] == word2[j-1] the characters match and you inherit the diagonal for free (dp[i][j] = dp[i-1][j-1]); otherwise dp[i][j] = 1 + min(dp[i][j-1] insert, dp[i-1][j] delete, dp[i-1][j-1] replace). The final answer is the bottom-right cell dp[m][n].",
		keyInsights: [
			"Each cell depends only on its left, top, and top-left neighbors — the three edit operations map to insert (left), delete (top), and replace (diagonal).",
			"A matching character is 'free': you inherit the diagonal value with no added cost, which is what makes common substrings cheap.",
			"Only the previous row is ever needed, so the O(m × n) space collapses to O(min(m, n)) with a rolling array.",
			"Backtracking from dp[m][n] through the winning choices reconstructs the actual sequence of edits (the diff), and the metric is symmetric: distance(A, B) == distance(B, A).",
		],
		edgeCases: [
			{
				name: "Identical strings",
				description:
					"When both words are equal, every character matches along the diagonal and the edit distance is 0.",
				input: '{ word1: "apple", word2: "apple" }',
			},
			{
				name: "One empty string",
				description:
					"If a string is empty, the distance equals the length of the other string (pure insertions or deletions) — exercised by the base-case row/column.",
				input: '{ word1: "", word2: "abc" }',
			},
			{
				name: "No characters in common",
				description:
					"When the strings share no characters, the distance is max(m, n): replace the overlapping length then insert/delete the remainder.",
				input: '{ word1: "abc", word2: "xyz" }',
			},
		],
		whenToUse: [
			"Spell checkers and 'did you mean?' suggestions — rank dictionary words by closeness to a misspelling.",
			"DNA, RNA, and protein sequence alignment in bioinformatics.",
			"Diff and merge tools that compute the minimal set of changes between two versions of text.",
			"Fuzzy search, autocomplete, and record deduplication where approximate string matching is required.",
			"Post-processing OCR or speech-recognition output against a known vocabulary.",
		],
		interviewTips: [
			"State the recurrence clearly before coding: match → diagonal, else 1 + min(insert, delete, replace). Interviewers want the transition articulated.",
			"Get the base cases right first — dp[i][0] = i and dp[0][j] = j — since off-by-one errors on the padding row/column are the most common bug.",
			"Mention the O(min(m, n)) space optimization with a rolling array as a follow-up; it's the standard 'can you do better on space?' answer.",
			"Be ready to extend it: weighted operations (different costs per edit) or reconstructing the actual edit sequence via backtracking are frequent follow-ups.",
		],
		prerequisites: ["fibonacci", "lcs"],
		relatedAlgorithms: ["lcs", "knapsack", "fibonacci"],
		visualizationType: "grid",
		path: "/algorithms/dynamic-programming/edit-distance",
		pythonModule: "dynamic_programming.edit_distance_viz",
	},
	unique_paths: {
		id: "unique_paths",
		name: "Unique Paths",
		category: "dynamic_programming",
		difficulty: "medium",
		tags: ["dynamic-programming", "grid", "combinatorics", "2d-dp", "interview-favorite"],
		complexity: {
			time: { best: "O(m*n)", average: "O(m*n)", worst: "O(m*n)" },
			space: "O(m*n)",
			explanation:
				"Each of the m*n grid cells is computed exactly once from its top and left neighbors, giving O(m*n) time. The DP grid uses O(m*n) space, reducible to O(n) with a single rolling row. Naive recursion without memoization is exponential, O(2^(m+n)).",
		},
		description:
			"A robot starts in the top-left corner of an m x n grid and can move only right or down. Unique Paths counts how many distinct routes reach the bottom-right corner, solved with a 2D dynamic-programming table where each cell sums the paths arriving from above and from the left.",
		howItWorks:
			"Build a DP grid where dp[i][j] is the number of unique paths from (0,0) to (i,j). Every cell in the first row and first column has exactly one path (a single straight line along the edge), so they are initialized to 1. For every interior cell, paths can only arrive from directly above or directly to the left, giving the recurrence dp[i][j] = dp[i-1][j] + dp[i][j-1]. Filling the grid top-to-bottom and left-to-right ensures both dependencies are ready before each cell is computed, and the final answer is the bottom-right cell dp[m-1][n-1].",
		keyInsights: [
			"Each cell depends only on its top and left neighbors, so one row-major pass fills the entire grid.",
			"The first row and first column are always 1 because there is exactly one straight-line way to reach any edge cell.",
			"There is a closed-form combinatorial answer: C(m+n-2, m-1), choosing which of the total moves are downward.",
			"Space collapses to O(n) since each row only needs the row directly above it (rolling array).",
		],
		edgeCases: [
			{
				name: "Single row or single column",
				description:
					"A 1 x n or m x 1 grid has exactly one path since the robot can only travel in a straight line.",
				input: "{ rows: 1, cols: 5 }",
			},
			{
				name: "1 x 1 grid",
				description:
					"The start cell is also the destination, so there is exactly one (trivial) path.",
				input: "{ rows: 1, cols: 1 }",
			},
			{
				name: "Square grid growth",
				description:
					"Path counts grow combinatorially; a 3 x 7 grid already yields 28 paths, illustrating why naive recursion blows up.",
				input: "{ rows: 3, cols: 7 }",
			},
		],
		whenToUse: [
			"Counting monotone lattice paths in robot or grid path-planning problems.",
			"Combinatorics problems that map to choosing an ordering of right/down moves.",
			"As a canonical first 2D DP problem before tackling Unique Paths II (obstacles) or Minimum Path Sum.",
			"Probability lattices and warehouse/logistics routing where movement is restricted to forward directions.",
		],
		interviewTips: [
			"State the recurrence dp[i][j] = dp[i-1][j] + dp[i][j-1] and justify the first row/column base case of 1.",
			"Mention the O(n) space optimization using a single rolling row to show you understand the dependency structure.",
			"Bring up the closed-form C(m+n-2, m-1) as an O(min(m,n)) alternative that impresses interviewers.",
			"Note the natural follow-up Unique Paths II, where blocked cells are set to 0 while the recurrence stays the same.",
		],
		prerequisites: ["recursion", "dynamic_programming"],
		relatedAlgorithms: ["knapsack", "coin_change", "num_islands"],
		visualizationType: "grid",
		path: "/algorithms/dynamic-programming/unique-paths",
		pythonModule: "dynamic_programming.unique_paths_viz",
	},
	counting_sort: {
		id: "counting_sort",
		name: "Counting Sort",
		category: "sorting",
		difficulty: "medium",
		tags: [
			"sorting",
			"non-comparison-sort",
			"integer-sort",
			"stable-sort",
			"linear-time",
			"radix-building-block",
			"interview-favorite",
		],
		complexity: {
			time: { best: "O(n + k)", average: "O(n + k)", worst: "O(n + k)" },
			space: "O(n + k)",
			explanation:
				"n is the number of elements and k is the range of input values (max + 1). Counting Sort never compares elements: it tallies occurrences into a count array of size k, prefix-sums the counts into positions, then places each element in one pass. All three cases are O(n + k); it stays linear only while k is comparable to n and degrades in both time and space when k is much larger than n.",
		},
		description:
			"A non-comparison, stable integer sorting algorithm that counts how many times each value occurs, converts those counts into positions via a prefix sum, and places each element directly into its sorted slot in linear O(n + k) time.",
		howItWorks:
			"1. Scan the input to find the maximum value and allocate a count array of size k = max + 1. 2. Count phase: for each element, increment the bucket at counts[value]. 3. Prefix-sum phase: accumulate the counts so counts[v] holds the number of elements <= v, i.e. the end position for value v. 4. Placement phase: iterate the input right-to-left, place each element at counts[value] - 1, and decrement the bucket. Going right-to-left preserves the relative order of equal keys, making the sort stable. The output array is now fully sorted.",
		keyInsights: [
			"Non-comparison sort: it derives positions arithmetically instead of comparing elements, so it beats the O(n log n) comparison lower bound.",
			"Runs in linear O(n + k) time when the value range k is comparable to n, but wastes memory and time when k is much larger than n (sparse or large-valued data).",
			"Stability comes from the prefix-summed count array plus right-to-left placement, which keeps equal elements in their original relative order.",
			"It only works on non-negative integers (or keys mappable to a bounded integer range), and it is the stable per-digit subroutine that makes Radix Sort possible.",
		],
		edgeCases: [
			{
				name: "Empty or single-element array",
				description:
					"An array with 0 or 1 elements is already sorted and is returned immediately without allocating a count array.",
				input: "[]",
			},
			{
				name: "Duplicate values",
				description:
					"Multiple equal keys land in adjacent slots; stability guarantees they keep their original relative order.",
				input: "[3, 0, 3, 1, 0]",
			},
			{
				name: "Large value range (k >> n)",
				description:
					"A single large value forces a huge count array, blowing up space and time even for few elements - the classic failure mode.",
				input: "[0, 1000000]",
			},
		],
		whenToUse: [
			"Sorting integers confined to a small, known range such as ages, exam scores, or byte values.",
			"When guaranteed linear-time sorting is needed and the key range is bounded.",
			"As the stable digit-sorting pass inside Radix Sort.",
			"Avoid when values are large, sparse, floating-point, or arbitrary comparable objects - use Merge Sort or Quick Sort instead.",
		],
		interviewTips: [
			"Be ready to state the O(n + k) time and O(n + k) space trade-off and explain when k >> n makes it worse than a comparison sort.",
			"Explain why the prefix sum plus right-to-left iteration makes the sort stable - a very common follow-up.",
			"Mention that Counting Sort is the building block of Radix Sort, which extends it to large-ranged integers digit by digit.",
			"Handle negative numbers by offsetting values by the minimum, and clarify the non-negative-integer precondition up front.",
		],
		prerequisites: ["arrays", "prefix-sum"],
		relatedAlgorithms: ["radix_sort", "bucket_sort", "merge_sort"],
		visualizationType: "array",
		path: "/algorithms/sorting/counting-sort",
		pythonModule: "sorting.counting_sort",
	},
	radix_sort: {
		id: "radix_sort",
		name: "Radix Sort",
		category: "sorting",
		difficulty: "medium",
		tags: [
			"non-comparison",
			"stable",
			"linear-time",
			"integer-sort",
			"counting-sort",
			"out-of-place",
		],
		complexity: {
			time: {
				best: "O(d·(n + k))",
				average: "O(d·(n + k))",
				worst: "O(d·(n + k))",
			},
			space: "O(n + k)",
			explanation:
				"d digit passes, each a stable counting sort over n elements with radix k (=10). With d treated as a small constant for fixed-width integers this is effectively linear O(n). Space is O(n + k) for the output buffer plus the k digit buckets; the sort is not in-place.",
		},
		description:
			"Non-comparison integer sort that processes numbers one digit at a time, from least to most significant, using a stable counting sort per digit to achieve linear-time performance.",
		howItWorks:
			"LSD radix sort finds the largest value to determine the digit count, then makes one pass per digit position starting at the ones place. Each pass distributes every element into one of 10 buckets (0-9) based on its current digit while preserving relative order (stable), then concatenates the buckets back into the array. Because each pass is stable, once the most significant digit is processed the array is fully sorted.",
		keyInsights: [
			"Never compares two elements directly, so it sidesteps the O(n log n) comparison-sort lower bound",
			"Stability of the per-digit counting sort is what makes the multi-pass LSD approach correct",
			"Runs in linear O(d·(n + k)) time when the number of digits d is a small constant",
			"Ideal for fixed-width keys like integers or fixed-length strings, but the classic form assumes non-negative integers",
		],
		edgeCases: [
			{
				name: "Values with differing digit counts",
				description:
					"Shorter numbers are treated as having leading zeros, so passes continue until the largest value's most significant digit",
				input: [170, 45, 75, 90, 2, 802, 24, 66],
			},
			{
				name: "All equal elements",
				description:
					"Every element lands in the same bucket each pass; stability keeps their order and the result is correct",
				input: [7, 7, 7, 7, 7],
			},
			{
				name: "Contains zero and single digits",
				description: "Zero and single-digit values finish sorting in the first (ones) pass",
				input: [0, 5, 3, 0, 9, 1],
			},
		],
		whenToUse: [
			"Sorting large sets of fixed-width integers or fixed-length strings",
			"When keys have a bounded number of digits and a small radix",
			"When a stable, linear-time sort is worth the extra O(n + k) memory",
			"Bucketing keys (e.g. dates, IDs, IP addresses) that decompose cleanly into digits",
		],
		interviewTips: [
			"Explain LSD vs MSD radix sort and why LSD relies on a stable per-digit sort",
			"State the complexity as O(d·(n + k)) and clarify when it beats comparison sorts",
			"Mention it needs O(n + k) extra space and is not in-place",
			"Note the non-negative-integer assumption and how to extend it (offset by min, or split sign) for negatives",
		],
		prerequisites: ["insertion_sort"],
		relatedAlgorithms: ["merge_sort", "quick_sort", "heap_sort"],
		visualizationType: "array",
		path: "/algorithms/sorting/radix-sort",
		pythonModule: "sorting.radix_sort",
	},
	validate_bst: {
		id: "validate_bst",
		name: "Validate BST",
		category: "trees",
		difficulty: "medium",
		tags: [
			"binary-search-tree",
			"trees",
			"recursion",
			"depth-first-search",
			"interview-favorite",
			"validation",
		],
		complexity: {
			time: { best: "O(1)", average: "O(n)", worst: "O(n)" },
			space: "O(h)",
			explanation:
				"Each of the n nodes is checked once against its (low, high) bounds, so validation is O(n); it can reject early on the first violation (O(1) best case when the root already breaks its bound). Space is O(h) for the recursion stack, where h is the tree height - O(log n) for a balanced tree and O(n) for a degenerate/skewed one.",
		},
		description:
			"Determine whether a binary tree satisfies the binary-search-tree property: for every node, all values in its left subtree are strictly smaller and all values in its right subtree are strictly larger. The clean approach carries a running (low, high) allowed range down the recursion, catching the classic trap that the constraint is global rather than a simple parent-child comparison.",
		howItWorks:
			"Recurse from the root with the widest allowed range (-∞, +∞). At each node, verify its value lies strictly inside the current (low, high) range. Descend left with the upper bound tightened to the node's value - range (low, node.val) - and descend right with the lower bound raised to the node's value - range (node.val, high). If any node falls outside its range the tree is not a BST; otherwise every node passing its bound check confirms a valid BST. An equivalent formulation checks that an in-order traversal produces a strictly increasing sequence.",
		keyInsights: [
			"The BST property is GLOBAL, not local: comparing a node only against its direct children gives false positives - a value can satisfy its parent yet violate a distant ancestor's bound.",
			"Passing (low, high) bounds down the recursion compresses every ancestor constraint into just two numbers, so each node needs only one O(1) check.",
			"Inequalities are strict for a canonical BST; if duplicate keys are allowed you must relax exactly one side to >= or <= to decide which subtree they belong in.",
			"Validation is equivalent to asking whether the in-order traversal is strictly increasing, since an in-order walk of a BST yields sorted order.",
		],
		edgeCases: [
			{
				name: "Empty tree",
				description: "A tree with no nodes is vacuously a valid BST.",
				input: "[]",
			},
			{
				name: "Single node",
				description: "Any single-node tree is a valid BST regardless of value.",
				input: "[1]",
			},
			{
				name: "Local-check trap",
				description:
					"A node valid against its immediate parent but violating an ancestor's bound - the case that breaks naive parent-child validation.",
				input: "[5, 3, 8, 1, 6, 7, 9]",
			},
			{
				name: "Duplicate values",
				description:
					"Equal keys break a strict BST unless duplicates are explicitly allowed on one side.",
				input: "[2, 2, 2]",
			},
		],
		whenToUse: [
			"Verifying search-tree integrity after inserts, deletes, or rotations, especially in tests or invariant assertions.",
			"As a prerequisite guard before BST-only operations (kth smallest, range queries, ordered iteration) that assume the ordering holds.",
			"Validating tree-structured indexes in databases and filesystems that depend on ordered invariants.",
			"Interview settings (LeetCode 98) where the local-vs-global distinction is the point being tested.",
		],
		interviewTips: [
			"State up front that the property is global and that a parent-child-only comparison is the classic wrong answer.",
			"Prefer the (low, high) bounds recursion; use None/±infinity sentinels for the root's open bounds and keep the inequalities strict.",
			"Mention the in-order alternative: validate by confirming the in-order sequence is strictly increasing (track only the previous value for O(1) extra space beyond the stack).",
			"Clarify the duplicates policy with the interviewer, since it changes whether you use < or <=.",
			"Note early termination - you can bail on the first out-of-bounds node instead of walking the whole tree.",
		],
		prerequisites: ["binary_search_tree", "tree_traversals"],
		relatedAlgorithms: ["binary_search_tree", "tree_traversals", "binary_search"],
		visualizationType: "tree",
		path: "/algorithms/trees/validate-bst",
		pythonModule: "trees.validate_bst_viz",
	},
	invert_binary_tree: {
		id: "invert_binary_tree",
		name: "Invert Binary Tree",
		category: "trees",
		difficulty: "easy",
		tags: ["trees", "recursion", "binary-tree", "interview-favorite", "foundational"],
		complexity: {
			time: {
				best: "O(n)",
				average: "O(n)",
				worst: "O(n)",
			},
			space: "O(h)",
			explanation:
				"Every node is visited exactly once to swap its children, giving O(n) time. Space is O(h) for the recursion stack where h is the tree height — O(log n) for a balanced tree, O(n) for a skewed one.",
		},
		description:
			"Produce the mirror image of a binary tree by recursively swapping the left and right children of every node. The famous 'Homebrew' whiteboard question.",
		howItWorks:
			"Starting at the root, swap the node's left and right child pointers, then recursively invert the left subtree and the right subtree. Null nodes and leaves are the base case and need no swap. The order of swap-then-recurse vs recurse-then-swap does not matter — both yield the same mirrored tree.",
		keyInsights: [
			"The whole algorithm is one idea — swap a node's two children — applied recursively to every node.",
			"It has the same traversal shape as any tree walk, so it runs in O(n) time.",
			"Swap the child pointers, not the values — swapping values would force you to touch every descendant.",
			"Inverting a tree twice restores the original: the operation is its own inverse.",
		],
		edgeCases: [
			{
				name: "Empty tree",
				description: "A null root has nothing to invert; the algorithm returns immediately.",
				input: "[]",
			},
			{
				name: "Single node",
				description: "A lone root has no children, so no swap occurs and the tree is unchanged.",
				input: "[1]",
			},
			{
				name: "Skewed tree",
				description:
					"A fully one-sided tree still inverts correctly but drives recursion depth to O(n) — a candidate for an iterative queue/stack version.",
				input: "[1, 2, null, 3]",
			},
		],
		whenToUse: [
			"Producing a mirror image of a tree for symmetry checks or right-to-left UI layout flipping.",
			"As a building block for testing whether a tree is symmetric (a tree is symmetric iff it equals its own inversion).",
			"Rendering mirrored hierarchical data such as flipped org charts or file trees.",
			"A canonical warm-up for mastering recursion patterns that apply an operation to every tree node.",
		],
		interviewTips: [
			"State the recursive insight up front: swap children, then recurse — it's shorter than it looks.",
			"Mention that swapping pointers (not values) keeps it O(n) and avoids touching descendants.",
			"Offer the iterative BFS (queue) or DFS (stack) variant to sidestep recursion depth on skewed trees.",
			"Nod to the Homebrew story — interviewers love that this 'trick question' is genuinely simple.",
		],
		prerequisites: ["tree_traversals"],
		relatedAlgorithms: ["tree_traversals", "bfs", "dfs"],
		visualizationType: "tree",
		path: "/algorithms/trees/invert-binary-tree",
		pythonModule: "trees.invert_binary_tree_viz",
	},
	topological_sort: {
		id: "topological_sort",
		name: "Topological Sort (Kahn's)",
		category: "graphs",
		difficulty: "medium",
		tags: [
			"graph",
			"topological-sort",
			"bfs",
			"dag",
			"in-degree",
			"cycle-detection",
			"scheduling",
			"interview-favorite",
		],
		complexity: {
			time: { best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)" },
			space: "O(V + E)",
			explanation:
				"Every vertex is enqueued and dequeued exactly once (O(V)) and every edge is relaxed exactly once when its source node is removed (O(E)), giving O(V + E) time. Space is O(V + E) for the in-degree map, the ready queue, the output order, and the adjacency list.",
		},
		description:
			"Kahn's algorithm produces a linear ordering of a Directed Acyclic Graph (DAG) so that for every edge u → v, u appears before v. It works by repeatedly removing nodes that have no remaining incoming edges (in-degree 0) and decrementing their neighbors' in-degrees.",
		howItWorks:
			"Compute the in-degree of every node. Enqueue all nodes with in-degree 0 (nothing must come before them). Repeatedly pop a node, append it to the output order, and decrement the in-degree of each of its neighbors; whenever a neighbor's in-degree drops to 0 it becomes ready and is enqueued. When the queue empties, if fewer than V nodes were placed the graph contains a cycle and has no valid ordering.",
		keyInsights: [
			"In-degree 0 means a node has no unmet dependencies, so it is always safe to place next.",
			"Cycle detection comes for free: if the algorithm cannot place every node, the remaining nodes are part of (or depend on) a cycle.",
			"The topological ordering is not unique — whenever multiple nodes have in-degree 0, any of them may be chosen next.",
			"Kahn's is iterative (BFS on in-degrees), so unlike the DFS-based topological sort it has no recursion-depth limit.",
		],
		edgeCases: [
			{
				name: "Cyclic graph",
				description:
					"A graph with a cycle has no valid topological order; Kahn's places fewer than V nodes and reports the leftover nodes as a detected cycle.",
				input: '{ "0": [1], "1": [2], "2": [0] }',
			},
			{
				name: "Disconnected DAG / isolated nodes",
				description:
					"Nodes with no incoming or outgoing edges start ready and are placed immediately; multiple independent components are all ordered correctly.",
				input: '{ "0": [1], "1": [], "2": [], "3": [] }',
			},
			{
				name: "Node appearing only as a neighbor",
				description:
					"A target that is never a key (e.g. a leaf) is still normalized into the graph so it receives an in-degree and appears in the final order.",
				input: '{ "0": [1, 5] }',
			},
		],
		whenToUse: [
			"Resolving dependency install/build order in package managers and build systems (make, npm, Bazel).",
			"Scheduling tasks or jobs that have prerequisite constraints.",
			"Course scheduling where classes have prerequisites.",
			"Evaluating spreadsheet formulas or computation graphs in dependency order.",
			"Detecting circular dependencies such as import cycles or deadlocks.",
		],
		interviewTips: [
			"State up front that a topological order only exists for a DAG, and mention Kahn's detects cycles when it can't place all V nodes.",
			"Remember to add nodes that only appear as neighbors — forgetting them is a common off-by-one bug in the node count / cycle check.",
			"Be ready to contrast Kahn's (BFS, in-degree queue) with the DFS + post-order-reversal approach, and note the order isn't unique.",
			"Using a min-heap instead of a plain queue yields the lexicographically smallest ordering — a frequent follow-up.",
		],
		prerequisites: ["bfs", "dfs"],
		relatedAlgorithms: ["dfs", "bfs"],
		visualizationType: "graph",
		path: "/algorithms/graphs/topological-sort",
		pythonModule: "graphs.topological_sort",
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
