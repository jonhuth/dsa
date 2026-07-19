"use client";

import { useEffect, useState } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { TreeNode } from "@/components/visualizers/TreeVisualizer";
import { TreeVisualizer } from "@/components/visualizers/TreeVisualizer";
import type { AlgorithmStep } from "@/lib/types";

export default function LowestCommonAncestorPage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [treeInput, setTreeInput] = useState("6, 2, 8, 0, 4, 7, 9, null, null, 3, 5");
	const [pInput, setPInput] = useState(2);
	const [qInput, setQInput] = useState(8);
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch(`/api/algorithms/lca/source`);
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

			const response = await fetch(`/api/algorithms/lca/execute`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					input: {
						values,
						p: pInput,
						q: qInput,
					},
				}),
			});

			const data = await response.json();
			setSteps(data.steps);
			setCurrentStep(0);
		} catch (error) {
			console.error("Failed to execute algorithm:", error);
			alert(
				"Invalid input. Use a comma list like 6, 2, 8, 0, 4, 7, 9 (use null for missing nodes) plus two target values.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const currentStepData = steps[currentStep];
	const currentLine = currentStepData?.metadata?.source_line;
	const currentNode = currentStepData?.metadata?.current as number | null | undefined;
	const direction = currentStepData?.metadata?.direction as string | undefined;
	const lca = currentStepData?.metadata?.lca as number | null | undefined;
	const targetP = currentStepData?.metadata?.p as number | undefined;
	const targetQ = currentStepData?.metadata?.q as number | undefined;

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
					/ Lowest Common Ancestor (BST)
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
							Lowest Common Ancestor (BST)
						</h1>
						<p className="text-muted-foreground">
							Walk down a binary search tree using its ordering to find the deepest node that is an
							ancestor of both targets
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
						<span className="block text-sm font-medium mb-2">Tree Values (level-order BST)</span>
						<input
							type="text"
							value={treeInput}
							onChange={(e) => setTreeInput(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded font-mono"
							placeholder="6, 2, 8, 0, 4, 7, 9, null, null, 3, 5"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Format: comma-separated, level-order - [root, left child of root, right child of root,
							...]. Use null (or leave blank) for missing nodes. The tree must be a valid BST.
						</p>
					</label>

					<div className="flex flex-wrap gap-4">
						<label className="block">
							<span className="block text-sm font-medium mb-2">Target p</span>
							<input
								type="number"
								value={pInput}
								onChange={(e) => setPInput(Number(e.target.value))}
								className="w-32 px-4 py-2 bg-background border border-border rounded font-mono"
							/>
						</label>
						<label className="block">
							<span className="block text-sm font-medium mb-2">Target q</span>
							<input
								type="number"
								value={qInput}
								onChange={(e) => setQInput(Number(e.target.value))}
								className="w-32 px-4 py-2 bg-background border border-border rounded font-mono"
							/>
						</label>
					</div>

					<button
						type="button"
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Finding LCA..." : "Run Lowest Common Ancestor"}
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

								{/* Current node / target metadata */}
								{(currentNode != null || targetP != null) && (
									<div className="mt-4 flex items-center justify-center gap-6 text-xs">
										{targetP != null && targetQ != null && (
											<div>
												<span className="text-muted-foreground">Targets: </span>
												<span className="font-mono font-bold">
													{targetP}, {targetQ}
												</span>
											</div>
										)}
										{currentNode != null && (
											<div>
												<span className="text-muted-foreground">Current node: </span>
												<span className="font-mono font-bold">{currentNode}</span>
											</div>
										)}
										{direction && (
											<div>
												<span className="text-muted-foreground">Direction: </span>
												<span className="font-mono font-bold">{direction}</span>
											</div>
										)}
									</div>
								)}

								{/* Result banner (final step) */}
								{lca != null && (
									<div className="mt-4 text-center">
										<span className="inline-block px-4 py-1 rounded-full text-sm font-bold bg-blue-500/20 text-blue-400">
											LCA = {lca}
										</span>
									</div>
								)}
							</div>
						</div>

						{/* Color Legend */}
						<div className="flex items-center justify-center gap-6 text-xs">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-blue-500 rounded-full" />
								<span>Current Node / LCA</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded-full" />
								<span>Path Walked</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-yellow-500 rounded-full" />
								<span>Targets (p, q)</span>
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
									O(h) where h = tree height
									<br />
									O(log n) for a balanced BST, O(n) for a skewed one. One comparison per level as we
									descend.
								</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">
									O(1) iterative
									<br />
									Only a pointer to the current node is kept (O(h) if written recursively for the
									call stack).
								</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal ml-5">
							<li>
								Start at the root. Compare both targets <span className="font-mono">p</span> and{" "}
								<span className="font-mono">q</span> to the current node's value.
							</li>
							<li>
								If <strong>both</strong> targets are smaller than the current node, the LCA lies in
								the left subtree - move left.
							</li>
							<li>
								If <strong>both</strong> targets are larger, the LCA lies in the right subtree -
								move right.
							</li>
							<li>
								Otherwise the targets <strong>split</strong> here (one is{" "}
								<span className="font-mono">&le;</span> the node, the other{" "}
								<span className="font-mono">&ge;</span>), so the current node is the lowest common
								ancestor.
							</li>
							<li>
								Return that node. The whole walk is a single top-down pass with no backtracking.
							</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>
								💡 The BST ordering <em>is</em> the decision function: the sign of the comparison
								tells you to go left, go right, or stop.
							</li>
							<li>
								💡 The LCA is exactly the first (highest) node where the paths to{" "}
								<span className="font-mono">p</span> and <span className="font-mono">q</span>{" "}
								diverge.
							</li>
							<li>
								⚠️ A node can be its own ancestor: if <span className="font-mono">p</span> or{" "}
								<span className="font-mono">q</span> equals the current node, that node is the LCA.
							</li>
							<li>
								💡 Each step discards an entire subtree, so the cost is O(h) - far cheaper than the
								O(n) search a general binary tree would need.
							</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use / Real-World</h2>
						<ul className="text-sm space-y-2 ml-4">
							<li>• Interview classic (LeetCode 235) - the BST-specialized twist on general LCA</li>
							<li>
								• Range and interval queries: the LCA marks where two ordered keys branch apart in
								an index
							</li>
							<li>
								• Hierarchies and taxonomies stored as ordered trees - finding the nearest shared
								parent of two entries
							</li>
							<li>
								• A building block for tree-distance and path queries between two nodes in ordered
								structures
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
