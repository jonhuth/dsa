"use client";

import { useEffect, useState } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { TreeNode } from "@/components/visualizers/TreeVisualizer";
import { TreeVisualizer } from "@/components/visualizers/TreeVisualizer";
import type { AlgorithmStep } from "@/lib/types";

export default function PathSumPage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [treeInput, setTreeInput] = useState("5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1");
	const [targetInput, setTargetInput] = useState(22);
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch(`/api/algorithms/tree_path_sum/source`);
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

			const response = await fetch(`/api/algorithms/tree_path_sum/execute`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					input: {
						values,
						target: targetInput,
					},
				}),
			});

			const data = await response.json();
			setSteps(data.steps);
			setCurrentStep(0);
		} catch (error) {
			console.error("Failed to execute algorithm:", error);
			alert(
				"Invalid tree format. Use a comma list like 5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1 (use null for missing nodes)",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const currentStepData = steps[currentStep];
	const currentLine = currentStepData?.metadata?.source_line;
	const found = currentStepData?.metadata?.found as boolean | null | undefined;
	const runningSum = currentStepData?.metadata?.running_sum as number | undefined;
	const target = currentStepData?.metadata?.target as number | undefined;
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
					/ Path Sum (Root-to-Leaf)
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
							Path Sum (Root-to-Leaf)
						</h1>
						<p className="text-muted-foreground">
							Search for a root-to-leaf path whose node values add up to a target, carrying a
							running sum down a depth-first search
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
							placeholder="5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Format: comma-separated, level-order - [root, left child of root, right child of root,
							...]. Use null (or leave blank) for missing nodes.
						</p>
					</label>

					<label className="block">
						<span className="block text-sm font-medium mb-2">Target Sum</span>
						<input
							type="number"
							value={targetInput}
							onChange={(e) => setTargetInput(Number(e.target.value))}
							className="w-40 px-4 py-2 bg-background border border-border rounded font-mono"
							placeholder="22"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							The sum a root-to-leaf path must match. Try a value like{" "}
							<span className="font-mono">100</span> for a no-match case.
						</p>
					</label>

					<button
						type="button"
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Searching..." : "Run Path Sum"}
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

								{/* Running sum / node metadata */}
								{(currentNode != null || runningSum != null) && (
									<div className="mt-4 flex items-center justify-center gap-6 text-xs">
										{currentNode != null && (
											<div>
												<span className="text-muted-foreground">Current node: </span>
												<span className="font-mono font-bold">{currentNode}</span>
											</div>
										)}
										{runningSum != null && (
											<div>
												<span className="text-muted-foreground">Running sum: </span>
												<span className="font-mono font-bold">{runningSum}</span>
											</div>
										)}
										{target != null && (
											<div>
												<span className="text-muted-foreground">Target: </span>
												<span className="font-mono font-bold">{target}</span>
											</div>
										)}
									</div>
								)}

								{/* Result banner (final step) */}
								{typeof found === "boolean" && (
									<div className="mt-4 text-center">
										<span
											className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${
												found
													? "bg-green-500/20 text-green-400"
													: "bg-yellow-500/20 text-yellow-400"
											}`}
										>
											{found ? "✅ Path found" : "❌ No matching path"}
										</span>
									</div>
								)}
							</div>
						</div>

						{/* Color Legend */}
						<div className="flex items-center justify-center gap-6 text-xs">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-blue-500 rounded-full" />
								<span>Active Path</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded-full" />
								<span>Matching Path</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-yellow-500 rounded-full" />
								<span>Leaf (no match)</span>
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
									Each node is visited at most once; the search stops at the first matching leaf
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
								Start a depth-first search at the root with a running sum of{" "}
								<span className="font-mono">0</span>.
							</li>
							<li>
								At each node, add its value to the running sum and record it on the current path.
							</li>
							<li>
								Recurse into the children, passing{" "}
								<span className="font-mono">running_sum + node.val</span> down to each.
							</li>
							<li>
								Only at a <strong>leaf</strong> (no children) compare the running sum to the target.
							</li>
							<li>
								If a leaf's running sum equals the target, a valid path exists -{" "}
								<strong>stop</strong> and report it; otherwise backtrack and try the next branch.
							</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>
								💡 Carry the running sum <strong>down</strong> the recursion so each child sees{" "}
								<span className="font-mono">parent_sum + node.val</span> - no need to rebuild and
								re-add each path.
							</li>
							<li>
								⚠️ The check happens <strong>only at a leaf</strong>. A prefix that already equals
								the target on an internal node does not count as a root-to-leaf path.
							</li>
							<li>
								💡 Short-circuit: the first matching leaf answers the question, so you never explore
								the rest of the tree once a path is found.
							</li>
							<li>
								⚠️ Values can be <strong>negative</strong>, so you cannot prune a branch just because
								the running sum overshot the target - a later negative node could bring it back.
							</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use / Real-World</h2>
						<ul className="text-sm space-y-2 ml-4">
							<li>
								• Interview classic (LeetCode 112) - a clean intro to DFS with an accumulator
								carried down the recursion
							</li>
							<li>
								• Decision-tree and game-tree evaluation where each root-to-leaf path is a full
								scenario whose cost or score you total
							</li>
							<li>• Budget or resource checks: does any sequence of choices hit an exact total?</li>
							<li>
								• A stepping stone to variants: count all matching paths, return the paths
								themselves (Path Sum II), or any-node-to-any-node paths (Path Sum III)
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
