import Link from "next/link";
import type { AlgorithmMetadata } from "@/lib/types";

interface RelatedLinksProps {
	algorithms: AlgorithmMetadata[];
	title: string;
	emptyMessage?: string;
}

export function RelatedLinks({
	algorithms,
	title,
	emptyMessage = "No related algorithms",
}: RelatedLinksProps) {
	if (!algorithms || algorithms.length === 0) {
		return (
			<div className="space-y-4">
				<h3 className="text-lg font-semibold">{title}</h3>
				<p className="text-sm text-muted-foreground">{emptyMessage}</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">{title}</h3>
			<div className="space-y-2">
				{algorithms.map((algo) => (
					<Link
						key={algo.id}
						href={algo.path}
						className="block p-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors group"
					>
						<div className="flex items-center justify-between">
							<div className="flex-1">
								<h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
									{algo.name}
								</h4>
								<p className="text-xs text-muted-foreground mt-1 line-clamp-2">
									{algo.description}
								</p>
							</div>
							<span className="text-muted-foreground group-hover:text-primary transition-colors ml-2">
								→
							</span>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
