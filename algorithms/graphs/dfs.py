"""Depth-First Search (DFS) - Depth-first graph traversal.

Time Complexity: O(V + E) where V = vertices, E = edges
Space Complexity: O(V) for recursion stack and visited set

Key Insights:
    - Explores graph depth-first using recursion or stack (LIFO)
    - Useful for: cycle detection, topological sort, maze solving, connectivity
    - May not find shortest path (explores one branch fully before backtracking)
    - Simpler implementation than BFS (recursive)
    - Better space complexity for wide graphs
"""

from typing import Generator, Dict, List, Set
from algorithms.base import StepTracker, Step, VisualizerType


class DFS(StepTracker):
    """Depth-First Search implementation with visualization."""

    visualizer_type = VisualizerType.GRAPH

    def __init__(self):
        super().__init__()
        self.nodes_visited = 0
        self.edges_explored = 0
        self.visited: Set[int] = set()
        self.path_stack: List[int] = []

    def search(self, graph: Dict[int, List[int]], start: int, target: int = None) -> Generator[Step, None, None]:
        """Perform DFS traversal on graph.

        Args:
            graph: Adjacency list representation {node: [neighbors]}
            start: Starting node
            target: Optional target node to find

        Yields:
            Step objects for visualization
        """
        self.reset()
        self.nodes_visited = 0
        self.edges_explored = 0
        self.visited = set()
        self.path_stack = []

        yield self.emit_step(
            operation="init",
            description=f"Starting DFS from node {start}",
            state={
                "type": "graph",
                "graph": graph,
                "current": None,
                "visited": [],
                "stack": [start],
            },
            highlights=[{"type": "node", "id": start, "color": "active"}],
            metadata={
                "nodes_visited": self.nodes_visited,
                "edges_explored": self.edges_explored,
                "start": start,
                "target": target,
            },
        )

        yield from self._dfs_recursive(graph, start, target)

        if target and target not in self.visited:
            yield self.emit_step(
                operation="not_found",
                description=f"Target {target} not reachable from {start}",
                state={
                    "type": "graph",
                    "graph": graph,
                    "current": None,
                    "visited": list(self.visited),
                    "stack": [],
                },
                highlights=[
                    *[{"type": "node", "id": n, "color": "visited"} for n in self.visited],
                ],
                metadata={
                    "nodes_visited": self.nodes_visited,
                    "edges_explored": self.edges_explored,
                    "found": False,
                },
            )
        elif not target:
            yield self.emit_step(
                operation="complete",
                description=f"DFS complete. Visited {self.nodes_visited} nodes, explored {self.edges_explored} edges",
                state={
                    "type": "graph",
                    "graph": graph,
                    "current": None,
                    "visited": list(self.visited),
                    "stack": [],
                },
                highlights=[
                    *[{"type": "node", "id": n, "color": "visited"} for n in self.visited],
                ],
                metadata={
                    "nodes_visited": self.nodes_visited,
                    "edges_explored": self.edges_explored,
                },
            )

    def _dfs_recursive(self, graph: Dict[int, List[int]], current: int, target: int = None) -> Generator[Step, None, None]:
        """Recursive DFS helper.

        Args:
            graph: Adjacency list
            current: Current node
            target: Optional target node

        Yields:
            Step objects for visualization
        """
        if current in self.visited:
            return

        self.visited.add(current)
        self.path_stack.append(current)
        self.nodes_visited += 1

        yield self.emit_step(
            operation="visit",
            description=f"Visiting node {current}",
            state={
                "type": "graph",
                "graph": graph,
                "current": current,
                "visited": list(self.visited),
                "stack": self.path_stack.copy(),
            },
            highlights=[
                {"type": "node", "id": current, "color": "visiting"},
                *[{"type": "node", "id": n, "color": "visited"} for n in self.visited if n != current],
                *[{"type": "node", "id": n, "color": "stacked"} for n in self.path_stack if n != current],
            ],
            metadata={
                "nodes_visited": self.nodes_visited,
                "edges_explored": self.edges_explored,
                "current": current,
                "depth": len(self.path_stack),
            },
        )

        if target and current == target:
            yield self.emit_step(
                operation="found",
                description=f"Found target {target}! Path length: {len(self.path_stack) - 1}",
                state={
                    "type": "graph",
                    "graph": graph,
                    "current": current,
                    "visited": list(self.visited),
                    "stack": self.path_stack.copy(),
                    "path": self.path_stack.copy(),
                },
                highlights=[
                    *[{"type": "node", "id": n, "color": "path"} for n in self.path_stack],
                    *[{"type": "edge", "from": self.path_stack[i], "to": self.path_stack[i+1], "color": "path"}
                      for i in range(len(self.path_stack) - 1)],
                ],
                metadata={
                    "nodes_visited": self.nodes_visited,
                    "edges_explored": self.edges_explored,
                    "path": self.path_stack.copy(),
                    "path_length": len(self.path_stack) - 1,
                },
            )
            return

        # Explore neighbors
        for neighbor in graph.get(current, []):
            self.edges_explored += 1

            if neighbor not in self.visited:
                yield self.emit_step(
                    operation="explore",
                    description=f"Exploring edge {current} → {neighbor}",
                    state={
                        "type": "graph",
                        "graph": graph,
                        "current": current,
                        "visited": list(self.visited),
                        "stack": self.path_stack.copy(),
                    },
                    highlights=[
                        {"type": "node", "id": current, "color": "visiting"},
                        {"type": "node", "id": neighbor, "color": "exploring"},
                        {"type": "edge", "from": current, "to": neighbor, "color": "exploring"},
                    ],
                    metadata={
                        "nodes_visited": self.nodes_visited,
                        "edges_explored": self.edges_explored,
                        "exploring_edge": f"{current}→{neighbor}",
                    },
                )

                # Recurse into neighbor
                yield from self._dfs_recursive(graph, neighbor, target)

                # If target was found in recursion, stop
                if target and target in self.visited and self.path_stack and self.path_stack[-1] == target:
                    return

        # Backtrack
        if self.path_stack and self.path_stack[-1] == current:
            self.path_stack.pop()

            if self.path_stack:  # Don't show backtrack from start node
                yield self.emit_step(
                    operation="backtrack",
                    description=f"Backtracking from node {current}",
                    state={
                        "type": "graph",
                        "graph": graph,
                        "current": self.path_stack[-1] if self.path_stack else None,
                        "visited": list(self.visited),
                        "stack": self.path_stack.copy(),
                    },
                    highlights=[
                        {"type": "node", "id": current, "color": "backtracked"},
                        *[{"type": "node", "id": n, "color": "stacked"} for n in self.path_stack],
                    ],
                    metadata={
                        "nodes_visited": self.nodes_visited,
                        "edges_explored": self.edges_explored,
                        "depth": len(self.path_stack),
                    },
                )
