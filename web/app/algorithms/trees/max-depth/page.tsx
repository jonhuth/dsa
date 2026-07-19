"use client";

import { useEffect, useState } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { TreeNode } from "@/components/visualizers/TreeVisualizer";
import { TreeVisualizer } from "@/components/visualizers/TreeVisualizer";
import type { AlgorithmStep } from "@/lib/types";

export default function MaxDepthPage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [treeInput, setTreeInput] = useState("3, 9, 20, null, null, 15, 7");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch(`/api/algorithms/tree_max_depth/source`);
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

			const response = await fetch(`/api/algorithms/tree_max_depth/execute`, {
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
	const maxDepth = currentStepData?.metadata?.max_depth as number | undefined;
	const nodeDepth = currentStepData?.metadata?.node_depth as number | null | undefined;
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
					/ Maximum Depth of Binary Tree
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
							Maximum Depth of Binary Tree
						</h1>
						<p className="text-muted-foreground">
							Find the longest root-to-leaf path with a recursive post-order DFS: depth = 1 +
							max(left, right)
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
							<span className="font-mono"> 1, 2, 2, 3, null, null, 3, 4, null, null, 4 </span>
							for a skewed shape.
						</p>
					</label>

					<button
						type="button"
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Computing..." : "Run Max Depth"}
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

								{/* Current node / depth metadata */}
								{(currentNode != null || nodeDepth != null || maxDepth != null) && (
									<div className="mt-4 flex items-center justify-center gap-6 text-xs">
										{currentNode != null && (
											<div>
												<span className="text-muted-foreground">Current node: </span>
												<span className="font-mono font-bold">{currentNode}</span>
											</div>
										)}
										{nodeDepth != null && (
											<div>
												<span className="text-muted-foreground">Subtree depth: </span>
												<span className="font-mono font-bold">{nodeDepth}</span>
											</div>
										)}
										{maxDepth != null && (
											<div>
												<span className="text-muted-foreground">Max depth so far: </span>
												<span className="font-mono font-bold">{maxDepth}</span>
											</div>
										)}
									</div>
								)}

								{/* Result banner (final step) */}
								{isComplete && maxDepth != null && (
									<div className="mt-4 text-center">
										<span className="inline-block px-4 py-1 rounded-full text-sm font-bold bg-green-500/20 text-green-400">
											📏 Maximum depth = {maxDepth}
										</span>
									</div>
								)}
							</div>
						</div>

						{/* Color Legend */}
						<div className="flex items-center justify-center gap-6 text-xs">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-blue-500 rounded-full" />
								<span>Current Node (descending)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded-full" />
								<span>Resolved subtree / deepest path</span>
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
									Every node must be visited once; there is no early exit
								</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">
									O(h) where h = tree height
									<br />
									Recursion stack: O(log n) balanced, O(n) skewed
								</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal ml-5">
							<li>
								Define depth recursively: an empty child has depth{" "}
								<span className="font-mono">0</span>.
							</li>
							<li>
								At each node, recurse into the left subtree, then the right subtree, to learn both
								child heights.
							</li>
							<li>
								Combine them on the way up:{" "}
								<span className="font-mono">depth = 1 + max(left, right)</span>.
							</li>
							<li>
								That value bubbles up to the parent, which repeats the same combination one level
								higher.
							</li>
							<li>
								The depth returned by the root is the maximum depth - the length of the longest
								root-to-leaf path.
							</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>
								💡 The answer is computed on the way <strong>up</strong>: a node can't know its
								height until both children have reported theirs.
							</li>
							<li>
								💡 This is a textbook <strong>post-order</strong> traversal - resolve children
								first, finalize the parent last.
							</li>
							<li>
								⚠️ Every node is touched exactly once with no way to short-circuit, so height is
								inherently <span className="font-mono">O(n)</span>.
							</li>
							<li>
								💡 Swap the recursion for a BFS level-count and you get the same number iteratively
								- handy when the tree is deep enough to overflow the call stack.
							</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use / Real-World</h2>
						<ul className="text-sm space-y-2 ml-4">
							<li>• Interview classic (LeetCode 104) - the "hello world" of tree recursion</li>
							<li>• Checking whether a tree is balanced (compare left vs right subtree heights)</li>
							<li>• Sizing UI or DOM trees, scene graphs, and file-system hierarchies</li>
							<li>
								• A stepping stone to harder tree problems: diameter, balanced-tree checks, and
								level-order layout all reuse the same post-order height computation
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
