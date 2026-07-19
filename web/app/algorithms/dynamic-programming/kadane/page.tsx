"use client";

import { useEffect, useState } from "react";
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { AlgorithmStep } from "@/lib/types";

export default function KadanePage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [input, setInput] = useState("-2, 1, -3, 4, -1, 2, 1, -5, 4");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/kadane/source");
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
			const nums = input
				.split(",")
				.map((s) => s.trim())
				.filter((s) => s.length > 0)
				.map((s) => parseInt(s, 10))
				.filter((v) => !Number.isNaN(v));

			const response = await fetch("/api/algorithms/kadane/execute", {
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
	const currentLine = currentStepData?.metadata?.source_line as number | undefined;

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
					/ Kadane's Maximum Subarray
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
							Kadane's Maximum Subarray
						</h1>
						<p className="text-muted-foreground">
							Find the contiguous subarray with the largest sum in a single linear pass
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
							Array (comma-separated, negatives allowed)
						</span>
						<input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded font-mono"
							placeholder="-2, 1, -3, 4, -1, 2, 1, -5, 4"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Enter integers separated by commas. Negative numbers are supported.
						</p>
					</label>
					<button
						type="button"
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Running..." : "Find Maximum Subarray"}
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
									<div className="mt-4 flex flex-wrap justify-center gap-6 text-xs">
										{currentStepData.metadata.current_sum !== undefined && (
											<div>
												current_sum:{" "}
												<span className="font-mono">
													{currentStepData.metadata.current_sum as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.best_sum !== undefined && (
											<div>
												best_sum:{" "}
												<span className="font-mono">
													{currentStepData.metadata.best_sum as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.best_start !== undefined &&
											currentStepData.metadata.best_end !== undefined && (
												<div>
													best window:{" "}
													<span className="font-mono">
														[{currentStepData.metadata.best_start as number}..
														{currentStepData.metadata.best_end as number}]
													</span>
												</div>
											)}
									</div>
								)}
							</div>
						</div>

						{/* Color Legend */}
						<div className="flex flex-wrap items-center justify-center gap-6 text-xs">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-blue-500 rounded" />
								<span>Current element (i)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-yellow-500 rounded" />
								<span>Current running window</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-purple-500 rounded" />
								<span>Best window so far</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded" />
								<span>Maximum subarray (final)</span>
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
								<p className="text-sm">O(n) - a single pass over the array</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">O(1) - only running scalars are tracked</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>Initialize current_sum and best_sum to the first element</li>
							<li>For each element from index 1 onward:</li>
							<li className="ml-6">current_sum = max(nums[i], current_sum + nums[i])</li>
							<li className="ml-6">
								If current_sum + nums[i] &lt; nums[i], the running sum was negative, so reset the
								window to start at i
							</li>
							<li className="ml-6">Update best_sum whenever current_sum exceeds it</li>
							<li>best_sum holds the maximum contiguous subarray sum</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>✅ current_sum is the best subarray sum that ENDS at index i</li>
							<li>
								✅ A negative running prefix can only hurt future sums, so drop it and restart the
								window
							</li>
							<li>✅ Linear time, constant space - no DP table required</li>
							<li>
								💡 Initialize best to the first element (not 0) so all-negative arrays return the
								largest single element
							</li>
							<li>💡 Track start/end indices alongside the sum to recover the actual subarray</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use / Real-World</h2>
						<ul className="text-sm space-y-2">
							<li>
								📈 Maximum profit over a contiguous time window (e.g. best run of daily gains)
							</li>
							<li>
								🎯 Any "largest contiguous sum" subproblem inside a bigger DP or greedy solution
							</li>
							<li>🖼️ 2D extension (max sum rectangle) uses Kadane over collapsed column sums</li>
							<li>🧠 A staple interview question that demonstrates DP with O(1) space</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
