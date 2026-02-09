import Link from "next/link";
import registry from "@/lib/registry";

export default function SortingPage() {
  const category = registry.categories.get("sorting");
  const algorithms = registry.algorithms.getByCategory("sorting");

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

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <div className="text-sm text-muted-foreground mb-2">
            <Link href="/algorithms" className="hover:underline">
              Algorithms
            </Link>{" "}
            / {category.name}
          </div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{category.icon}</span>
            <h1 className="text-4xl font-bold">{category.name}</h1>
          </div>
          <p className="text-muted-foreground">{category.description}</p>
        </div>

        <div className="grid gap-4">
          {algorithms.map((algo) => (
            <Link
              key={algo.id}
              href={algo.path}
              className="p-6 border border-border rounded-lg hover:bg-accent transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {algo.name}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">{algo.description}</p>
                  {algo.tags && algo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {algo.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-background border border-border rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <span className={`px-3 py-1 rounded text-xs ${difficultyColor(algo.difficulty)}`}>
                    {algo.difficulty.charAt(0).toUpperCase() + algo.difficulty.slice(1)}
                  </span>
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded text-xs">
                    {algo.complexity.time.average}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
