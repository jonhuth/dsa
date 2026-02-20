"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
	ComplexityChart,
	EdgeCases,
	InterviewTips,
	KeyInsights,
	Prerequisites,
	RelatedLinks,
	WhenToUse,
} from "@/components/learning";
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { PlaybackControls } from "@/components/visualizers/PlaybackControls";
import registry from "@/lib/registry";
import { getPrerequisites, getRelatedAlgorithms } from "@/lib/relationships";
import type { AlgorithmStep } from "@/lib/types";

export default function BubbleSortPage() {
	const [steps, setSteps] = useState<AlgorithmStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [inputArray, setInputArray] = useState("5, 2, 8, 1, 9");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	// Get algorithm metadata
	const algorithm = registry.algorithms.get("bubble_sort");
	const relatedAlgorithms = algorithm ? getRelatedAlgorithms("bubble_sort") : [];
	const prerequisites = algorithm ? getPrerequisites("bubble_sort") : [];

	// Fetch source code on mount
	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/bubble_sort/source");
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
			// Parse input
			const arr = inputArray.split(",").map((n) => Number.parseInt(n.trim(), 10));

			const response = await fetch("/api/algorithms/bubble_sort/execute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ input: arr }),
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

	if (!algorithm) {
		return <div>Algorithm not found</div>;
	}

	return (
		<div className="min-h-screen p-4 sm:p-6 lg:p-8">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
						{/* Breadcrumb */}
						<div className="text-sm text-muted-foreground">
							<Link href="/algorithms" className="hover:underline">
								Algorithms
							</Link>{" "}
							/{" "}
							<Link href="/algorithms/sorting" className="hover:underline">
								Sorting
							</Link>{" "}
							/ {algorithm.name}
						</div>

						{/* Header */}
						<div>
							<div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
								<h1 className="text-2xl sm:text-3xl lg:text-2xl sm:text-3xl lg:text-4xl font-bold">
									{algorithm.name}
								</h1>
								<span
									className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${
										algorithm.difficulty === "easy"
											? "bg-green-500/10 text-green-500"
											: algorithm.difficulty === "medium"
												? "bg-yellow-500/10 text-yellow-500"
												: "bg-red-500/10 text-red-500"
									}`}
								>
									{algorithm.difficulty.charAt(0).toUpperCase() + algorithm.difficulty.slice(1)}
								</span>
							</div>
							<p className="text-sm sm:text-base text-muted-foreground">{algorithm.description}</p>
							{algorithm.tags && algorithm.tags.length > 0 && (
								<div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
									{algorithm.tags.map((tag) => (
										<span
											key={tag}
											className="text-xs px-2 py-1 bg-background border border-border rounded"
										>
											{tag}
										</span>
									))}
								</div>
							)}
						</div>

						{/* Input Controls */}
						<div className="p-4 sm:p-6 border border-border rounded-lg space-y-3 sm:space-y-4">
							<label className="block">
								<span className="block text-sm font-medium mb-2">
									Input Array (comma-separated)
								</span>
								<input
									type="text"
									value={inputArray}
									onChange={(e) => setInputArray(e.target.value)}
									className="w-full px-3 sm:px-4 py-2 bg-background border border-border rounded text-sm sm:text-base"
									placeholder="5, 2, 8, 1, 9"
								/>
							</label>
							<div className="flex flex-wrap gap-2">
								<button
									type="button"
									onClick={executeAlgorithm}
									disabled={isLoading}
									className="px-4 sm:px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 text-sm sm:text-base touch-manipulation"
								>
									{isLoading ? "Running..." : "Run Algorithm"}
								</button>
								{steps.length > 0 && (
									<button
										type="button"
										onClick={() => setShowCode(!showCode)}
										className="px-3 sm:px-4 py-2 border border-border rounded hover:bg-accent text-sm touch-manipulation"
									>
										{showCode ? "Hide Code" : "Show Code"}
									</button>
								)}
							</div>
						</div>

						{/* Visualization */}
						{steps.length > 0 && (
							<div className="space-y-3 sm:space-y-4">
								{/* Split-pane layout: Code + Visualization */}
								<div
									className={`grid ${showCode ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-3 sm:gap-4`}
								>
									{/* Code Viewer - hidden on mobile by default when showing */}
									{showCode && sourceCode && (
										<div className="border border-border rounded-lg overflow-hidden order-2 md:order-1">
											<div className="bg-card p-2 sm:p-3 border-b border-border">
												<h3 className="font-semibold text-xs sm:text-sm">
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

									{/* Array Visualization */}
									<div className="p-4 sm:p-6 border border-border rounded-lg order-1 md:order-2">
										<ArrayVisualizer
											values={currentStepData?.state?.values || []}
											highlights={currentStepData?.highlights || []}
										/>

										{/* Step Description */}
										<div className="mt-3 sm:mt-4 text-center">
											<p className="text-xs sm:text-sm font-medium">
												{currentStepData?.description}
											</p>
											<p className="text-xs text-muted-foreground mt-1">
												Step {currentStep + 1} of {steps.length}
											</p>
										</div>

										{/* Metadata */}
										{currentStepData?.metadata && (
											<div className="mt-3 sm:mt-4 flex justify-center gap-4 sm:gap-6 text-xs">
												{currentStepData.metadata.comparisons !== undefined && (
													<div>
														Comparisons:{" "}
														<span className="font-mono">
															{currentStepData.metadata.comparisons}
														</span>
													</div>
												)}
												{currentStepData.metadata.swaps !== undefined && (
													<div>
														Swaps:{" "}
														<span className="font-mono">{currentStepData.metadata.swaps}</span>
													</div>
												)}
											</div>
										)}
									</div>
								</div>

								{/* Color Legend */}
								<div className="flex items-center justify-center gap-6 text-xs">
									<div className="flex items-center gap-2">
										<div className="w-4 h-4 bg-yellow-500 rounded" />
										<span>Comparing</span>
									</div>
									<div className="flex items-center gap-2">
										<div className="w-4 h-4 bg-green-500 rounded" />
										<span>Swapped</span>
									</div>
									<div className="flex items-center gap-2">
										<div className="w-4 h-4 bg-purple-500 rounded" />
										<span>Sorted</span>
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

						{/* Learning Content */}
						<div className="space-y-4 sm:space-y-6">
							{/* Complexity Chart */}
							<div className="p-4 sm:p-6 border border-border rounded-lg">
								<ComplexityChart complexity={algorithm.complexity} />
							</div>

							{/* How It Works */}
							{algorithm.howItWorks && (
								<div className="p-4 sm:p-6 border border-border rounded-lg">
									<h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">How It Works</h2>
									<p className="text-sm leading-relaxed">{algorithm.howItWorks}</p>
								</div>
							)}

							{/* Key Insights */}
							{algorithm.keyInsights && algorithm.keyInsights.length > 0 && (
								<div className="p-4 sm:p-6 border border-border rounded-lg">
									<KeyInsights insights={algorithm.keyInsights} />
								</div>
							)}

							{/* Edge Cases */}
							{algorithm.edgeCases && algorithm.edgeCases.length > 0 && (
								<div className="p-4 sm:p-6 border border-border rounded-lg">
									<EdgeCases edgeCases={algorithm.edgeCases} />
								</div>
							)}

							{/* When to Use */}
							{algorithm.whenToUse && algorithm.whenToUse.length > 0 && (
								<div className="p-4 sm:p-6 border border-border rounded-lg">
									<WhenToUse useCases={algorithm.whenToUse} />
								</div>
							)}

							{/* Interview Tips */}
							{algorithm.interviewTips && algorithm.interviewTips.length > 0 && (
								<div className="p-4 sm:p-6 border border-border rounded-lg">
									<InterviewTips tips={algorithm.interviewTips} />
								</div>
							)}
						</div>
					</div>

					{/* Sidebar */}
					<div className="space-y-4 sm:space-y-6">
						{/* Prerequisites */}
						<div className="p-3 sm:p-4 border border-border rounded-lg">
							<Prerequisites prerequisites={prerequisites} />
						</div>

						{/* Related Algorithms */}
						<div className="p-3 sm:p-4 border border-border rounded-lg">
							<RelatedLinks
								algorithms={relatedAlgorithms}
								title="Related Algorithms"
								emptyMessage="No related algorithms"
							/>
						</div>

						{/* Quick Stats */}
						<div className="p-3 sm:p-4 border border-border rounded-lg space-y-2 sm:space-y-3">
							<h3 className="font-semibold text-sm sm:text-base">Quick Stats</h3>
							<div className="space-y-2 text-xs sm:text-sm">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Category:</span>
									<span className="font-medium capitalize">{algorithm.category}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Difficulty:</span>
									<span
										className={`font-medium capitalize ${
											algorithm.difficulty === "easy"
												? "text-green-500"
												: algorithm.difficulty === "medium"
													? "text-yellow-500"
													: "text-red-500"
										}`}
									>
										{algorithm.difficulty}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Avg Time:</span>
									<span className="font-mono text-xs">{algorithm.complexity.time.average}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Space:</span>
									<span className="font-mono text-xs">{algorithm.complexity.space}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
