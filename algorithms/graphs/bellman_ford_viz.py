"""Bellman-Ford - Single-source shortest paths with negative edges.

Time Complexity:
    Best: O(V * E) - always relaxes every edge across passes
    Average: O(V * E)
    Worst: O(V * E)

Space Complexity: O(V) - distance and predecessor tables

Key Insights:
    - Finds shortest paths from a source even when edges are negative
    - Relaxes ALL edges V-1 times; after V-1 passes every shortest path
      (which uses at most V-1 edges) has settled
    - One extra pass detects negative-weight cycles: any edge that can
      still be relaxed proves a cycle of net-negative weight is reachable
    - Slower than Dijkstra's O((V+E) log V) but handles negative weights
    - Used in: routing protocols (RIP), arbitrage detection, systems with
      negative costs where Dijkstra's greedy assumption breaks
"""

from collections.abc import Generator
from typing import Any

from algorithms.base import Step, StepTracker, VisualizerType


class BellmanFord(StepTracker):
    """Bellman-Ford single-source shortest path with visualization."""

    visualizer_type = VisualizerType.GRAPH

    def __init__(self):
        super().__init__()
        self.distances: dict[int, float] = {}
        self.previous: dict[int, int | None] = {}

    def run(self, input_data: dict[str, Any]) -> Generator[Step, None, None]:
        """Run Bellman-Ford, emitting a visualization step per relaxation.

        Args:
            input_data: {"graph": {node: [[neighbor, weight], ...]}, "start": int}
                        JSON object keys arrive as strings and are coerced to int.
                        The graph is directed and weighted; edges MAY be negative.

        Yields:
            Step objects for visualization.
        """
        self.reset()

        raw_graph = input_data.get("graph", {})
        start = int(input_data.get("start", 0))

        # Coerce string JSON keys / neighbours to ints and normalise edge lists.
        graph: dict[int, list[tuple[int, int]]] = {}
        for node, neighbors in raw_graph.items():
            node_int = int(node)
            graph.setdefault(node_int, [])
            for neighbor, weight in neighbors:
                graph[node_int].append((int(neighbor), weight))

        # Ensure every referenced node exists as a key (destinations with no
        # outgoing edges may only appear as neighbours).
        for neighbors in list(graph.values()):
            for neighbor, _ in neighbors:
                graph.setdefault(neighbor, [])
        graph.setdefault(start, [])

        # Flat edge list drives the relaxation loop.
        edges: list[tuple[int, int, int]] = [(u, v, w) for u in graph for (v, w) in graph[u]]

        self.distances = {node: float("inf") for node in graph}
        self.distances[start] = 0
        self.previous = dict.fromkeys(graph)
        relaxations = 0

        yield self.emit_step(
            operation="init",
            description=(
                f"Initialize distances: source {start} = 0, all others = ∞. "
                f"Will relax {len(edges)} edges up to {len(graph) - 1} times."
            ),
            state={"type": "graph", "graph": graph},
            highlights=[{"type": "node", "id": start, "color": "active"}],
            metadata={
                "start": start,
                "distances": self._dist_snapshot(),
                "iteration": 0,
                "relaxations": relaxations,
                "edge_count": len(edges),
                "vertex_count": len(graph),
            },
        )

        # Relax all edges V-1 times.
        num_vertices = len(graph)
        for iteration in range(1, num_vertices):
            updated_this_pass = False

            for u, v, w in edges:
                du = self.distances[u]
                dv = self.distances[v]
                candidate = du + w if du != float("inf") else float("inf")
                improved = candidate < dv

                yield self.emit_step(
                    operation="relax",
                    description=(
                        f"Pass {iteration}: relax edge {u} → {v} (weight {w}). "
                        + (
                            f"Improve dist[{v}]: {self._fmt(dv)} → {self._fmt(candidate)}"
                            if improved
                            else f"No improvement (dist[{v}] = {self._fmt(dv)})"
                        )
                    ),
                    state={"type": "graph", "graph": graph},
                    highlights=[
                        {"type": "node", "id": u, "color": "active"},
                        {"type": "node", "id": v, "color": "comparing"},
                        {"type": "edge", "id": f"{u}-{v}", "color": "active"},
                    ],
                    metadata={
                        "iteration": iteration,
                        "edge": [u, v, w],
                        "from": u,
                        "to": v,
                        "weight": w,
                        "candidate": None if candidate == float("inf") else candidate,
                        "old_distance": None if dv == float("inf") else dv,
                        "improved": improved,
                        "relaxations": relaxations,
                        "distances": self._dist_snapshot(),
                    },
                )

                if improved:
                    self.distances[v] = candidate
                    self.previous[v] = u
                    relaxations += 1
                    updated_this_pass = True

                    yield self.emit_step(
                        operation="update",
                        description=(f"Updated dist[{v}] = {self._fmt(candidate)} via {u} → {v}"),
                        state={"type": "graph", "graph": graph},
                        highlights=[
                            {"type": "node", "id": v, "color": "found"},
                            {"type": "edge", "id": f"{u}-{v}", "color": "path"},
                        ],
                        metadata={
                            "iteration": iteration,
                            "node": v,
                            "new_distance": candidate,
                            "relaxations": relaxations,
                            "distances": self._dist_snapshot(),
                        },
                    )

            # Early exit: a full pass with no updates means we've converged.
            if not updated_this_pass:
                yield self.emit_step(
                    operation="converged",
                    description=(
                        f"Pass {iteration} made no updates — distances have converged early."
                    ),
                    state={"type": "graph", "graph": graph},
                    highlights=[],
                    metadata={
                        "iteration": iteration,
                        "relaxations": relaxations,
                        "distances": self._dist_snapshot(),
                    },
                )
                break

        # One more pass: any relaxable edge reveals a negative-weight cycle.
        for u, v, w in edges:
            du = self.distances[u]
            if du != float("inf") and du + w < self.distances[v]:
                yield self.emit_step(
                    operation="negative_cycle",
                    description=(
                        f"Negative-weight cycle detected! Edge {u} → {v} "
                        f"(weight {w}) still relaxes after {num_vertices - 1} "
                        f"passes — no shortest path is well-defined."
                    ),
                    state={"type": "graph", "graph": graph},
                    highlights=[
                        {"type": "node", "id": u, "color": "comparing"},
                        {"type": "node", "id": v, "color": "comparing"},
                        {"type": "edge", "id": f"{u}-{v}", "color": "active"},
                    ],
                    metadata={
                        "negative_cycle": True,
                        "edge": [u, v, w],
                        "relaxations": relaxations,
                        "distances": self._dist_snapshot(),
                    },
                )
                return

        # Complete: report finalized shortest distances.
        reachable = {node: dist for node, dist in self.distances.items() if dist != float("inf")}
        yield self.emit_step(
            operation="complete",
            description=(
                f"Complete — shortest distances from {start} computed for "
                f"{len(reachable)} reachable node(s). No negative cycle found."
            ),
            state={"type": "graph", "graph": graph},
            highlights=[{"type": "node", "id": node, "color": "found"} for node in reachable],
            metadata={
                "negative_cycle": False,
                "start": start,
                "distances": reachable,
                "relaxations": relaxations,
                "reachable_count": len(reachable),
            },
        )

    def _dist_snapshot(self) -> dict[int, Any]:
        """Distances with unreachable (∞) rendered as None for JSON safety."""
        return {
            node: (None if dist == float("inf") else dist) for node, dist in self.distances.items()
        }

    @staticmethod
    def _fmt(value: float) -> str:
        """Human-readable distance ('∞' for unreachable)."""
        return "∞" if value == float("inf") else str(value)
