"use client";

import { useEffect, useState } from "react";
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";

interface Step {
	operation: string;
	description: string;
	state: {
		values?: number[];
		[key: string]: unknown;
	};
	highlights?: Array<{ indices: number[]; color: string }>;
	metadata?: {
		source_line?: number;
		item?: number;
		capacity?: number;
		weight?: number;
		value?: number;
		max_value?: number;
		[key: string]: unknown;
	};
}

export default function KnapsackPage() {
	const [steps, setSteps] = useState<Step[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [itemsInput, setItemsInput] = useState(
		JSON.stringify(
			[
				[2, 10],
				[3, 15],
				[5, 30],
				[7, 45],
			],
			null,
			2,
		),
	);
	const [capacity, setCapacity] = useState("10");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/knapsack/source");
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
			const items = JSON.parse(itemsInput);
			const capacityValue = Number.parseInt(capacity, 10);

			const response = await fetch("/api/algorithms/knapsack/execute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					input: {
						items: items,
						capacity: capacityValue,
					},
				}),
			});

			const data = await response.json();
			setSteps(data.steps);
			setCurrentStep(0);
		} catch (error) {
			console.error("Failed to execute algorithm:", error);
			alert("Invalid input format. Please check your items array.");
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
					<a href="/algorithms/dynamic-programming" className="hover:underline">
						Dynamic Programming
					</a>{" "}
					/ 0/1 Knapsack
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
							0/1 Knapsack Problem
						</h1>
						<p className="text-muted-foreground">
							Maximize value in a capacity-constrained knapsack using dynamic programming
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
						<span className="block text-sm font-medium mb-2">
							Items (Array of [weight, value] pairs)
						</span>
						<textarea
							value={itemsInput}
							onChange={(e) => setItemsInput(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded font-mono text-sm"
							rows={6}
							placeholder="[[2, 10], [3, 15], [5, 30], [7, 45]]"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Format: [[weight, value], ...] - each item has a weight and value
						</p>
					</label>
					<label className="block">
						<span className="block text-sm font-medium mb-2">Knapsack Capacity</span>
						<input
							type="number"
							value={capacity}
							onChange={(e) => setCapacity(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded"
							placeholder="10"
							min="0"
							max="50"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Maximum weight the knapsack can hold
						</p>
					</label>
					<button
						type="button"
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Solving..." : "Solve Knapsack"}
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

							{/* DP Table Visualization */}
							<div className="p-6 border border-border rounded-lg">
								<ArrayVisualizer
									values={currentStepData?.state?.values || []}
									highlights={currentStepData?.highlights || []}
								/>

								{/* Step Description */}
								<div className="mt-4 text-center">
									<p className="text-sm font-medium">{currentStepData?.description}</p>
									<p className="text-xs text-muted-foreground mt-1">
										Step {currentStep + 1} of {steps.length}
									</p>
								</div>

								{/* Metadata */}
								{currentStepData?.metadata && (
									<div className="mt-4 flex justify-center gap-6 text-xs flex-wrap">
										{currentStepData.metadata.item !== undefined && (
											<div>
												Item: <span className="font-mono">{currentStepData.metadata.item + 1}</span>
											</div>
										)}
										{currentStepData.metadata.capacity !== undefined && (
											<div>
												Capacity:{" "}
												<span className="font-mono">{currentStepData.metadata.capacity}</span>
											</div>
										)}
										{currentStepData.metadata.weight !== undefined && (
											<div>
												Weight: <span className="font-mono">{currentStepData.metadata.weight}</span>
											</div>
										)}
										{currentStepData.metadata.value !== undefined && (
											<div>
												Value: <span className="font-mono">{currentStepData.metadata.value}</span>
											</div>
										)}
										{currentStepData.metadata.max_value !== undefined && (
											<div>
												Max Value:{" "}
												<span className="font-mono">{currentStepData.metadata.max_value}</span>
											</div>
										)}
									</div>
								)}
							</div>
						</div>

						{/* Color Legend */}
						<div className="flex items-center justify-center gap-6 text-xs">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-blue-500 rounded" />
								<span>Current Cell</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-yellow-500 rounded" />
								<span>Comparing</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded" />
								<span>Selected Item</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-purple-500 rounded" />
								<span>Computed</span>
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
									O(n × W) where n = items, W = capacity
									<br />
									(naive recursion is O(2^n))
								</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">
									O(n × W) for DP table
									<br />
									(can be optimized to O(W))
								</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>Create 2D DP table: dp[i][w] = max value with first i items and capacity w</li>
							<li>Base case: dp[0][w] = 0 (no items, no value)</li>
							<li>For each item i and capacity w:</li>
							<li className="ml-6">If item weight &gt; w: can't include, dp[i][w] = dp[i-1][w]</li>
							<li className="ml-6">
								Otherwise: max of (include item: value[i] + dp[i-1][w-weight[i]], exclude item:
								dp[i-1][w])
							</li>
							<li>Final answer is dp[n][W]</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>✅ Classic DP problem - overlapping subproblems + optimal substructure</li>
							<li>✅ "0/1" means each item either included (1) or excluded (0) - no fractions</li>
							<li>
								✅ Decision at each step: include current item (if fits) or exclude it for better
								value
							</li>
							<li>💡 DP table cell [i][w] represents best value achievable with constraints</li>
							<li>💡 Can backtrack through table to find which items were selected</li>
							<li>
								💡 Space optimization: only need previous row, can reduce to O(W) space with rolling
								array
							</li>
							<li>
								💡 Used in: resource allocation, portfolio optimization, cargo loading, budget
								planning
							</li>
							<li>
								💡 Variant: unbounded knapsack allows unlimited copies of each item (different
								recurrence)
							</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Real-World Applications</h2>
						<ul className="text-sm space-y-2">
							<li>
								<strong>Investment Portfolio:</strong> Select stocks with limited capital to
								maximize returns
							</li>
							<li>
								<strong>Cargo Loading:</strong> Pack truck/ship with weight limit to maximize value
							</li>
							<li>
								<strong>Budget Planning:</strong> Choose projects with budget constraint to maximize
								impact
							</li>
							<li>
								<strong>Server Capacity:</strong> Allocate resources (CPU, memory) to maximize
								throughput
							</li>
							<li>
								<strong>Menu Selection:</strong> Choose dishes with calorie limit to maximize
								enjoyment
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
