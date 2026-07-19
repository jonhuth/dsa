"""Connected Components (DFS) - Count and label the connected pieces of a graph.

Given an UNDIRECTED graph, a *connected component* is a maximal set of nodes
that are all reachable from one another. This algorithm walks every node; each
time it meets a node that no earlier walk has visited, it has found a brand-new
component, and a depth-first search floods outward from that node to color the
entire component with a distinct label before moving on.

Time Complexity: O(V + E) where V = vertices, E = edges
    Every node is pushed/popped from the DFS stack exactly once (O(V)) and every
    edge is examined once from each endpoint (O(E)). The outer scan over all
    nodes is also O(V).
Space Complexity: O(V + E)
    O(V) for the visited set, component labels, and the DFS stack in the worst
    case (a single path-shaped component), plus O(V + E) to hold the adjacency
    list. Recursion is avoided here in favor of an explicit stack, so there is
    no call-depth limit.

Key Insights:
    - The outer loop is what makes this "count components": DFS/BFS alone
      explores ONE component, but restarting the search from every still-
      unvisited node guarantees you reach and count every disconnected piece.
    - Each node belongs to exactly one component, so the total work is linear -
      the visited set ensures no node is explored twice even though the outer
      loop touches all V nodes.
    - The graph must be treated as UNDIRECTED: an edge u-v lets you travel both
      ways, so the adjacency list is made symmetric before searching. (In a
      DIRECTED graph the analogous notion is *strongly* connected components,
      which needs a different algorithm such as Tarjan's or Kosaraju's.)
    - Isolated nodes (no edges) are perfectly valid components of size 1 - they
      are found by the outer scan even though their DFS explores nothing.
"""

from collections.abc import Generator
from typing import Any

from algorithms.base import Step, StepTracker, VisualizerType


class ConnectedComponents(StepTracker):
    """Count connected components of an undirected graph via DFS, with steps."""

    visualizer_type = VisualizerType.GRAPH

    # Distinct highlight colors cycled per component so adjacent components in
    # the visualization are easy to tell apart. Falls back by wrapping around.
    _COMPONENT_COLORS = ["found", "visited", "comparing", "path"]

    def __init__(self):
        super().__init__()
        self.nodes_visited = 0
        self.edges_explored = 0

    def _component_color(self, component_id: int) -> str:
        """Return a stable highlight color for a given component index."""
        return self._COMPONENT_COLORS[component_id % len(self._COMPONENT_COLORS)]

    @staticmethod
    def _normalize_graph(raw: Any) -> tuple[dict[int, list[int]], list[int]]:
        """Coerce a raw adjacency list into an UNDIRECTED graph with int keys.

        JSON object keys always arrive as strings, so keys and neighbor values
        are coerced to int. The adjacency list is made symmetric (edge u-v adds
        both u->v and v->u) because connected components are defined on
        undirected graphs. Nodes that appear only as neighbors, and isolated
        nodes given with an empty list, are all preserved so every vertex
        participates.

        Args:
            raw: Adjacency list, typically {str|int: list[str|int]}.

        Returns:
            Tuple of (symmetric graph with int keys/values, sorted node ids).
        """
        graph: dict[int, set[int]] = {}
        nodes: set[int] = set()

        if isinstance(raw, dict):
            items = raw.items()
        else:
            items = enumerate(raw or [])

        for key, neighbors in items:
            node = int(key)
            graph.setdefault(node, set())
            nodes.add(node)
            for neighbor in neighbors or []:
                nb = int(neighbor)
                nodes.add(nb)
                graph.setdefault(node, set())
                graph.setdefault(nb, set())
                # Symmetric: an undirected edge is traversable both ways.
                graph[node].add(nb)
                graph[nb].add(node)

        # Ensure isolated / neighbor-only nodes have an entry.
        for node in nodes:
            graph.setdefault(node, set())

        # Convert to sorted lists for deterministic, reproducible visualization.
        sorted_graph = {node: sorted(graph[node]) for node in graph}
        return sorted_graph, sorted(nodes)

    def run(self, input_data: dict[str, Any]) -> Generator[Step, None, None]:
        """Run DFS connected-components labeling and emit visualization steps.

        Args:
            input_data: Dict shaped as {"graph": {node: [neighbors]}} describing
                an UNDIRECTED graph adjacency list. Node keys may be strings
                (from JSON) and are coerced to int; the graph is symmetrized.

        Yields:
            Step objects for visualization.
        """
        self.reset()
        self.nodes_visited = 0
        self.edges_explored = 0

        raw_graph = input_data.get("graph", {}) if isinstance(input_data, dict) else input_data
        graph, nodes = self._normalize_graph(raw_graph)

        # component_id[node] -> which component a node belongs to (or None).
        component_id: dict[int, int | None] = dict.fromkeys(nodes, None)
        visited: set[int] = set()
        component_count = 0

        def node_highlights(active: int | None) -> list[dict[str, Any]]:
            """Color every labeled node by its component; active node in blue."""
            hl: list[dict[str, Any]] = []
            for n in nodes:
                cid = component_id[n]
                if n == active:
                    hl.append({"type": "node", "id": n, "color": "active"})
                elif cid is not None:
                    hl.append({"type": "node", "id": n, "color": self._component_color(cid)})
            return hl

        yield self.emit_step(
            operation="init",
            description=(
                f"Scanning {len(nodes)} nodes to find connected components. Each unvisited "
                "node we hit starts a new component; DFS then floods its whole component."
            ),
            state={
                "type": "graph",
                "graph": graph,
                "current": None,
                "component_count": 0,
                "component_id": dict(component_id),
            },
            highlights=[],
            metadata={
                "component_count": 0,
                "component_id": dict(component_id),
                "nodes_visited": self.nodes_visited,
                "total_nodes": len(nodes),
                "edges_explored": self.edges_explored,
            },
        )

        # Outer scan: restart DFS from every node not yet reached.
        for start in nodes:
            if start in visited:
                continue

            # Found a brand-new component.
            current_component = component_count
            component_count += 1
            color = self._component_color(current_component)

            yield self.emit_step(
                operation="new_component",
                description=(
                    f"Node {start} is unvisited - it opens component #{current_component + 1}. "
                    "Starting a depth-first search from here."
                ),
                state={
                    "type": "graph",
                    "graph": graph,
                    "current": start,
                    "component_count": component_count,
                    "component_id": dict(component_id),
                },
                highlights=[
                    *node_highlights(start),
                    {"type": "node", "id": start, "color": "active"},
                ],
                metadata={
                    "component_count": component_count,
                    "component_id": dict(component_id),
                    "current": start,
                    "nodes_visited": self.nodes_visited,
                    "total_nodes": len(nodes),
                    "edges_explored": self.edges_explored,
                },
            )

            # Iterative DFS with an explicit stack (no recursion-depth limit).
            stack: list[int] = [start]
            component_members: list[int] = []

            while stack:
                node = stack.pop()
                if node in visited:
                    continue

                visited.add(node)
                component_id[node] = current_component
                component_members.append(node)
                self.nodes_visited += 1

                yield self.emit_step(
                    operation="visit",
                    description=(
                        f"Visit node {node}: label it component #{current_component + 1}. "
                        f"Component now holds {len(component_members)} node(s)."
                    ),
                    state={
                        "type": "graph",
                        "graph": graph,
                        "current": node,
                        "component_count": component_count,
                        "component_id": dict(component_id),
                    },
                    highlights=node_highlights(node),
                    metadata={
                        "component_count": component_count,
                        "component_id": dict(component_id),
                        "current": node,
                        "component_size": len(component_members),
                        "nodes_visited": self.nodes_visited,
                        "total_nodes": len(nodes),
                        "edges_explored": self.edges_explored,
                    },
                )

                # Push unvisited neighbors (reversed so the smallest id is
                # explored first, matching a natural recursive DFS order).
                for neighbor in sorted(graph[node], reverse=True):
                    self.edges_explored += 1
                    if neighbor not in visited:
                        stack.append(neighbor)

            yield self.emit_step(
                operation="component_done",
                description=(
                    f"Component #{current_component + 1} fully explored: nodes "
                    f"{sorted(component_members)} ({len(component_members)} total). "
                    f"{component_count} component(s) found so far."
                ),
                state={
                    "type": "graph",
                    "graph": graph,
                    "current": None,
                    "component_count": component_count,
                    "component_id": dict(component_id),
                },
                highlights=[{"type": "node", "id": n, "color": color} for n in component_members]
                + [
                    {"type": "node", "id": n, "color": self._component_color(component_id[n])}
                    for n in nodes
                    if component_id[n] is not None and n not in component_members
                ],
                metadata={
                    "component_count": component_count,
                    "component_id": dict(component_id),
                    "component_members": sorted(component_members),
                    "component_size": len(component_members),
                    "nodes_visited": self.nodes_visited,
                    "total_nodes": len(nodes),
                    "edges_explored": self.edges_explored,
                },
            )

        yield self.emit_step(
            operation="complete",
            description=(
                f"Done. The graph has {component_count} connected component(s) "
                f"across {len(nodes)} node(s)."
            ),
            state={
                "type": "graph",
                "graph": graph,
                "current": None,
                "component_count": component_count,
                "component_id": dict(component_id),
            },
            highlights=[
                {"type": "node", "id": n, "color": self._component_color(component_id[n])}
                for n in nodes
                if component_id[n] is not None
            ],
            metadata={
                "component_count": component_count,
                "component_id": dict(component_id),
                "nodes_visited": self.nodes_visited,
                "total_nodes": len(nodes),
                "edges_explored": self.edges_explored,
                "result": component_count,
            },
        )
