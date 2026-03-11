import { AlgorithmSearch } from "@/components/AlgorithmSearch";
import registry from "@/lib/registry";

export default function HomePage() {
	// Get all algorithms from registry
	const allAlgorithms = registry.algorithms.getAll();

	// Get active categories
	const activeCategories = registry.categories.getActive();

	return (
		<div className="min-h-screen p-4 sm:p-6 lg:p-8">
			<div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
				{/* Header */}
				<div className="space-y-3 sm:space-y-4">
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
						DSA Visualizer
					</h1>
					<p className="text-base sm:text-lg text-muted-foreground">
						Interactive algorithm visualizations with live code execution
					</p>
				</div>

				{/* Algorithms List */}
				<div className="space-y-3 sm:space-y-4">
					<h2 className="text-xl sm:text-2xl font-semibold">All Algorithms</h2>

					<AlgorithmSearch initialAlgorithms={allAlgorithms} />
				</div>

				{/* Quick Stats */}
				<div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 sm:pt-8 border-t border-border">
					<div className="text-center">
						<div className="text-2xl sm:text-3xl font-bold text-primary">
							{allAlgorithms.length}
						</div>
						<div className="text-xs sm:text-sm text-muted-foreground">Algorithms</div>
					</div>
					<div className="text-center">
						<div className="text-2xl sm:text-3xl font-bold text-primary">
							{activeCategories.length}
						</div>
						<div className="text-xs sm:text-sm text-muted-foreground">Categories</div>
					</div>
					<div className="text-center">
						<div className="text-2xl sm:text-3xl font-bold text-primary">100%</div>
						<div className="text-xs sm:text-sm text-muted-foreground">Live Code</div>
					</div>
				</div>
			</div>
		</div>
	);
}
