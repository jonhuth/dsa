"use client";

import { useState, useEffect } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";

export default function LCSPage() {
	const [steps, setSteps] = useState<any[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [str1, setStr1] = useState("ABCDGH");
	const [str2, setStr2] = useState("AEDFHR");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/lcs/source");
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
			const response = await fetch("/api/algorithms/lcs/execute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					input: {
						str1: str1,
						str2: str2,
					},
				}),
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
		<div className="min-h-screen p-8">
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
					/ Longest Common Subsequence
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-4xl font-bold mb-2">Longest Common Subsequence (LCS)</h1>
						<p className="text-muted-foreground">
							Find the longest subsequence common to two strings using 2D dynamic programming
						</p>
					</div>
					{steps.length > 0 && (
						<button
							onClick={() => setShowCode(!showCode)}
							className="px-4 py-2 border border-border rounded hover:bg-accent text-sm"
						>
							{showCode ? "Hide Code" : "Show Code"}
						</button>
					)}
				</div>

				{/* Input Controls */}
				<div className="p-6 border border-border rounded-lg space-y-4">
					<div>
						<label className="block text-sm font-medium mb-2">First String</label>
						<input
							type="text"
							value={str1}
							onChange={(e) => setStr1(e.target.value.toUpperCase())}
							className="w-full px-4 py-2 bg-background border border-border rounded font-mono"
							placeholder="ABCDGH"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-2">Second String</label>
						<input
							type="text"
							value={str2}
							onChange={(e) => setStr2(e.target.value.toUpperCase())}
							className="w-full px-4 py-2 bg-background border border-border rounded font-mono"
							placeholder="AEDFHR"
						/>
					</div>
					<p className="text-xs text-muted-foreground">
						Example: "ABCDGH" and "AEDFHR" → LCS is "ADH" (length 3)
					</p>
					<button
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Computing..." : "Find LCS"}
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
									<CodeViewer code={sourceCode} highlightedLine={currentLine} />
								</div>
							)}

							{/* DP Table Visualization */}
							<div className="p-6 border border-border rounded-lg">
								<ArrayVisualizer
									values={currentStepData?.state?.values || []}
									highlights={currentStepData?.highlights || []}
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
										{currentStepData.metadata.str1 && (
											<div>
												String 1:{" "}
												<span className="font-mono font-bold">{currentStepData.metadata.str1}</span>
											</div>
										)}
										{currentStepData.metadata.str2 && (
											<div>
												String 2:{" "}
												<span className="font-mono font-bold">{currentStepData.metadata.str2}</span>
											</div>
										)}
										{currentStepData.metadata.i !== undefined && (
											<div>
												Row (i): <span className="font-mono">{currentStepData.metadata.i}</span>
											</div>
										)}
										{currentStepData.metadata.j !== undefined && (
											<div>
												Col (j): <span className="font-mono">{currentStepData.metadata.j}</span>
											</div>
										)}
										{currentStepData.metadata.char1 && (
											<div>
												Char1: <span className="font-mono">{currentStepData.metadata.char1}</span>
											</div>
										)}
										{currentStepData.metadata.char2 && (
											<div>
												Char2: <span className="font-mono">{currentStepData.metadata.char2}</span>
											</div>
										)}
										{currentStepData.metadata.lcs_length !== undefined && (
											<div>
												LCS Length:{" "}
												<span className="font-mono">{currentStepData.metadata.lcs_length}</span>
											</div>
										)}
										{currentStepData.metadata.lcs && (
											<div>
												LCS:{" "}
												<span className="font-mono font-bold">{currentStepData.metadata.lcs}</span>
											</div>
										)}
										{currentStepData.metadata.comparisons !== undefined && (
											<div>
												Comparisons:{" "}
												<span className="font-mono">{currentStepData.metadata.comparisons}</span>
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
								<span>Current Cell</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded" />
								<span>Match (chars equal)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-yellow-500 rounded" />
								<span>No Match (comparing)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-gray-600 rounded" />
								<span>Computed</span>
							</div>
						</div>

						{/* Playback Controls */}
						<div className="flex items-center justify-center gap-4">
							<button
								onClick={() => setCurrentStep(0)}
								disabled={currentStep === 0}
								className="px-4 py-2 border border-border rounded hover:bg-accent disabled:opacity-50"
							>
								First
							</button>
							<button
								onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
								disabled={currentStep === 0}
								className="px-4 py-2 border border-border rounded hover:bg-accent disabled:opacity-50"
							>
								Previous
							</button>
							<button
								onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
								disabled={currentStep === steps.length - 1}
								className="px-4 py-2 border border-border rounded hover:bg-accent disabled:opacity-50"
							>
								Next
							</button>
							<button
								onClick={() => setCurrentStep(steps.length - 1)}
								disabled={currentStep === steps.length - 1}
								className="px-4 py-2 border border-border rounded hover:bg-accent disabled:opacity-50"
							>
								Last
							</button>
						</div>
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
									O(m × n) where m, n = string lengths
									<br />
									(naive recursion is O(2^min(m,n)))
								</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">
									O(m × n) for DP table
									<br />
									(can be optimized to O(min(m,n)))
								</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>Create 2D DP table: dp[i][j] = LCS length of str1[0..i] and str2[0..j]</li>
							<li>Base case: dp[0][j] = dp[i][0] = 0 (empty string has no subsequence)</li>
							<li>For each position (i, j) in the table:</li>
							<li className="ml-6">
								If str1[i-1] == str2[j-1]: chars match, dp[i][j] = 1 + dp[i-1][j-1]
							</li>
							<li className="ml-6">
								Otherwise: take max of dp[i-1][j] (skip char from str1) or dp[i][j-1] (skip char
								from str2)
							</li>
							<li>Final answer is dp[m][n]</li>
							<li>Backtrack through table to reconstruct the actual LCS string</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>
								✅ Subsequence maintains relative order but need not be contiguous (unlike
								substring)
							</li>
							<li>✅ 2D DP - each axis represents one string</li>
							<li>
								✅ Recurrence relation captures optimal substructure: either chars match (extend
								LCS) or don't (take best from skipping either char)
							</li>
							<li>
								💡 DP table cell [i][j] represents best LCS achievable with prefixes of length i and
								j
							</li>
							<li>
								💡 Backtracking: when chars match, go diagonal; otherwise, go towards higher value
							</li>
							<li>
								💡 Can be space-optimized: only need current and previous row, reducing to O(n)
								space
							</li>
							<li>
								💡 Used in: diff tools (git diff), DNA sequence alignment, plagiarism detection,
								file comparison
							</li>
							<li>
								💡 Related problems: Longest Common Substring, Edit Distance (Levenshtein), Longest
								Increasing Subsequence
							</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Real-World Applications</h2>
						<ul className="text-sm space-y-2">
							<li>
								<strong>Version Control (git diff):</strong> Show minimal changes between file
								versions
							</li>
							<li>
								<strong>DNA Sequence Alignment:</strong> Find common genetic sequences for evolution
								studies
							</li>
							<li>
								<strong>Plagiarism Detection:</strong> Identify copied content by finding common
								subsequences
							</li>
							<li>
								<strong>File Synchronization:</strong> Efficiently sync files by identifying common
								blocks
							</li>
							<li>
								<strong>Spell Correction:</strong> Suggest corrections by finding words with longest
								common subsequence
							</li>
							<li>
								<strong>Protein Analysis:</strong> Compare amino acid sequences to study protein
								evolution
							</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">LCS vs LCS (Longest Common Substring)</h2>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<h3 className="font-medium mb-2 text-blue-400">LCS - Subsequence (This Page)</h3>
								<ul className="space-y-1">
									<li>• Characters can be non-contiguous</li>
									<li>• Maintains relative order</li>
									<li>• Example: "ABCDGH", "AEDFHR" → "ADH"</li>
									<li>• Recurrence considers skipping chars</li>
									<li>• Used in diff, DNA alignment</li>
								</ul>
							</div>
							<div>
								<h3 className="font-medium mb-2 text-purple-400">LCSS - Substring</h3>
								<ul className="space-y-1">
									<li>• Characters must be contiguous</li>
									<li>• Maintains relative order + adjacency</li>
									<li>• Example: "ABCDGH", "AEDFHR" → "" (no match)</li>
									<li>• Recurrence resets on mismatch</li>
									<li>• Used in pattern matching</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
