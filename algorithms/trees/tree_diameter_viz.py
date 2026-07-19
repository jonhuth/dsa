"""Binary Tree Diameter - Longest path (in edges) between any two nodes.

The diameter of a binary tree is the number of edges on the longest path
between *any* two nodes. That path may or may not pass through the root - the
classic trap is assuming it always does. The key observation is that for every
node the longest path *through that node* is exactly ``height(left) +
height(right)`` (in edges, where a missing child contributes 0 edges). So a
single post-order pass that returns each node's height can, as a side effect,
keep a running maximum of ``height(left) + height(right)`` across all nodes -
that maximum is the diameter.

Time Complexity:
    Best: O(n) - every node must be visited to know all heights
    Average: O(n) - each node touched exactly once
    Worst: O(n) - single pass regardless of shape

Space Complexity: O(h) - recursion stack, where h = tree height
    (O(log n) for a balanced tree, O(n) for a degenerate/skewed tree)

Key Insights:
    - The diameter need NOT pass through the root; it is the best "through-path"
      over ALL nodes, so you must check every node, not just the root.
    - height and diameter are computed together in ONE post-order pass: the
      function returns the height while side-effecting the best diameter.
    - A node's through-path length (edges) = height(left) + height(right); a
      missing subtree contributes 0 edges (an empty child has height -1, so it
      adds nothing to the path).
    - Measuring in EDGES (not nodes) matters: a path over k nodes has k-1 edges.
      Answering in the wrong unit is a common off-by-one bug.
"""

from collections import deque
from collections.abc import Generator

from algorithms.base import Step, StepTracker, VisualizerType


class TreeNode:
    """Binary tree node."""

    def __init__(self, val: int):
        self.val = val
        self.left: TreeNode | None = None
        self.right: TreeNode | None = None


class TreeDiameter(StepTracker):
    """Compute a binary tree's diameter with a post-order height visualization."""

    visualizer_type = VisualizerType.TREE

    def __init__(self):
        super().__init__()
        self.heights: dict[int, int] = {}
        self.best_diameter: int = 0
        self.best_path: list[int] = []

    def _build_tree_from_list(self, values: list[int | None]) -> TreeNode | None:
        """Build binary tree from level-order list (None = missing node)."""
        if not values or values[0] is None:
            return None

        root = TreeNode(values[0])
        queue = deque([root])
        i = 1

        while queue and i < len(values):
            node = queue.popleft()

            # Left child
            if i < len(values) and values[i] is not None:
                node.left = TreeNode(values[i])
                queue.append(node.left)
            i += 1

            # Right child
            if i < len(values) and values[i] is not None:
                node.right = TreeNode(values[i])
                queue.append(node.right)
            i += 1

        return root

    def _tree_to_dict(self, node: TreeNode | None) -> dict | None:
        """Convert tree to dict for visualization."""
        if not node:
            return None
        return {
            "val": node.val,
            "left": self._tree_to_dict(node.left),
            "right": self._tree_to_dict(node.right),
        }

    def _highlights(self, current: int | None, path: list[int] | None) -> list[dict]:
        """Color map: green = height known, blue = current node, yellow = best path."""
        colors: dict[int, str] = {}
        for v in self.heights:
            colors[v] = "sorted"
        if current is not None:
            colors[current] = "active"
        for v in path or []:
            colors[v] = "comparing"
        return [{"type": "node", "id": v, "color": c} for v, c in colors.items()]

    def run(self, input_data) -> Generator[Step, None, None]:
        """Compute the diameter from level-order input, emitting a step per node.

        Args:
            input_data: level-order values as a ``list`` (use ``None`` for
                missing nodes) or a dict ``{"values": [...]}``.
        """
        self.reset()
        self.heights = {}
        self.best_diameter = 0
        self.best_path = []

        values = input_data["values"] if isinstance(input_data, dict) else input_data
        root = self._build_tree_from_list(values)
        tree_dict = self._tree_to_dict(root)

        yield self.emit_step(
            operation="init",
            description=(
                "Diameter = longest path (in edges) between any two nodes. "
                "Post-order DFS: return each node's height, and at every node "
                "track the best height(left) + height(right)."
            ),
            state={"type": "tree", "tree": tree_dict},
            highlights=[],
            metadata={
                "current": None,
                "best_diameter": 0,
                "heights": {},
            },
        )

        if root is None:
            yield self.emit_step(
                operation="complete",
                description="Empty tree - the diameter is 0 (no edges).",
                state={"type": "tree", "tree": tree_dict},
                highlights=[],
                metadata={"current": None, "best_diameter": 0, "heights": {}},
            )
            return

        yield from self._diameter(root, root)

        # Final report: highlight the diameter path if we captured one.
        yield self.emit_step(
            operation="complete",
            description=(
                f"Diameter = {self.best_diameter} edge(s). Longest path: "
                + (" → ".join(str(v) for v in self.best_path) if self.best_path else "single node")
                + "."
            ),
            state={"type": "tree", "tree": tree_dict},
            highlights=self._highlights(None, self.best_path),
            metadata={
                "current": None,
                "best_diameter": self.best_diameter,
                "heights": dict(self.heights),
                "path": list(self.best_path),
            },
        )

    def _diameter(
        self, node: TreeNode | None, root: TreeNode
    ) -> Generator[Step, None, tuple[int, list[int]]]:
        """Post-order: return (height in edges, downward path to deepest leaf).

        Height convention: a leaf has height 0, a missing child has height -1
        (so it contributes 0 edges to any path through its parent).
        """
        if node is None:
            return -1, []

        left_h, left_path = yield from self._diameter(node.left, root)
        right_h, right_path = yield from self._diameter(node.right, root)

        height = 1 + max(left_h, right_h)
        # Through-path length in edges: an absent child (height -1) adds nothing.
        through = left_h + right_h + 2
        down_path = [node.val] + (left_path if left_h >= right_h else right_path)

        self.heights[node.val] = height

        if through > self.best_diameter:
            self.best_diameter = through
            self.best_path = list(reversed(left_path)) + [node.val] + right_path
            yield self.emit_step(
                operation="update",
                description=(
                    f"Node {node.val}: {left_h + 1} edge(s) down-left, "
                    f"{right_h + 1} down-right → through-path = {through} edge(s). "
                    f"New best diameter = {self.best_diameter}."
                ),
                state={"type": "tree", "tree": self._tree_to_dict(root)},
                highlights=self._highlights(node.val, self.best_path),
                metadata={
                    "current": node.val,
                    "height": height,
                    "through": through,
                    "best_diameter": self.best_diameter,
                    "heights": dict(self.heights),
                    "path": list(self.best_path),
                },
            )
        else:
            yield self.emit_step(
                operation="visit",
                description=(
                    f"Node {node.val}: height = {height} edge(s). Through-path here "
                    f"= {through} edge(s), which does not beat the best "
                    f"({self.best_diameter})."
                ),
                state={"type": "tree", "tree": self._tree_to_dict(root)},
                highlights=self._highlights(node.val, self.best_path),
                metadata={
                    "current": node.val,
                    "height": height,
                    "through": through,
                    "best_diameter": self.best_diameter,
                    "heights": dict(self.heights),
                    "path": list(self.best_path),
                },
            )

        return height, down_path
