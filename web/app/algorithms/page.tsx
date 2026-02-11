import Link from "next/link";
import registry from "@/lib/registry";

export default function AlgorithmsPage() {
	const categories = registry.categories.getActive();

	return (
		<div className="min-h-screen p-8">
			<div className="max-w-6xl mx-auto space-y-8">
				<div>
					<h1 className="text-4xl font-bold mb-2">Algorithms</h1>
					<p className="text-muted-foreground">Browse and visualize algorithms by category</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{categories.map((category) => {
						const algorithms = registry.algorithms.getByCategory(category.id);
						const sampleNames = algorithms
							.slice(0, 3)
							.map((a) => a.name)
							.join(", ");

						return (
							<Link
								key={category.id}
								href={`/algorithms/${category.id}`}
								className="p-6 border border-border rounded-lg hover:bg-accent transition-colors group"
							>
								<div className="flex items-center gap-3 mb-2">
									<span className="text-3xl">{category.icon}</span>
									<h2 className="text-2xl font-semibold group-hover:text-primary transition-colors">
										{category.name}
									</h2>
								</div>
								<p className="text-sm text-muted-foreground mb-4">{category.description}</p>
								<div className="flex items-center justify-between text-xs">
									<span className="text-muted-foreground">
										{sampleNames}
										{algorithms.length > 3 && ", ..."}
									</span>
									<span className="px-2 py-1 bg-primary/10 text-primary rounded">
										{category.algorithmCount} algorithm
										{category.algorithmCount !== 1 ? "s" : ""}
									</span>
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}
