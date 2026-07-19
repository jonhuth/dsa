"use client";

import { useEffect, useState } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { GridVisualizer } from "@/components/visualizers/GridVisualizer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { AlgorithmStep } from "@/lib/types";

export default function UniquePathsPage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [rows, setRows] = useState("3");
	const [cols, setCols] = useState("7");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/unique_paths/source");
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
			const rowsValue = Number.parseInt(rows, 10);
			const colsValue = Number.parseInt(cols, 10);

			const response = await fetch("/api/algorithms/unique_paths/execute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					input: {
						rows: rowsValue,
						cols: colsValue,
					},
				}),
			});

			const data = await response.json();
			setSteps(data.steps);
			setCurrentStep(0);
		} catch (error) {
			console.error("Failed to execute algorithm:", error);
			alert("Invalid input. Please enter valid grid dimensions.");
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
					/ Unique Paths
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Unique Paths</h1>
						<p className="text-muted-foreground">
							Count distinct top-left to bottom-right paths in a grid using dynamic programming
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
					<div className="grid grid-cols-2 gap-4">
						<label className="block">
							<span className="block text-sm font-medium mb-2">Rows</span>
							<input
								type="number"
								value={rows}
								onChange={(e) => setRows(e.target.value)}
								className="w-full px-4 py-2 bg-background border border-border rounded"
								placeholder="3"
								min="1"
								max="10"
							/>
						</label>
						<label className="block">
							<span className="block text-sm font-medium mb-2">Columns</span>
							<input
								type="number"
								value={cols}
								onChange={(e) => setCols(e.target.value)}
								className="w-full px-4 py-2 bg-background border border-border rounded"
								placeholder="7"
								min="1"
								max="10"
							/>
						</label>
					</div>
					<p className="text-xs text-muted-foreground">
						The robot starts at the top-left cell and may move only right or down. Dimensions are
						clamped to 1-10.
					</p>
					<button
						type="button"
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Computing..." : "Count Paths"}
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
										{currentStepData.metadata.current_cell && (
											<div>
												Current Cell:{" "}
												<span className="font-mono">
													({(currentStepData.metadata.current_cell as number[])[0]},{" "}
													{(currentStepData.metadata.current_cell as number[])[1]})
												</span>
											</div>
										)}
										{currentStepData.metadata.from_above !== undefined && (
											<div>
												From Above:{" "}
												<span className="font-mono">
													{currentStepData.metadata.from_above as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.from_left !== undefined && (
											<div>
												From Left:{" "}
												<span className="font-mono">
													{currentStepData.metadata.from_left as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.value !== undefined && (
											<div>
												Paths to Cell:{" "}
												<span className="font-mono font-bold">
													{currentStepData.metadata.value as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.total_paths !== undefined && (
											<div>
												Total Paths:{" "}
												<span className="font-mono font-bold">
													{currentStepData.metadata.total_paths as number}
												</span>
											</div>
										)}
									</div>
								)}
							</div>
						</div>

						{/* Color Legend */}
						<div className="flex items-center justify-center gap-6 text-xs">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-blue-500 rounded" />
								<span>Current Cell</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-yellow-500 rounded" />
								<span>Cell Above</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-purple-500 rounded" />
								<span>Cell Left</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded" />
								<span>Destination</span>
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
									O(m × n) where m = rows, n = cols
									<br />
									(naive recursion is O(2^(m+n)))
								</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">
									O(m × n) for the DP grid
									<br />
									(can be optimized to O(n) with a rolling row)
								</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>Create a 2D DP grid: dp[i][j] = number of unique paths from (0,0) to (i,j)</li>
							<li>Base case: every cell in the first row and first column has exactly 1 path</li>
							<li>For each interior cell, paths arrive from directly above or from the left:</li>
							<li className="ml-6">dp[i][j] = dp[i-1][j] + dp[i][j-1]</li>
							<li>Fill the grid top-to-bottom, left-to-right so dependencies are ready</li>
							<li>The answer is dp[rows-1][cols-1] (the bottom-right cell)</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>✅ Classic 2D DP - overlapping subproblems + optimal substructure</li>
							<li>
								✅ Each cell only depends on its top and left neighbors, so a single pass fills the
								grid
							</li>
							<li>
								✅ First row and first column are always 1 (only one straight-line way to reach an
								edge cell)
							</li>
							<li>
								💡 There is a closed-form answer: C(m+n-2, m-1) - choosing which of the total moves
								go down
							</li>
							<li>
								💡 Space can be reduced to O(n) since each row only needs the row directly above it
							</li>
							<li>
								💡 Adding obstacles (Unique Paths II) just forces blocked cells to 0 - same
								recurrence otherwise
							</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use / Real-World Applications</h2>
						<ul className="text-sm space-y-2">
							<li>
								<strong>Robot / Grid Path Planning:</strong> Count routes for an agent restricted to
								forward moves
							</li>
							<li>
								<strong>Combinatorics:</strong> Model lattice-path counting problems as grid DP
							</li>
							<li>
								<strong>Probability Lattices:</strong> Enumerate outcome paths in binomial-style
								trees
							</li>
							<li>
								<strong>Warehouse / Logistics Routing:</strong> Count monotone routes across a shelf
								or map grid
							</li>
							<li>
								<strong>Interview Warm-up:</strong> A canonical first 2D DP problem before Unique
								Paths II and Minimum Path Sum
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
