export default function SortingPage() {
  const algorithms = [
    {
      id: "bubble-sort",
      name: "Bubble Sort",
      difficulty: "Easy",
      timeComplexity: "O(n²)",
      description: "Simple comparison-based sorting with adjacent element swaps",
    },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <div className="text-sm text-muted-foreground mb-2">
            <a href="/algorithms" className="hover:underline">
              Algorithms
            </a>{" "}
            / Sorting
          </div>
          <h1 className="text-4xl font-bold mb-2">Sorting Algorithms</h1>
          <p className="text-muted-foreground">
            Algorithms for arranging elements in a specific order
          </p>
        </div>

        <div className="grid gap-4">
          {algorithms.map((algo) => (
            <a
              key={algo.id}
              href={`/algorithms/sorting/${algo.id}`}
              className="p-6 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-2">{algo.name}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{algo.description}</p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded text-xs">
                    {algo.difficulty}
                  </span>
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded text-xs">
                    {algo.timeComplexity}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
