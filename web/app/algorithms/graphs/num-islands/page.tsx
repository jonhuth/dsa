"use client";

import { useEffect, useState } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { GridVisualizer } from "@/components/visualizers/GridVisualizer";

export default function NumIslandsPage() {
	const [steps, setSteps] = useState<any[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [gridInput, setGridInput] = useState(
		JSON.stringify(
			[
				["1", "1", "1", "1", "0"],
				["1", "1", "0", "1", "0"],
				["1", "1", "0", "0", "0"],
				["0", "0", "0", "0", "0"],
			],
			null,
			2,
		),
	);
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/num_islands/source");
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

			const response = await fetch("/api/algorithms/num_islands/execute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					input: { grid: grid },
				}),
			});

			const data = await response.json();
			setSteps(data.steps);
			setCurrentStep(0);
		} catch (error) {
			console.error("Failed to execute algorithm:", error);
			alert("Invalid grid format. Please check your input.");
		} finally {
			setIsLoading(false);
		}
	};

	const currentStepData = steps[currentStep];
	const currentLine = currentStepData?.metadata?.source_line;

	return (
		<div className="min-h-screen p-8">
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
					/ Number of Islands
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-4xl font-bold mb-2">Number of Islands</h1>
						<p className="text-muted-foreground">
							Count connected components in a 2D grid using BFS/DFS
						</p>
					</div>
					{steps.length > 0 && (
						<button
							onClick={() => setShowCode(!showCode)}
							className="px-4 py-2 border border-border rounded hover:bg-accent text-sm"
						>
							{showCode ? "Hide Code" : "Show Code"}
						</button>
					)}
				</div>

				{/* Input Controls */}
				<div className="p-6 border border-border rounded-lg space-y-4">
					<div>
						<label className="block text-sm font-medium mb-2">
							Grid (2D array where "1" = land, "0" = water)
						</label>
						<textarea
							value={gridInput}
							onChange={(e) => setGridInput(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded font-mono text-sm"
							rows={8}
							placeholder='[["1", "1", "0"], ["1", "0", "0"], ["0", "0", "1"]]'
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Format: 2D array of strings - "1" for land, "0" for water. An island is formed by
							connecting adjacent lands horizontally or vertically.
						</p>
					</div>
					<button
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Counting..." : "Count Islands"}
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
									<CodeViewer code={sourceCode} highlightedLine={currentLine} />
								</div>
							)}

							{/* Grid Visualization */}
							<div className="p-6 border border-border rounded-lg">
								<GridVisualizer
									grid={currentStepData?.state?.grid || []}
									highlights={currentStepData?.highlights || []}
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
										{currentStepData.metadata.island_count !== undefined && (
											<div>
												Islands Found:{" "}
												<span className="font-mono font-bold">
													{currentStepData.metadata.island_count}
												</span>
											</div>
										)}
										{currentStepData.metadata.island_size !== undefined && (
											<div>
												Current Island Size:{" "}
												<span className="font-mono">{currentStepData.metadata.island_size}</span>
											</div>
										)}
										{currentStepData.metadata.current_pos && (
											<div>
												Position:{" "}
												<span className="font-mono">
													({currentStepData.metadata.current_pos[0]},{" "}
													{currentStepData.metadata.current_pos[1]})
												</span>
											</div>
										)}
										{currentStepData.metadata.rows !== undefined && (
											<div>
												Grid Size:{" "}
												<span className="font-mono">
													{currentStepData.metadata.rows} × {currentStepData.metadata.cols}
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
								<div className="w-4 h-4 bg-blue-900 rounded" />
								<span>Water (0)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-700 rounded" />
								<span>Land (1)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-blue-500 rounded" />
								<span>Exploring</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-purple-500 rounded" />
								<span>Visited</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded" />
								<span>Island Complete</span>
							</div>
						</div>

						{/* Playback Controls */}
						<div className="flex items-center justify-center gap-4">
							<button
								onClick={() => setCurrentStep(0)}
								disabled={currentStep === 0}
								className="px-4 py-2 border border-border rounded hover:bg-accent disabled:opacity-50"
							>
								First
							</button>
							<button
								onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
								disabled={currentStep === 0}
								className="px-4 py-2 border border-border rounded hover:bg-accent disabled:opacity-50"
							>
								Previous
							</button>
							<button
								onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
								disabled={currentStep === steps.length - 1}
								className="px-4 py-2 border border-border rounded hover:bg-accent disabled:opacity-50"
							>
								Next
							</button>
							<button
								onClick={() => setCurrentStep(steps.length - 1)}
								disabled={currentStep === steps.length - 1}
								className="px-4 py-2 border border-border rounded hover:bg-accent disabled:opacity-50"
							>
								Last
							</button>
						</div>
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
									Each cell visited at most once
								</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">
									O(min(m, n)) for BFS queue
									<br />
									Or O(m × n) for DFS call stack
								</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>Scan grid cell by cell (nested loops)</li>
							<li>When we find unvisited land ("1"), we found a new island</li>
							<li>Increment island counter</li>
							<li>Use BFS/DFS to mark all cells of this island as visited</li>
							<li>
								BFS explores 4 directions (up, down, left, right) from each cell, adding neighbors
								to queue
							</li>
							<li>Continue scanning for more unvisited land</li>
							<li>Final count = number of times we initiated BFS/DFS</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>✅ Classic connected components problem on a 2D grid</li>
							<li>✅ Each island is a connected component of "1"s (land cells)</li>
							<li>
								✅ BFS and DFS both work - BFS uses queue (O(min(m,n))), DFS uses call stack (O(m×n)
								worst case)
							</li>
							<li>💡 Key insight: count how many times we START a new BFS/DFS = island count</li>
							<li>💡 Marking cells as visited prevents counting same island twice</li>
							<li>💡 Can modify grid in-place (mark "1" as "-1") or use separate visited array</li>
							<li>
								💡 Only horizontal/vertical neighbors count (4-directional) - diagonal doesn't
								connect islands
							</li>
							<li>
								💡 Used in: map analysis, image segmentation, cluster detection, connected regions
							</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Real-World Applications</h2>
						<ul className="text-sm space-y-2">
							<li>
								<strong>Map Analysis:</strong> Count land masses, lakes, or geographic features
							</li>
							<li>
								<strong>Image Segmentation:</strong> Identify distinct objects or regions in images
							</li>
							<li>
								<strong>Network Analysis:</strong> Find isolated network clusters or subnets
							</li>
							<li>
								<strong>Game Development:</strong> Detect connected regions in tile-based games
							</li>
							<li>
								<strong>Circuit Design:</strong> Identify connected components in circuit boards
							</li>
							<li>
								<strong>Social Networks:</strong> Find disconnected communities or groups
							</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">BFS vs DFS for This Problem</h2>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<h3 className="font-medium mb-2 text-blue-400">BFS (This Implementation)</h3>
								<ul className="space-y-1">
									<li>• Uses queue (FIFO)</li>
									<li>• Explores level by level</li>
									<li>• Space: O(min(m, n))</li>
									<li>• Better for wide, shallow islands</li>
									<li>• Iterative implementation</li>
								</ul>
							</div>
							<div>
								<h3 className="font-medium mb-2 text-purple-400">DFS Alternative</h3>
								<ul className="space-y-1">
									<li>• Uses call stack (LIFO)</li>
									<li>• Explores depth first</li>
									<li>• Space: O(m × n) worst case</li>
									<li>• Better for narrow, deep islands</li>
									<li>• Recursive implementation</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
