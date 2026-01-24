"use client";

import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  // All available algorithms
  const algorithms = [
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
  ];

  // Filter algorithms based on search query
  const filteredAlgorithms = algorithms.filter(
    (algo) =>
      algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.timeComplexity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const difficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/10 text-green-500";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-500";
      case "Hard":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            DSA Visualizer
          </h1>
          <p className="text-lg text-muted-foreground">
            Interactive algorithm visualizations with live code execution
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search algorithms... (try 'sort', 'O(n)', 'divide-and-conquer')"
            className="w-full px-6 py-4 bg-background border-2 border-border rounded-lg text-lg focus:border-primary focus:outline-none transition-colors"
          />
          <div className="absolute right-4 top-4 text-sm text-muted-foreground">Cmd+K</div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="p-4 border border-border rounded-lg bg-card/50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="text-sm font-medium">Keyboard Shortcuts:</div>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-background border border-border rounded">Cmd+K</kbd>
                <span>Search</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-background border border-border rounded">Space</kbd>
                <span>Play/Pause</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-background border border-border rounded">← →</kbd>
                <span>Step</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-background border border-border rounded">?</kbd>
                <span>Help</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {searchQuery && (
          <div className="text-sm text-muted-foreground">
            Found {filteredAlgorithms.length} algorithm{filteredAlgorithms.length !== 1 ? "s" : ""}
          </div>
        )}

        {/* Algorithms List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            {searchQuery ? "Search Results" : "All Algorithms"}
          </h2>

          {filteredAlgorithms.length > 0 ? (
            <div className="grid gap-4">
              {filteredAlgorithms.map((algo) => (
                <Link
                  key={algo.id}
                  href={algo.path}
                  className="p-6 border border-border rounded-lg hover:bg-accent transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                          {algo.name}
                        </h3>
                        <span className="text-xs text-muted-foreground px-2 py-1 bg-background border border-border rounded">
                          {algo.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{algo.description}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className={`px-3 py-1 rounded ${difficultyColor(algo.difficulty)}`}>
                          {algo.difficulty}
                        </span>
                        <span className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded">
                          {algo.timeComplexity}
                        </span>
                      </div>
                    </div>
                    <div className="text-muted-foreground group-hover:text-primary transition-colors">
                      →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">No algorithms found matching "{searchQuery}"</p>
              <p className="text-sm">Try searching for "sort", "O(n)", or an algorithm name</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{algorithms.length}</div>
            <div className="text-sm text-muted-foreground">Algorithms</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">5</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground">With Live Code Viewer</div>
          </div>
        </div>
      </div>
    </div>
  );
}
