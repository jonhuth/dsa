"""Prim's Minimum Spanning Tree - grow an MST one crossing edge at a time.

Given a connected, UNDIRECTED, WEIGHTED graph, a *minimum spanning tree* (MST)
is a subset of edges that connects every vertex with no cycles and the smallest
possible total edge weight. Prim's algorithm builds the MST greedily: start from
a single vertex and repeatedly pull in the cheapest edge that crosses the "cut"
separating the tree-so-far from the rest of the graph, absorbing the new vertex
on the far side. A min-priority-queue (binary heap) of crossing edges makes
"cheapest crossing edge" an O(log E) query.

Time Complexity: O(E log V) with a binary heap
    Every edge is pushed onto the heap at most once (O(E) pushes, each O(log E)
    = O(log V) since E <= V^2), and each vertex is popped and absorbed once.
    Total work is dominated by the heap operations: O(E log V).
Space Complexity: O(V + E)
    O(V) for the in-tree set and the chosen MST edge list, plus O(E) for the
    heap of crossing edges and O(V + E) to hold the adjacency list itself.

Key Insights:
    - The "cut property" is what makes the greedy choice safe: for any cut of the
      graph, the minimum-weight edge crossing that cut is always in *some* MST.
      Prim's exploits exactly this - the cut is (tree so far) vs (everything
      else), and the cheapest crossing edge is always safe to add.
    - The heap can hold *stale* crossing edges - an edge whose far endpoint got
      absorbed by a later, cheaper edge. Prim's simply discards any popped edge
      whose target is already in the tree (a lazy-deletion min-heap), so no
      decrease-key bookkeeping is needed.
    - Prim's grows ONE connected tree outward (contrast with Kruskal's, which
      sorts all edges globally and merges forests via union-find). Prim's tends
      to win on dense graphs; Kruskal's on sparse, edge-list-shaped ones.
    - The graph must be treated as UNDIRECTED: an edge u-v is a candidate from
      whichever endpoint is already in the tree, so the adjacency list is made
      symmetric before growing the tree.
"""

import heapq
from collections.abc import Generator
from typing import Any

from algorithms.base import Step, StepTracker, VisualizerType


class PrimMST(StepTracker):
    """Build a minimum spanning tree with Prim's algorithm, emitting steps."""

    visualizer_type = VisualizerType.GRAPH

    def __init__(self):
        super().__init__()
        self.mst_weight = 0
        self.edges_considered = 0

    @staticmethod
    def _normalize_graph(raw: Any) -> tuple[dict[int, list[list[int]]], list[int]]:
        """Coerce a raw weighted adjacency list into a symmetric int-keyed graph.

        JSON object keys always arrive as strings, so node keys and neighbor ids
        are coerced to int. The adjacency list is made symmetric (an undirected
        edge u-v adds both u->v and v->u with the same weight) because an MST is
        defined on undirected graphs. Nodes that appear only as a neighbor, and
        isolated nodes given with an empty list, are all preserved.

        Args:
            raw: Weighted adjacency list, typically
                {str|int: list[[neighbor, weight], ...]}.

        Returns:
            Tuple of (symmetric graph {int: [[neighbor, weight], ...]} with
            neighbors sorted by id, sorted list of node ids).
        """
        # weights[u][v] = min weight of any edge between u and v (undirected).
        weights: dict[int, dict[int, int]] = {}
        nodes: set[int] = set()

        if isinstance(raw, dict):
            items = raw.items()
        else:
            items = enumerate(raw or [])

        for key, neighbors in items:
            node = int(key)
            nodes.add(node)
            weights.setdefault(node, {})
            for pair in neighbors or []:
                nb = int(pair[0])
                weight = int(pair[1])
                nodes.add(nb)
                weights.setdefault(nb, {})
                # Keep the cheapest weight if the edge is listed more than once.
                if node not in weights[nb] or weight < weights[nb][node]:
                    weights[node][nb] = weight
                    weights[nb][node] = weight

        for node in nodes:
            weights.setdefault(node, {})

        graph = {
            node: [[nb, weights[node][nb]] for nb in sorted(weights[node])]
            for node in sorted(nodes)
        }
        return graph, sorted(nodes)

    def run(self, input_data: dict[str, Any]) -> Generator[Step, None, None]:
        """Run Prim's MST and emit visualization steps.

        Args:
            input_data: Dict shaped as
                {"graph": {node: [[neighbor, weight], ...]}, "start": int}
                describing an UNDIRECTED WEIGHTED graph. Node keys may be strings
                (from JSON) and are coerced to int; the graph is symmetrized.

        Yields:
            Step objects for visualization.
        """
        self.reset()
        self.mst_weight = 0
        self.edges_considered = 0

        raw_graph = input_data.get("graph", {}) if isinstance(input_data, dict) else input_data
        start = int(input_data.get("start", 0)) if isinstance(input_data, dict) else 0

        graph, nodes = self._normalize_graph(raw_graph)
        if not nodes:
            yield self.emit_step(
                operation="complete",
                description="Empty graph - no minimum spanning tree to build.",
                state={"type": "graph", "graph": graph, "current": None},
                highlights=[],
                metadata={
                    "mst_weight": 0,
                    "edges_in_mst": 0,
                    "tree_nodes": [],
                    "mst_edges": [],
                    "candidate_edges": [],
                    "result": 0,
                },
            )
            return

        if start not in graph:
            start = nodes[0]

        in_tree: set[int] = set()
        mst_edges: list[list[int]] = []  # chosen edges as [u, v, weight]
        # Lazy min-heap of crossing edges: (weight, from_node, to_node).
        heap: list[tuple[int, int, int]] = []

        def candidate_edges() -> list[list[int]]:
            """Crossing edges currently on the heap whose target is still outside
            the tree (stale entries whose target was already absorbed are
            dropped). Returned as [from, to, weight] for the frontier highlight."""
            seen: set[tuple[int, int]] = set()
            out: list[list[int]] = []
            for w, u, v in heap:
                if v in in_tree:
                    continue
                key = (u, v)
                if key in seen:
                    continue
                seen.add(key)
                out.append([u, v, w])
            return out

        def frontier_nodes() -> list[int]:
            """Nodes not yet in the tree that sit on the cut (reachable by a
            crossing edge on the heap) - highlighted as candidates."""
            return sorted({v for _, _, v in heap if v not in in_tree})

        def add_to_tree(node: int) -> None:
            """Absorb a node and push all of its outgoing crossing edges."""
            in_tree.add(node)
            for nb, weight in graph[node]:
                if nb not in in_tree:
                    heapq.heappush(heap, (weight, node, nb))

        add_to_tree(start)

        yield self.emit_step(
            operation="init",
            description=(
                f"Start Prim's from node {start}. The tree holds just {{{start}}}; "
                "grow it by repeatedly pulling in the cheapest edge that crosses "
                "the cut between the tree and the rest of the graph."
            ),
            state={"type": "graph", "graph": graph, "current": start},
            highlights=[
                {"type": "node", "id": start, "color": "active"},
                *[
                    {"type": "edge", "id": f"{u}-{v}", "color": "active"}
                    for _, u, v in candidate_edges()
                ],
                *[{"type": "node", "id": v, "color": "comparing"} for v in frontier_nodes()],
            ],
            metadata={
                "start": start,
                "current": start,
                "mst_weight": 0,
                "edges_in_mst": 0,
                "tree_nodes": sorted(in_tree),
                "mst_edges": [list(e) for e in mst_edges],
                "candidate_edges": candidate_edges(),
                "frontier_nodes": frontier_nodes(),
                "total_nodes": len(nodes),
                "edges_considered": self.edges_considered,
            },
        )

        while heap and len(in_tree) < len(nodes):
            weight, u, v = heapq.heappop(heap)
            self.edges_considered += 1

            # Stale entry: the target was already absorbed by a cheaper edge.
            if v in in_tree:
                yield self.emit_step(
                    operation="skip",
                    description=(
                        f"Cheapest crossing edge {u}-{v} (weight {weight}) is stale - "
                        f"node {v} is already in the tree. Discard it and pop the next."
                    ),
                    state={"type": "graph", "graph": graph, "current": u},
                    highlights=[
                        *[{"type": "node", "id": n, "color": "visited"} for n in in_tree],
                        *[
                            {"type": "edge", "id": f"{a}-{b}", "color": "path"}
                            for a, b, _ in mst_edges
                        ],
                        *[
                            {"type": "edge", "id": f"{a}-{b}", "color": "active"}
                            for _, a, b in candidate_edges()
                        ],
                        *[
                            {"type": "node", "id": c, "color": "comparing"}
                            for c in frontier_nodes()
                        ],
                    ],
                    metadata={
                        "skipped_edge": [u, v, weight],
                        "current": u,
                        "mst_weight": self.mst_weight,
                        "edges_in_mst": len(mst_edges),
                        "tree_nodes": sorted(in_tree),
                        "mst_edges": [list(e) for e in mst_edges],
                        "candidate_edges": candidate_edges(),
                        "frontier_nodes": frontier_nodes(),
                        "total_nodes": len(nodes),
                        "edges_considered": self.edges_considered,
                    },
                )
                continue

            # This edge crosses the cut to a new vertex: add it to the MST.
            self.mst_weight += weight
            mst_edges.append([u, v, weight])
            add_to_tree(v)

            yield self.emit_step(
                operation="add_edge",
                description=(
                    f"Add cheapest crossing edge {u}-{v} (weight {weight}) to the MST "
                    f"and absorb node {v}. Tree now spans {len(in_tree)} node(s); "
                    f"total weight {self.mst_weight}."
                ),
                state={"type": "graph", "graph": graph, "current": v},
                highlights=[
                    *[{"type": "node", "id": n, "color": "visited"} for n in in_tree if n != v],
                    {"type": "node", "id": v, "color": "active"},
                    *[{"type": "edge", "id": f"{a}-{b}", "color": "path"} for a, b, _ in mst_edges],
                    *[
                        {"type": "edge", "id": f"{a}-{b}", "color": "active"}
                        for _, a, b in candidate_edges()
                    ],
                    *[{"type": "node", "id": c, "color": "comparing"} for c in frontier_nodes()],
                ],
                metadata={
                    "chosen_edge": [u, v, weight],
                    "current": v,
                    "mst_weight": self.mst_weight,
                    "edges_in_mst": len(mst_edges),
                    "tree_nodes": sorted(in_tree),
                    "mst_edges": [list(e) for e in mst_edges],
                    "candidate_edges": candidate_edges(),
                    "frontier_nodes": frontier_nodes(),
                    "total_nodes": len(nodes),
                    "edges_considered": self.edges_considered,
                },
            )

        connected = len(in_tree) == len(nodes)
        if connected:
            description = (
                f"Minimum spanning tree complete: {len(mst_edges)} edge(s) connect all "
                f"{len(nodes)} node(s) with total weight {self.mst_weight}."
            )
        else:
            description = (
                f"Graph is disconnected - Prim's reached only {len(in_tree)} of "
                f"{len(nodes)} nodes. The spanning tree of this component has weight "
                f"{self.mst_weight}."
            )

        yield self.emit_step(
            operation="complete",
            description=description,
            state={"type": "graph", "graph": graph, "current": None},
            highlights=[
                *[{"type": "node", "id": n, "color": "visited"} for n in in_tree],
                *[{"type": "edge", "id": f"{a}-{b}", "color": "path"} for a, b, _ in mst_edges],
            ],
            metadata={
                "mst_weight": self.mst_weight,
                "edges_in_mst": len(mst_edges),
                "tree_nodes": sorted(in_tree),
                "mst_edges": [list(e) for e in mst_edges],
                "candidate_edges": [],
                "frontier_nodes": [],
                "total_nodes": len(nodes),
                "edges_considered": self.edges_considered,
                "connected": connected,
                "result": self.mst_weight,
            },
        )
