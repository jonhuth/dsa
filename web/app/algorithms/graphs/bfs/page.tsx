"use client";

import { useState, useEffect } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { GraphVisualizer } from "@/components/visualizers/GraphVisualizer";

export default function BFSPage() {
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [graphInput, setGraphInput] = useState(
    JSON.stringify({ 0: [1, 2], 1: [3, 4], 2: [5], 3: [], 4: [], 5: [] }, null, 2)
  );
  const [startNode, setStartNode] = useState("0");
  const [targetNode, setTargetNode] = useState("5");
  const [sourceCode, setSourceCode] = useState<string>("");
  const [showCode, setShowCode] = useState(true);

  useEffect(() => {
    const fetchSource = async () => {
      try {
        const response = await fetch("/api/algorithms/bfs/source");
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
      const graph = JSON.parse(graphInput);
      const start = parseInt(startNode);
      const target = targetNode ? parseInt(targetNode) : null;

      const response = await fetch("/api/algorithms/bfs/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: { graph, start, target },
        }),
      });

      const data = await response.json();
      setSteps(data.steps);
      setCurrentStep(0);
    } catch (error) {
      console.error("Failed to execute algorithm:", error);
      alert("Invalid graph format. Please check your input.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentStepData = steps[currentStep];
  const currentLine = currentStepData?.metadata?.source_line;

  // Extract nodes and edges from graph
  const getNodesAndEdges = () => {
    try {
      const graph = JSON.parse(graphInput);
      const nodes = Object.keys(graph).map((id) => ({ id: parseInt(id) }));
      const edges: Array<{ from: number; to: number }> = [];

      for (const [from, neighbors] of Object.entries(graph)) {
        for (const to of neighbors as number[]) {
          edges.push({ from: parseInt(from), to });
        }
      }

      return { nodes, edges };
    } catch {
      return { nodes: [], edges: [] };
    }
  };

  const { nodes, edges } = getNodesAndEdges();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground">
          <a href="/algorithms" className="hover:underline">
            Algorithms
          </a>{" "}
          /{" "}
          <a href="/algorithms/graphs" className="hover:underline">
            Graphs
          </a>{" "}
          / Breadth-First Search
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Breadth-First Search (BFS)</h1>
            <p className="text-muted-foreground">
              Level-order graph traversal that explores nodes layer by layer
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
            <label className="block text-sm font-medium mb-2">Graph (JSON adjacency list)</label>
            <textarea
              value={graphInput}
              onChange={(e) => setGraphInput(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded font-mono text-sm"
              rows={8}
              placeholder='{"0": [1, 2], "1": [3], "2": [4], "3": [], "4": []}'
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Node</label>
              <input
                type="text"
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Target Node (optional)</label>
              <input
                type="text"
                value={targetNode}
                onChange={(e) => setTargetNode(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded"
                placeholder="5"
              />
            </div>
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

              {/* Graph Visualization */}
              <div className="p-6 border border-border rounded-lg">
                <div className="flex justify-center">
                  <GraphVisualizer
                    nodes={nodes}
                    edges={edges}
                    highlights={currentStepData?.highlights || []}
                  />
                </div>

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
                    {currentStepData.metadata.queue_size !== undefined && (
                      <div>
                        Queue Size:{" "}
                        <span className="font-mono">{currentStepData.metadata.queue_size}</span>
                      </div>
                    )}
                    {currentStepData.metadata.visited_count !== undefined && (
                      <div>
                        Visited:{" "}
                        <span className="font-mono">{currentStepData.metadata.visited_count}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Color Legend */}
            <div className="flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full" />
                <span>Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                <span>In Queue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full" />
                <span>Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full" />
                <span>Target Found</span>
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
                <p className="text-sm">O(V + E) - visits all vertices and edges</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Space Complexity</h3>
                <p className="text-sm">O(V) - for queue and visited set</p>
              </div>
            </div>
          </div>

          <div className="p-6 border border-border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <ol className="text-sm space-y-2 list-decimal list-inside">
              <li>Start at the source node and mark it as visited</li>
              <li>Add the source node to a queue</li>
              <li>While the queue is not empty, dequeue a node</li>
              <li>Visit all unvisited neighbors and add them to the queue</li>
              <li>Repeat until the target is found or the queue is empty</li>
            </ol>
          </div>

          <div className="p-6 border border-border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
            <ul className="text-sm space-y-2">
              <li>✅ Finds shortest path in unweighted graphs</li>
              <li>✅ Level-order traversal - explores by distance from source</li>
              <li>✅ Complete - will find target if it exists</li>
              <li>💡 Uses a queue (FIFO) for frontier management</li>
              <li>💡 Parent tracking enables path reconstruction</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
