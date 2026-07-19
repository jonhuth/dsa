"use client";

import { useEffect, useState } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { GridVisualizer } from "@/components/visualizers/GridVisualizer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { AlgorithmStep } from "@/lib/types";

export default function LongestPalindromicSubsequencePage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [s, setS] = useState("bbbab");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/longest_palindromic_subsequence/source");
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
			const response = await fetch("/api/algorithms/longest_palindromic_subsequence/execute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					input: { s: s },
				}),
			});

			const data = await response.json();
			setSteps(data.steps);
			setCurrentStep(0);
		} catch (error) {
			console.error("Failed to execute algorithm:", error);
			alert("Failed to compute the longest palindromic subsequence. Please check your input.");
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
					/ Longest Palindromic Subsequence
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
							Longest Palindromic Subsequence
						</h1>
						<p className="text-muted-foreground">
							Longest subsequence of a string that reads the same forwards and backwards
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
					<div className="grid grid-cols-1 gap-4">
						<label className="block">
							<span className="block text-sm font-medium mb-2">String</span>
							<input
								type="text"
								value={s}
								onChange={(e) => setS(e.target.value)}
								className="w-full px-4 py-2 bg-background border border-border rounded font-mono text-sm"
								placeholder="bbbab"
							/>
						</label>
					</div>
					<p className="text-xs text-muted-foreground">
						The grid fills dp[i][j] = length of the longest palindromic subsequence within s[i..j].
						The answer is the top-right cell dp[0][n-1].
					</p>
					<button
						type="button"
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Computing..." : "Compute Longest Palindromic Subsequence"}
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
										{currentStepData.metadata.char_i !== undefined && (
											<div>
												Comparing:{" "}
												<span className="font-mono">
													'{currentStepData.metadata.char_i as string}' vs '
													{currentStepData.metadata.char_j as string}'
												</span>
											</div>
										)}
										{currentStepData.metadata.operation_won !== undefined && (
											<div>
												Choice:{" "}
												<span className="font-mono font-bold">
													{currentStepData.metadata.operation_won as string}
												</span>
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
										{currentStepData.metadata.lps_length !== undefined && (
											<div>
												LPS Length:{" "}
												<span className="font-mono font-bold">
													{currentStepData.metadata.lps_length as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.comparisons !== undefined && (
											<div>
												Comparisons:{" "}
												<span className="font-mono">
													{currentStepData.metadata.comparisons as number}
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
								<span>Winning Source</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-purple-500 rounded" />
								<span>Candidate / Base Case</span>
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
									O(n²) where n = string length
									<br />
									(naive recursion is O(2ⁿ))
								</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">
									O(n²) for DP table
									<br />
									(can be optimized to O(n) with a rolling array)
								</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>
								Create 2D DP table: dp[i][j] = length of the longest palindromic subsequence within
								s[i..j]
							</li>
							<li>Base case: dp[i][i] = 1 — each single character is a palindrome of length 1</li>
							<li>
								Fill by increasing interval length (i from high to low, j from i upward) so
								dependencies are ready:
							</li>
							<li className="ml-6">
								If s[i] == s[j]: the ends wrap an inner palindrome, dp[i][j] = 2 + dp[i+1][j-1]
							</li>
							<li className="ml-6">
								Otherwise: drop one end, dp[i][j] = max(dp[i+1][j], dp[i][j-1])
							</li>
							<li>The answer is dp[0][n-1] — the top-right cell (the whole string)</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>
								✅ Interval DP — subproblems are contiguous substrings s[i..j], solved shortest
								first
							</li>
							<li>
								✅ Matching ends add 2 and recurse inward; mismatched ends discard one character
							</li>
							<li>
								💡 LPS(s) equals LCS(s, reverse(s)) — the same answer via a different classic DP
							</li>
							<li>💡 Minimum deletions to make s a palindrome is exactly n − LPS(s)</li>
							<li>💡 Only the upper triangle (i ≤ j) of the table is ever used</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use / Real-World Applications</h2>
						<ul className="text-sm space-y-2">
							<li>
								<strong>Bioinformatics:</strong> Model RNA secondary structure, where complementary
								bases pair like palindrome ends
							</li>
							<li>
								<strong>Text Similarity:</strong> Measure symmetric structure within a single
								sequence
							</li>
							<li>
								<strong>String Editing:</strong> Compute minimum deletions (or insertions) to turn a
								string into a palindrome
							</li>
							<li>
								<strong>Interview Staple:</strong> A canonical interval-DP problem that generalizes
								to matrix-chain and palindrome-partitioning variants
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
