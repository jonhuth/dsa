"""Dijkstra's Algorithm - Shortest path in weighted graphs.

Time Complexity: O((V + E) log V) with min-heap
Space Complexity: O(V) for distances and priority queue

Key Insights:
    - Finds shortest path from source to all other nodes
    - Works only with non-negative edge weights
    - Greedy algorithm - always picks minimum distance node
    - Uses priority queue for efficiency
    - Used in: GPS navigation, network routing, game pathfinding
"""

from typing import Generator, Dict, List, Tuple, Set
import heapq
from algorithms.base import StepTracker, Step, VisualizerType


class Dijkstra(StepTracker):
    """Dijkstra's shortest path algorithm with visualization."""

    visualizer_type = VisualizerType.GRAPH

    def __init__(self):
        super().__init__()
        self.distances: Dict[int, float] = {}
        self.previous: Dict[int, int | None] = {}
        self.visited: Set[int] = set()

    def shortest_path(
        self,
        graph: Dict[int, List[Tuple[int, int]]],
        start: int,
        target: int | None = None,
    ) -> Generator[Step, None, None]:
        """Find shortest path using Dijkstra's algorithm.

        Args:
            graph: Adjacency list with weights {node: [(neighbor, weight), ...]}
            start: Starting node
            target: Optional target node (if None, finds paths to all nodes)

        Yields:
            Step objects for visualization
        """
        self.reset()
        self.distances = {node: float("inf") for node in graph}
        self.distances[start] = 0
        self.previous = {node: None for node in graph}
        self.visited = set()

        # Priority queue: (distance, node)
        pq = [(0, start)]

        yield self.emit_step(
            operation="init",
            description=f"Starting Dijkstra from node {start}",
            state={"type": "graph", "graph": graph},
            highlights=[{"type": "node", "id": start, "color": "active"}],
            metadata={
                "start": start,
                "target": target,
                "distances": dict(self.distances),
                "queue_size": len(pq),
            },
        )

        while pq:
            current_dist, current = heapq.heappop(pq)

            # Skip if already visited
            if current in self.visited:
                continue

            self.visited.add(current)

            yield self.emit_step(
                operation="visit",
                description=f"Visiting node {current} (distance: {current_dist})",
                state={"type": "graph", "graph": graph},
                highlights=[
                    {"type": "node", "id": current, "color": "active"},
                    *[{"type": "node", "id": v, "color": "visited"} for v in self.visited if v != current],
                ],
                metadata={
                    "current": current,
                    "current_distance": current_dist,
                    "distances": dict(self.distances),
                    "queue_size": len(pq),
                    "visited_count": len(self.visited),
                },
            )

            # If target found, we can stop (shortest path guaranteed)
            if target is not None and current == target:
                path = self._reconstruct_path(start, target)
                yield self.emit_step(
                    operation="found",
                    description=f"Shortest path to {target}: {' → '.join(map(str, path))} (distance: {self.distances[target]})",
                    state={"type": "graph", "graph": graph},
                    highlights=[
                        *[{"type": "node", "id": node, "color": "path"} for node in path],
                        *[
                            {"type": "edge", "id": f"{path[i]}-{path[i+1]}", "color": "path"}
                            for i in range(len(path) - 1)
                        ],
                    ],
                    metadata={
                        "target": target,
                        "distance": self.distances[target],
                        "path": path,
                        "path_length": len(path),
                    },
                )
                return

            # Check all neighbors
            for neighbor, weight in graph.get(current, []):
                if neighbor in self.visited:
                    continue

                new_dist = current_dist + weight
                old_dist = self.distances[neighbor]

                yield self.emit_step(
                    operation="consider",
                    description=f"Consider edge {current} → {neighbor} (weight: {weight})",
                    state={"type": "graph", "graph": graph},
                    highlights=[
                        {"type": "node", "id": current, "color": "active"},
                        {"type": "node", "id": neighbor, "color": "comparing"},
                        {"type": "edge", "id": f"{current}-{neighbor}", "color": "active"},
                    ],
                    metadata={
                        "current": current,
                        "neighbor": neighbor,
                        "weight": weight,
                        "new_distance": new_dist,
                        "old_distance": old_dist if old_dist != float("inf") else None,
                    },
                )

                if new_dist < self.distances[neighbor]:
                    self.distances[neighbor] = new_dist
                    self.previous[neighbor] = current
                    heapq.heappush(pq, (new_dist, neighbor))

                    yield self.emit_step(
                        operation="relax",
                        description=f"Updated distance to {neighbor}: {old_dist} → {new_dist}",
                        state={"type": "graph", "graph": graph},
                        highlights=[
                            {"type": "node", "id": neighbor, "color": "active"},
                            {"type": "edge", "id": f"{current}-{neighbor}", "color": "active"},
                        ],
                        metadata={
                            "neighbor": neighbor,
                            "new_distance": new_dist,
                            "old_distance": old_dist if old_dist != float("inf") else None,
                            "distances": dict(self.distances),
                        },
                    )

        # If target specified but not found
        if target is not None:
            yield self.emit_step(
                operation="not_found",
                description=f"No path to {target}",
                state={"type": "graph", "graph": graph},
                highlights=[
                    *[{"type": "node", "id": v, "color": "visited"} for v in self.visited],
                ],
                metadata={
                    "target": target,
                    "found": False,
                    "visited_count": len(self.visited),
                },
            )
        else:
            # Show all shortest paths
            yield self.emit_step(
                operation="complete",
                description=f"Computed shortest paths from {start} to all reachable nodes",
                state={"type": "graph", "graph": graph},
                highlights=[
                    *[{"type": "node", "id": v, "color": "visited"} for v in self.visited],
                ],
                metadata={
                    "start": start,
                    "distances": {k: v for k, v in self.distances.items() if v != float("inf")},
                    "visited_count": len(self.visited),
                },
            )

    def _reconstruct_path(self, start: int, target: int) -> List[int]:
        """Reconstruct shortest path from start to target."""
        path = []
        current = target
        while current is not None:
            path.append(current)
            current = self.previous[current]
        path.reverse()
        return path
