"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Command } from "cmdk";
import { Search, TrendingUp, GitBranch, Binary, TreePine, Calculator } from "lucide-react";

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
    id: "fibonacci-tabulation",
    name: "Fibonacci (Tabulation)",
    category: "Dynamic Programming",
    difficulty: "Easy",
    timeComplexity: "O(n)",
    description: "Bottom-up DP computing Fibonacci numbers iteratively",
    path: "/algorithms/dynamic-programming/fibonacci-tabulation",
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

const categoryIcons: Record<string, any> = {
  Sorting: TrendingUp,
  Graphs: GitBranch,
  Search: Binary,
  Trees: TreePine,
  "Dynamic Programming": Calculator,
};

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // Reset search when dialog closes
  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  // Group algorithms by category
  const categories = Array.from(new Set(algorithms.map((a) => a.category)));

  const filteredAlgorithms = search
    ? algorithms.filter(
        (algo) =>
          algo.name.toLowerCase().includes(search.toLowerCase()) ||
          algo.category.toLowerCase().includes(search.toLowerCase()) ||
          algo.description.toLowerCase().includes(search.toLowerCase()) ||
          algo.timeComplexity.toLowerCase().includes(search.toLowerCase())
      )
    : algorithms;

  const handleSelect = (path: string) => {
    onOpenChange(false);
    router.push(path);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] px-4">
        <Command className="rounded-lg border border-border bg-background shadow-2xl">
          <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search algorithms by name, category, or complexity..."
              className="flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            <kbd className="pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No algorithms found.
            </Command.Empty>

            {search ? (
              // Show all filtered results when searching
              <Command.Group heading="Search Results">
                {filteredAlgorithms.map((algo) => {
                  const Icon = categoryIcons[algo.category] || Search;
                  return (
                    <Command.Item
                      key={algo.id}
                      value={algo.id}
                      onSelect={() => handleSelect(algo.path)}
                      className="flex items-start gap-3 rounded-lg px-3 py-3 cursor-pointer hover:bg-accent aria-selected:bg-accent"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium leading-none">{algo.name}</p>
                          <span className="text-xs text-muted-foreground">{algo.category}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {algo.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="px-2 py-0.5 bg-purple-500/10 text-purple-500 rounded">
                            {algo.timeComplexity}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded ${
                              algo.difficulty === "Easy"
                                ? "bg-green-500/10 text-green-500"
                                : algo.difficulty === "Medium"
                                  ? "bg-yellow-500/10 text-yellow-500"
                                  : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            {algo.difficulty}
                          </span>
                        </div>
                      </div>
                    </Command.Item>
                  );
                })}
              </Command.Group>
            ) : (
              // Group by category when not searching
              <>
                {categories.map((category) => {
                  const categoryAlgos = algorithms.filter((a) => a.category === category);
                  const Icon = categoryIcons[category] || Search;

                  return (
                    <Command.Group key={category} heading={category}>
                      {categoryAlgos.map((algo) => (
                        <Command.Item
                          key={algo.id}
                          value={algo.id}
                          onSelect={() => handleSelect(algo.path)}
                          className="flex items-start gap-3 rounded-lg px-3 py-2 cursor-pointer hover:bg-accent aria-selected:bg-accent"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium leading-none">{algo.name}</p>
                              <span className="text-xs text-muted-foreground px-2 py-0.5 bg-purple-500/10 text-purple-500 rounded">
                                {algo.timeComplexity}
                              </span>
                            </div>
                          </div>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  );
                })}
              </>
            )}
          </Command.List>

          <div className="flex items-center border-t border-border px-3 py-2 text-xs text-muted-foreground">
            <kbd className="pointer-events-none mr-1 inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              ↑↓
            </kbd>
            <span className="mr-4">Navigate</span>
            <kbd className="pointer-events-none mr-1 inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              ↵
            </kbd>
            <span className="mr-4">Select</span>
            <kbd className="pointer-events-none mr-1 inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              ESC
            </kbd>
            <span>Close</span>
          </div>
        </Command>
      </div>

      {/* Backdrop - close on click */}
      <div className="fixed inset-0 -z-10" onClick={() => onOpenChange(false)} />
    </div>
  );
}
