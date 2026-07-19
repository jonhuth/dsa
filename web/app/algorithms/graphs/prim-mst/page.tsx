"use client";

import { useEffect, useState } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { GraphVisualizer } from "@/components/visualizers/GraphVisualizer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { AlgorithmStep } from "@/lib/types";

export default function PrimMstPage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [graphInput, setGraphInput] = useState(
		JSON.stringify(
			{
				0: [
					[1, 2],
					[3, 6],
				],
				1: [
					[0, 2],
					[2, 3],
					[3, 8],
					[4, 5],
				],
				2: [
					[1, 3],
					[4, 7],
				],
				3: [
					[0, 6],
					[1, 8],
				],
				4: [
					[1, 5],
					[2, 7],
				],
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
				const response = await fetch("/api/algorithms/prim_mst/source");
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

			const response = await fetch("/api/algorithms/prim_mst/execute", {
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

	// Extract nodes and edges from the weighted graph. The graph is UNDIRECTED,
	// so each edge is drawn once (u-v and v-u collapse to a single line, keeping
	// the smaller weight if listed twice) with its weight as the label. Nodes
	// that only appear as neighbors are added so every vertex renders.
	const getNodesAndEdges = () => {
		try {
			const graph = JSON.parse(graphInput);
			const nodeIds = new Set<number>();
			const edgeWeights = new Map<string, number>();

			for (const [from, neighbors] of Object.entries(graph)) {
				const fromId = parseInt(from, 10);
				nodeIds.add(fromId);
				for (const [to, weight] of neighbors as Array<[number, number]>) {
					nodeIds.add(to);
					const key = fromId < to ? `${fromId}-${to}` : `${to}-${fromId}`;
					const existing = edgeWeights.get(key);
					if (existing === undefined || weight < existing) {
						edgeWeights.set(key, weight);
					}
				}
			}

			const edges: Array<{ from: number; to: number; label?: string }> = [];
			for (const [key, weight] of edgeWeights) {
				const [from, to] = key.split("-").map((n) => parseInt(n, 10));
				edges.push({ from, to, label: String(weight) });
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

	// Build highlights from metadata that survives serialization (the pydantic
	// Highlight model strips the type/id fields, so we reconstruct here from the
	// metadata the Python step emits). Node priority: current > in-tree > frontier
	// (GraphVisualizer's .find picks the first matching entry, so order matters).
	const meta = currentStepData?.metadata;
	const treeNodes = (meta?.tree_nodes as number[] | undefined) ?? [];
	const frontierNodes = (meta?.frontier_nodes as number[] | undefined) ?? [];
	const current = meta?.current as number | null | undefined;
	const mstEdges = (meta?.mst_edges as Array<[number, number, number]> | undefined) ?? [];
	const candidateEdges =
		(meta?.candidate_edges as Array<[number, number, number]> | undefined) ?? [];

	const pairKey = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);
	const mstEdgeKeys = new Set(mstEdges.map(([a, b]) => pairKey(a, b)));
	const candidateEdgeKeys = new Set(candidateEdges.map(([a, b]) => pairKey(a, b)));

	const highlights: Array<{ type: "node" | "edge"; id: number | string; color: string }> = [];

	// Nodes.
	if (current !== undefined && current !== null) {
		highlights.push({ type: "node", id: current, color: "active" });
	}
	for (const n of treeNodes) {
		if (n === current) continue;
		highlights.push({ type: "node", id: n, color: "visited" });
	}
	for (const n of frontierNodes) {
		if (n === current || treeNodes.includes(n)) continue;
		highlights.push({ type: "node", id: n, color: "comparing" });
	}

	// Edges - matched against the drawn edge ids (from-to) in either direction.
	for (const edge of edges) {
		const key = pairKey(edge.from, edge.to);
		const edgeId = `${edge.from}-${edge.to}`;
		if (mstEdgeKeys.has(key)) {
			highlights.push({ type: "edge", id: edgeId, color: "path" });
		} else if (candidateEdgeKeys.has(key)) {
			highlights.push({ type: "edge", id: edgeId, color: "active" });
		}
	}

	const mstWeight = meta?.mst_weight as number | undefined;
	const edgesInMst = meta?.edges_in_mst as number | undefined;

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
					/ Prim's Minimum Spanning Tree
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
							Prim's Minimum Spanning Tree
						</h1>
						<p className="text-muted-foreground">
							Grow a minimum spanning tree from a start node, one cheapest crossing edge at a time
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
							rows={12}
							placeholder='{"0": [[1, 2], [3, 6]], "1": [[0, 2], [2, 3]]}'
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Format: {`{node: [[neighbor, weight], ...], ...}`}. Edges are UNDIRECTED (u-v is
							symmetric), so listing an edge on either endpoint is enough.
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
									<GraphVisualizer nodes={nodes} edges={edges} highlights={highlights} />
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
										{mstWeight !== undefined && (
											<div>
												MST Weight: <span className="font-mono">{mstWeight}</span>
											</div>
										)}
										{edgesInMst !== undefined && (
											<div>
												Edges in MST: <span className="font-mono">{edgesInMst}</span>
											</div>
										)}
										{currentStepData.metadata.total_nodes !== undefined && (
											<div>
												Tree Size:{" "}
												<span className="font-mono">
													{treeNodes.length} / {currentStepData.metadata.total_nodes as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.edges_considered !== undefined && (
											<div>
												Edges Considered:{" "}
												<span className="font-mono">
													{currentStepData.metadata.edges_considered as number}
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
								<div className="w-4 h-4 bg-blue-500 rounded-full" />
								<span>Just added / candidate edge</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-purple-500 rounded-full" />
								<span>In MST (tree node)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-yellow-500 rounded-full" />
								<span>Frontier candidate node</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded-full" />
								<span>MST edge</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-gray-500 rounded-full" />
								<span>Not yet reached</span>
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
									<br />V = vertices, E = edges
								</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">
									O(V + E) for the in-tree set, chosen edges, and the heap of crossing edges
								</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>Treat the graph as undirected - make the weighted adjacency list symmetric</li>
							<li>Start the tree with a single node and push all of its edges onto a min-heap</li>
							<li>Pop the cheapest edge that crosses the cut (tree vs. everything else)</li>
							<li>
								If its far endpoint is already in the tree, discard the stale edge and pop again
							</li>
							<li>Otherwise add the edge to the MST, absorb the new node, and push its edges</li>
							<li>Repeat until every node is in the tree (V - 1 edges chosen)</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>
								💡 The <strong>cut property</strong>: the minimum-weight edge crossing any cut is
								always in some MST - Prim's greedily adds exactly that edge at every step
							</li>
							<li>
								✅ A lazy min-heap avoids decrease-key bookkeeping - just discard any popped edge
								whose target is already in the tree
							</li>
							<li>
								💡 Prim's grows ONE connected tree outward; Kruskal's instead sorts all edges
								globally and merges forests with union-find
							</li>
							<li>
								❌ The graph must be UNDIRECTED and connected - a disconnected graph has no single
								spanning tree (only a spanning forest)
							</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use / Real-World</h2>
						<ul className="text-sm space-y-2">
							<li>
								🔌 Network design - laying cable, pipes, or roads to connect sites at least cost
							</li>
							<li>📡 Cluster analysis - single-linkage clustering is built on an MST</li>
							<li>🖼️ Image segmentation and maze generation use spanning trees</li>
							<li>
								⚡ Prefer Prim's on dense graphs; Kruskal's shines on sparse, edge-list graphs
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
