"use client";

import { useEffect, useState } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { TreeVisualizer } from "@/components/visualizers/TreeVisualizer";

export default function BSTInsertPage() {
	const [steps, setSteps] = useState<any[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [inputValues, setInputValues] = useState("50, 30, 70, 20, 40, 60, 80");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/bst_insert/source");
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
			const values = inputValues.split(",").map((n) => parseInt(n.trim(), 10));

			const response = await fetch("/api/algorithms/bst_insert/execute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ input: values }),
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
					/ BST Insert
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-4xl font-bold mb-2">Binary Search Tree - Insert</h1>
						<p className="text-muted-foreground">
							Inserting values into a Binary Search Tree maintaining the BST property
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
						<label className="block text-sm font-medium mb-2">
							Values to Insert (comma-separated)
						</label>
						<input
							type="text"
							value={inputValues}
							onChange={(e) => setInputValues(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded"
							placeholder="50, 30, 70, 20, 40"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							First value becomes root, subsequent values are inserted according to BST rules
						</p>
					</div>
					<button
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Running..." : "Build Tree"}
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
										{currentStepData.metadata.size !== undefined && (
											<div>
												Nodes: <span className="font-mono">{currentStepData.metadata.size}</span>
											</div>
										)}
									</div>
								)}
							</div>
						</div>

						{/* Color Legend */}
						<div className="flex items-center justify-center gap-6 text-xs">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-blue-500 rounded-full" />
								<span>Just Inserted</span>
							</div>
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
								<span>Parent</span>
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
							<li>Compare the value to insert with current node</li>
							<li>If value is less, go to left child; if greater, go to right child</li>
							<li>Repeat until finding an empty spot (null child)</li>
							<li>Insert the new node at that position</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>✅ Maintains BST property: left subtree &lt; node &lt; right subtree</li>
							<li>✅ No rebalancing needed (unlike AVL or Red-Black trees)</li>
							<li>💡 Insertion order affects tree shape and search efficiency</li>
							<li>💡 Sorted input creates degenerate tree (linked list) - O(n) operations</li>
							<li>💡 Random input typically creates reasonably balanced tree</li>
							<li>❌ Can become unbalanced - consider self-balancing variants for production</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
