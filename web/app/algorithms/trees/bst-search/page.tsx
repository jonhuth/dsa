"use client";

import { useEffect, useState } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import { TreeVisualizer } from "@/components/visualizers/TreeVisualizer";
import type { AlgorithmStep } from "@/lib/types";

export default function BSTSearchPage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [treeValues, setTreeValues] = useState("50, 30, 70, 20, 40, 60, 80");
	const [targetValue, setTargetValue] = useState("40");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/bst_search/source");
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
			const values = treeValues.split(",").map((n) => parseInt(n.trim(), 10));
			const target = parseInt(targetValue, 10);

			const response = await fetch("/api/algorithms/bst_search/execute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					input: { values, target },
				}),
			});

			const data = await response.json();
			setSteps(data.steps);
			setCurrentStep(0);
		} catch (error) {
			console.error("Failed to execute algorithm:", error);
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
					/ BST Search
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
							Binary Search Tree - Search
						</h1>
						<p className="text-muted-foreground">
							Searching for a value in a Binary Search Tree using BST properties
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
						<span className="block text-sm font-medium mb-2">Tree Values (comma-separated)</span>
						<input
							type="text"
							value={treeValues}
							onChange={(e) => setTreeValues(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded"
							placeholder="50, 30, 70, 20, 40"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Tree will be built from these values before searching
						</p>
					</label>
					<label className="block">
						<span className="block text-sm font-medium mb-2">Target Value to Search</span>
						<input
							type="text"
							value={targetValue}
							onChange={(e) => setTargetValue(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded"
							placeholder="40"
						/>
					</label>
					<button
						type="button"
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Running..." : "Search Tree"}
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
								<div className="flex justify-center">
									<TreeVisualizer
										tree={currentStepData?.state?.tree}
										highlights={currentStepData?.highlights || []}
									/>
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
									<div className="mt-4 flex justify-center gap-6 text-xs">
										{currentStepData.metadata.comparisons !== undefined && (
											<div>
												Comparisons:{" "}
												<span className="font-mono">{currentStepData.metadata.comparisons}</span>
											</div>
										)}
										{currentStepData.metadata.target !== undefined && (
											<div>
												Target: <span className="font-mono">{currentStepData.metadata.target}</span>
											</div>
										)}
										{currentStepData.metadata.path && (
											<div>
												Path:{" "}
												<span className="font-mono">
													{currentStepData.metadata.path.join(" → ")}
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
								<div className="w-4 h-4 bg-yellow-500 rounded-full" />
								<span>Comparing</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-gray-600 rounded-full" />
								<span>Visited</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded-full" />
								<span>Found!</span>
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
								<ul className="text-sm space-y-1">
									<li>Average: O(log n) - balanced tree</li>
									<li>Worst: O(n) - degenerates to linked list</li>
								</ul>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">O(1) - iterative, constant extra space</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>Start at the root node</li>
							<li>Compare target value with current node</li>
							<li>If they match, found!</li>
							<li>If target is less, search left subtree</li>
							<li>If target is greater, search right subtree</li>
							<li>Repeat until found or reach null (not found)</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>✅ Efficient search leveraging BST property</li>
							<li>✅ Similar to binary search but on a tree structure</li>
							<li>💡 Each comparison eliminates half the remaining subtree</li>
							<li>💡 Search path visualizes the decision tree</li>
							<li>💡 Number of comparisons equals depth of found node + 1</li>
							<li>
								💡 Self-balancing trees (AVL, Red-Black) guarantee O(log n) by maintaining balance
							</li>
							<li>❌ Performance degrades to O(n) if tree is unbalanced</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
