"use client";

import type { ComplexityAnalysis } from "@/lib/types";

interface ComplexityChartProps {
	complexity: ComplexityAnalysis;
}

export function ComplexityChart({ complexity }: ComplexityChartProps) {
	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">Time Complexity</h3>

			<div className="space-y-3">
				{/* Best Case */}
				<div>
					<div className="flex items-center justify-between mb-1">
						<span className="text-sm text-muted-foreground">Best Case</span>
						<span className="text-sm font-mono font-semibold text-green-500">
							{complexity.time.best}
						</span>
					</div>
					<div className="h-2 bg-background rounded-full overflow-hidden">
						<div
							className="h-full bg-green-500"
							style={{
								width: getComplexityWidth(complexity.time.best),
							}}
						/>
					</div>
				</div>

				{/* Average Case */}
				<div>
					<div className="flex items-center justify-between mb-1">
						<span className="text-sm text-muted-foreground">Average Case</span>
						<span className="text-sm font-mono font-semibold text-yellow-500">
							{complexity.time.average}
						</span>
					</div>
					<div className="h-2 bg-background rounded-full overflow-hidden">
						<div
							className="h-full bg-yellow-500"
							style={{
								width: getComplexityWidth(complexity.time.average),
							}}
						/>
					</div>
				</div>

				{/* Worst Case */}
				<div>
					<div className="flex items-center justify-between mb-1">
						<span className="text-sm text-muted-foreground">Worst Case</span>
						<span className="text-sm font-mono font-semibold text-red-500">
							{complexity.time.worst}
						</span>
					</div>
					<div className="h-2 bg-background rounded-full overflow-hidden">
						<div
							className="h-full bg-red-500"
							style={{
								width: getComplexityWidth(complexity.time.worst),
							}}
						/>
					</div>
				</div>
			</div>

			{/* Space Complexity */}
			<div className="pt-4 border-t border-border">
				<div className="flex items-center justify-between">
					<span className="text-sm text-muted-foreground">Space Complexity</span>
					<span className="text-sm font-mono font-semibold text-purple-500">
						{complexity.space}
					</span>
				</div>
			</div>

			{/* Explanation */}
			{complexity.explanation && (
				<div className="pt-4 border-t border-border">
					<p className="text-sm text-muted-foreground leading-relaxed">{complexity.explanation}</p>
				</div>
			)}
		</div>
	);
}

/**
 * Convert Big-O notation to a visual width percentage
 * This is a rough heuristic for visualization purposes
 */
function getComplexityWidth(complexity: string): string {
	const normalized = complexity.toLowerCase().replace(/\s/g, "");

	// Map complexities to approximate relative widths
	const widthMap: Record<string, string> = {
		"o(1)": "10%",
		"o(logn)": "25%",
		"o(n)": "50%",
		"o(nlogn)": "70%",
		"o(n²)": "90%",
		"o(n^2)": "90%",
		"o(n³)": "95%",
		"o(n^3)": "95%",
		"o(2^n)": "100%",
		"o(n!)": "100%",
	};

	return widthMap[normalized] || "50%";
}
