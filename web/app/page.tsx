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
            <div className="text-3xl font-bold text-primary">1</div>
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
