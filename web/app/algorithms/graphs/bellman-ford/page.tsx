"use client";

import { useEffect, useState } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { GraphVisualizer } from "@/components/visualizers/GraphVisualizer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { AlgorithmStep } from "@/lib/types";

export default function BellmanFordPage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [graphInput, setGraphInput] = useState(
		JSON.stringify(
			{
				0: [
					[1, 4],
					[2, 5],
				],
				1: [[3, 3]],
				2: [
					[1, -2],
					[3, 4],
				],
				3: [],
			},
			null,
			2,
		),
	);
	const [startNode, setStartNode] = useState("0");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/bellman_ford/source");
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
			const graph = JSON.parse(graphInput);
			const start = parseInt(startNode, 10);

			const response = await fetch("/api/algorithms/bellman_ford/execute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					input: { graph, start },
				}),
			});

			const data = await response.json();
			setSteps(data.steps);
			setCurrentStep(0);
		} catch (error) {
			console.error("Failed to execute algorithm:", error);
			alert("Invalid graph format. Please check your input.");
		} finally {
			setIsLoading(false);
		}
	};

	const currentStepData = steps[currentStep];
	const currentLine = currentStepData?.metadata?.source_line;

	// Extract nodes and edges from weighted graph
	const getNodesAndEdges = () => {
		try {
			const graph = JSON.parse(graphInput);
			const nodes = Object.keys(graph).map((id) => ({ id: parseInt(id, 10) }));
			const edges: Array<{ from: number; to: number; label?: string }> = [];

			for (const [from, neighbors] of Object.entries(graph)) {
				for (const [to, weight] of neighbors as Array<[number, number]>) {
					edges.push({ from: parseInt(from, 10), to, label: String(weight) });
				}
			}

			return { nodes, edges };
		} catch {
			return { nodes: [], edges: [] };
		}
	};

	const { nodes, edges } = getNodesAndEdges();

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
					/ Bellman-Ford
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
							Bellman-Ford Algorithm
						</h1>
						<p className="text-muted-foreground">
							Single-source shortest paths for weighted graphs — handles negative edges and detects
							negative-weight cycles
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
							Weighted Graph (JSON adjacency list)
						</span>
						<textarea
							value={graphInput}
							onChange={(e) => setGraphInput(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded font-mono text-sm"
							rows={10}
							placeholder='{"0": [[1, 4], [2, 5]], "1": [[3, 3]], "2": [[1, -2], [3, 4]], "3": []}'
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Format: {`{node: [[neighbor, weight], ...], ...}`} — weights may be negative
						</p>
					</label>
					<div className="grid grid-cols-2 gap-4">
						<label className="block">
							<span className="block text-sm font-medium mb-2">Start Node</span>
							<input
								type="number"
								value={startNode}
								onChange={(e) => setStartNode(e.target.value)}
								className="w-full px-4 py-2 bg-background border border-border rounded"
								placeholder="0"
							/>
						</label>
					</div>
					<button
						type="button"
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Running..." : "Run Algorithm"}
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

							{/* Graph Visualization */}
							<div className="p-6 border border-border rounded-lg">
								<div className="flex justify-center">
									<GraphVisualizer
										nodes={nodes}
										edges={edges}
										highlights={currentStepData?.highlights ?? []}
									/>
								</div>

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
										{currentStepData.metadata.iteration !== undefined && (
											<div>
												Pass:{" "}
												<span className="font-mono">
													{currentStepData.metadata.iteration as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.relaxations !== undefined && (
											<div>
												Relaxations:{" "}
												<span className="font-mono">
													{currentStepData.metadata.relaxations as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.weight !== undefined && (
											<div>
												Edge weight:{" "}
												<span className="font-mono">
													{currentStepData.metadata.weight as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.negative_cycle === true && (
											<div className="text-red-500 font-semibold">Negative cycle!</div>
										)}
									</div>
								)}
							</div>
						</div>

						{/* Color Legend */}
						<div className="flex items-center justify-center gap-6 text-xs">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-blue-500 rounded-full" />
								<span>Source of edge</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-yellow-500 rounded-full" />
								<span>Target being relaxed</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded-full" />
								<span>Distance updated</span>
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
									O(V · E) — relax every edge across V−1 passes
									<br />V = vertices, E = edges
								</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">O(V) for distance and predecessor tables</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>Initialize all distances to infinity except the source (0)</li>
							<li>Repeat V−1 times: relax every edge (u → v, w)</li>
							<li>Relaxing means: if dist[u] + w &lt; dist[v], update dist[v]</li>
							<li>After V−1 passes, all shortest paths (≤ V−1 edges) have settled</li>
							<li>Run one extra pass: if any edge still relaxes, a negative cycle exists</li>
							<li>Otherwise the computed distances are final and optimal</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>✅ Handles negative edge weights (unlike Dijkstra)</li>
							<li>✅ Detects negative-weight cycles reachable from the source</li>
							<li>💡 A shortest path visits at most V−1 edges, so V−1 passes suffice</li>
							<li>💡 Dynamic programming: each pass extends optimal paths by one more edge</li>
							<li>💡 If a pass makes no updates, distances have converged — stop early</li>
							<li>
								❌ Slower than Dijkstra's O((V + E) log V); prefer Dijkstra when weights are
								non-negative
							</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When To Use</h2>
						<ul className="text-sm space-y-2">
							<li>📍 Shortest paths in graphs that contain negative edge weights</li>
							<li>📍 Detecting negative-weight cycles (e.g. currency arbitrage)</li>
							<li>📍 Distance-vector routing protocols such as RIP</li>
							<li>📍 As a subroutine in Johnson's all-pairs shortest paths</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
