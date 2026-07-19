"use client";

import { useEffect, useState } from "react";
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { AlgorithmStep } from "@/lib/types";

export default function LongestIncreasingSubsequencePage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [input, setInput] = useState("10, 9, 2, 5, 3, 7, 101, 18");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/lis/source");
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

			const response = await fetch("/api/algorithms/lis/execute", {
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
					/ Longest Increasing Subsequence
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
							Longest Increasing Subsequence
						</h1>
						<p className="text-muted-foreground">
							Find the length of the longest strictly increasing subsequence with O(n²) dynamic
							programming
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
						<span className="block text-sm font-medium mb-2">Array (comma-separated integers)</span>
						<input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded font-mono"
							placeholder="10, 9, 2, 5, 3, 7, 101, 18"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Enter integers separated by commas. The bars visualize the dp array (dp[i] = LIS
							length ending at index i).
						</p>
					</label>
					<button
						type="button"
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Running..." : "Find Longest Increasing Subsequence"}
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

								{/* Original array (dp bars above map to these values) */}
								{currentStepData?.metadata?.nums !== undefined && (
									<div className="mt-3 text-center text-xs text-muted-foreground">
										nums:{" "}
										<span className="font-mono">
											[{(currentStepData.metadata.nums as number[]).join(", ")}]
										</span>
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
										{currentStepData.metadata.lis_length !== undefined && (
											<div>
												LIS length:{" "}
												<span className="font-mono">
													{currentStepData.metadata.lis_length as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.comparisons !== undefined && (
											<div>
												comparisons:{" "}
												<span className="font-mono">
													{currentStepData.metadata.comparisons as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.updates !== undefined && (
											<div>
												dp updates:{" "}
												<span className="font-mono">
													{currentStepData.metadata.updates as number}
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
								<span>Candidate (j), no extension</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded" />
								<span>Candidate (j) extends / final LIS</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-purple-500 rounded" />
								<span>Initial dp values</span>
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
									O(n²) - for each element we scan every earlier element (an O(n log n)
									patience-sorting variant also exists)
								</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">O(n) - one dp entry per index, plus a parent array</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>Define dp[i] = length of the longest increasing subsequence ENDING at index i</li>
							<li>Initialize every dp[i] = 1 (each element is a subsequence of length 1)</li>
							<li>For each i from 1 onward, compare nums[i] against every earlier nums[j]:</li>
							<li className="ml-6">
								If nums[j] &lt; nums[i] and dp[j] + 1 &gt; dp[i], set dp[i] = dp[j] + 1
							</li>
							<li className="ml-6">
								Record j as the parent of i to reconstruct the subsequence later
							</li>
							<li>The answer is max(dp) - the LIS may end at any index, not just the last</li>
							<li>Walk the parent pointers back from the best index to recover one actual LIS</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>✅ dp[i] is the best LIS length that ENDS at index i - a per-index subproblem</li>
							<li>
								✅ Each dp[i] extends the best compatible earlier run, reusing dp[j] instead of
								recomputing - optimal substructure + overlapping subproblems
							</li>
							<li>✅ The answer is max(dp), not dp[n-1], because the LIS can end anywhere</li>
							<li>
								💡 A parent pointer per index lets you rebuild the actual subsequence, not just its
								length
							</li>
							<li>
								💡 Patience sorting with binary search improves this to O(n log n) by keeping the
								smallest tail for each length
							</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use / Real-World</h2>
						<ul className="text-sm space-y-2">
							<li>
								📦 Box / envelope stacking (Russian doll) - sort, then LIS on the other dimension
							</li>
							<li>🧬 Bioinformatics: longest chain of ordered matches in sequence alignment</li>
							<li>📊 Detecting the longest run of improving metrics over time</li>
							<li>🧠 A classic interview problem that teaches "dp ending at index i" framing</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
