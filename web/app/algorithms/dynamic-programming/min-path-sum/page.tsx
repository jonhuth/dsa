"use client";

import { useEffect, useState } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { GridVisualizer } from "@/components/visualizers/GridVisualizer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { AlgorithmStep } from "@/lib/types";

const DEFAULT_GRID = `[
  [1, 3, 1],
  [1, 5, 1],
  [4, 2, 1]
]`;

export default function MinPathSumPage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [gridInput, setGridInput] = useState(DEFAULT_GRID);
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/min_path_sum/source");
				const data = await response.json();
				setSourceCode(data.source || "");
			} catch (error) {
				console.error("Failed to fetch source code:", error);
			}
		};
		fetchSource();
	}, []);

	const executeAlgorithm = async () => {
		setIsLoading(true);
		try {
			let grid: number[][];
			try {
				grid = JSON.parse(gridInput);
			} catch {
				alert("Invalid grid: please enter a valid JSON 2D array of numbers.");
				setIsLoading(false);
				return;
			}

			const response = await fetch("/api/algorithms/min_path_sum/execute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					input: { grid },
				}),
			});

			const data = await response.json();
			setSteps(data.steps);
			setCurrentStep(0);
		} catch (error) {
			console.error("Failed to execute algorithm:", error);
			alert("Failed to compute minimum path sum. Please check your input.");
		} finally {
			setIsLoading(false);
		}
	};

	const currentStepData = steps[currentStep];
	const currentLine = currentStepData?.metadata?.source_line;

	return (
		<div className="min-h-screen p-4 sm:p-6 lg:p-8">
			<div className="max-w-7xl mx-auto space-y-8">
				{/* Breadcrumb */}
				<div className="text-sm text-muted-foreground">
					<a href="/algorithms" className="hover:underline">
						Algorithms
					</a>{" "}
					/{" "}
					<a href="/algorithms/dynamic-programming" className="hover:underline">
						Dynamic Programming
					</a>{" "}
					/ Minimum Path Sum
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Minimum Path Sum</h1>
						<p className="text-muted-foreground">
							Cheapest top-left to bottom-right path through a grid, moving only down or right
						</p>
					</div>
					{steps.length > 0 && (
						<button
							type="button"
							onClick={() => setShowCode(!showCode)}
							className="px-4 py-2 border border-border rounded hover:bg-accent text-sm"
						>
							{showCode ? "Hide Code" : "Show Code"}
						</button>
					)}
				</div>

				{/* Input Controls */}
				<div className="p-6 border border-border rounded-lg space-y-4">
					<label className="block">
						<span className="block text-sm font-medium mb-2">
							Grid (JSON 2D array of non-negative numbers)
						</span>
						<textarea
							value={gridInput}
							onChange={(e) => setGridInput(e.target.value)}
							rows={6}
							className="w-full px-4 py-2 bg-background border border-border rounded font-mono text-sm"
							placeholder={DEFAULT_GRID}
						/>
					</label>
					<p className="text-xs text-muted-foreground">
						The grid fills cost[i][j] = minimum sum to reach cell (i, j) from the top-left, computed
						as grid[i][j] + min(cost above, cost left). The answer is the bottom-right cell.
					</p>
					<button
						type="button"
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Computing..." : "Compute Minimum Path Sum"}
					</button>
				</div>

				{/* Visualization */}
				{steps.length > 0 && (
					<div className="space-y-4">
						{/* Split-pane layout */}
						<div className={`grid ${showCode ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
							{/* Code Viewer */}
							{showCode && sourceCode && (
								<div className="border border-border rounded-lg overflow-hidden">
									<div className="bg-card p-3 border-b border-border">
										<h3 className="font-semibold text-sm">
											Live Code Execution
											{currentLine && (
												<span className="ml-2 text-xs text-muted-foreground">
													Line {currentLine}
												</span>
											)}
										</h3>
									</div>
									<CodeViewer
										code={sourceCode}
										highlightedLine={currentLine as number | undefined}
									/>
								</div>
							)}

							{/* DP Grid Visualization */}
							<div className="p-6 border border-border rounded-lg">
								<GridVisualizer
									grid={(currentStepData?.state?.grid as number[][] | undefined) || []}
									variant="table"
									highlights={currentStepData?.highlights ?? []}
								/>

								{/* Step Description */}
								<div className="mt-4 text-center">
									<p className="text-sm font-medium">{currentStepData?.description}</p>
									<p className="text-xs text-muted-foreground mt-1">
										Step {currentStep + 1} of {steps.length}
									</p>
								</div>

								{/* Metadata */}
								{currentStepData?.metadata && (
									<div className="mt-4 flex justify-center gap-6 text-xs flex-wrap">
										{currentStepData.metadata.grid_value !== undefined && (
											<div>
												Grid Value:{" "}
												<span className="font-mono">
													{currentStepData.metadata.grid_value as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.from !== undefined && (
											<div>
												Came From:{" "}
												<span className="font-mono font-bold">
													{currentStepData.metadata.from as string}
												</span>
											</div>
										)}
										{currentStepData.metadata.value !== undefined && (
											<div>
												Cell Cost:{" "}
												<span className="font-mono">
													{currentStepData.metadata.value as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.min_path_sum !== undefined && (
											<div>
												Min Path Sum:{" "}
												<span className="font-mono font-bold">
													{currentStepData.metadata.min_path_sum as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.cells_filled !== undefined && (
											<div>
												Cells Filled:{" "}
												<span className="font-mono">
													{currentStepData.metadata.cells_filled as number}
												</span>
											</div>
										)}
									</div>
								)}
							</div>
						</div>

						{/* Color Legend */}
						<div className="flex items-center justify-center gap-6 text-xs flex-wrap">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-blue-500 rounded" />
								<span>Current Cell</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-yellow-500 rounded" />
								<span>Chosen Neighbor (min)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-purple-500 rounded" />
								<span>Other Neighbor</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded" />
								<span>Final Answer</span>
							</div>
						</div>

						{/* Playback Controls */}
						<PlaybackControls
							currentStep={currentStep}
							totalSteps={steps.length}
							onStepChange={setCurrentStep}
						/>
					</div>
				)}

				{/* Documentation */}
				<div className="space-y-6">
					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Complexity Analysis</h2>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<h3 className="font-medium mb-2">Time Complexity</h3>
								<p className="text-sm">
									O(m × n) where m, n = grid dimensions
									<br />
									(each cell is computed exactly once)
								</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">
									O(m × n) for the cost table
									<br />
									(can be optimized to O(n) with a rolling row)
								</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>
								Create a cost table: cost[i][j] = minimum sum to reach cell (i, j) from the top-left
							</li>
							<li>Start cell: cost[0][0] = grid[0][0]</li>
							<li>
								First row: only "right" moves are possible, so it is a prefix sum along the top
							</li>
							<li>
								First column: only "down" moves are possible, so it is a prefix sum down the left
							</li>
							<li>
								For every interior cell: cost[i][j] = grid[i][j] + min(cost[i-1][j] above,
								cost[i][j-1] left)
							</li>
							<li>The answer is cost[m-1][n-1] — the bottom-right cell</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>
								✅ Classic 2D DP — each cell depends only on the cell above and the cell to its left
							</li>
							<li>
								✅ Because you can only move down or right, subproblems never overlap in conflicting
								ways — a single forward sweep is optimal
							</li>
							<li>
								✅ Non-negative costs mean a plain DP works; you do NOT need Dijkstra or any
								priority queue
							</li>
							<li>
								💡 Only the previous row is needed at any time, so space collapses to O(n) with a
								rolling array
							</li>
							<li>
								💡 Storing which neighbor "won" at each cell lets you backtrack from the
								bottom-right to reconstruct the actual cheapest path
							</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use / Real-World Applications</h2>
						<ul className="text-sm space-y-2">
							<li>
								<strong>Grid Pathfinding:</strong> Cheapest route through a weighted terrain when
								movement is restricted to down/right (or any monotone direction)
							</li>
							<li>
								<strong>Image Seam Carving:</strong> Content-aware resizing finds a minimum-energy
								seam with the same DP recurrence
							</li>
							<li>
								<strong>Robotics / Logistics:</strong> Minimum-cost traversal of a cost map with
								monotone movement constraints
							</li>
							<li>
								<strong>Interview Staple:</strong> A canonical introduction to 2D grid DP and space
								optimization
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
