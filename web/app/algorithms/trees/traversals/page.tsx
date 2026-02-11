"use client";

import { useState, useEffect } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { TreeVisualizer } from "@/components/visualizers/TreeVisualizer";

type TraversalType = "inorder" | "preorder" | "postorder";

export default function TreeTraversalsPage() {
	const [steps, setSteps] = useState<any[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [traversalType, setTraversalType] = useState<TraversalType>("inorder");
	const [treeInput, setTreeInput] = useState("[4, 2, 6, 1, 3, 5, 7]");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch(`/api/algorithms/tree_${traversalType}/source`);
				const data = await response.json();
				setSourceCode(data.source || "");
			} catch (error) {
				console.error("Failed to fetch source code:", error);
			}
		};
		fetchSource();
	}, [traversalType]);

	const executeAlgorithm = async () => {
		setIsLoading(true);
		try {
			const values = JSON.parse(treeInput);

			const response = await fetch(`/api/algorithms/tree_${traversalType}/execute`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					input: { values: values },
				}),
			});

			const data = await response.json();
			setSteps(data.steps);
			setCurrentStep(0);
		} catch (error) {
			console.error("Failed to execute algorithm:", error);
			alert("Invalid tree format. Use array like [4, 2, 6, 1, 3, 5, 7] or [4, 2, 6, null, 3]");
		} finally {
			setIsLoading(false);
		}
	};

	const currentStepData = steps[currentStep];
	const currentLine = currentStepData?.metadata?.source_line;

	const traversalDescriptions = {
		inorder: "Left → Root → Right (gives sorted order for BST)",
		preorder: "Root → Left → Right (useful for tree copy)",
		postorder: "Left → Right → Root (useful for tree deletion)",
	};

	return (
		<div className="min-h-screen p-8">
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
					/ Binary Tree Traversals
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-4xl font-bold mb-2">Binary Tree Traversals</h1>
						<p className="text-muted-foreground">
							Explore different ways to visit all nodes in a binary tree
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
						<label className="block text-sm font-medium mb-2">Traversal Type</label>
						<div className="flex gap-2">
							<button
								onClick={() => setTraversalType("inorder")}
								className={`px-4 py-2 rounded border ${
									traversalType === "inorder"
										? "bg-primary text-primary-foreground border-primary"
										: "border-border hover:bg-accent"
								}`}
							>
								In-order
							</button>
							<button
								onClick={() => setTraversalType("preorder")}
								className={`px-4 py-2 rounded border ${
									traversalType === "preorder"
										? "bg-primary text-primary-foreground border-primary"
										: "border-border hover:bg-accent"
								}`}
							>
								Pre-order
							</button>
							<button
								onClick={() => setTraversalType("postorder")}
								className={`px-4 py-2 rounded border ${
									traversalType === "postorder"
										? "bg-primary text-primary-foreground border-primary"
										: "border-border hover:bg-accent"
								}`}
							>
								Post-order
							</button>
						</div>
						<p className="text-xs text-muted-foreground mt-2">
							{traversalDescriptions[traversalType]}
						</p>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">
							Tree Values (level-order array)
						</label>
						<input
							type="text"
							value={treeInput}
							onChange={(e) => setTreeInput(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded font-mono"
							placeholder="[4, 2, 6, 1, 3, 5, 7]"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Format: Array in level-order - [root, left child of root, right child of root, ...].
							Use null for missing nodes.
						</p>
					</div>

					<button
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading
							? "Traversing..."
							: `Run ${traversalType.charAt(0).toUpperCase() + traversalType.slice(1)}`}
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

							{/* Tree Visualization */}
							<div className="p-6 border border-border rounded-lg">
								<TreeVisualizer
									tree={currentStepData?.state?.tree}
									highlights={currentStepData?.highlights || []}
								/>

								{/* Step Description */}
								<div className="mt-4 text-center">
									<p className="text-sm font-medium">{currentStepData?.description}</p>
									<p className="text-xs text-muted-foreground mt-1">
										Step {currentStep + 1} of {steps.length}
									</p>
								</div>

								{/* Traversal Order */}
								{currentStepData?.metadata?.order && (
									<div className="mt-4 text-center">
										<p className="text-xs text-muted-foreground mb-1">Traversal Order:</p>
										<p className="font-mono text-sm font-bold">
											[{currentStepData.metadata.order.join(", ")}]
										</p>
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
								<div className="w-4 h-4 bg-yellow-500 rounded-full" />
								<span>Exploring</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded-full" />
								<span>Visited</span>
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
									O(n) where n = number of nodes
									<br />
									Each node visited exactly once
								</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">
									O(h) where h = tree height
									<br />
									Recursion stack depth
								</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Traversal Types</h2>
						<div className="grid gap-4">
							<div>
								<h3 className="font-medium mb-2 text-green-400">In-order (Left-Root-Right)</h3>
								<ul className="text-sm space-y-1 ml-4">
									<li>• Visit left subtree, then root, then right subtree</li>
									<li>
										<strong>Key use:</strong> Gives nodes in sorted order for BST
									</li>
									<li>• Example: [1, 2, 3, 4, 5, 6, 7]</li>
								</ul>
							</div>
							<div>
								<h3 className="font-medium mb-2 text-blue-400">Pre-order (Root-Left-Right)</h3>
								<ul className="text-sm space-y-1 ml-4">
									<li>• Visit root first, then left subtree, then right subtree</li>
									<li>
										<strong>Key use:</strong> Useful for creating a copy of the tree
									</li>
									<li>• Example: [4, 2, 1, 3, 6, 5, 7]</li>
								</ul>
							</div>
							<div>
								<h3 className="font-medium mb-2 text-purple-400">Post-order (Left-Right-Root)</h3>
								<ul className="text-sm space-y-1 ml-4">
									<li>• Visit left subtree, then right subtree, then root last</li>
									<li>
										<strong>Key use:</strong> Useful for deleting a tree (delete children before
										parent)
									</li>
									<li>• Example: [1, 3, 2, 5, 7, 6, 4]</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>✅ All three traversals visit every node exactly once - O(n) time</li>
							<li>✅ All use recursion - O(h) space for call stack where h = height</li>
							<li>
								✅ For BST: in-order gives sorted sequence, pre-order can reconstruct tree,
								post-order for safe deletion
							</li>
							<li>💡 In-order: most common for BST operations (validate, kth smallest, etc.)</li>
							<li>💡 Pre-order: serialize tree, expression tree evaluation (prefix notation)</li>
							<li>
								💡 Post-order: calculate tree properties (height, size), expression trees (postfix)
							</li>
							<li>
								💡 Level-order (BFS) is a 4th traversal type - uses queue instead of recursion
							</li>
							<li>💡 Can implement iteratively using stack (replaces recursion)</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Real-World Applications</h2>
						<div className="grid gap-4 text-sm">
							<div>
								<h3 className="font-medium mb-1 text-green-400">In-order</h3>
								<ul className="space-y-1 ml-4">
									<li>• BST validation (check if sequence is sorted)</li>
									<li>• Finding kth smallest element in BST</li>
									<li>• Converting BST to sorted array/linked list</li>
								</ul>
							</div>
							<div>
								<h3 className="font-medium mb-1 text-blue-400">Pre-order</h3>
								<ul className="space-y-1 ml-4">
									<li>• Tree serialization (save tree to file)</li>
									<li>• Creating a deep copy of the tree</li>
									<li>• Expression tree evaluation (prefix notation)</li>
									<li>• File system traversal (print directory before contents)</li>
								</ul>
							</div>
							<div>
								<h3 className="font-medium mb-1 text-purple-400">Post-order</h3>
								<ul className="space-y-1 ml-4">
									<li>• Deleting/freeing tree (delete children first)</li>
									<li>• Calculating tree properties (height, size, sum)</li>
									<li>• Expression tree evaluation (postfix notation)</li>
									<li>• Dependency resolution (process dependencies before parent)</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
