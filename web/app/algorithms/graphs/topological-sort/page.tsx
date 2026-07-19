"use client";

import { useEffect, useState } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { GraphVisualizer } from "@/components/visualizers/GraphVisualizer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { AlgorithmStep } from "@/lib/types";

export default function TopologicalSortPage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [graphInput, setGraphInput] = useState(
		JSON.stringify({ 0: [1, 2], 1: [3], 2: [3], 3: [4], 4: [] }, null, 2),
	);
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/topological_sort/source");
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

			const response = await fetch("/api/algorithms/topological_sort/execute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					input: { graph },
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

	// Extract nodes and edges from graph. Nodes that only appear as neighbors
	// are added so the graph renders every vertex.
	const getNodesAndEdges = () => {
		try {
			const graph = JSON.parse(graphInput);
			const nodeIds = new Set<number>();
			const edges: Array<{ from: number; to: number }> = [];

			for (const [from, neighbors] of Object.entries(graph)) {
				const fromId = parseInt(from, 10);
				nodeIds.add(fromId);
				for (const to of neighbors as number[]) {
					nodeIds.add(to);
					edges.push({ from: fromId, to });
				}
			}

			const nodes = Array.from(nodeIds)
				.sort((a, b) => a - b)
				.map((id) => ({ id }));

			return { nodes, edges };
		} catch {
			return { nodes: [], edges: [] };
		}
	};

	const { nodes, edges } = getNodesAndEdges();
	const order = currentStepData?.metadata?.order as number[] | undefined;

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
					/ Topological Sort (Kahn&apos;s)
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
							Topological Sort (Kahn&apos;s)
						</h1>
						<p className="text-muted-foreground">
							Linear ordering of a DAG where every edge points forward - built by repeatedly
							removing nodes with no incoming edges
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
							Directed Graph (JSON adjacency list)
						</span>
						<textarea
							value={graphInput}
							onChange={(e) => setGraphInput(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded font-mono text-sm"
							rows={8}
							placeholder='{"0": [1, 2], "1": [3], "2": [3], "3": [4], "4": []}'
						/>
					</label>
					<p className="text-xs text-muted-foreground">
						Each key is a node; its list holds nodes it points to (edge u → v means u must come
						before v). Provide a DAG - a cycle has no valid ordering and will be reported.
					</p>
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

								{/* Current order */}
								{order && order.length > 0 && (
									<div className="mt-4 text-center">
										<span className="text-xs text-muted-foreground">Order: </span>
										<span className="font-mono text-sm">{order.join(" → ")}</span>
									</div>
								)}

								{/* Metadata */}
								{currentStepData?.metadata && (
									<div className="mt-4 flex justify-center gap-6 text-xs">
										{currentStepData.metadata.nodes_placed !== undefined && (
											<div>
												Placed:{" "}
												<span className="font-mono">
													{currentStepData.metadata.nodes_placed as number}
													{currentStepData.metadata.total_nodes !== undefined
														? ` / ${currentStepData.metadata.total_nodes as number}`
														: ""}
												</span>
											</div>
										)}
										{currentStepData.metadata.edges_relaxed !== undefined && (
											<div>
												Edges Relaxed:{" "}
												<span className="font-mono">
													{currentStepData.metadata.edges_relaxed as number}
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
								<div className="w-4 h-4 bg-blue-500 rounded-full" />
								<span>Placing (in-degree 0)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-yellow-500 rounded-full" />
								<span>Ready / Relaxing</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-purple-500 rounded-full" />
								<span>Placed</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded-full" />
								<span>Final Order</span>
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
									O(V + E) - each node is processed once and each edge relaxed once
								</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">
									O(V + E) - in-degree map, ready queue, output order, and adjacency list
								</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>Compute the in-degree (number of incoming edges) of every node</li>
							<li>Enqueue all nodes whose in-degree is 0 - nothing must come before them</li>
							<li>Remove a node from the queue and append it to the output order</li>
							<li>Decrement the in-degree of each of its neighbors</li>
							<li>Any neighbor whose in-degree drops to 0 becomes ready - enqueue it</li>
							<li>
								Repeat until the queue is empty. If fewer than V nodes were placed, the graph
								contains a cycle
							</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>💡 In-degree 0 means &quot;no unmet dependencies&quot; - safe to place next</li>
							<li>✅ Detects cycles for free: a leftover node means a cycle exists</li>
							<li>💡 The ordering is not unique - ties can be broken any way you like</li>
							<li>✅ Iterative (BFS-style), so no recursion depth limit unlike the DFS variant</li>
							<li>❌ Only Directed Acyclic Graphs (DAGs) have a topological ordering</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use / Real-World</h2>
						<ul className="text-sm space-y-2">
							<li>📦 Build systems &amp; package managers - resolve dependency install order</li>
							<li>📅 Task &amp; job scheduling with prerequisite constraints</li>
							<li>🎓 Course scheduling where classes have prerequisites</li>
							<li>📊 Evaluating spreadsheet formulas / computation graphs in dependency order</li>
							<li>🔁 Detecting circular dependencies (deadlock / import cycles)</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
