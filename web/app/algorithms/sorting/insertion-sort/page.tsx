"use client";

import { useEffect, useState } from "react";
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { AlgorithmStep } from "@/lib/types";

export default function InsertionSortPage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [inputArray, setInputArray] = useState("5, 2, 8, 1, 9");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	// Fetch source code on mount
	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/insertion_sort/source");
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
			// Parse input
			const arr = inputArray.split(",").map((n) => parseInt(n.trim(), 10));

			const response = await fetch("/api/algorithms/insertion_sort/execute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ input: arr }),
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
					<a href="/algorithms/sorting" className="hover:underline">
						Sorting
					</a>{" "}
					/ Insertion Sort
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Insertion Sort</h1>
						<p className="text-muted-foreground">
							Simple comparison-based sorting algorithm that repeatedly swaps adjacent elements
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
					<div>
						<label className="block text-sm font-medium mb-2">Input Array (comma-separated)</label>
						<input
							type="text"
							value={inputArray}
							onChange={(e) => setInputArray(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded"
							placeholder="5, 2, 8, 1, 9"
						/>
					</div>
					<button
						type="button"
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Running..." : "Run Algorithm"}
					</button>
				</div>

				{/* Visualization */}
				{steps.length > 0 && (
					<div className="space-y-4">
						{/* Split-pane layout: Code + Visualization */}
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

							{/* Array Visualization */}
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
									<div className="mt-4 flex justify-center gap-6 text-xs">
										{currentStepData.metadata.comparisons !== undefined && (
											<div>
												Comparisons:{" "}
												<span className="font-mono">{currentStepData.metadata.comparisons}</span>
											</div>
										)}
										{currentStepData.metadata.swaps !== undefined && (
											<div>
												Swaps: <span className="font-mono">{currentStepData.metadata.swaps}</span>
											</div>
										)}
										{currentStepData.metadata.passes !== undefined && (
											<div>
												Passes: <span className="font-mono">{currentStepData.metadata.passes}</span>
											</div>
										)}
									</div>
								)}
							</div>
						</div>

						{/* Color Legend */}
						<div className="flex items-center justify-center gap-6 text-xs">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-yellow-500 rounded" />
								<span>Comparing</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded" />
								<span>Swapped</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-purple-500 rounded" />
								<span>Sorted</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-blue-500 rounded" />
								<span>Active Range</span>
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
									<li>Best: O(n) - already sorted</li>
									<li>Average: O(n²)</li>
									<li>Worst: O(n²) - reverse sorted</li>
								</ul>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">O(1) - in-place sorting</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>Compare adjacent elements in the array</li>
							<li>Swap them if they are in the wrong order</li>
							<li>Repeat passes through the array until no swaps are needed</li>
							<li>Each pass "bubbles" the largest unsorted element to its correct position</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>✅ Stable: maintains relative order of equal elements</li>
							<li>✅ In-place: requires no extra space</li>
							<li>✅ Simple to understand and implement</li>
							<li>❌ Not efficient for large datasets (O(n²) average case)</li>
							<li>💡 Can be optimized to stop early if no swaps occur (array is sorted)</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
