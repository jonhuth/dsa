"""Topological Sort (Kahn's Algorithm) - Linear ordering of a DAG.

Produces an ordering of the vertices of a Directed Acyclic Graph (DAG) such
that for every directed edge u -> v, u appears before v in the ordering.
Kahn's algorithm is the BFS-based approach: it repeatedly removes nodes with
no remaining incoming edges (in-degree 0).

Time Complexity: O(V + E) where V = vertices, E = edges
    Each node is enqueued/dequeued once (O(V)) and each edge is relaxed once
    when its source is removed (O(E)).
Space Complexity: O(V + E)
    O(V) for the in-degree map, the ready queue, and the output order, plus
    O(V + E) to hold the adjacency list.

Key Insights:
    - Only Directed ACYCLIC graphs have a topological ordering. Kahn's
      algorithm doubles as cycle detection: if it cannot place every node,
      the leftover nodes form (or depend on) a cycle.
    - "In-degree 0" means "nothing must come before me" - those nodes are the
      valid next choices. Removing one may free up its successors.
    - The ordering is not unique: whenever several nodes have in-degree 0, any
      of them may be chosen next. This implementation breaks ties by node id
      for deterministic, reproducible visualizations.
    - Compared to the DFS-based topological sort, Kahn's is iterative (no
      recursion depth limit) and surfaces cycles naturally.
"""

from collections import deque
from collections.abc import Generator
from typing import Any

from algorithms.base import Step, StepTracker, VisualizerType


class TopologicalSort(StepTracker):
    """Topological Sort via Kahn's algorithm with step-by-step visualization."""

    visualizer_type = VisualizerType.GRAPH

    def __init__(self):
        super().__init__()
        self.nodes_placed = 0
        self.edges_relaxed = 0

    @staticmethod
    def _normalize_graph(raw: Any) -> tuple[dict[int, list[int]], list[int]]:
        """Coerce a raw adjacency list into int keys/values.

        JSON object keys always arrive as strings, so keys and neighbor values
        are coerced to int. Nodes that only appear as neighbors (never as keys)
        are added with an empty adjacency list so they still participate.

        Args:
            raw: Adjacency list, typically {str|int: list[str|int]}.

        Returns:
            Tuple of (graph with int keys/values, sorted list of all node ids).
        """
        graph: dict[int, list[int]] = {}
        nodes: set[int] = set()

        if isinstance(raw, dict):
            items = raw.items()
        else:
            items = enumerate(raw or [])

        for key, neighbors in items:
            node = int(key)
            graph.setdefault(node, [])
            nodes.add(node)
            for neighbor in neighbors or []:
                nb = int(neighbor)
                graph[node].append(nb)
                nodes.add(nb)

        # Normalize nodes that only appear as neighbors.
        for node in nodes:
            graph.setdefault(node, [])

        return graph, sorted(nodes)

    def run(self, input_data: dict[str, Any]) -> Generator[Step, None, None]:
        """Run Kahn's topological sort and emit visualization steps.

        Args:
            input_data: Dict shaped as {"graph": {node: [neighbors]}} describing
                a DAG adjacency list. Node keys may be strings (from JSON).

        Yields:
            Step objects for visualization.
        """
        self.reset()
        self.nodes_placed = 0
        self.edges_relaxed = 0

        raw_graph = input_data.get("graph", {}) if isinstance(input_data, dict) else input_data
        graph, nodes = self._normalize_graph(raw_graph)

        # Compute in-degree for every node.
        in_degree: dict[int, int] = dict.fromkeys(nodes, 0)
        for node in nodes:
            for neighbor in graph[node]:
                in_degree[neighbor] += 1

        order: list[int] = []

        yield self.emit_step(
            operation="init",
            description=(
                "Computed in-degrees for all "
                f"{len(nodes)} nodes. Nodes with in-degree 0 are ready to place."
            ),
            state={
                "type": "graph",
                "graph": graph,
                "current": None,
                "order": [],
                "in_degree": dict(in_degree),
                "queue": [n for n in nodes if in_degree[n] == 0],
            },
            highlights=[
                {"type": "node", "id": n, "color": "exploring"} for n in nodes if in_degree[n] == 0
            ],
            metadata={
                "in_degree": dict(in_degree),
                "order": [],
                "nodes_placed": self.nodes_placed,
                "total_nodes": len(nodes),
                "edges_relaxed": self.edges_relaxed,
            },
        )

        # Seed the ready queue with all in-degree-0 nodes (sorted for determinism).
        queue: deque[int] = deque(sorted(n for n in nodes if in_degree[n] == 0))

        while queue:
            current = queue.popleft()
            order.append(current)
            self.nodes_placed += 1

            yield self.emit_step(
                operation="place",
                description=(
                    f"Node {current} has in-degree 0 - remove it and append to the "
                    f"order (position {len(order)})."
                ),
                state={
                    "type": "graph",
                    "graph": graph,
                    "current": current,
                    "order": order.copy(),
                    "in_degree": dict(in_degree),
                    "queue": list(queue),
                },
                highlights=[
                    {"type": "node", "id": current, "color": "active"},
                    *[{"type": "node", "id": n, "color": "visited"} for n in order if n != current],
                    *[{"type": "node", "id": n, "color": "exploring"} for n in queue],
                ],
                metadata={
                    "current": current,
                    "in_degree": dict(in_degree),
                    "order": order.copy(),
                    "nodes_placed": self.nodes_placed,
                    "total_nodes": len(nodes),
                    "edges_relaxed": self.edges_relaxed,
                    "position": len(order),
                },
            )

            # Decrement in-degree of each neighbor; enqueue any that reach 0.
            for neighbor in graph[current]:
                self.edges_relaxed += 1
                in_degree[neighbor] -= 1
                became_ready = in_degree[neighbor] == 0

                if became_ready:
                    queue.append(neighbor)

                yield self.emit_step(
                    operation="relax",
                    description=(
                        f"Edge {current} -> {neighbor}: decrement in-degree of "
                        f"{neighbor} to {in_degree[neighbor]}"
                        + (" (now ready to place)." if became_ready else ".")
                    ),
                    state={
                        "type": "graph",
                        "graph": graph,
                        "current": current,
                        "order": order.copy(),
                        "in_degree": dict(in_degree),
                        "queue": list(queue),
                    },
                    highlights=[
                        {"type": "node", "id": current, "color": "active"},
                        {"type": "node", "id": neighbor, "color": "exploring"},
                        {"type": "edge", "from": current, "to": neighbor, "color": "active"},
                        *[
                            {"type": "node", "id": n, "color": "visited"}
                            for n in order
                            if n != current
                        ],
                    ],
                    metadata={
                        "current": current,
                        "neighbor": neighbor,
                        "in_degree": dict(in_degree),
                        "order": order.copy(),
                        "nodes_placed": self.nodes_placed,
                        "total_nodes": len(nodes),
                        "edges_relaxed": self.edges_relaxed,
                        "became_ready": became_ready,
                    },
                )

        has_cycle = len(order) < len(nodes)

        if has_cycle:
            remaining = [n for n in nodes if n not in set(order)]
            yield self.emit_step(
                operation="cycle",
                description=(
                    f"Cycle detected! Only placed {len(order)} of {len(nodes)} nodes. "
                    f"Nodes {remaining} are stuck with non-zero in-degree - a DAG is required."
                ),
                state={
                    "type": "graph",
                    "graph": graph,
                    "current": None,
                    "order": order.copy(),
                    "in_degree": dict(in_degree),
                    "queue": [],
                },
                highlights=[
                    *[{"type": "node", "id": n, "color": "visited"} for n in order],
                    *[{"type": "node", "id": n, "color": "comparing"} for n in remaining],
                ],
                metadata={
                    "order": order.copy(),
                    "remaining": remaining,
                    "nodes_placed": self.nodes_placed,
                    "total_nodes": len(nodes),
                    "edges_relaxed": self.edges_relaxed,
                    "has_cycle": True,
                },
            )
            return

        yield self.emit_step(
            operation="complete",
            description=(
                "Topological sort complete. A valid ordering: " + " -> ".join(str(n) for n in order)
            ),
            state={
                "type": "graph",
                "graph": graph,
                "current": None,
                "order": order.copy(),
                "in_degree": dict(in_degree),
                "queue": [],
            },
            highlights=[{"type": "node", "id": n, "color": "found"} for n in order],
            metadata={
                "order": order.copy(),
                "nodes_placed": self.nodes_placed,
                "total_nodes": len(nodes),
                "edges_relaxed": self.edges_relaxed,
                "has_cycle": False,
            },
        )
