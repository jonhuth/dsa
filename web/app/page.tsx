import Link from "next/link";
import registry from "@/lib/registry";

export default function HomePage() {
  // Get all algorithms from registry
  const allAlgorithms = registry.algorithms.getAll();

  // Get active categories
  const activeCategories = registry.categories.getActive();

  const difficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500/10 text-green-500";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500";
      case "hard":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const categoryDisplayName = (category: string) => {
    return registry.categories.get(category as any)?.name || category;
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

        {/* Algorithms List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">All Algorithms</h2>

          <div className="grid gap-4">
            {allAlgorithms.map((algo) => (
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
                        {categoryDisplayName(algo.category)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{algo.description}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className={`px-3 py-1 rounded ${difficultyColor(algo.difficulty)}`}>
                        {algo.difficulty.charAt(0).toUpperCase() + algo.difficulty.slice(1)}
                      </span>
                      <span className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded">
                        {algo.complexity.time.average}
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
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{allAlgorithms.length}</div>
            <div className="text-sm text-muted-foreground">Algorithms</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{activeCategories.length}</div>
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
