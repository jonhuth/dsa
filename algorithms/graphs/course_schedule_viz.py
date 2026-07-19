"""Course Schedule (Cycle Detection) - Can every course be finished?

Given a set of courses and their prerequisites as a directed graph
(edge u -> v means "u must be taken before v", i.e. u is a prerequisite of v),
determine whether it is possible to finish every course. It is possible if and
only if the prerequisite graph is a Directed Acyclic Graph (DAG): a cycle means
a group of courses each (transitively) depend on one another, so none can ever
be taken first.

This implementation uses DFS with three-color marking to detect a cycle:

    WHITE (unvisited)  - not yet explored
    GRAY  (in progress) - on the current DFS recursion stack
    BLACK (done)        - fully explored, all descendants finished

A **back edge** - an edge to a GRAY node that is still on the recursion stack -
proves a cycle exists, so the schedule cannot be finished. If DFS completes with
no back edge, reversing the order in which nodes turned BLACK (post-order) yields
a valid course order (a topological sort).

Time Complexity: O(V + E) where V = courses, E = prerequisite edges
    Each node is colored GRAY/BLACK once and each edge is examined once.
Space Complexity: O(V + E)
    O(V) for the color map and recursion stack (path), plus O(V + E) for the
    adjacency list.

Key Insights:
    - "Can finish all courses" is exactly "the prerequisite graph is acyclic."
      Cycle detection and schedulability are the same question.
    - A back edge (edge to a node still on the recursion stack / GRAY) is the
      signature of a cycle. An edge to a BLACK node is fine - that subtree is
      already known to be cycle-free.
    - The GRAY set is precisely the current recursion path, so when a back edge
      is found the cycle is the slice of that path from the target node onward.
    - No cycle => reversing post-order gives a valid schedule for free, so this
      is the DFS-based topological sort in disguise.
"""

from collections.abc import Generator
from typing import Any

from algorithms.base import Step, StepTracker, VisualizerType

WHITE, GRAY, BLACK = 0, 1, 2


class CourseSchedule(StepTracker):
    """Course Schedule cycle detection via DFS coloring with visualization."""

    visualizer_type = VisualizerType.GRAPH

    def __init__(self):
        super().__init__()
        self.nodes_processed = 0
        self.edges_examined = 0

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

    @staticmethod
    def _color_name(color: int) -> str:
        return {WHITE: "unvisited", GRAY: "in-progress", BLACK: "done"}[color]

    def run(self, input_data: dict[str, Any]) -> Generator[Step, None, None]:
        """Detect a cycle in the prerequisite graph and emit visualization steps.

        Args:
            input_data: Dict shaped as {"graph": {node: [neighbors]}} describing
                a directed prerequisite graph. Node keys may be strings (JSON).

        Yields:
            Step objects for visualization.
        """
        self.reset()
        self.nodes_processed = 0
        self.edges_examined = 0

        raw_graph = input_data.get("graph", {}) if isinstance(input_data, dict) else input_data
        graph, nodes = self._normalize_graph(raw_graph)

        color: dict[int, int] = dict.fromkeys(nodes, WHITE)
        path: list[int] = []  # current DFS recursion stack (the GRAY nodes)
        post_order: list[int] = []  # nodes in the order they turned BLACK
        cycle: list[int] = []  # populated when a back edge is found

        yield self.emit_step(
            operation="init",
            description=(
                f"Start cycle detection over {len(nodes)} courses. "
                "Every node begins WHITE (unvisited); DFS will color nodes GRAY "
                "while on the current path and BLACK when fully explored."
            ),
            state={
                "type": "graph",
                "graph": graph,
                "current": None,
                "path": [],
                "order": [],
                "colors": {n: self._color_name(color[n]) for n in nodes},
            },
            highlights=[{"type": "node", "id": n, "color": "default"} for n in nodes],
            metadata={
                "nodes_processed": self.nodes_processed,
                "total_nodes": len(nodes),
                "edges_examined": self.edges_examined,
                "can_finish": None,
            },
        )

        def base_highlights(current: int | None) -> list[dict[str, Any]]:
            """Node highlights reflecting the current three-color state."""
            hl: list[dict[str, Any]] = []
            for n in nodes:
                if n == current:
                    hl.append({"type": "node", "id": n, "color": "active"})
                elif color[n] == GRAY:
                    hl.append({"type": "node", "id": n, "color": "comparing"})
                elif color[n] == BLACK:
                    hl.append({"type": "node", "id": n, "color": "visited"})
                else:
                    hl.append({"type": "node", "id": n, "color": "default"})
            return hl

        def dfs(node: int) -> Generator[Step, None, bool]:
            """DFS from ``node``. Returns True if a cycle is found."""
            color[node] = GRAY
            path.append(node)

            yield self.emit_step(
                operation="visit",
                description=(
                    f"Enter course {node}: mark it GRAY (in-progress) and push it "
                    f"onto the current path {path}."
                ),
                state={
                    "type": "graph",
                    "graph": graph,
                    "current": node,
                    "path": path.copy(),
                    "order": post_order.copy(),
                    "colors": {n: self._color_name(color[n]) for n in nodes},
                },
                highlights=base_highlights(node),
                metadata={
                    "current": node,
                    "path": path.copy(),
                    "nodes_processed": self.nodes_processed,
                    "total_nodes": len(nodes),
                    "edges_examined": self.edges_examined,
                    "can_finish": None,
                },
            )

            for neighbor in graph[node]:
                self.edges_examined += 1

                if color[neighbor] == GRAY:
                    # Back edge to a node still on the stack -> cycle.
                    idx = path.index(neighbor)
                    cycle.extend(path[idx:])
                    yield self.emit_step(
                        operation="cycle",
                        description=(
                            f"Edge {node} -> {neighbor} points to a GRAY node still on "
                            f"the path - a back edge! Cycle found: "
                            f"{' -> '.join(str(c) for c in [*cycle, cycle[0]])}. "
                            "The schedule cannot be finished."
                        ),
                        state={
                            "type": "graph",
                            "graph": graph,
                            "current": node,
                            "path": path.copy(),
                            "order": post_order.copy(),
                            "colors": {n: self._color_name(color[n]) for n in nodes},
                        },
                        highlights=[
                            *[{"type": "node", "id": n, "color": "default"} for n in nodes],
                            *[{"type": "node", "id": c, "color": "comparing"} for c in cycle],
                            {"type": "edge", "from": node, "to": neighbor, "color": "active"},
                        ],
                        metadata={
                            "current": node,
                            "neighbor": neighbor,
                            "cycle": cycle.copy(),
                            "path": path.copy(),
                            "nodes_processed": self.nodes_processed,
                            "total_nodes": len(nodes),
                            "edges_examined": self.edges_examined,
                            "can_finish": False,
                        },
                    )
                    return True

                if color[neighbor] == BLACK:
                    yield self.emit_step(
                        operation="skip",
                        description=(
                            f"Edge {node} -> {neighbor}: {neighbor} is already BLACK "
                            "(fully explored, cycle-free) - nothing to do."
                        ),
                        state={
                            "type": "graph",
                            "graph": graph,
                            "current": node,
                            "path": path.copy(),
                            "order": post_order.copy(),
                            "colors": {n: self._color_name(color[n]) for n in nodes},
                        },
                        highlights=[
                            *base_highlights(node),
                            {"type": "edge", "from": node, "to": neighbor, "color": "visited"},
                        ],
                        metadata={
                            "current": node,
                            "neighbor": neighbor,
                            "path": path.copy(),
                            "nodes_processed": self.nodes_processed,
                            "total_nodes": len(nodes),
                            "edges_examined": self.edges_examined,
                            "can_finish": None,
                        },
                    )
                    continue

                # WHITE neighbor: recurse into it.
                yield self.emit_step(
                    operation="explore",
                    description=(
                        f"Edge {node} -> {neighbor}: {neighbor} is WHITE (unvisited) - "
                        "recurse into it."
                    ),
                    state={
                        "type": "graph",
                        "graph": graph,
                        "current": node,
                        "path": path.copy(),
                        "order": post_order.copy(),
                        "colors": {n: self._color_name(color[n]) for n in nodes},
                    },
                    highlights=[
                        *base_highlights(node),
                        {"type": "node", "id": neighbor, "color": "active"},
                        {"type": "edge", "from": node, "to": neighbor, "color": "active"},
                    ],
                    metadata={
                        "current": node,
                        "neighbor": neighbor,
                        "path": path.copy(),
                        "nodes_processed": self.nodes_processed,
                        "total_nodes": len(nodes),
                        "edges_examined": self.edges_examined,
                        "can_finish": None,
                    },
                )

                found = yield from dfs(neighbor)
                if found:
                    return True

            # All neighbors explored without a cycle: finish this node.
            color[node] = BLACK
            path.pop()
            post_order.append(node)
            self.nodes_processed += 1

            yield self.emit_step(
                operation="finish",
                description=(
                    f"Course {node} is fully explored with no cycle below it: mark it "
                    f"BLACK (done) and record it. Post-order so far: {post_order}."
                ),
                state={
                    "type": "graph",
                    "graph": graph,
                    "current": node,
                    "path": path.copy(),
                    "order": post_order.copy(),
                    "colors": {n: self._color_name(color[n]) for n in nodes},
                },
                highlights=base_highlights(None),
                metadata={
                    "current": node,
                    "path": path.copy(),
                    "nodes_processed": self.nodes_processed,
                    "total_nodes": len(nodes),
                    "edges_examined": self.edges_examined,
                    "can_finish": None,
                },
            )
            return False

        # Launch DFS from every unvisited node (sorted for deterministic output).
        cycle_found = False
        for start in nodes:
            if color[start] == WHITE:
                cycle_found = yield from dfs(start)
                if cycle_found:
                    break

        if cycle_found:
            yield self.emit_step(
                operation="complete",
                description=(
                    "Cannot finish all courses: the prerequisite graph contains a "
                    f"cycle {' -> '.join(str(c) for c in [*cycle, cycle[0]])}. Those "
                    "courses mutually depend on each other, so none can be taken first."
                ),
                state={
                    "type": "graph",
                    "graph": graph,
                    "current": None,
                    "path": [],
                    "order": post_order.copy(),
                    "colors": {n: self._color_name(color[n]) for n in nodes},
                },
                highlights=[
                    *[{"type": "node", "id": n, "color": "default"} for n in nodes],
                    *[{"type": "node", "id": c, "color": "comparing"} for c in cycle],
                ],
                metadata={
                    "cycle": cycle.copy(),
                    "nodes_processed": self.nodes_processed,
                    "total_nodes": len(nodes),
                    "edges_examined": self.edges_examined,
                    "can_finish": False,
                },
            )
            return

        # No cycle: a valid course order is the reverse of the post-order.
        order = post_order[::-1]
        yield self.emit_step(
            operation="complete",
            description=(
                "Can finish all courses! No cycle exists, so the prerequisite graph "
                "is a DAG. A valid course order (reverse post-order): "
                + " -> ".join(str(n) for n in order)
            ),
            state={
                "type": "graph",
                "graph": graph,
                "current": None,
                "path": [],
                "order": order,
                "colors": {n: self._color_name(color[n]) for n in nodes},
            },
            highlights=[{"type": "node", "id": n, "color": "found"} for n in order],
            metadata={
                "order": order,
                "nodes_processed": self.nodes_processed,
                "total_nodes": len(nodes),
                "edges_examined": self.edges_examined,
                "can_finish": True,
            },
        )
