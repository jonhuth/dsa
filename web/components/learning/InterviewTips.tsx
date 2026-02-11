interface InterviewTipsProps {
	tips: string[];
	algorithmName: string;
}

export function InterviewTips({ tips, algorithmName }: InterviewTipsProps) {
	if (!tips || tips.length === 0) {
		return null;
	}

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">💼 Interview Tips</h3>
			<div className="space-y-2">
				{tips.map((tip, index) => (
					<div
						key={index}
						className="flex items-start gap-3 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg"
					>
						<span className="text-yellow-500 mt-0.5 flex-shrink-0">→</span>
						<p className="text-sm leading-relaxed">{tip}</p>
					</div>
				))}
			</div>
		</div>
	);
}
