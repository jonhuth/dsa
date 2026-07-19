"use client";

import { useEffect, useState } from "react";
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { AlgorithmStep } from "@/lib/types";

export default function RadixSortPage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [inputArray, setInputArray] = useState("170, 45, 75, 90, 2, 802, 24, 66");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	// Fetch source code on mount
	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/radix_sort/source");
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

			const response = await fetch("/api/algorithms/radix_sort/execute", {
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
					/ Radix Sort
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Radix Sort</h1>
						<p className="text-muted-foreground">
							Non-comparison, digit-by-digit integer sort that runs in linear O(d·(n+k)) time
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
							placeholder="170, 45, 75, 90, 2, 802, 24, 66"
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
										{currentStepData.metadata.pass_number !== undefined &&
											currentStepData.metadata.pass_number !== null && (
												<div>
													Pass:{" "}
													<span className="font-mono">
														{currentStepData.metadata.pass_number as number}
													</span>
												</div>
											)}
										{currentStepData.metadata.current_digit_place !== undefined &&
											currentStepData.metadata.current_digit_place !== null && (
												<div>
													Digit place:{" "}
													<span className="font-mono">
														{currentStepData.metadata.current_digit_place as number}
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
								<div className="w-4 h-4 bg-blue-500 rounded" />
								<span>Active element</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-yellow-500 rounded" />
								<span>Shares active digit</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-purple-500 rounded" />
								<span>Sorted</span>
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
									<li>Best: O(d·(n + k))</li>
									<li>Average: O(d·(n + k))</li>
									<li>Worst: O(d·(n + k))</li>
								</ul>
								<p className="text-xs text-muted-foreground mt-2">
									d = digits in the largest value, n = element count, k = radix (10). Effectively
									linear for fixed-width integers.
								</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">O(n + k) - output buffer plus k digit buckets</p>
								<p className="text-sm mt-2">Stable: yes (per-digit counting sort is stable)</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>Find the largest value to determine how many digit passes are needed</li>
							<li>Start at the least significant digit (the ones place)</li>
							<li>
								Distribute every element into one of 10 buckets (0-9) based on its current digit,
								keeping their relative order (stable)
							</li>
							<li>Concatenate buckets 0-9 back into the array</li>
							<li>Move to the next digit place (tens, hundreds, ...) and repeat</li>
							<li>After the most significant digit is processed, the array is fully sorted</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>⚡ Non-comparison sort: beats the O(n log n) comparison lower bound</li>
							<li>✅ Stable: the per-digit counting sort preserves prior ordering</li>
							<li>💡 Stability of each pass is what makes the LSD approach correct</li>
							<li>🚀 Linear O(d·(n + k)) time when digit count d is a small constant</li>
							<li>⚠️ Classic form assumes non-negative integers (or fixed-width keys)</li>
							<li>📦 Needs O(n + k) extra space for buckets - not in-place</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use</h2>
						<ul className="text-sm space-y-2">
							<li>✅ Sorting large sets of fixed-width integers or fixed-length strings</li>
							<li>✅ When keys have a bounded number of digits and a small radix</li>
							<li>✅ When a stable, linear-time sort is worth the extra memory</li>
							<li>❌ When keys vary wildly in magnitude (d becomes large)</li>
							<li>❌ When memory is tight (use an in-place comparison sort instead)</li>
							<li>❌ For arbitrary comparable objects with no digit/key decomposition</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
