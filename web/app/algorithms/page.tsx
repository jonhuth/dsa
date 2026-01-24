export default function AlgorithmsPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Algorithms</h1>
          <p className="text-muted-foreground">Browse and visualize algorithms by category</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sorting Category */}
          <a
            href="/algorithms/sorting"
            className="p-6 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Sorting</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Comparison-based and non-comparison sorting algorithms
            </p>
            <div className="text-xs text-muted-foreground">
              Bubble Sort, Quick Sort, Merge Sort, and more
            </div>
          </a>

          {/* Placeholder for more categories */}
          <div className="p-6 border border-border rounded-lg opacity-50">
            <h2 className="text-2xl font-semibold mb-2">Searching</h2>
            <p className="text-sm text-muted-foreground mb-4">Coming soon...</p>
          </div>

          <div className="p-6 border border-border rounded-lg opacity-50">
            <h2 className="text-2xl font-semibold mb-2">Graph Algorithms</h2>
            <p className="text-sm text-muted-foreground mb-4">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
