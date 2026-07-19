"""Path Sum (Root-to-Leaf) - Does any root-to-leaf path add up to a target?

Given a binary tree and a target sum, decide whether the tree has a
*root-to-leaf* path whose node values add up exactly to the target. A leaf is a
node with no children, so a path must start at the root and end at a leaf - you
cannot stop early in the middle of the tree.

The clean solution is a depth-first search that carries a *running sum* down the
recursion. Instead of collecting every path and summing it at the end, you
subtract (or add) as you descend: each child inherits ``running_sum + node.val``.
Only at a leaf do you compare the accumulated sum against the target. The first
matching leaf answers the question - you can short-circuit and stop.

Time Complexity:
    Best: O(1) - a matching root that is itself a leaf (single-node tree)
    Average: O(n) - each node is visited at most once
    Worst: O(n) - no path matches, so every node is visited

Space Complexity: O(h) - recursion stack, where h = tree height
    (O(log n) for a balanced tree, O(n) for a degenerate/skewed tree)

Key Insights:
    - Carry the running sum DOWN the recursion; don't rebuild each path from
      scratch. Each child sees ``parent_running_sum + node.val``.
    - The check happens ONLY at a leaf (no left and no right child). A prefix
      that already equals the target but sits on an internal node does not count.
    - Short-circuit: the first matching leaf lets you stop; you never need to
      explore the rest of the tree once a valid path is found.
    - Values may be negative, so you cannot prune a branch just because the
      running sum already exceeds the target - a later negative node could pull
      it back down.
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


class PathSum(StepTracker):
    """Find a root-to-leaf path summing to a target, with running-sum steps."""

    visualizer_type = VisualizerType.TREE

    def __init__(self):
        super().__init__()
        self.target: int = 0
        self.found: bool = False
        self.match_path: list[int] = []

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

    def _highlights(self, path: list[int], color: str) -> list[dict]:
        """Highlight every node currently on the active path with ``color``."""
        return [{"type": "node", "id": val, "color": color} for val in path]

    def run(self, input_data) -> Generator[Step, None, None]:
        """Search for a root-to-leaf path summing to a target.

        Args:
            input_data: a dict ``{"values": [...], "target": int}`` where
                ``values`` is a level-order list (use ``None`` for missing
                nodes) and ``target`` is the sum to look for.
        """
        self.reset()
        self.found = False
        self.match_path = []

        if isinstance(input_data, dict):
            values = input_data.get("values", [])
            self.target = int(input_data.get("target", 0))
        else:
            values = input_data
            self.target = 0

        root = self._build_tree_from_list(values)

        yield self.emit_step(
            operation="init",
            description=(
                f"Path Sum: is there a root-to-leaf path summing to {self.target}? "
                "DFS from the root, carrying a running sum down each branch and "
                "checking it only at the leaves."
            ),
            state={"type": "tree", "tree": self._tree_to_dict(root)},
            highlights=[],
            metadata={
                "current": None,
                "running_sum": 0,
                "target": self.target,
                "path": [],
                "found": None,
            },
        )

        yield from self._dfs(root, 0, [], root)

        tree_dict = self._tree_to_dict(root)

        if self.found:
            path_str = " + ".join(str(v) for v in self.match_path)
            yield self.emit_step(
                operation="complete",
                description=(
                    f"Found it! The path {path_str} = {self.target} reaches a leaf "
                    "and matches the target. A valid root-to-leaf path exists."
                ),
                state={"type": "tree", "tree": tree_dict},
                highlights=self._highlights(self.match_path, "sorted"),
                metadata={
                    "current": None,
                    "running_sum": self.target,
                    "target": self.target,
                    "path": self.match_path.copy(),
                    "found": True,
                },
            )
        else:
            yield self.emit_step(
                operation="complete",
                description=(
                    f"No root-to-leaf path sums to {self.target}. Every leaf was "
                    "reached and none of the accumulated sums matched the target."
                ),
                state={"type": "tree", "tree": tree_dict},
                highlights=[],
                metadata={
                    "current": None,
                    "running_sum": 0,
                    "target": self.target,
                    "path": [],
                    "found": False,
                },
            )

    def _dfs(
        self,
        node: TreeNode | None,
        running_sum: int,
        path: list[int],
        root: TreeNode,
    ) -> Generator[Step, None, bool]:
        """DFS carrying the running sum; returns True once a match is found."""
        if node is None:
            return False
        if self.found:
            return True

        running_sum += node.val
        path = path + [node.val]
        is_leaf = node.left is None and node.right is None

        if is_leaf:
            if running_sum == self.target:
                self.found = True
                self.match_path = path.copy()
                yield self.emit_step(
                    operation="match",
                    description=(
                        f"Leaf {node.val} reached with running sum {running_sum} == "
                        f"target {self.target}. This root-to-leaf path matches - stop."
                    ),
                    state={"type": "tree", "tree": self._tree_to_dict(root)},
                    highlights=self._highlights(path, "sorted"),
                    metadata={
                        "current": node.val,
                        "running_sum": running_sum,
                        "target": self.target,
                        "path": path.copy(),
                        "found": True,
                    },
                )
                return True

            yield self.emit_step(
                operation="leaf",
                description=(
                    f"Leaf {node.val} reached with running sum {running_sum} != "
                    f"target {self.target}. This path fails - backtrack and try another."
                ),
                state={"type": "tree", "tree": self._tree_to_dict(root)},
                highlights=self._highlights(path, "comparing"),
                metadata={
                    "current": node.val,
                    "running_sum": running_sum,
                    "target": self.target,
                    "path": path.copy(),
                    "found": False,
                },
            )
            return False

        remaining = self.target - running_sum
        yield self.emit_step(
            operation="visit",
            description=(
                f"Visit node {node.val}. Running sum is now {running_sum}; "
                f"{remaining} left to reach {self.target}. Descend into its children."
            ),
            state={"type": "tree", "tree": self._tree_to_dict(root)},
            highlights=self._highlights(path, "active"),
            metadata={
                "current": node.val,
                "running_sum": running_sum,
                "target": self.target,
                "path": path.copy(),
                "found": None,
            },
        )

        # Explore left subtree, then right; short-circuit on the first match.
        left_found = yield from self._dfs(node.left, running_sum, path, root)
        if left_found:
            return True

        right_found = yield from self._dfs(node.right, running_sum, path, root)
        return right_found
