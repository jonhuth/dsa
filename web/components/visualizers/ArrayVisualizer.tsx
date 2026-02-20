"use client";

interface ArrayVisualizerProps {
	values: number[];
	highlights?: Array<{
		indices: number[];
		color: string;
	}>;
	height?: number;
}

export function ArrayVisualizer({ values, highlights = [], height = 200 }: ArrayVisualizerProps) {
	const colorClasses = {
		default: "bg-gray-500",
		comparing: "bg-yellow-500",
		swapped: "bg-green-500",
		sorted: "bg-purple-500",
		active: "bg-blue-500",
		visited: "bg-gray-600",
	};

	// Scale height based on number of values to prevent overflow
	const barWidth =
		values.length > 8 ? "w-6 sm:w-8" : values.length > 5 ? "w-8 sm:w-10" : "w-10 sm:w-12";
	const heightMultiplier = values.length > 8 ? 12 : values.length > 5 ? 16 : 20;

	return (
		<div
			className="flex items-end justify-center gap-1 sm:gap-2 overflow-x-auto px-2"
			style={{ minHeight: `${height}px` }}
		>
			{values.map((value, idx) => {
				const highlight = highlights.find((h) => h.indices?.includes(idx));
				const color = highlight?.color || "default";

				return (
					// biome-ignore lint/suspicious/noArrayIndexKey: Index-based keys are correct for sorting visualizations where positions change
					<div key={idx} className="flex flex-col items-center gap-1 sm:gap-2 shrink-0">
						<div
							className={`${barWidth} ${colorClasses[color as keyof typeof colorClasses]} transition-all duration-300 rounded-t-sm`}
							style={{ height: `${Math.max(value * heightMultiplier, 20)}px` }}
						/>
						<div className="text-[10px] sm:text-xs">{value}</div>
					</div>
				);
			})}
		</div>
	);
}
