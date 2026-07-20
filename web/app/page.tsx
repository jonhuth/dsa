import Link from "next/link";
import { AlgorithmSearch } from "@/components/AlgorithmSearch";
import { LearnedCounter } from "@/components/LearnedCounter";
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

				{/* Foundations: Information Theory — kept above the algorithm list, which
				    renders all 55 entries unpaginated and would otherwise bury this. */}
				<Link
					href="/information-theory"
					className="group block rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 p-6 transition-colors hover:border-violet-500/60"
				>
					<div className="flex items-center justify-between gap-4">
						<div>
							<span className="text-xs uppercase tracking-wide text-violet-300">
								Foundations · Interactive
							</span>
							<h2 className="mt-1 text-xl font-semibold sm:text-2xl group-hover:text-violet-400">
								Entropy &amp; the Laws of Information
							</h2>
							<p className="mt-1 max-w-2xl text-sm text-muted-foreground">
								Drag distributions to see Shannon entropy, cross-entropy, KL divergence and
								Kolmogorov complexity come alive — with the laws you can deduce from them.
							</p>
						</div>
						<span className="hidden shrink-0 text-3xl sm:block">📊</span>
					</div>
				</Link>

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
					<LearnedCounter totalAlgorithms={allAlgorithms.length} />
				</div>
			</div>
		</div>
	);
}
