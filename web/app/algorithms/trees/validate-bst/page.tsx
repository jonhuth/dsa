"use client";

import { useEffect, useState } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { TreeNode } from "@/components/visualizers/TreeVisualizer";
import { TreeVisualizer } from "@/components/visualizers/TreeVisualizer";
import type { AlgorithmStep } from "@/lib/types";

export default function ValidateBstPage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [treeInput, setTreeInput] = useState("5, 3, 8, 1, 4, 7, 9");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch(`/api/algorithms/validate_bst/source`);
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

			const response = await fetch(`/api/algorithms/validate_bst/execute`, {
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
				"Invalid tree format. Use a comma list like 5, 3, 8, 1, 4, 7, 9 (use null for missing nodes)",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const currentStepData = steps[currentStep];
	const currentLine = currentStepData?.metadata?.source_line;
	const isValid = currentStepData?.metadata?.is_valid as boolean | null | undefined;
	const currentRange = currentStepData?.metadata?.range as string | undefined;
	const currentNode = currentStepData?.metadata?.current as number | null | undefined;

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
					/ Validate BST
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Validate BST</h1>
						<p className="text-muted-foreground">
							Check whether a binary tree obeys the global binary-search-tree ordering using (low,
							high) bounds
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
							placeholder="5, 3, 8, 1, 4, 7, 9"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Format: comma-separated, level-order - [root, left child of root, right child of root,
							...]. Use null (or leave blank) for missing nodes. Try
							<span className="font-mono"> 5, 3, 8, 1, 6, 7, 9 </span>
							for an invalid tree.
						</p>
					</label>

					<button
						type="button"
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Validating..." : "Run Validate BST"}
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

								{/* Current bound / node metadata */}
								{(currentRange || currentNode != null) && (
									<div className="mt-4 flex items-center justify-center gap-6 text-xs">
										{currentNode != null && (
											<div>
												<span className="text-muted-foreground">Current node: </span>
												<span className="font-mono font-bold">{currentNode}</span>
											</div>
										)}
										{currentRange && (
											<div>
												<span className="text-muted-foreground">Allowed range: </span>
												<span className="font-mono font-bold">{currentRange}</span>
											</div>
										)}
									</div>
								)}

								{/* Result banner (final step) */}
								{typeof isValid === "boolean" && (
									<div className="mt-4 text-center">
										<span
											className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${
												isValid
													? "bg-green-500/20 text-green-400"
													: "bg-yellow-500/20 text-yellow-400"
											}`}
										>
											{isValid ? "✅ Valid BST" : "❌ Not a valid BST"}
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
								<span>Validated (in bounds)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-yellow-500 rounded-full" />
								<span>Violation (out of bounds)</span>
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
									Each node is checked once against its bounds (can reject early on the first
									violation)
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
								Start at the root with the widest possible allowed range:{" "}
								<span className="font-mono">(-∞, +∞)</span>.
							</li>
							<li>
								At each node, check that its value is <strong>strictly inside</strong> the current{" "}
								<span className="font-mono">(low, high)</span> range.
							</li>
							<li>
								Recurse left, tightening the upper bound to the node's value:{" "}
								<span className="font-mono">(low, node.val)</span>.
							</li>
							<li>
								Recurse right, raising the lower bound to the node's value:{" "}
								<span className="font-mono">(node.val, high)</span>.
							</li>
							<li>
								If any node falls outside its range, the tree is <strong>not</strong> a BST - stop
								and report the first violator.
							</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>
								⚠️ The BST property is <strong>global</strong>, not local: comparing only against
								direct children gives false positives (e.g. a small value buried deep in a right
								subtree).
							</li>
							<li>
								💡 Passing <span className="font-mono">(low, high)</span> bounds down the recursion
								encodes every ancestor constraint in just two numbers.
							</li>
							<li>
								💡 Inequalities are strict - if duplicates are allowed you must relax one side to{" "}
								<span className="font-mono">&gt;=</span> or <span className="font-mono">&lt;=</span>
								.
							</li>
							<li>
								💡 Equivalent trick: an in-order traversal of a BST is strictly increasing, so
								"validate BST" reduces to "is the in-order sequence sorted?".
							</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use / Real-World</h2>
						<ul className="text-sm space-y-2 ml-4">
							<li>
								• Verifying the integrity of a search tree after inserts, deletes, or rotations
							</li>
							<li>
								• Interview classic (LeetCode 98) - a favorite test of the local-vs-global trap
							</li>
							<li>• Database and filesystem indexes that rely on ordered tree invariants</li>
							<li>
								• A building block before BST-only operations (kth smallest, range queries) that
								assume the ordering holds
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
