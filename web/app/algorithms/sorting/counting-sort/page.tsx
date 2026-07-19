"use client";

import { useEffect, useState } from "react";
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { AlgorithmStep } from "@/lib/types";

export default function CountingSortPage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [inputArray, setInputArray] = useState("4, 2, 8, 3, 1, 4, 7, 2");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	// Fetch source code on mount
	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/counting_sort/source");
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
			const nums = inputArray.split(",").map((n) => parseInt(n.trim(), 10));

			const response = await fetch("/api/algorithms/counting_sort/execute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ input: nums }),
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
	const counts = currentStepData?.metadata?.counts as number[] | undefined;

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
					/ Counting Sort
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Counting Sort</h1>
						<p className="text-muted-foreground">
							Non-comparison integer sort that counts occurrences to achieve linear O(n + k) time
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
							Input Array (comma-separated, non-negative integers)
						</span>
						<input
							type="text"
							value={inputArray}
							onChange={(e) => setInputArray(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded"
							placeholder="4, 2, 8, 3, 1, 4, 7, 2"
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

								{/* Count Array */}
								{counts && counts.length > 0 && (
									<div className="mt-6">
										<p className="text-xs text-muted-foreground text-center mb-2">
											Count Array (index = value, cell = count / position)
										</p>
										<div className="flex items-end justify-center gap-1 overflow-x-auto px-2">
											{counts.map((c, idx) => {
												const isActive = currentStepData?.metadata?.count_index === idx;
												const isPrefix = currentStepData?.metadata?.prefix_index === idx;
												return (
													// biome-ignore lint/suspicious/noArrayIndexKey: count indices are stable value buckets
													<div key={idx} className="flex flex-col items-center gap-1 shrink-0">
														<div
															className={`w-7 h-8 flex items-center justify-center rounded text-xs font-mono border ${
																isActive || isPrefix
																	? "bg-yellow-500 text-black border-yellow-600"
																	: "bg-card border-border"
															}`}
														>
															{c}
														</div>
														<div className="text-[10px] text-muted-foreground">{idx}</div>
													</div>
												);
											})}
										</div>
									</div>
								)}

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
										{currentStepData.metadata.count_writes !== undefined && (
											<div>
												Count Writes:{" "}
												<span className="font-mono">
													{currentStepData.metadata.count_writes as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.placements !== undefined && (
											<div>
												Placements:{" "}
												<span className="font-mono">
													{currentStepData.metadata.placements as number}
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
								<div className="w-4 h-4 bg-yellow-500 rounded" />
								<span>Counting / Active Bucket</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded" />
								<span>Just Placed</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-purple-500 rounded" />
								<span>Sorted</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-blue-500 rounded" />
								<span>Max Value</span>
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
									<li>Best: O(n + k)</li>
									<li>Average: O(n + k)</li>
									<li>Worst: O(n + k)</li>
									<li className="text-muted-foreground">n = element count, k = value range</li>
								</ul>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">
									O(n + k) - count array of size k plus output array of size n
								</p>
								<p className="text-sm mt-2 text-muted-foreground">
									Stable: equal elements keep their relative order
								</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>Find the maximum value to size the count array (k = max + 1)</li>
							<li>
								<strong>Phase 1 - Count:</strong> scan the input and tally how many times each value
								appears into its count bucket
							</li>
							<li>
								<strong>Phase 2 - Prefix sum:</strong> accumulate the counts so each bucket holds
								the number of elements ≤ that value (its end position)
							</li>
							<li>
								<strong>Phase 3 - Place:</strong> walk the input right-to-left, placing each element
								at its computed position and decrementing the bucket
							</li>
							<li>The output array is now fully sorted and stable</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>🚀 Non-comparison sort: beats the O(n log n) comparison lower bound</li>
							<li>⚡ Linear O(n + k) time when the value range k is comparable to n</li>
							<li>✅ Stable: right-to-left placement preserves relative order of equal keys</li>
							<li>❌ Degrades when k ≫ n: a huge value range wastes memory and time</li>
							<li>
								🔢 Only works on non-negative integers (or values mappable to a bounded range)
							</li>
							<li>🧱 Serves as the stable subroutine inside Radix Sort</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use</h2>
						<ul className="text-sm space-y-2">
							<li>
								✅ Sorting integers within a small, known range (e.g. ages, grades, byte values)
							</li>
							<li>✅ When linear-time sorting is needed and the key range is bounded</li>
							<li>✅ As the digit-sorting pass inside Radix Sort</li>
							<li>❌ When values are large or sparse (k ≫ n makes it wasteful)</li>
							<li>❌ For floating-point or arbitrary comparable objects (use Merge/Quick Sort)</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
