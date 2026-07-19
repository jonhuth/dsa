"use client";

import { useEffect, useState } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { GridVisualizer } from "@/components/visualizers/GridVisualizer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { AlgorithmStep } from "@/lib/types";

export default function CoinChange2Page() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [coinsText, setCoinsText] = useState("1, 2, 5");
	const [amount, setAmount] = useState(5);
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/coin_change_2/source");
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
			const coins = coinsText
				.split(",")
				.map((s) => Number.parseInt(s.trim(), 10))
				.filter((n) => Number.isFinite(n));

			const response = await fetch("/api/algorithms/coin_change_2/execute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					input: { coins: coins, amount: amount },
				}),
			});

			const data = await response.json();
			setSteps(data.steps);
			setCurrentStep(0);
		} catch (error) {
			console.error("Failed to execute algorithm:", error);
			alert("Failed to count ways. Please check your input.");
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
					/ Coin Change II (Count Ways)
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
							Coin Change II (Count Ways)
						</h1>
						<p className="text-muted-foreground">
							Count the number of distinct combinations of coins that add up to a target amount
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
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<label className="block">
							<span className="block text-sm font-medium mb-2">Coins (comma-separated)</span>
							<input
								type="text"
								value={coinsText}
								onChange={(e) => setCoinsText(e.target.value)}
								className="w-full px-4 py-2 bg-background border border-border rounded font-mono text-sm"
								placeholder="1, 2, 5"
							/>
						</label>
						<label className="block">
							<span className="block text-sm font-medium mb-2">Amount</span>
							<input
								type="number"
								value={amount}
								onChange={(e) => setAmount(Number.parseInt(e.target.value, 10) || 0)}
								className="w-full px-4 py-2 bg-background border border-border rounded font-mono text-sm"
								placeholder="5"
							/>
						</label>
					</div>
					<p className="text-xs text-muted-foreground">
						The grid fills dp[i][j] = number of ways to make amount j using the first i coin types.
						Order does not matter, so {"{1,2}"} and {"{2,1}"} count once. The answer is the
						bottom-right cell.
					</p>
					<button
						type="button"
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Counting..." : "Count Ways"}
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

							{/* DP Grid Visualization */}
							<div className="p-6 border border-border rounded-lg">
								<GridVisualizer
									grid={(currentStepData?.state?.grid as number[][] | undefined) || []}
									variant="table"
									highlights={currentStepData?.highlights ?? []}
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
										{currentStepData.metadata.coin !== undefined && (
											<div>
												Coin:{" "}
												<span className="font-mono font-bold">
													{currentStepData.metadata.coin as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.skip !== undefined && (
											<div>
												Skip:{" "}
												<span className="font-mono">{currentStepData.metadata.skip as number}</span>
											</div>
										)}
										{currentStepData.metadata.use !== undefined && (
											<div>
												Use:{" "}
												<span className="font-mono">{currentStepData.metadata.use as number}</span>
											</div>
										)}
										{currentStepData.metadata.value !== undefined && (
											<div>
												Cell Value:{" "}
												<span className="font-mono">
													{currentStepData.metadata.value as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.ways !== undefined && (
											<div>
												Total Ways:{" "}
												<span className="font-mono font-bold">
													{currentStepData.metadata.ways as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.operations !== undefined && (
											<div>
												Cells Computed:{" "}
												<span className="font-mono">
													{currentStepData.metadata.operations as number}
												</span>
											</div>
										)}
									</div>
								)}
							</div>
						</div>

						{/* Color Legend */}
						<div className="flex items-center justify-center gap-6 text-xs flex-wrap">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-blue-500 rounded" />
								<span>Current Cell</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-yellow-500 rounded" />
								<span>Skip (cell above)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-purple-500 rounded" />
								<span>Use Coin / Base Case</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded" />
								<span>Final Answer</span>
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
									O(k × amount) where k = number of coin types
									<br />
									(one pass over each cell of the table)
								</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">
									O(k × amount) for the DP table
									<br />
									(can be optimized to O(amount) with a 1D array)
								</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>
								Create a 2D DP table: dp[i][j] = number of ways to make amount j using the first i
								coin types
							</li>
							<li>Base case: dp[i][0] = 1 — exactly one way to make amount 0 (use no coins)</li>
							<li>Add one coin type at a time (outer loop over coins) so order does not matter:</li>
							<li className="ml-6">
								Skip coin i: inherit dp[i-1][j] (the ways that never use this coin — cell above)
							</li>
							<li className="ml-6">
								Use coin i (if coin ≤ j): add dp[i][j - coin] (same row, so the coin can be reused)
							</li>
							<li>dp[i][j] = skip + use — a SUM, because we are counting combinations</li>
							<li>The answer is dp[k][amount] — the bottom-right cell</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>
								✅ Looping over coins in the OUTER loop is what prevents double-counting
								permutations — {"{1,2}"} and {"{2,1}"} are the same combination
							</li>
							<li>
								💡 The "use coin" transition reuses the SAME row (dp[i][j - coin]) because a coin
								can be picked any number of times (unbounded knapsack)
							</li>
							<li>
								💡 Contrast with Coin Change (min coins): that problem MINIMIZES 1 + subproblem;
								this one SUMS subproblems. Unreachable amounts here are simply 0 ways, not infinity
							</li>
							<li>
								💡 Only the previous row and the current row are needed, so space collapses to
								O(amount) with a single rolling array updated left-to-right
							</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use / Real-World Applications</h2>
						<ul className="text-sm space-y-2">
							<li>
								<strong>Making Change:</strong> Count how many distinct coin/note combinations
								produce a given total
							</li>
							<li>
								<strong>Integer Partitions:</strong> Count ways to write a number as a sum from a
								fixed set of parts
							</li>
							<li>
								<strong>Combinatorics & Counting DP:</strong> Template for any "count combinations
								that sum to a target" problem
							</li>
							<li>
								<strong>Knapsack-Style Counting:</strong> Count fillings of a capacity when items
								are reusable and order is irrelevant
							</li>
							<li>
								<strong>Pricing & Denomination Design:</strong> Analyze how flexibly a set of
								denominations can represent totals
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
