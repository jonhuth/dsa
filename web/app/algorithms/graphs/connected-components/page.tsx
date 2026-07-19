"use client";

import { useEffect, useState } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { GraphVisualizer } from "@/components/visualizers/GraphVisualizer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { AlgorithmStep } from "@/lib/types";

// Distinct colors cycled per component - mirrors the palette used by the
// Python ConnectedComponents implementation so labels line up.
const COMPONENT_COLORS = ["found", "visited", "comparing", "path"];

export default function ConnectedComponentsPage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [graphInput, setGraphInput] = useState(
		JSON.stringify({ 0: [1], 1: [0], 2: [3], 3: [2], 4: [] }, null, 2),
	);
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/connected_components/source");
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

			const response = await fetch("/api/algorithms/connected_components/execute", {
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

	// Extract nodes and edges from graph. The graph is UNDIRECTED, so each edge
	// is drawn once (u-v and v-u collapse to a single line) and nodes that only
	// appear as neighbors are added so every vertex renders.
	const getNodesAndEdges = () => {
		try {
			const graph = JSON.parse(graphInput);
			const nodeIds = new Set<number>();
			const edgeKeys = new Set<string>();
			const edges: Array<{ from: number; to: number }> = [];

			for (const [from, neighbors] of Object.entries(graph)) {
				const fromId = parseInt(from, 10);
				nodeIds.add(fromId);
				for (const to of neighbors as number[]) {
					nodeIds.add(to);
					const key = fromId < to ? `${fromId}-${to}` : `${to}-${fromId}`;
					if (!edgeKeys.has(key)) {
						edgeKeys.add(key);
						edges.push({ from: fromId, to });
					}
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

	// Build node highlights from metadata that survives serialization
	// (component_id + current). The current node wins by being placed first.
	const componentId = currentStepData?.metadata?.component_id as
		| Record<string, number | null>
		| undefined;
	const current = currentStepData?.metadata?.current as number | null | undefined;

	const highlights: Array<{ type: "node"; id: number; color: string }> = [];
	if (current !== undefined && current !== null) {
		highlights.push({ type: "node", id: current, color: "active" });
	}
	if (componentId) {
		for (const [nodeStr, cid] of Object.entries(componentId)) {
			const id = parseInt(nodeStr, 10);
			if (cid === null || cid === undefined) continue;
			if (id === current) continue;
			highlights.push({
				type: "node",
				id,
				color: COMPONENT_COLORS[cid % COMPONENT_COLORS.length],
			});
		}
	}

	const componentCount = currentStepData?.metadata?.component_count as number | undefined;

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
					/ Connected Components (DFS)
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
							Connected Components (DFS)
						</h1>
						<p className="text-muted-foreground">
							Count the disconnected pieces of an undirected graph - scan every node and flood each
							new one with a depth-first search that labels its whole component
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
							Undirected Graph (JSON adjacency list)
						</span>
						<textarea
							value={graphInput}
							onChange={(e) => setGraphInput(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded font-mono text-sm"
							rows={8}
							placeholder='{"0": [1], "1": [0], "2": [3], "3": [2], "4": []}'
						/>
					</label>
					<p className="text-xs text-muted-foreground">
						Each key is a node; its list holds the nodes it shares an edge with. Edges are
						UNDIRECTED (u-v is symmetric), so listing the edge on either endpoint is enough. An
						empty list is an isolated node - its own component.
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
									<GraphVisualizer nodes={nodes} edges={edges} highlights={highlights} />
								</div>

								{/* Step Description */}
								<div className="mt-4 text-center">
									<p className="text-sm font-medium">{currentStepData?.description}</p>
									<p className="text-xs text-muted-foreground mt-1">
										Step {currentStep + 1} of {steps.length}
									</p>
								</div>

								{/* Component count */}
								{componentCount !== undefined && (
									<div className="mt-4 text-center">
										<span className="text-xs text-muted-foreground">Components found: </span>
										<span className="font-mono text-sm">{componentCount}</span>
									</div>
								)}

								{/* Metadata */}
								{currentStepData?.metadata && (
									<div className="mt-4 flex justify-center gap-6 text-xs">
										{currentStepData.metadata.nodes_visited !== undefined && (
											<div>
												Visited:{" "}
												<span className="font-mono">
													{currentStepData.metadata.nodes_visited as number}
													{currentStepData.metadata.total_nodes !== undefined
														? ` / ${currentStepData.metadata.total_nodes as number}`
														: ""}
												</span>
											</div>
										)}
										{currentStepData.metadata.edges_explored !== undefined && (
											<div>
												Edges Explored:{" "}
												<span className="font-mono">
													{currentStepData.metadata.edges_explored as number}
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
								<span>Current node</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded-full" />
								<span>Component 1</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-purple-500 rounded-full" />
								<span>Component 2</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-yellow-500 rounded-full" />
								<span>Component 3</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-gray-500 rounded-full" />
								<span>Unvisited</span>
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
									O(V + E) - every node is visited once and every edge examined once
								</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">
									O(V + E) - visited set, component labels, DFS stack, and adjacency list
								</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>Treat the graph as undirected - make the adjacency list symmetric</li>
							<li>Scan every node in order, keeping a visited set and a component counter</li>
							<li>When a node has not been visited, it opens a brand-new component</li>
							<li>Run a depth-first search from that node, labeling everything it reaches</li>
							<li>Every reachable node gets the same component id and is marked visited</li>
							<li>
								Continue the outer scan; each fresh unvisited node increments the component count.
								The total is the number of connected components
							</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>
								💡 A single DFS only explores ONE component - the outer loop over all nodes is what
								lets you count and label every disconnected piece
							</li>
							<li>
								✅ Still O(V + E): the visited set means no node is explored twice even though the
								outer loop touches all V nodes
							</li>
							<li>
								💡 Isolated nodes (no edges) are valid components of size 1 - found by the outer
								scan even though their DFS explores nothing
							</li>
							<li>
								❌ This is for UNDIRECTED graphs - directed graphs need *strongly* connected
								components (Tarjan&apos;s / Kosaraju&apos;s), a different algorithm
							</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use / Real-World</h2>
						<ul className="text-sm space-y-2">
							<li>🖼️ Image processing - counting distinct blobs / regions of connected pixels</li>
							<li>🌐 Network analysis - finding isolated clusters or friend groups in a graph</li>
							<li>🗺️ Counting separate landmasses / islands or reachable regions on a map</li>
							<li>🧩 Detecting whether a graph is fully connected (exactly one component)</li>
							<li>
								🔗 Union-Find is the classic alternative when edges arrive incrementally (online
								connectivity)
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
