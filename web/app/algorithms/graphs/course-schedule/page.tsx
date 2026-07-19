"use client";

import { useEffect, useState } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { GraphVisualizer } from "@/components/visualizers/GraphVisualizer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { AlgorithmStep } from "@/lib/types";

export default function CourseSchedulePage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [graphInput, setGraphInput] = useState(JSON.stringify({ 0: [1], 1: [2], 2: [] }, null, 2));
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/course_schedule/source");
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

			const response = await fetch("/api/algorithms/course_schedule/execute", {
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
	// are added so the graph renders every course.
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
	const canFinish = currentStepData?.metadata?.can_finish as boolean | null | undefined;

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
					/ Course Schedule (Cycle Detection)
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
							Course Schedule (Cycle Detection)
						</h1>
						<p className="text-muted-foreground">
							Can every course be finished? Only if the prerequisite graph has no cycle - found via
							DFS three-color marking that flags a back edge to a node still on the path
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
							Prerequisite Graph (JSON adjacency list)
						</span>
						<textarea
							value={graphInput}
							onChange={(e) => setGraphInput(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded font-mono text-sm"
							rows={8}
							placeholder='{"0": [1], "1": [2], "2": []}'
						/>
					</label>
					<p className="text-xs text-muted-foreground">
						Each key is a course; its list holds courses that depend on it (edge u → v means u is a
						prerequisite of v). A DAG can be finished; a cycle (e.g.{" "}
						<code className="font-mono">{'{"0": [1], "1": [2], "2": [0]}'}</code>) cannot.
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

								{/* Verdict */}
								{canFinish !== undefined && canFinish !== null && (
									<div className="mt-4 text-center">
										<span
											className={`inline-block px-3 py-1 rounded text-sm font-medium ${
												canFinish
													? "bg-green-500/15 text-green-500"
													: "bg-yellow-500/15 text-yellow-500"
											}`}
										>
											{canFinish ? "Can finish all courses" : "Cannot finish - cycle detected"}
										</span>
									</div>
								)}

								{/* Valid order */}
								{canFinish && order && order.length > 0 && (
									<div className="mt-4 text-center">
										<span className="text-xs text-muted-foreground">Valid order: </span>
										<span className="font-mono text-sm">{order.join(" → ")}</span>
									</div>
								)}

								{/* Metadata */}
								{currentStepData?.metadata && (
									<div className="mt-4 flex justify-center gap-6 text-xs">
										{currentStepData.metadata.nodes_processed !== undefined && (
											<div>
												Finished:{" "}
												<span className="font-mono">
													{currentStepData.metadata.nodes_processed as number}
													{currentStepData.metadata.total_nodes !== undefined
														? ` / ${currentStepData.metadata.total_nodes as number}`
														: ""}
												</span>
											</div>
										)}
										{currentStepData.metadata.edges_examined !== undefined && (
											<div>
												Edges Examined:{" "}
												<span className="font-mono">
													{currentStepData.metadata.edges_examined as number}
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
								<div className="w-4 h-4 bg-gray-500 rounded-full" />
								<span>White (unvisited)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-blue-500 rounded-full" />
								<span>Current</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-yellow-500 rounded-full" />
								<span>Gray (on path) / Cycle</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-purple-500 rounded-full" />
								<span>Black (done)</span>
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
									O(V + E) - each course is colored once and each prerequisite edge examined once
								</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">
									O(V + E) - color map and recursion stack, plus the adjacency list
								</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>Mark every course WHITE (unvisited)</li>
							<li>Run DFS from each unvisited course, coloring it GRAY when it enters the path</li>
							<li>For each edge, look at the neighbor&apos;s color</li>
							<li>
								GRAY neighbor = a back edge to a node still on the stack = a cycle - the schedule
								cannot be finished
							</li>
							<li>BLACK neighbor is already proven cycle-free, so it can be skipped</li>
							<li>
								When all of a course&apos;s neighbors are explored, color it BLACK and record it
							</li>
							<li>
								If DFS finishes with no back edge, reversing the finish (post) order gives a valid
								course schedule
							</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>
								💡 &quot;Can finish all courses&quot; is exactly &quot;the graph is acyclic&quot;
							</li>
							<li>
								✅ A back edge - an edge to a GRAY node still on the recursion stack - is the
								signature of a cycle
							</li>
							<li>💡 An edge to a BLACK node is safe: that subtree is already known cycle-free</li>
							<li>
								✅ No cycle? Reverse post-order is a valid schedule for free (topological sort)
							</li>
							<li>
								❌ Two colors (visited / unvisited) are not enough - you must distinguish
								&quot;done&quot; from &quot;on the current path&quot;
							</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use / Real-World</h2>
						<ul className="text-sm space-y-2">
							<li>🎓 Course scheduling with prerequisites (the canonical problem)</li>
							<li>📦 Build systems &amp; package managers - detect circular dependencies</li>
							<li>🔁 Import / module cycle detection in compilers and linkers</li>
							<li>🔒 Deadlock detection in resource allocation graphs</li>
							<li>📅 Any &quot;can these dependent tasks be ordered?&quot; feasibility check</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
