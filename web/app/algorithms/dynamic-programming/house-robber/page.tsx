"use client";

import { useEffect, useState } from "react";
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { AlgorithmStep } from "@/lib/types";

export default function HouseRobberPage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [housesInput, setHousesInput] = useState("2, 7, 9, 3, 1");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/house_robber/source");
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
			const nums = housesInput
				.split(",")
				.map((s) => parseInt(s.trim(), 10))
				.filter((n) => !Number.isNaN(n));

			const response = await fetch("/api/algorithms/house_robber/execute", {
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
					/ House Robber
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">House Robber</h1>
						<p className="text-muted-foreground">
							Maximize loot from a row of houses without robbing two adjacent ones
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
							House values (comma-separated money in each house)
						</span>
						<input
							type="text"
							value={housesInput}
							onChange={(e) => setHousesInput(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded"
							placeholder="2, 7, 9, 3, 1"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Enter non-negative integers separated by commas (e.g. 2, 7, 9, 3, 1)
						</p>
					</label>
					<button
						type="button"
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Robbing..." : "Rob Houses"}
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

							{/* DP Table Visualization */}
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

								{/* Houses (nums) context row */}
								{currentStepData?.metadata?.nums !== undefined && (
									<div className="mt-4 text-center">
										<p className="text-xs text-muted-foreground mb-1">House values (nums)</p>
										<p className="font-mono text-sm">
											[{(currentStepData.metadata.nums as number[]).join(", ")}]
										</p>
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
									<div className="mt-4 flex flex-wrap justify-center gap-6 text-xs">
										{currentStepData.metadata.current_index !== undefined && (
											<div>
												House:{" "}
												<span className="font-mono">
													{currentStepData.metadata.current_index as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.best !== undefined && (
											<div>
												Best so far:{" "}
												<span className="font-mono">{currentStepData.metadata.best as number}</span>
											</div>
										)}
										{currentStepData.metadata.result !== undefined && (
											<div>
												Max loot:{" "}
												<span className="font-mono">
													{currentStepData.metadata.result as number}
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
								<div className="w-4 h-4 bg-yellow-500 rounded" />
								<span>Skip option (dp[i-1])</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-blue-500 rounded" />
								<span>Rob option (dp[i-2])</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded" />
								<span>Value written to dp[i]</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-purple-500 rounded" />
								<span>Final answer</span>
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
								<p className="text-sm">O(n) - one pass, one decision per house</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">O(n) - dp table (reducible to O(1))</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>Set base cases: dp[0] = nums[0], dp[1] = max(nums[0], nums[1])</li>
							<li>For each house i from 2 to n-1, weigh two mutually exclusive choices:</li>
							<li className="ml-6">SKIP house i - inherit the best-so-far dp[i-1]</li>
							<li className="ml-6">
								ROB house i - take nums[i] plus dp[i-2] (skipping the neighbor)
							</li>
							<li className="ml-6">dp[i] = max(dp[i-1], dp[i-2] + nums[i])</li>
							<li>The maximum loot is dp[n-1]</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>✅ Each house is a binary choice: rob it (skip the neighbor) or skip it</li>
							<li>
								✅ The "rob" branch reaches back to dp[i-2] because adjacent houses are forbidden
							</li>
							<li>💡 dp[i] is the best loot considering only houses 0..i (optimal substructure)</li>
							<li>💡 The running maximum never decreases, so dp is non-decreasing</li>
							<li>💡 Only the last two dp values matter - space collapses to O(1)</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use / Real-World</h2>
						<ul className="text-sm space-y-2">
							<li>🎯 The template for "max sum of non-adjacent elements" problems</li>
							<li>🎯 Scheduling non-overlapping jobs or bookings on a timeline</li>
							<li>🎯 Selecting items with a "no two in a row" / cooldown constraint</li>
							<li>
								🎯 Foundation for variants: House Robber II (circular street) and III (binary tree)
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
