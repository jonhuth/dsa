export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl text-center space-y-6">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          DSA Visualizer
        </h1>
        <p className="text-xl text-muted-foreground">
          Interactive learning platform for data structures and algorithms
        </p>
        <p className="text-sm text-muted-foreground">
          Explore algorithms through visualization, rich documentation, and AI-assisted learning
        </p>
        <div className="flex gap-4 justify-center pt-8">
          <a
            href="/algorithms"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Browse Algorithms
          </a>
          <a
            href="/algorithms/sorting/bubble-sort"
            className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            Try Bubble Sort
          </a>
        </div>
      </div>
    </div>
  );
}
