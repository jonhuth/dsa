"use client";

import { useEffect, useState } from "react";
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { AlgorithmStep } from "@/lib/types";

export default function MergeSortPage() {
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
				const response = await fetch("/api/algorithms/merge_sort/source");
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

			const response = await fetch("/api/algorithms/merge_sort/execute", {
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
					/ Merge Sort
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Merge Sort</h1>
						<p className="text-muted-foreground">
							Stable divide-and-conquer sorting with guaranteed O(n log n) performance
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
						<span className="block text-sm font-medium mb-2">Input Array (comma-separated)</span>
						<input
							type="text"
							value={inputArray}
							onChange={(e) => setInputArray(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded"
							placeholder="5, 2, 8, 1, 9"
						/>
					</label>
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
									<CodeViewer
										code={sourceCode}
										highlightedLine={currentLine as number | undefined}
									/>
								</div>
							)}

							{/* Array Visualization */}
							<div className="p-6 border border-border rounded-lg">
								<ArrayVisualizer
									values={(currentStepData?.state?.values as number[]) || []}
									highlights={
										(currentStepData?.highlights as Array<{
											indices?: number[];
											color?: string;
										}>) || []
									}
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
												<span className="font-mono">
													{currentStepData.metadata.comparisons as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.merges !== undefined && (
											<div>
												Merges: <span className="font-mono">{currentStepData.metadata.merges}</span>
											</div>
										)}
										{currentStepData.metadata.array_accesses !== undefined && (
											<div>
												Array Accesses:{" "}
												<span className="font-mono">{currentStepData.metadata.array_accesses}</span>
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
								<span>Left Subarray</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-blue-500 rounded" />
								<span>Right Subarray</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded" />
								<span>Placed</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-purple-500 rounded" />
								<span>Merged Range</span>
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
									<li>Best: O(n log n)</li>
									<li>Average: O(n log n)</li>
									<li>Worst: O(n log n) - guaranteed!</li>
								</ul>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">O(n) - requires extra space for merging</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>Divide the array into two halves</li>
							<li>Recursively sort the left half</li>
							<li>Recursively sort the right half</li>
							<li>Merge the two sorted halves into one sorted array</li>
							<li>Base case: arrays of size ≤ 1 are already sorted</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>⚡ Divide-and-conquer: splits problem recursively</li>
							<li>✅ Stable: preserves relative order of equal elements</li>
							<li>✅ Predictable: O(n log n) guaranteed, no worst-case degradation</li>
							<li>❌ Not in-place: requires O(n) extra space</li>
							<li>⚡ Great for external sorting (sorting data that doesn't fit in memory)</li>
							<li>💡 No worst-case scenario unlike Quick Sort</li>
							<li>🔍 Easy to parallelize (each half can be sorted independently)</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use</h2>
						<ul className="text-sm space-y-2">
							<li>✅ When stability is required (preserve order of equal elements)</li>
							<li>✅ When worst-case O(n log n) guarantee is needed</li>
							<li>✅ For external sorting (large datasets that don't fit in memory)</li>
							<li>✅ When parallelization is beneficial</li>
							<li>❌ When memory is extremely limited (use Quick Sort or Heap Sort)</li>
							<li>❌ When in-place sorting is required</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Comparison with Quick Sort</h2>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<h3 className="font-medium mb-2 text-purple-400">Merge Sort</h3>
								<ul className="space-y-1">
									<li>✅ O(n log n) guaranteed</li>
									<li>✅ Stable</li>
									<li>❌ O(n) extra space</li>
									<li>⚡ Great for linked lists</li>
								</ul>
							</div>
							<div>
								<h3 className="font-medium mb-2 text-blue-400">Quick Sort</h3>
								<ul className="space-y-1">
									<li>❌ O(n²) worst case</li>
									<li>❌ Not stable</li>
									<li>✅ O(log n) space (in-place)</li>
									<li>⚡ Often faster in practice</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
