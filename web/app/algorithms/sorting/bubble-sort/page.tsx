"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import {
  ComplexityChart,
  EdgeCases,
  KeyInsights,
  RelatedLinks,
  Prerequisites,
  WhenToUse,
  InterviewTips,
} from "@/components/learning";
import registry from "@/lib/registry";
import { getRelatedAlgorithms, getPrerequisites } from "@/lib/relationships";

export default function BubbleSortPage() {
  const [steps, setSteps] = useState<any[]>([]);
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
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
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
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{algorithm.name}</h1>
                <span
                  className={`px-3 py-1 rounded text-sm ${
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
              <p className="text-muted-foreground">{algorithm.description}</p>
              {algorithm.tags && algorithm.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
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
            <div className="p-6 border border-border rounded-lg space-y-4">
              <div>
                <label htmlFor="input-array" className="block text-sm font-medium mb-2">
                  Input Array (comma-separated)
                </label>
                <input
                  id="input-array"
                  type="text"
                  value={inputArray}
                  onChange={(e) => setInputArray(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded"
                  placeholder="5, 2, 8, 1, 9"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={executeAlgorithm}
                  disabled={isLoading}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
                >
                  {isLoading ? "Running..." : "Run Algorithm"}
                </button>
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
            </div>

            {/* Visualization */}
            {steps.length > 0 && (
              <div className="space-y-4">
                {/* Split-pane layout: Code + Visualization */}
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

                  {/* Array Visualization */}
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
                      <div className="mt-4 flex justify-center gap-6 text-xs">
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
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(0)}
                    disabled={currentStep === 0}
                    className="px-4 py-2 border border-border rounded hover:bg-accent disabled:opacity-50"
                  >
                    First
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="px-4 py-2 border border-border rounded hover:bg-accent disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                    disabled={currentStep === steps.length - 1}
                    className="px-4 py-2 border border-border rounded hover:bg-accent disabled:opacity-50"
                  >
                    Next
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(steps.length - 1)}
                    disabled={currentStep === steps.length - 1}
                    className="px-4 py-2 border border-border rounded hover:bg-accent disabled:opacity-50"
                  >
                    Last
                  </button>
                </div>
              </div>
            )}

            {/* Learning Content */}
            <div className="space-y-6">
              {/* Complexity Chart */}
              <div className="p-6 border border-border rounded-lg">
                <ComplexityChart complexity={algorithm.complexity} algorithmName={algorithm.name} />
              </div>

              {/* How It Works */}
              {algorithm.howItWorks && (
                <div className="p-6 border border-border rounded-lg">
                  <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
                  <p className="text-sm leading-relaxed">{algorithm.howItWorks}</p>
                </div>
              )}

              {/* Key Insights */}
              {algorithm.keyInsights && algorithm.keyInsights.length > 0 && (
                <div className="p-6 border border-border rounded-lg">
                  <KeyInsights insights={algorithm.keyInsights} algorithmName={algorithm.name} />
                </div>
              )}

              {/* Edge Cases */}
              {algorithm.edgeCases && algorithm.edgeCases.length > 0 && (
                <div className="p-6 border border-border rounded-lg">
                  <EdgeCases edgeCases={algorithm.edgeCases} algorithmName={algorithm.name} />
                </div>
              )}

              {/* When to Use */}
              {algorithm.whenToUse && algorithm.whenToUse.length > 0 && (
                <div className="p-6 border border-border rounded-lg">
                  <WhenToUse useCases={algorithm.whenToUse} algorithmName={algorithm.name} />
                </div>
              )}

              {/* Interview Tips */}
              {algorithm.interviewTips && algorithm.interviewTips.length > 0 && (
                <div className="p-6 border border-border rounded-lg">
                  <InterviewTips tips={algorithm.interviewTips} algorithmName={algorithm.name} />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Prerequisites */}
            <div className="p-4 border border-border rounded-lg">
              <Prerequisites prerequisites={prerequisites} algorithmName={algorithm.name} />
            </div>

            {/* Related Algorithms */}
            <div className="p-4 border border-border rounded-lg">
              <RelatedLinks
                algorithms={relatedAlgorithms}
                title="Related Algorithms"
                emptyMessage="No related algorithms"
              />
            </div>

            {/* Quick Stats */}
            <div className="p-4 border border-border rounded-lg space-y-3">
              <h3 className="font-semibold">Quick Stats</h3>
              <div className="space-y-2 text-sm">
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
