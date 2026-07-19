"use client";

import { useEffect, useState } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { GridVisualizer } from "@/components/visualizers/GridVisualizer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { AlgorithmStep } from "@/lib/types";

export default function AStarGridPage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [gridInput, setGridInput] = useState(
		JSON.stringify(
			[
				[0, 0, 0, 0, 0],
				[0, 1, 1, 1, 0],
				[0, 0, 0, 1, 0],
				[1, 1, 0, 1, 0],
				[0, 0, 0, 0, 0],
			],
			null,
			2,
		),
	);
	const [startInput, setStartInput] = useState("[0, 0]");
	const [goalInput, setGoalInput] = useState("[4, 4]");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/astar_grid/source");
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
			const grid = JSON.parse(gridInput);
			const start = JSON.parse(startInput);
			const goal = JSON.parse(goalInput);

			const response = await fetch("/api/algorithms/astar_grid/execute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					input: { grid, start, goal },
				}),
			});

			const data = await response.json();
			setSteps(data.steps);
			setCurrentStep(0);
		} catch (error) {
			console.error("Failed to execute algorithm:", error);
			alert("Invalid input format. Check your grid, start, and goal.");
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
					<a href="/algorithms/graphs" className="hover:underline">
						Graphs
					</a>{" "}
					/ A* Pathfinding (Grid)
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
							A* Pathfinding (Grid)
						</h1>
						<p className="text-muted-foreground">
							Find the shortest path on a 4-connected grid using f = g + h with a Manhattan
							heuristic
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
							Grid (2D array where 0 = open, 1 = wall)
						</span>
						<textarea
							value={gridInput}
							onChange={(e) => setGridInput(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded font-mono text-sm"
							rows={8}
							placeholder="[[0, 0, 0], [0, 1, 0], [0, 0, 0]]"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Format: 2D array of numbers - 0 for open cells, 1 for walls. Movement is 4-directional
							(up, down, left, right).
						</p>
					</label>
					<div className="flex gap-4 flex-wrap">
						<label className="block">
							<span className="block text-sm font-medium mb-2">Start [row, col]</span>
							<input
								value={startInput}
								onChange={(e) => setStartInput(e.target.value)}
								className="w-40 px-4 py-2 bg-background border border-border rounded font-mono text-sm"
								placeholder="[0, 0]"
							/>
						</label>
						<label className="block">
							<span className="block text-sm font-medium mb-2">Goal [row, col]</span>
							<input
								value={goalInput}
								onChange={(e) => setGoalInput(e.target.value)}
								className="w-40 px-4 py-2 bg-background border border-border rounded font-mono text-sm"
								placeholder="[4, 4]"
							/>
						</label>
					</div>
					<button
						type="button"
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Searching..." : "Find Path"}
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

							{/* Grid Visualization */}
							<div className="p-6 border border-border rounded-lg">
								<GridVisualizer
									grid={(currentStepData?.state?.grid as number[][] | undefined) || []}
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
										{currentStepData.metadata.f !== undefined && (
											<div>
												f = g + h:{" "}
												<span className="font-mono font-bold">
													{currentStepData.metadata.f as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.g !== undefined && (
											<div>
												g (cost so far):{" "}
												<span className="font-mono">{currentStepData.metadata.g as number}</span>
											</div>
										)}
										{currentStepData.metadata.h !== undefined && (
											<div>
												h (heuristic):{" "}
												<span className="font-mono">{currentStepData.metadata.h as number}</span>
											</div>
										)}
										{currentStepData.metadata.open_size !== undefined && (
											<div>
												Frontier:{" "}
												<span className="font-mono">
													{currentStepData.metadata.open_size as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.steps !== undefined && (
											<div>
												Expansions:{" "}
												<span className="font-mono">
													{currentStepData.metadata.steps as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.path_length !== undefined && (
											<div>
												Path Length:{" "}
												<span className="font-mono font-bold">
													{currentStepData.metadata.path_length as number}
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
								<div className="w-4 h-4 bg-gray-700 rounded" />
								<span>Open cell (0)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-700 rounded" />
								<span>Wall (1)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-blue-500 rounded" />
								<span>Current / Start / Goal</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-yellow-500 rounded" />
								<span>Frontier (open set)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-purple-500 rounded" />
								<span>Visited (closed set)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded" />
								<span>Final path</span>
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
									O(E log V) with a binary heap
									<br />
									On a grid V = R×C cells, E = O(V) edges
									<br />
									Best case approaches O(V) with a strong heuristic
								</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">
									O(V) for the open set, closed set,
									<br />
									g-scores, and came-from map
								</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>Push the start cell onto a min-heap (open set) keyed by f = g + h</li>
							<li>g = known cost from start; h = Manhattan distance estimate to the goal</li>
							<li>Pop the cell with the smallest f value (most promising)</li>
							<li>If it is the goal, reconstruct the path via the came-from map and stop</li>
							<li>Otherwise mark it visited (closed set) so it is never expanded again</li>
							<li>
								Relax each in-bounds, non-wall neighbor: if the path through the current cell is
								cheaper, update g, set came-from, and push it with its new f
							</li>
							<li>Repeat until the goal is popped or the open set empties (no path)</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>
								💡 f = g + h balances the exact cost so far (g) with an optimistic estimate to goal
								(h), focusing search toward the goal instead of exploring blindly
							</li>
							<li>
								✅ An admissible heuristic (never overestimates) guarantees the optimal shortest
								path. Manhattan distance is the tightest admissible choice on a 4-connected grid
							</li>
							<li>
								💡 With h = 0, A* degenerates into Dijkstra's algorithm; a perfect heuristic walks
								straight to the goal. Heuristic quality controls how much of the grid is explored
							</li>
							<li>
								💡 The closed set prevents re-expanding cells, keeping search efficient when many
								paths converge on the same cell
							</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use</h2>
						<ul className="text-sm space-y-2">
							<li>
								<strong>Game AI Navigation:</strong> Move units and NPCs around obstacles on tile
								maps
							</li>
							<li>
								<strong>Robotics Motion Planning:</strong> Plan collision-free paths for robots on
								occupancy grids
							</li>
							<li>
								<strong>GPS &amp; Routing:</strong> Shortest routes when a good distance estimate to
								the destination exists
							</li>
							<li>
								<strong>Puzzle Solving:</strong> Optimal solutions to sliding puzzles (15-puzzle)
								with an admissible heuristic
							</li>
							<li>
								<strong>Any shortest path with a heuristic:</strong> Prefer A* over Dijkstra when a
								reliable estimate to the goal is available
							</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">A* vs Dijkstra vs Greedy Best-First</h2>
						<div className="grid grid-cols-3 gap-4 text-sm">
							<div>
								<h3 className="font-medium mb-2 text-blue-400">A* (This Implementation)</h3>
								<ul className="space-y-1">
									<li>• f = g + h</li>
									<li>• Optimal with admissible h</li>
									<li>• Balances cost and estimate</li>
									<li>• Best overall on grids</li>
								</ul>
							</div>
							<div>
								<h3 className="font-medium mb-2 text-purple-400">Dijkstra</h3>
								<ul className="space-y-1">
									<li>• f = g (h = 0)</li>
									<li>• Optimal, but uninformed</li>
									<li>• Explores in all directions</li>
									<li>• Slower without a heuristic</li>
								</ul>
							</div>
							<div>
								<h3 className="font-medium mb-2 text-yellow-400">Greedy Best-First</h3>
								<ul className="space-y-1">
									<li>• f = h (ignores g)</li>
									<li>• Fast but not optimal</li>
									<li>• Can be misled by walls</li>
									<li>• No cost guarantee</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
