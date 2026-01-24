"use client";

import { useState, useEffect } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";

export default function QuickSortPage() {
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [inputArray, setInputArray] = useState("5, 2, 8, 1, 9");
  const [sourceCode, setSourceCode] = useState<string>("");
  const [showCode, setShowCode] = useState(true);

  // Fetch source code on mount
  useEffect(() => {
    const fetchSource = async () => {
      try {
        const response = await fetch("/api/algorithms/quick_sort/source");
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
      const arr = inputArray.split(",").map((n) => parseInt(n.trim()));

      const response = await fetch("/api/algorithms/quick_sort/execute", {
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

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground">
          <a href="/algorithms" className="hover:underline">
            Algorithms
          </a>{" "}
          /{" "}
          <a href="/algorithms/sorting" className="hover:underline">
            Sorting
          </a>{" "}
          / Quick Sort
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Quick Sort</h1>
            <p className="text-muted-foreground">
              Efficient divide-and-conquer sorting algorithm with O(n log n) average-case
              performance
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
            <label className="block text-sm font-medium mb-2">Input Array (comma-separated)</label>
            <input
              type="text"
              value={inputArray}
              onChange={(e) => setInputArray(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded"
              placeholder="5, 2, 8, 1, 9"
            />
          </div>
          <button
            onClick={executeAlgorithm}
            disabled={isLoading}
            className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? "Running..." : "Run Algorithm"}
          </button>
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
                        <span className="font-mono">{currentStepData.metadata.comparisons}</span>
                      </div>
                    )}
                    {currentStepData.metadata.swaps !== undefined && (
                      <div>
                        Swaps: <span className="font-mono">{currentStepData.metadata.swaps}</span>
                      </div>
                    )}
                    {currentStepData.metadata.partitions !== undefined && (
                      <div>
                        Partitions:{" "}
                        <span className="font-mono">{currentStepData.metadata.partitions}</span>
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
                <span>Sorted/Pivot Placed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded" />
                <span>Pivot</span>
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
                <ul className="text-sm space-y-1">
                  <li>Best: O(n log n) - balanced partitions</li>
                  <li>Average: O(n log n)</li>
                  <li>Worst: O(n²) - already sorted with poor pivot selection</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Space Complexity</h3>
                <p className="text-sm">O(log n) - recursion stack for balanced partitions</p>
                <p className="text-sm">O(n) - worst case recursion depth</p>
              </div>
            </div>
          </div>

          <div className="p-6 border border-border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <ol className="text-sm space-y-2 list-decimal list-inside">
              <li>Select a pivot element (typically the last element)</li>
              <li>
                Partition the array: elements ≤ pivot go to the left, elements &gt; pivot go to the
                right
              </li>
              <li>Place the pivot in its final sorted position</li>
              <li>Recursively apply quick sort to the left and right subarrays</li>
              <li>Base case: subarrays of size ≤ 1 are already sorted</li>
            </ol>
          </div>

          <div className="p-6 border border-border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
            <ul className="text-sm space-y-2">
              <li>⚡ Divide-and-conquer: breaks problem into smaller subproblems</li>
              <li>✅ In-place: sorts with minimal extra space (only recursion stack)</li>
              <li>⚡ Cache-friendly: good locality of reference</li>
              <li>❌ Not stable: relative order of equal elements may change</li>
              <li>
                ⚠️ Worst case O(n²): occurs with poor pivot selection (always smallest/largest)
              </li>
              <li>
                💡 Optimizations: median-of-three pivot, hybrid with insertion sort for small
                subarrays
              </li>
              <li>🚀 Often fastest in practice despite O(n²) worst case</li>
            </ul>
          </div>

          <div className="p-6 border border-border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">When to Use</h2>
            <ul className="text-sm space-y-2">
              <li>✅ General-purpose sorting when average-case performance matters</li>
              <li>✅ When in-place sorting is required (limited memory)</li>
              <li>✅ When cache efficiency is important</li>
              <li>❌ When worst-case O(n log n) guarantee is needed (use Merge Sort)</li>
              <li>❌ When stability is required (use Merge Sort or Stable Sort)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
