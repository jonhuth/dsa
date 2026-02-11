import type { EdgeCase } from "@/lib/types";

interface EdgeCasesProps {
	edgeCases: EdgeCase[];
	algorithmName: string;
}

export function EdgeCases({ edgeCases, algorithmName }: EdgeCasesProps) {
	if (!edgeCases || edgeCases.length === 0) {
		return null;
	}

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">Edge Cases & Pitfalls</h3>
			<div className="space-y-3">
				{edgeCases.map((edgeCase, index) => (
					<div key={index} className="p-4 bg-card border border-border rounded-lg">
						<h4 className="font-semibold mb-2 text-sm">{edgeCase.name}</h4>
						<p className="text-sm text-muted-foreground mb-2">{edgeCase.description}</p>
						{edgeCase.input !== undefined && (
							<div className="mt-2">
								<span className="text-xs text-muted-foreground">Example input:</span>
								<code className="block mt-1 px-2 py-1 bg-background rounded text-xs font-mono">
									{typeof edgeCase.input === "string"
										? edgeCase.input
										: JSON.stringify(edgeCase.input)}
								</code>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
