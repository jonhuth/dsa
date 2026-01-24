"""Breadth-First Search (BFS) - Level-order graph traversal.

Time Complexity: O(V + E) where V = vertices, E = edges
Space Complexity: O(V) for queue and visited set

Key Insights:
    - Explores graph level by level using a queue (FIFO)
    - Finds shortest path in unweighted graphs
    - Complete: finds solution if one exists
    - Used in: shortest path, web crawlers, social networks, GPS navigation
    - Guaranteed to find shortest path (minimum edges)
"""

from collections import deque
from typing import Generator, Dict, List, Set
from algorithms.base import StepTracker, Step, VisualizerType


class BFS(StepTracker):
    """Breadth-First Search implementation with visualization."""

    visualizer_type = VisualizerType.GRAPH

    def __init__(self):
        super().__init__()
        self.nodes_visited = 0
        self.edges_explored = 0

    def search(self, graph: Dict[int, List[int]], start: int, target: int = None) -> Generator[Step, None, None]:
        """Perform BFS traversal on graph.

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

        yield self.emit_step(
            operation="init",
            description=f"Starting BFS from node {start}",
            state={
                "type": "graph",
                "graph": graph,
                "current": None,
                "visited": [],
                "queue": [start],
            },
            highlights=[{"type": "node", "id": start, "color": "active"}],
            metadata={
                "nodes_visited": self.nodes_visited,
                "edges_explored": self.edges_explored,
                "start": start,
                "target": target,
            },
        )

        visited: Set[int] = set()
        queue = deque([start])
        parent: Dict[int, int] = {start: None}

        while queue:
            current = queue.popleft()

            if current in visited:
                continue

            visited.add(current)
            self.nodes_visited += 1

            yield self.emit_step(
                operation="visit",
                description=f"Visiting node {current}",
                state={
                    "type": "graph",
                    "graph": graph,
                    "current": current,
                    "visited": list(visited),
                    "queue": list(queue),
                },
                highlights=[
                    {"type": "node", "id": current, "color": "visiting"},
                    *[{"type": "node", "id": n, "color": "visited"} for n in visited if n != current],
                    *[{"type": "node", "id": n, "color": "queued"} for n in queue],
                ],
                metadata={
                    "nodes_visited": self.nodes_visited,
                    "edges_explored": self.edges_explored,
                    "current": current,
                },
            )

            if target and current == target:
                path = self._reconstruct_path(parent, start, target)

                yield self.emit_step(
                    operation="found",
                    description=f"Found target {target}! Path length: {len(path) - 1}",
                    state={
                        "type": "graph",
                        "graph": graph,
                        "current": current,
                        "visited": list(visited),
                        "queue": list(queue),
                        "path": path,
                    },
                    highlights=[
                        *[{"type": "node", "id": n, "color": "path"} for n in path],
                        *[{"type": "edge", "from": path[i], "to": path[i+1], "color": "path"}
                          for i in range(len(path) - 1)],
                    ],
                    metadata={
                        "nodes_visited": self.nodes_visited,
                        "edges_explored": self.edges_explored,
                        "path": path,
                        "path_length": len(path) - 1,
                    },
                )
                return

            # Explore neighbors
            for neighbor in graph.get(current, []):
                self.edges_explored += 1

                if neighbor not in visited:
                    yield self.emit_step(
                        operation="explore",
                        description=f"Exploring edge {current} → {neighbor}",
                        state={
                            "type": "graph",
                            "graph": graph,
                            "current": current,
                            "visited": list(visited),
                            "queue": list(queue),
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

                    if neighbor not in parent:
                        parent[neighbor] = current
                        queue.append(neighbor)

                        yield self.emit_step(
                            operation="enqueue",
                            description=f"Added node {neighbor} to queue",
                            state={
                                "type": "graph",
                                "graph": graph,
                                "current": current,
                                "visited": list(visited),
                                "queue": list(queue),
                            },
                            highlights=[
                                {"type": "node", "id": neighbor, "color": "queued"},
                                *[{"type": "node", "id": n, "color": "queued"} for n in queue if n != neighbor],
                            ],
                            metadata={
                                "nodes_visited": self.nodes_visited,
                                "edges_explored": self.edges_explored,
                            },
                        )

        if target:
            yield self.emit_step(
                operation="not_found",
                description=f"Target {target} not reachable from {start}",
                state={
                    "type": "graph",
                    "graph": graph,
                    "current": None,
                    "visited": list(visited),
                    "queue": [],
                },
                highlights=[
                    *[{"type": "node", "id": n, "color": "visited"} for n in visited],
                ],
                metadata={
                    "nodes_visited": self.nodes_visited,
                    "edges_explored": self.edges_explored,
                    "found": False,
                },
            )
        else:
            yield self.emit_step(
                operation="complete",
                description=f"BFS complete. Visited {self.nodes_visited} nodes, explored {self.edges_explored} edges",
                state={
                    "type": "graph",
                    "graph": graph,
                    "current": None,
                    "visited": list(visited),
                    "queue": [],
                },
                highlights=[
                    *[{"type": "node", "id": n, "color": "visited"} for n in visited],
                ],
                metadata={
                    "nodes_visited": self.nodes_visited,
                    "edges_explored": self.edges_explored,
                },
            )

    def _reconstruct_path(self, parent: Dict[int, int], start: int, target: int) -> List[int]:
        """Reconstruct path from start to target using parent pointers."""
        path = []
        current = target
        while current is not None:
            path.append(current)
            current = parent.get(current)
        path.reverse()
        return path
