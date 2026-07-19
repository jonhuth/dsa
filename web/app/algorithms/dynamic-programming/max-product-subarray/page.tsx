"use client";

import { useEffect, useState } from "react";
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { AlgorithmStep } from "@/lib/types";

export default function MaxProductSubarrayPage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [input, setInput] = useState("2, 3, -2, 4, -1");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/max_product_subarray/source");
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

			const response = await fetch("/api/algorithms/max_product_subarray/execute", {
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
					/ Maximum Product Subarray
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
							Maximum Product Subarray
						</h1>
						<p className="text-muted-foreground">
							Find the contiguous subarray with the largest product in a single linear pass
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
							Array (comma-separated, negatives and zeros allowed)
						</span>
						<input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded font-mono"
							placeholder="2, 3, -2, 4, -1"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Enter integers separated by commas. Negative numbers and zeros are supported.
						</p>
					</label>
					<button
						type="button"
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Running..." : "Find Maximum Product"}
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
										{currentStepData.metadata.cur_max !== undefined && (
											<div>
												cur_max:{" "}
												<span className="font-mono">
													{currentStepData.metadata.cur_max as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.cur_min !== undefined && (
											<div>
												cur_min:{" "}
												<span className="font-mono">
													{currentStepData.metadata.cur_min as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.best !== undefined && (
											<div>
												best:{" "}
												<span className="font-mono">{currentStepData.metadata.best as number}</span>
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
								<span>Maximum product subarray (final)</span>
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
							<li>Initialize cur_max, cur_min, and best to the first element</li>
							<li>For each element x = nums[i] from index 1 onward:</li>
							<li className="ml-6">
								cur_max = max(x, old_cur_max &times; x, old_cur_min &times; x)
							</li>
							<li className="ml-6">
								cur_min = min(x, old_cur_max &times; x, old_cur_min &times; x)
							</li>
							<li className="ml-6">
								Compute both from the OLD cur_max/cur_min before overwriting either
							</li>
							<li className="ml-6">Update best whenever cur_max exceeds it</li>
							<li>best holds the maximum contiguous subarray product</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>
								✅ You must track BOTH the max and min product ending at i - the min is a candidate
								max waiting for a sign flip
							</li>
							<li>
								✅ A negative element swaps the roles of max and min (negative &times; smallest =
								largest)
							</li>
							<li>
								💡 A zero collapses both products to 0 and effectively restarts the window after it
							</li>
							<li>
								💡 Initialize best to nums[0] (not 1) so single-element and all-negative arrays
								return the correct answer
							</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use / Real-World</h2>
						<ul className="text-sm space-y-2">
							<li>
								📈 Maximizing multiplicative gain over a contiguous window (e.g. compounded growth
								factors)
							</li>
							<li>🎯 Any "largest contiguous product" subproblem where signs and zeros interact</li>
							<li>
								🧠 A classic interview follow-up to Kadane that tests handling of negatives and
								zeros
							</li>
							<li>🔁 Demonstrates carrying two DP states in parallel instead of one</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
