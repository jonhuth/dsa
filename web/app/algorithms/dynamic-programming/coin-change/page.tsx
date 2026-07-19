"use client";

import { useEffect, useState } from "react";
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { AlgorithmStep } from "@/lib/types";

export default function CoinChangePage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [coins, setCoins] = useState("1, 2, 5");
	const [amount, setAmount] = useState("11");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/coin_change/source");
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
			const coinsValue = coins
				.split(",")
				.map((c) => parseInt(c.trim(), 10))
				.filter((c) => !Number.isNaN(c));
			const amountValue = parseInt(amount, 10);

			const response = await fetch("/api/algorithms/coin_change/execute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ input: { coins: coinsValue, amount: amountValue } }),
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
					/ Coin Change
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Coin Change</h1>
						<p className="text-muted-foreground">
							Bottom-up dynamic programming to find the minimum number of coins for a target amount
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
							<span className="block text-sm font-medium mb-2">
								Coin denominations (comma-separated)
							</span>
							<input
								type="text"
								value={coins}
								onChange={(e) => setCoins(e.target.value)}
								className="w-full px-4 py-2 bg-background border border-border rounded"
								placeholder="1, 2, 5"
							/>
							<p className="text-xs text-muted-foreground mt-1">Positive integers, e.g. 1, 2, 5</p>
						</label>
						<label className="block">
							<span className="block text-sm font-medium mb-2">Target amount</span>
							<input
								type="number"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								className="w-full px-4 py-2 bg-background border border-border rounded"
								placeholder="11"
								min="0"
								max="30"
							/>
							<p className="text-xs text-muted-foreground mt-1">
								Range: 0-30 (larger values create too many visualization steps)
							</p>
						</label>
					</div>
					<button
						type="button"
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Computing..." : "Compute Minimum Coins"}
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
									<p className="text-xs text-muted-foreground mt-1">
										Each bar is dp[amount] = min coins to make that amount (-1 = unreachable)
									</p>
								</div>

								{/* Metadata */}
								{currentStepData?.metadata && (
									<div className="mt-4 flex flex-wrap justify-center gap-6 text-xs">
										{currentStepData.metadata.current_amount !== undefined && (
											<div>
												Amount:{" "}
												<span className="font-mono">
													{currentStepData.metadata.current_amount as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.coin !== undefined && (
											<div>
												Coin:{" "}
												<span className="font-mono">{currentStepData.metadata.coin as number}</span>
											</div>
										)}
										{currentStepData.metadata.coins_tried !== undefined && (
											<div>
												Coins tried:{" "}
												<span className="font-mono">
													{currentStepData.metadata.coins_tried as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.updates !== undefined && (
											<div>
												Updates:{" "}
												<span className="font-mono">
													{currentStepData.metadata.updates as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.result !== undefined && (
											<div>
												Result:{" "}
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
								<div className="w-4 h-4 bg-blue-500 rounded" />
								<span>Current amount</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-yellow-500 rounded" />
								<span>Sub-amount read (dp[a - coin])</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded" />
								<span>Cell updated</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-purple-500 rounded" />
								<span>Base case / final answer</span>
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
									O(amount × coins) - each amount tries every denomination once
								</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">O(amount) - a single 1D DP table</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>Create dp[0..amount], dp[0] = 0 and every other amount unreachable (-1)</li>
							<li>For each amount a from 1 to the target:</li>
							<li className="ml-6">For each coin c ≤ a, look at dp[a - c]</li>
							<li className="ml-6">If dp[a - c] is reachable, candidate = dp[a - c] + 1</li>
							<li className="ml-6">
								Keep the smallest candidate: dp[a] = min(dp[a], dp[a - c] + 1)
							</li>
							<li>dp[amount] is the answer, or -1 if it stayed unreachable</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>✅ Optimal substructure: dp[a] = 1 + min(dp[a - c]) over all coins c ≤ a</li>
							<li>✅ Overlapping subproblems: each dp[a] is reused by every larger amount</li>
							<li>
								💡 Greedy (take biggest coin first) can fail — DP always finds the true minimum
							</li>
							<li>
								💡 Iterating amount outer, coin inner lets each coin be reused unlimited times
							</li>
							<li>💡 A sentinel "infinity" cleanly marks amounts that cannot be formed</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use / Real-World</h2>
						<ul className="text-sm space-y-2 list-disc list-inside">
							<li>Making change with the fewest coins/bills at a register or vending machine</li>
							<li>Any "minimum items to reach a target" unbounded-knapsack style problem</li>
							<li>Fewest denominations for cash dispensing (ATMs) or currency exchange</li>
							<li>A canonical interview problem for teaching bottom-up DP over 1D tables</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
