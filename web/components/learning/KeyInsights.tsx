interface KeyInsightsProps {
	insights: string[];
	algorithmName: string;
}

export function KeyInsights({ insights, algorithmName }: KeyInsightsProps) {
	if (!insights || insights.length === 0) {
		return null;
	}

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">💡 Key Insights</h3>
			<div className="space-y-2">
				{insights.map((insight, index) => (
					<div
						key={index}
						className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg"
					>
						<span className="text-primary mt-0.5 flex-shrink-0">•</span>
						<p className="text-sm leading-relaxed">{insight}</p>
					</div>
				))}
			</div>
		</div>
	);
}
