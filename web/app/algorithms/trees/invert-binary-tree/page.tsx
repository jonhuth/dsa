"use client";

import { useEffect, useState } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { TreeNode } from "@/components/visualizers/TreeVisualizer";
import { TreeVisualizer } from "@/components/visualizers/TreeVisualizer";
import type { AlgorithmStep } from "@/lib/types";

export default function InvertBinaryTreePage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [treeInput, setTreeInput] = useState("4, 2, 7, 1, 3, 6, 9");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/invert_binary_tree/source");
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
			// Parse the comma-separated level-order values (supports null for gaps).
			const values = treeInput
				.split(",")
				.map((token) => token.trim())
				.filter((token) => token.length > 0)
				.map((token) => (token.toLowerCase() === "null" ? null : Number(token)));

			if (values.some((v) => v !== null && Number.isNaN(v))) {
				throw new Error("Invalid number in input");
			}

			const response = await fetch("/api/algorithms/invert_binary_tree/execute", {
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
				"Invalid tree format. Use level-order values like 4, 2, 7, 1, 3, 6, 9 (use null for missing nodes)",
			);
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
					<a href="/algorithms/trees" className="hover:underline">
						Trees
					</a>{" "}
					/ Invert Binary Tree
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Invert Binary Tree</h1>
						<p className="text-muted-foreground">
							Mirror a binary tree by recursively swapping every node&apos;s children
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

				{/* The Homebrew note */}
				<div className="p-4 border border-border rounded-lg bg-card text-sm text-muted-foreground">
					<span className="font-medium text-foreground">The famous whiteboard question.</span>{" "}
					Legend has it the creator of Homebrew was turned down by a big tech company for not
					inverting a binary tree on a whiteboard. It looks intimidating but is a single idea
					applied recursively.
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
							placeholder="4, 2, 7, 1, 3, 6, 9"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Format: comma-separated values in level-order - [root, left child, right child, ...].
							Use null for missing nodes.
						</p>
					</label>

					<button
						type="button"
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Inverting..." : "Invert Tree"}
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

								{/* Swap Counter */}
								{currentStepData?.metadata?.swaps !== undefined && (
									<div className="mt-4 text-center">
										<p className="text-xs text-muted-foreground mb-1">Swaps performed:</p>
										<p className="font-mono text-sm font-bold">
											{currentStepData.metadata.swaps as number}
										</p>
									</div>
								)}
							</div>
						</div>

						{/* Color Legend */}
						<div className="flex items-center justify-center gap-6 text-xs">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-blue-500 rounded-full" />
								<span>Node Being Swapped</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-yellow-500 rounded-full" />
								<span>Children To Swap</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded-full" />
								<span>Swapped / Done</span>
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
									Each node is visited exactly once
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
						<ol className="text-sm space-y-2 ml-4 list-decimal">
							<li>Start at the root of the tree.</li>
							<li>Swap the node&apos;s left and right children (pointers, not values).</li>
							<li>Recursively invert the left subtree.</li>
							<li>Recursively invert the right subtree.</li>
							<li>
								Base case: a null node (or leaf) needs no swap - the recursion simply returns.
							</li>
						</ol>
						<p className="text-sm mt-3 text-muted-foreground">
							The order of the three operations does not matter - swapping then recursing, or
							recursing then swapping, both produce the same mirrored tree.
						</p>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>
								✅ The entire algorithm is one line of logic - swap children - applied recursively.
							</li>
							<li>✅ It has the exact same shape as a tree traversal, so it is O(n) time.</li>
							<li>
								💡 Swap the child pointers, not the node values - swapping values would require
								touching every descendant.
							</li>
							<li>
								💡 An iterative version uses a queue (BFS) or stack (DFS) with the identical swap -
								handy when you want to avoid recursion depth on skewed trees.
							</li>
							<li>
								💡 Inverting the tree twice returns the original tree (the operation is its own
								inverse).
							</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use / Real-World</h2>
						<ul className="text-sm space-y-2 ml-4">
							<li>
								• Producing a mirror image of a tree for symmetry checks or UI layout flipping.
							</li>
							<li>
								• A building block for checking whether a tree is symmetric (a tree is symmetric if
								it equals its own inversion).
							</li>
							<li>
								• Rendering right-to-left views of hierarchical data (e.g. mirrored org charts or
								file trees).
							</li>
							<li>
								• A classic warm-up for mastering recursion on trees - the pattern generalizes to
								many &quot;do X to every node&quot; problems.
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
