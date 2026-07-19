"use client";

import { useEffect, useState } from "react";
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import type { AlgorithmStep } from "@/lib/types";

export default function WordBreakPage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [stringInput, setStringInput] = useState("leetcode");
	const [wordsInput, setWordsInput] = useState("leet, code");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/word_break/source");
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
			const s = stringInput.trim();
			const words = wordsInput
				.split(",")
				.map((w) => w.trim())
				.filter((w) => w.length > 0);

			const response = await fetch("/api/algorithms/word_break/execute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ input: { s, words } }),
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
					/ Word Break
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Word Break</h1>
						<p className="text-muted-foreground">
							Decide whether a string can be segmented into a sequence of dictionary words
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
						<span className="block text-sm font-medium mb-2">String</span>
						<input
							type="text"
							value={stringInput}
							onChange={(e) => setStringInput(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded font-mono"
							placeholder="leetcode"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							The string to segment into dictionary words.
						</p>
					</label>
					<label className="block">
						<span className="block text-sm font-medium mb-2">
							Dictionary (comma-separated words)
						</span>
						<input
							type="text"
							value={wordsInput}
							onChange={(e) => setWordsInput(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded font-mono"
							placeholder="leet, code"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Enter dictionary words separated by commas.
						</p>
					</label>
					<button
						type="button"
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Running..." : "Check Word Break"}
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
										{currentStepData.metadata.substring !== undefined && (
											<div>
												substring:{" "}
												<span className="font-mono">
													"{currentStepData.metadata.substring as string}"
												</span>
											</div>
										)}
										{currentStepData.metadata.in_dictionary !== undefined &&
											currentStepData.metadata.in_dictionary !== null && (
												<div>
													in dictionary:{" "}
													<span className="font-mono">
														{currentStepData.metadata.in_dictionary ? "yes" : "no"}
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
										{currentStepData.metadata.result !== undefined && (
											<div>
												result:{" "}
												<span className="font-mono">
													{currentStepData.metadata.result ? "True" : "False"}
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
								<span>Current end (i)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-yellow-500 rounded" />
								<span>Split point being checked (j)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded" />
								<span>Matched / segmentable prefix</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-purple-500 rounded" />
								<span>ok[i] = 1 (prefix segmentable)</span>
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
									O(n² · k) - for each of n end positions we try every split point and compare a
									substring (length up to k) against the dictionary set
								</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">O(n + W) - the ok[] table of size n+1 plus the word set</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>Define ok[i] = true if the prefix s[:i] can be split into dictionary words</li>
							<li>Base case: ok[0] = true (the empty prefix needs no words)</li>
							<li>For each end position i from 1 to n:</li>
							<li className="ml-6">Try every split point j &lt; i where ok[j] is already true</li>
							<li className="ml-6">
								If the substring s[j:i] is in the dictionary, set ok[i] = true and stop
							</li>
							<li>The answer is ok[n] - whether the whole string is segmentable</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>✅ ok[i] means "the prefix of length i is segmentable" - optimal substructure</li>
							<li>
								✅ Only split points j with ok[j] = true can extend a segmentation, so unreachable
								prefixes are skipped
							</li>
							<li>
								✅ Storing the dictionary in a set makes each substring check an O(k) hash lookup
							</li>
							<li>
								💡 As soon as one valid split works for ok[i], you can stop - a single witness is
								enough
							</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">When to Use / Real-World</h2>
						<ul className="text-sm space-y-2">
							<li>🈶 Tokenizing text with no spaces (e.g. some East Asian scripts, hashtags)</li>
							<li>🔤 Spell-check and autocomplete that must split concatenated input</li>
							<li>
								🧩 A gateway problem for string DP (Word Break II enumerates all segmentations)
							</li>
							<li>🧠 A classic interview question testing 1D DP and set-based lookups</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
