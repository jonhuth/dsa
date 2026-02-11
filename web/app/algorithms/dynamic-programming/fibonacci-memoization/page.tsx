"use client";

import { useState, useEffect } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";

export default function FibonacciMemoizationPage() {
	const [steps, setSteps] = useState<any[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [n, setN] = useState("10");
	const [sourceCode, setSourceCode] = useState<string>("");
	const [showCode, setShowCode] = useState(true);

	useEffect(() => {
		const fetchSource = async () => {
			try {
				const response = await fetch("/api/algorithms/fibonacci_memo/source");
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
			const nValue = parseInt(n);

			const response = await fetch("/api/algorithms/fibonacci_memo/execute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ input: { n: nValue } }),
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
					/ Fibonacci (Memoization)
				</div>

				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-4xl font-bold mb-2">Fibonacci - Memoization</h1>
						<p className="text-muted-foreground">
							Top-down dynamic programming with caching to avoid redundant computations
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
						<label className="block text-sm font-medium mb-2">Compute Fibonacci(n) where n =</label>
						<input
							type="number"
							value={n}
							onChange={(e) => setN(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded"
							placeholder="10"
							min="0"
							max="20"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Range: 0-20 (larger values create too many visualization steps)
						</p>
					</div>
					<button
						onClick={executeAlgorithm}
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
					>
						{isLoading ? "Computing..." : "Compute Fibonacci"}
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

							{/* Memoization Table Visualization */}
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
										{currentStepData.metadata.n !== undefined && (
											<div>
												Computing:{" "}
												<span className="font-mono">F({currentStepData.metadata.n})</span>
											</div>
										)}
										{currentStepData.metadata.result !== undefined && (
											<div>
												Result: <span className="font-mono">{currentStepData.metadata.result}</span>
											</div>
										)}
										{currentStepData.metadata.cache_hits !== undefined && (
											<div>
												Cache Hits:{" "}
												<span className="font-mono">{currentStepData.metadata.cache_hits}</span>
											</div>
										)}
										{currentStepData.metadata.recursive_calls !== undefined && (
											<div>
												Recursive Calls:{" "}
												<span className="font-mono">
													{currentStepData.metadata.recursive_calls}
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
								<span>Current Call</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded" />
								<span>Cached (Memoized)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-yellow-500 rounded" />
								<span>Computing</span>
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
									O(n) - each subproblem computed once
									<br />
									(naive recursion is O(2^n))
								</p>
							</div>
							<div>
								<h3 className="font-medium mb-2">Space Complexity</h3>
								<p className="text-sm">
									O(n) - memo table + call stack
									<br />
									(recursion depth is O(n))
								</p>
							</div>
						</div>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="text-sm space-y-2 list-decimal list-inside">
							<li>Start with empty memoization cache (dictionary/map)</li>
							<li>To compute F(n), first check if it's in the cache</li>
							<li>If cached: return the stored value (cache hit)</li>
							<li>If not cached: recursively compute F(n-1) + F(n-2)</li>
							<li>Store the result in cache before returning</li>
							<li>Each subproblem is solved at most once</li>
						</ol>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
						<ul className="text-sm space-y-2">
							<li>✅ Top-down approach - starts from problem, breaks down to subproblems</li>
							<li>✅ Recursive - maintains natural problem structure</li>
							<li>✅ Cache prevents redundant work - exponential speedup over naive recursion</li>
							<li>💡 Trade-off: uses call stack space (O(n)) in addition to memo table (O(n))</li>
							<li>💡 Cache hit rate increases as more values are computed</li>
							<li>
								💡 Compare with tabulation: memoization computes only needed subproblems, tabulation
								computes all
							</li>
							<li>💡 Also known as "lazy evaluation" - compute only what's needed</li>
						</ul>
					</div>

					<div className="p-6 border border-border rounded-lg">
						<h2 className="text-2xl font-semibold mb-4">Memoization vs Tabulation</h2>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<h3 className="font-medium mb-2 text-blue-400">Memoization (This Page)</h3>
								<ul className="space-y-1">
									<li>• Top-down (recursive)</li>
									<li>• Computes only needed values</li>
									<li>• Uses call stack (O(n))</li>
									<li>• Natural recursive structure</li>
									<li>• Easy to convert from recursion</li>
								</ul>
							</div>
							<div>
								<h3 className="font-medium mb-2 text-purple-400">Tabulation</h3>
								<ul className="space-y-1">
									<li>• Bottom-up (iterative)</li>
									<li>• Computes all subproblems</li>
									<li>• No recursion overhead</li>
									<li>• Requires dependency order</li>
									<li>• Often more space-efficient</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
