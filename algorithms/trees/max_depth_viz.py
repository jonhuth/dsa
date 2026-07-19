"""Maximum Depth of Binary Tree - Height via recursive DFS.

The maximum depth (a.k.a. height) of a binary tree is the number of nodes along
the longest path from the root down to the farthest leaf. The recursive insight
is beautifully small: an empty tree has depth 0, and any non-empty node's depth
is ``1 + max(depth(left), depth(right))``. Each node simply asks its two
subtrees how tall they are, takes the taller answer, and adds itself. The value
"bubbles up" the recursion as the call stack unwinds.

Time Complexity:
    Best: O(n) - every node must be visited to know the height
    Average: O(n) - each node visited exactly once
    Worst: O(n) - same; there is no early exit

Space Complexity: O(h) - recursion stack, where h = tree height
    (O(log n) for a balanced tree, O(n) for a degenerate/skewed tree)

Key Insights:
    - Depth is defined recursively: depth(node) = 1 + max(depth(left),
      depth(right)); the base case is the empty child, which contributes 0.
    - The answer is computed on the way *up*: a node cannot know its height until
      both children have reported theirs, so work happens as the stack unwinds.
    - This is a textbook post-order traversal - children are fully resolved
      before the parent is finalized.
    - Every node is touched exactly once and there is no way to short-circuit, so
      the height problem is inherently O(n).
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


class MaxDepth(StepTracker):
    """Compute the maximum depth of a binary tree with post-order DFS steps."""

    visualizer_type = VisualizerType.TREE

    def __init__(self):
        super().__init__()
        self.resolved: list[int] = []
        self.depths: dict[int, int] = {}
        self.max_depth: int = 0

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

    def _deepest_path(self, node: TreeNode | None) -> list[int]:
        """Follow the taller child from root to a farthest leaf."""
        path: list[int] = []
        while node is not None:
            path.append(node.val)
            left_h = self._height(node.left)
            right_h = self._height(node.right)
            node = node.left if left_h >= right_h else node.right
        return path

    def _height(self, node: TreeNode | None) -> int:
        """Plain (non-emitting) height helper for path reconstruction."""
        if node is None:
            return 0
        return 1 + max(self._height(node.left), self._height(node.right))

    def _highlights(
        self,
        current: int | None,
        path: list[int] | None = None,
    ) -> list[dict]:
        """Green for resolved subtrees, blue for the current node, path override.

        When ``path`` is given (final step) the deepest path is drawn green and
        everything else defaults, to spotlight the longest root-to-leaf chain.
        """
        if path is not None:
            return [{"type": "node", "id": v, "color": "sorted"} for v in path]

        highlights: list[dict] = [
            {"type": "node", "id": v, "color": "sorted"} for v in self.resolved
        ]
        if current is not None:
            highlights.append({"type": "node", "id": current, "color": "active"})
        return highlights

    def run(self, input_data) -> Generator[Step, None, None]:
        """Compute max depth from level-order input, emitting DFS steps.

        Args:
            input_data: level-order values as a ``list`` (use ``None`` for
                missing nodes) or a dict ``{"values": [...]}``.
        """
        self.reset()
        self.resolved = []
        self.depths = {}
        self.max_depth = 0

        values = input_data["values"] if isinstance(input_data, dict) else input_data
        root = self._build_tree_from_list(values)

        yield self.emit_step(
            operation="init",
            description=(
                "Maximum depth = longest path (in nodes) from the root to a leaf. "
                "We recurse: each node's depth is 1 + max(left depth, right depth), "
                "and an empty child contributes depth 0."
            ),
            state={"type": "tree", "tree": self._tree_to_dict(root)},
            highlights=[],
            metadata={"current": None, "max_depth": 0, "node_depth": None},
        )

        _ = yield from self._depth(root, root, 1)

        tree_dict = self._tree_to_dict(root)
        deepest = self._deepest_path(root)

        yield self.emit_step(
            operation="complete",
            description=(
                f"Maximum depth is {self.max_depth}. The highlighted chain "
                f"{' -> '.join(str(v) for v in deepest) if deepest else '(empty)'} "
                "is a longest root-to-leaf path, and its length equals the answer."
            ),
            state={"type": "tree", "tree": tree_dict},
            highlights=self._highlights(None, path=deepest),
            metadata={
                "current": None,
                "max_depth": self.max_depth,
                "node_depth": self.max_depth,
                "deepest_path": deepest,
            },
        )

    def _depth(
        self,
        node: TreeNode | None,
        root: TreeNode | None,
        level: int,
    ) -> Generator[Step, None, int]:
        """Recursively compute subtree depth; returns height of ``node``."""
        if node is None:
            return 0

        # Descend: entering this node before its children are known.
        yield self.emit_step(
            operation="descend",
            description=(
                f"Visit node {node.val} (level {level}). Before we can size its "
                "subtree we must recurse into its children and ask how tall they are."
            ),
            state={"type": "tree", "tree": self._tree_to_dict(root)},
            highlights=self._highlights(node.val),
            metadata={"current": node.val, "level": level, "max_depth": self.max_depth},
        )

        left_h = yield from self._depth(node.left, root, level + 1)
        right_h = yield from self._depth(node.right, root, level + 1)

        depth = 1 + max(left_h, right_h)
        self.depths[node.val] = depth
        self.resolved.append(node.val)
        self.max_depth = max(self.max_depth, depth)

        # Return: children resolved, finalize this node's height on the way up.
        taller = "left" if left_h >= right_h else "right"
        yield self.emit_step(
            operation="return",
            description=(
                f"Node {node.val}: left subtree height {left_h}, right subtree "
                f"height {right_h}. Take the taller ({taller}) and add 1 -> depth "
                f"{depth} bubbles up to its parent."
            ),
            state={"type": "tree", "tree": self._tree_to_dict(root)},
            highlights=self._highlights(node.val),
            metadata={
                "current": node.val,
                "level": level,
                "node_depth": depth,
                "left_height": left_h,
                "right_height": right_h,
                "max_depth": self.max_depth,
            },
        )

        return depth
