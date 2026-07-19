"use client";

import { useEffect, useState } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { TreeNode } from "@/components/visualizers/TreeVisualizer";
import { TreeVisualizer } from "@/components/visualizers/TreeVisualizer";
import type { AlgorithmStep } from "@/lib/types";

export default function LevelOrderPage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [treeInput, setTreeInput] = useState("3, 9, 20, null, null, 15, 7");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch(`/api/algorithms/level_order/source`);
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
			// Parse comma-separated level-order values.
			// Blank or "null" tokens become null (missing node).
			const values = treeInput.split(",").map((token) => {
				const trimmed = token.trim();
				if (trimmed === "" || trimmed.toLowerCase() === "null") {
					return null;
				}
				return Number(trimmed);
			});

			const response = await fetch(`/api/algorithms/level_order/execute`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					input: values,
				}),
			});

			const data = await response.json();
			setSteps(data.steps);
			setCurrentStep(0);
		} catch (error) {
			console.error("Failed to execute algorithm:", error);
			alert(
				"Invalid tree format. Use a comma list like 3, 9, 20, null, null, 15, 7 (use null for missing nodes)",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const currentStepData = steps[currentStep];
	const currentLine = currentStepData?.metadata?.source_line;
	const currentLevel = currentStepData?.metadata?.current_level as number | null | undefined;
	const levelValues = currentStepData?.metadata?.level_values as number[] | undefined;
	const order = currentStepData?.metadata?.order as number[] | undefined;
	const levels = currentStepData?.metadata?.levels as number[][] | undefined;
	const queue = currentStepData?.metadata?.queue as number[] | undefined;
	const currentNode = currentStepData?.metadata?.current as number | null | undefined;
	const isComplete = currentStepData?.operation === "complete";

	return (
		<div className="min-h-screen p-4 sm:p-6 lg:p-8">
			<div className="max-w-7xl mx-auto space-y-8">
				{/* Breadcrumb */}
				<div className="text-sm text-muted-foreground">
					<a href="/algorithms" className="hover:underline">
						Algorithms
					</a>{" "}
					/{" "}
					<a href="/algorithms/trees" className="hover:underline">
						Trees
					</a>{" "}
					/ Binary Tree Level-Order Traversal (BFS)
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
							Binary Tree Level-Order Traversal (BFS)
						</h1>
						<p className="text-muted-foreground">
							Walk a binary tree breadth-first with a FIFO queue, grouping nodes level by level
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
						<span className="block text-sm font-medium mb-2">Tree Values (level-order)</span>
						<input
							type="text"
							value={treeInput}
							onChange={(e) => setTreeInput(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded font-mono"
							placeholder="3, 9, 20, null, null, 15, 7"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Format: comma-separated, level-order - [root, left child of root, right child of root,
							...]. Use null (or leave blank) for missing nodes. Try
							<span className="font-mono"> 1, 2, 3, 4, 5, 6, 7 </span>
							for a full tree.
						</p>
					</label>

					<button
						type="button"
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Traversing..." : "Run Level-Order Traversal"}
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

							{/* Tree Visualization */}
							<div className="p-6 border border-border rounded-lg">
								<TreeVisualizer
									tree={currentStepData?.state?.tree as TreeNode | null}
									highlights={currentStepData?.highlights ?? []}
								/>

								{/* Step Description */}
								<div className="mt-4 text-center">
									<p className="text-sm font-medium">{currentStepData?.description}</p>
									<p className="text-xs text-muted-foreground mt-1">
										Step {currentStep + 1} of {steps.length}
									</p>
								</div>

								{/* Current level / node / queue metadata */}
								{(currentNode != null || currentLevel != null || (queue && queue.length > 0)) && (
									<div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-xs">
										{currentNode != null && (
											<div>
												<span className="text-muted-foreground">Current node: </span>
												<span className="font-mono font-bold">{currentNode}</span>
											</div>
										)}
										{currentLevel != null && (
											<div>
												<span className="text-muted-foreground">Level: </span>
												<span className="font-mono font-bold">{currentLevel}</span>
											</div>
										)}
										{queue && (
											<div>
												<span className="text-muted-foreground">Queue: </span>
												<span className="font-mono font-bold">[{queue.join(", ")}]</span>
											</div>
										)}
									</div>
								)}

								{/* Levels built so far */}
								{levels && levels.length > 0 && (
									<div className="mt-3 text-center text-xs">
										<span className="text-muted-foreground">Levels: </span>
										<span className="font-mono font-bold">
											[{levels.map((lvl) => `[${lvl.join(", ")}]`).join(", ")}
											{levelValues && levelValues.length > 0 && currentLevel != null
												? `, [${levelValues.join(", ")}]`
												: ""}
											]
										</span>
									</div>
								)}
								{(!levels || levels.length === 0) &&
									levelValues &&
									levelValues.length > 0 &&
									currentLevel != null && (
										<div className="mt-3 text-center text-xs">
											<span className="text-muted-foreground">Levels: </span>
											<span className="font-mono font-bold">[[{levelValues.join(", ")}]]</span>
										</div>
									)}

								{/* Result banner (final step) */}
								{isComplete && order && (
									<div className="mt-4 text-center">
										<span className="inline-block px-4 py-1 rounded-full text-sm font-bold bg-green-500/20 text-green-400">
											✅ Visited {order.length} node{order.length === 1 ? "" : "s"}
										</span>
									</div>
								)}
							</div>
						</div>

						{/* Color Legend */}
						<div className="flex items-center justify-center gap-6 text-xs">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-blue-500 rounded-full" />
								<span>Visiting (dequeued)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded-full" />
								<span>Already visited</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-gray-500 rounded-full" />
								<span>Not yet visited</span>
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
									O(n) where n = number of nodes
									<br />
									Every node is enqueued and dequeued exactly once
								</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">
									O(n) for the queue
									<br />
									The widest level of a balanced tree holds ~n/2 nodes
								</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal ml-5">
							<li>
								Seed a FIFO <span className="font-mono">queue</span> with the root node.
							</li>
							<li>
								At the start of each round, snapshot the queue length - that count is exactly the
								number of nodes on the current level.
							</li>
							<li>
								Dequeue that many nodes one at a time, recording each into the current level's list.
							</li>
							<li>
								As you dequeue a node, enqueue its <strong>left child then right child</strong>,
								preserving left-to-right order.
							</li>
							<li>
								When the queue empties, every level has been collected into the{" "}
								<span className="font-mono">levels</span> result.
							</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>
								💡 A <strong>FIFO queue</strong> is what makes traversal breadth-first: children
								enqueued now are only visited after every node already waiting, so visit order
								equals depth order.
							</li>
							<li>
								💡 Snapshot the queue length <strong>before</strong> each round - that count is
								exactly the size of the current level, which is how a flat BFS becomes a "list of
								levels".
							</li>
							<li>
								💡 Always enqueue the left child before the right child to keep each level ordered
								left-to-right.
							</li>
							<li>
								⚠️ Swap the queue for a <strong>stack</strong> (LIFO) and the same skeleton becomes a
								depth-first traversal - the data structure alone dictates the strategy.
							</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use / Real-World</h2>
						<ul className="text-sm space-y-2 ml-4">
							<li>
								• Finding the shortest path in an unweighted graph or grid - BFS reaches nearer
								nodes first
							</li>
							<li>
								• Interview classic (LeetCode 102) and the basis for zigzag, right-side-view, and
								level-average variants
							</li>
							<li>• Rendering or serializing a tree level by level (e.g. org charts, UI trees)</li>
							<li>• Computing tree width, minimum depth, or connecting nodes at the same level</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
