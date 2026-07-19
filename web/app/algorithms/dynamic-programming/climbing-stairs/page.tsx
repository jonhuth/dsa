"use client";

import { useEffect, useState } from "react";
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { AlgorithmStep } from "@/lib/types";

export default function ClimbingStairsPage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [n, setN] = useState("5");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/climbing_stairs/source");
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
			const nValue = parseInt(n, 10);

			const response = await fetch("/api/algorithms/climbing_stairs/execute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ input: nValue }),
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
					/ Climbing Stairs
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Climbing Stairs</h1>
						<p className="text-muted-foreground">
							Count the distinct ways to climb a staircase taking 1 or 2 steps at a time
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
						<span className="block text-sm font-medium mb-2">Number of stairs n =</span>
						<input
							type="number"
							value={n}
							onChange={(e) => setN(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded"
							placeholder="5"
							min="0"
							max="20"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Range: 0-20 (larger values create too many visualization steps)
						</p>
					</label>
					<button
						type="button"
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Computing..." : "Count Ways"}
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
										{currentStepData.metadata.n !== undefined && (
											<div>
												Stairs:{" "}
												<span className="font-mono">
													n = {currentStepData.metadata.n as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.additions !== undefined && (
											<div>
												Additions:{" "}
												<span className="font-mono">
													{currentStepData.metadata.additions as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.result !== undefined && (
											<div>
												Ways:{" "}
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
						<div className="flex items-center justify-center gap-6 text-xs">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-blue-500 rounded" />
								<span>Current Step (ways[i])</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-yellow-500 rounded" />
								<span>Came From (i-1, i-2)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded" />
								<span>Just Computed</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-purple-500 rounded" />
								<span>Base Case / Final</span>
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
								<p className="text-sm">O(n) - computes each step count once</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">O(n) - stores the dp array (reducible to O(1))</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>Set base cases: ways[0] = 1 (stand still) and ways[1] = 1 (one 1-step)</li>
							<li>For each step i from 2 to n:</li>
							<li className="ml-6">
								You reach step i either from step i-1 (a 1-step) or from step i-2 (a 2-step)
							</li>
							<li className="ml-6">So ways[i] = ways[i-1] + ways[i-2]</li>
							<li>The answer is ways[n] - the total distinct ways to reach the top</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>✅ This is the Fibonacci sequence in disguise (ways[n] = Fib(n+1))</li>
							<li>✅ Bottom-up DP - builds each answer from the two smaller subproblems</li>
							<li>✅ Linear time - dramatically faster than naive O(2^n) recursion</li>
							<li>💡 Optimal substructure + overlapping subproblems = textbook DP</li>
							<li>💡 Can be space-optimized to O(1) by tracking only the last two values</li>
							<li>💡 Generalizes: allow 1, 2, or 3 steps and you sum the last three values</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use / Real-World</h2>
						<ul className="text-sm space-y-2">
							<li>🎯 Classic interview warm-up for teaching 1D dynamic programming</li>
							<li>🎯 Counting-paths problems where each state depends on a few prior states</li>
							<li>🎯 Any decomposition where choices at each stage combine additively</li>
							<li>🎯 A stepping stone to harder DP: coin change, tiling, and grid-path counting</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
