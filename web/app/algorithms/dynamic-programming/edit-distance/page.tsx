"use client";

import { useEffect, useState } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { GridVisualizer } from "@/components/visualizers/GridVisualizer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { AlgorithmStep } from "@/lib/types";

export default function EditDistancePage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [word1, setWord1] = useState("horse");
	const [word2, setWord2] = useState("ros");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/edit_distance/source");
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
			const response = await fetch("/api/algorithms/edit_distance/execute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					input: { word1: word1, word2: word2 },
				}),
			});

			const data = await response.json();
			setSteps(data.steps);
			setCurrentStep(0);
		} catch (error) {
			console.error("Failed to execute algorithm:", error);
			alert("Failed to compute edit distance. Please check your input.");
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
					/ Edit Distance (Levenshtein)
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
							Edit Distance (Levenshtein)
						</h1>
						<p className="text-muted-foreground">
							Minimum insertions, deletions, and replacements to transform one string into another
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
							<span className="block text-sm font-medium mb-2">Word 1 (source)</span>
							<input
								type="text"
								value={word1}
								onChange={(e) => setWord1(e.target.value)}
								className="w-full px-4 py-2 bg-background border border-border rounded font-mono text-sm"
								placeholder="horse"
							/>
						</label>
						<label className="block">
							<span className="block text-sm font-medium mb-2">Word 2 (target)</span>
							<input
								type="text"
								value={word2}
								onChange={(e) => setWord2(e.target.value)}
								className="w-full px-4 py-2 bg-background border border-border rounded font-mono text-sm"
								placeholder="ros"
							/>
						</label>
					</div>
					<p className="text-xs text-muted-foreground">
						The grid fills dp[i][j] = edit distance between the first i chars of Word 1 and the
						first j chars of Word 2. The answer is the bottom-right cell.
					</p>
					<button
						type="button"
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Computing..." : "Compute Edit Distance"}
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
										{currentStepData.metadata.char1 !== undefined && (
											<div>
												Comparing:{" "}
												<span className="font-mono">
													'{currentStepData.metadata.char1 as string}' vs '
													{currentStepData.metadata.char2 as string}'
												</span>
											</div>
										)}
										{currentStepData.metadata.operation_won !== undefined && (
											<div>
												Operation:{" "}
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
										{currentStepData.metadata.edit_distance !== undefined && (
											<div>
												Edit Distance:{" "}
												<span className="font-mono font-bold">
													{currentStepData.metadata.edit_distance as number}
												</span>
											</div>
										)}
										{currentStepData.metadata.operations !== undefined && (
											<div>
												Comparisons:{" "}
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
								<span>Winning Source</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-purple-500 rounded" />
								<span>Candidate / Base Case</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded" />
								<span>Match / Final Answer</span>
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
									O(m × n) where m, n = string lengths
									<br />
									(naive recursion is O(3^max(m,n)))
								</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">
									O(m × n) for DP table
									<br />
									(can be optimized to O(min(m, n)))
								</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>Create 2D DP table: dp[i][j] = edit distance between word1[:i] and word2[:j]</li>
							<li>Base cases: dp[i][0] = i (delete i chars), dp[0][j] = j (insert j chars)</li>
							<li>For each pair of prefixes (i, j):</li>
							<li className="ml-6">
								If word1[i-1] == word2[j-1]: characters match, dp[i][j] = dp[i-1][j-1] (free
								diagonal)
							</li>
							<li className="ml-6">
								Otherwise: dp[i][j] = 1 + min(dp[i][j-1] insert, dp[i-1][j] delete, dp[i-1][j-1]
								replace)
							</li>
							<li>The answer is dp[m][n] — the bottom-right cell</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>
								✅ Classic 2D DP — overlapping subproblems + optimal substructure over prefixes
							</li>
							<li>
								✅ Each cell depends only on its left, top, and top-left neighbors (three sources)
							</li>
							<li>
								✅ A matching character is "free" — you inherit the diagonal with no added cost
							</li>
							<li>
								💡 The three non-match choices map to insert (left), delete (top), and replace
								(diagonal)
							</li>
							<li>
								💡 Only the previous row is needed, so space collapses to O(min(m, n)) with a
								rolling array
							</li>
							<li>
								💡 Backtracking from dp[m][n] reconstructs the actual sequence of edits (the diff)
							</li>
							<li>
								💡 Symmetric: edit distance from A→B equals B→A (insert and delete swap roles)
							</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use / Real-World Applications</h2>
						<ul className="text-sm space-y-2">
							<li>
								<strong>Spell Checkers:</strong> Suggest corrections by finding dictionary words
								with small edit distance
							</li>
							<li>
								<strong>DNA / Sequence Alignment:</strong> Measure similarity between genetic
								sequences in bioinformatics
							</li>
							<li>
								<strong>Diff Tools:</strong> Compute minimal changes between file versions (git,
								text diffs)
							</li>
							<li>
								<strong>Fuzzy Search & Autocomplete:</strong> Rank matches by closeness to a query
								string
							</li>
							<li>
								<strong>Plagiarism & Deduplication:</strong> Detect near-duplicate text via string
								similarity
							</li>
							<li>
								<strong>OCR / Speech Post-Processing:</strong> Correct recognition errors against a
								known vocabulary
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
