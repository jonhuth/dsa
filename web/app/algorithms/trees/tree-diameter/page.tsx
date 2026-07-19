"use client";

import { useEffect, useState } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { TreeNode } from "@/components/visualizers/TreeVisualizer";
import { TreeVisualizer } from "@/components/visualizers/TreeVisualizer";
import type { AlgorithmStep } from "@/lib/types";

export default function TreeDiameterPage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [treeInput, setTreeInput] = useState("1, 2, 3, 4, 5");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch(`/api/algorithms/tree_diameter/source`);
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

			const response = await fetch(`/api/algorithms/tree_diameter/execute`, {
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
				"Invalid tree format. Use a comma list like 1, 2, 3, 4, 5 (use null for missing nodes)",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const currentStepData = steps[currentStep];
	const currentLine = currentStepData?.metadata?.source_line;
	const currentNode = currentStepData?.metadata?.current as number | null | undefined;
	const bestDiameter = currentStepData?.metadata?.best_diameter as number | undefined;
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
					/ Binary Tree Diameter
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
							Binary Tree Diameter
						</h1>
						<p className="text-muted-foreground">
							Find the longest path (in edges) between any two nodes with a single post-order height
							pass
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
							placeholder="1, 2, 3, 4, 5"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Format: comma-separated, level-order - [root, left child of root, right child of root,
							...]. Use null (or leave blank) for missing nodes. Try
							<span className="font-mono"> 1, 2, 3, null, null, 4, 5 </span>
							for a diameter that skips the root.
						</p>
					</label>

					<button
						type="button"
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Computing..." : "Run Tree Diameter"}
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

								{/* Current node / best diameter metadata */}
								{(currentNode != null || bestDiameter != null) && (
									<div className="mt-4 flex items-center justify-center gap-6 text-xs">
										{currentNode != null && (
											<div>
												<span className="text-muted-foreground">Current node: </span>
												<span className="font-mono font-bold">{currentNode}</span>
											</div>
										)}
										{bestDiameter != null && (
											<div>
												<span className="text-muted-foreground">Best diameter: </span>
												<span className="font-mono font-bold">{bestDiameter}</span>
											</div>
										)}
									</div>
								)}

								{/* Result banner (final step) */}
								{isComplete && bestDiameter != null && (
									<div className="mt-4 text-center">
										<span className="inline-block px-4 py-1 rounded-full text-sm font-bold bg-green-500/20 text-green-400">
											📏 Diameter = {bestDiameter} edge{bestDiameter === 1 ? "" : "s"}
										</span>
									</div>
								)}
							</div>
						</div>

						{/* Color Legend */}
						<div className="flex items-center justify-center gap-6 text-xs">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-blue-500 rounded-full" />
								<span>Current Node</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded-full" />
								<span>Height Computed</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-yellow-500 rounded-full" />
								<span>Best Diameter Path</span>
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
									Every node is visited exactly once in a single post-order pass
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
								Run a <strong>post-order</strong> DFS: process both children before the node itself.
							</li>
							<li>
								Each call returns the node's <strong>height</strong> in edges - a leaf is{" "}
								<span className="font-mono">0</span>, a missing child is{" "}
								<span className="font-mono">-1</span> (contributing 0 edges).
							</li>
							<li>
								At every node compute the <strong>through-path</strong>:{" "}
								<span className="font-mono">height(left) + height(right) + 2</span> edges.
							</li>
							<li>
								Keep a running <strong>best diameter</strong> across all nodes - it may be centered
								anywhere, not just the root.
							</li>
							<li>
								Return <span className="font-mono">1 + max(height(left), height(right))</span> to
								the parent and repeat.
							</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>
								⚠️ The diameter does <strong>not</strong> have to pass through the root - you must
								take the maximum through-path over every node.
							</li>
							<li>
								💡 Height and diameter are computed together in <strong>one</strong> post-order
								pass: the function returns the height while side-effecting the best diameter.
							</li>
							<li>
								💡 A node's through-path in edges is{" "}
								<span className="font-mono">height(left) + height(right)</span>; an absent subtree
								adds nothing.
							</li>
							<li>
								💡 Diameter is measured in <strong>edges</strong>, not nodes - a path over{" "}
								<span className="font-mono">k</span> nodes has{" "}
								<span className="font-mono">k - 1</span> edges (a classic off-by-one trap).
							</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use / Real-World</h2>
						<ul className="text-sm space-y-2 ml-4">
							<li>
								• Interview classic (LeetCode 543) - a clean test of post-order "return one thing,
								track another"
							</li>
							<li>• Measuring the "width" or worst-case span of a hierarchy or dependency tree</li>
							<li>
								• Network/graph analysis: the diameter bounds the maximum communication hop count
							</li>
							<li>
								• A template for any tree DP that combines results from left and right subtrees at
								each node
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
