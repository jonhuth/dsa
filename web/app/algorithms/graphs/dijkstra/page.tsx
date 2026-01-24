"use client";

import { useState, useEffect } from "react";
import { CodeViewer } from "@/components/visualizers/CodeViewer";
import { GraphVisualizer } from "@/components/visualizers/GraphVisualizer";

export default function DijkstraPage() {
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [graphInput, setGraphInput] = useState(
    JSON.stringify(
      {
        0: [
          [1, 4],
          [2, 1],
        ],
        1: [[3, 1]],
        2: [
          [1, 2],
          [3, 5],
        ],
        3: [],
      },
      null,
      2
    )
  );
  const [startNode, setStartNode] = useState("0");
  const [targetNode, setTargetNode] = useState("3");
  const [sourceCode, setSourceCode] = useState<string>("");
  const [showCode, setShowCode] = useState(true);

  useEffect(() => {
    const fetchSource = async () => {
      try {
        const response = await fetch("/api/algorithms/dijkstra/source");
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

      const response = await fetch("/api/algorithms/dijkstra/execute", {
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

  // Extract nodes and edges from weighted graph
  const getNodesAndEdges = () => {
    try {
      const graph = JSON.parse(graphInput);
      const nodes = Object.keys(graph).map((id) => ({ id: parseInt(id) }));
      const edges: Array<{ from: number; to: number }> = [];

      for (const [from, neighbors] of Object.entries(graph)) {
        for (const [to, weight] of neighbors as Array<[number, number]>) {
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
          / Dijkstra's Algorithm
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dijkstra's Algorithm</h1>
            <p className="text-muted-foreground">
              Shortest path algorithm for weighted graphs with non-negative edges
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
            <label className="block text-sm font-medium mb-2">
              Weighted Graph (JSON adjacency list)
            </label>
            <textarea
              value={graphInput}
              onChange={(e) => setGraphInput(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded font-mono text-sm"
              rows={10}
              placeholder='{"0": [[1, 4], [2, 1]], "1": [[3, 1]], "2": [[1, 2], [3, 5]], "3": []}'
            />
            <p className="text-xs text-muted-foreground mt-1">
              Format: {`{node: [[neighbor, weight], ...], ...}`}
            </p>
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
                placeholder="3"
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
                  <div className="mt-4 flex justify-center gap-6 text-xs flex-wrap">
                    {currentStepData.metadata.current !== undefined && (
                      <div>
                        Current:{" "}
                        <span className="font-mono">{currentStepData.metadata.current}</span>
                      </div>
                    )}
                    {currentStepData.metadata.current_distance !== undefined && (
                      <div>
                        Distance:{" "}
                        <span className="font-mono">
                          {currentStepData.metadata.current_distance}
                        </span>
                      </div>
                    )}
                    {currentStepData.metadata.queue_size !== undefined && (
                      <div>
                        Queue:{" "}
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
                <span>Comparing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full" />
                <span>Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full" />
                <span>Shortest Path</span>
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
                  O((V + E) log V) with min-heap
                  <br />V = vertices, E = edges
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Space Complexity</h3>
                <p className="text-sm">O(V) for distances and priority queue</p>
              </div>
            </div>
          </div>

          <div className="p-6 border border-border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <ol className="text-sm space-y-2 list-decimal list-inside">
              <li>Initialize all distances to infinity except source (0)</li>
              <li>Add source to priority queue with distance 0</li>
              <li>While queue not empty: extract node with minimum distance</li>
              <li>For each unvisited neighbor: calculate new distance</li>
              <li>If new distance is shorter, update and add to queue</li>
              <li>Repeat until target found or queue empty</li>
            </ol>
          </div>

          <div className="p-6 border border-border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
            <ul className="text-sm space-y-2">
              <li>✅ Finds optimal shortest path (if one exists)</li>
              <li>✅ Works with weighted graphs (non-negative weights only)</li>
              <li>✅ Greedy algorithm - always picks minimum distance node</li>
              <li>💡 Uses priority queue for efficiency (min-heap)</li>
              <li>💡 Edge relaxation: try to improve distances by exploring edges</li>
              <li>💡 Once a node is visited, its shortest path is guaranteed</li>
              <li>
                💡 Used in: GPS navigation, network routing, game pathfinding, flight planning
              </li>
              <li>❌ Doesn't work with negative edge weights (use Bellman-Ford instead)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
