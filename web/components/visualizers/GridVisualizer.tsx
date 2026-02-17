interface GridVisualizerProps {
	grid: number[][];
	highlights?: Array<{
		type: "cell";
		row: number;
		col: number;
		color: string;
	}>;
	width?: number;
	height?: number;
}

export function GridVisualizer({
	grid,
	highlights = [],
	width = 600,
	height = 400,
}: GridVisualizerProps) {
	if (!grid || grid.length === 0 || grid[0].length === 0) {
		return (
			<div
				className="flex items-center justify-center border border-border rounded"
				style={{ width: `${width}px`, height: `${height}px` }}
			>
				<p className="text-muted-foreground">No grid data</p>
			</div>
		);
	}

	const rows = grid.length;
	const cols = grid[0].length;

	// Calculate cell size based on grid dimensions and available space
	const cellSize = Math.min(Math.floor((width - 40) / cols), Math.floor((height - 40) / rows), 60);
	const _gridWidth = cols * cellSize;
	const _gridHeight = rows * cellSize;

	// Color mapping
	const colorClasses: Record<string, string> = {
		default: "bg-gray-700 border-gray-600",
		active: "bg-blue-500 border-blue-400",
		visited: "bg-purple-500 border-purple-400",
		comparing: "bg-yellow-500 border-yellow-400",
		sorted: "bg-green-500 border-green-400",
		water: "bg-blue-900 border-blue-800",
		land: "bg-green-700 border-green-600",
	};

	// Get color for a cell
	const getCellColor = (row: number, col: number) => {
		const highlight = highlights.find((h) => h.row === row && h.col === col);
		if (highlight) {
			return colorClasses[highlight.color] || colorClasses.default;
		}
		// Default coloring based on cell value
		return grid[row][col] === 1 ? colorClasses.land : colorClasses.water;
	};

	return (
		<div className="flex items-center justify-center p-4">
			<div
				className="grid gap-0.5"
				style={{
					gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
					gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
				}}
			>
				{grid.map((row, rowIdx) =>
					row.map((cell, colIdx) => (
						<div
							key={`${rowIdx}-${colIdx}`}
							className={`border flex items-center justify-center text-xs font-mono transition-colors duration-300 ${getCellColor(rowIdx, colIdx)}`}
							style={{
								width: `${cellSize}px`,
								height: `${cellSize}px`,
							}}
						>
							{cell === 1 ? "1" : ""}
						</div>
					)),
				)}
			</div>
		</div>
	);
}
