"""Invert Binary Tree - Mirror a binary tree by swapping every node's children.

The famous "Homebrew" interview question: legend has it that the creator of the
Homebrew package manager was rejected by a big tech company for being unable to
invert a binary tree on a whiteboard. It has since become the canonical example
of a deceptively simple tree problem.

Given the root of a binary tree, invert it (produce its mirror image) so that
the left and right children of every node are swapped.

Time Complexity: O(n) where n = number of nodes (each node visited once)
Space Complexity: O(h) for the recursion stack where h = tree height
    Best/balanced: O(log n)   Worst/skewed: O(n)

Key Insights:
    - The whole algorithm is one idea applied recursively: swap the two children
      of a node, then invert each subtree. Order does not matter.
    - It is the same shape as a tree traversal - you touch every node exactly
      once, so it is O(n) time.
    - The recursion bottoms out at leaves and nulls, which need no swap.
    - Can also be done iteratively with a queue (BFS) or stack (DFS) - same
      swap, different bookkeeping.
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


class InvertBinaryTree(StepTracker):
    """Invert (mirror) a binary tree with step-by-step visualization."""

    visualizer_type = VisualizerType.TREE

    def __init__(self):
        super().__init__()
        self.swaps = 0
        self.nodes_visited = 0

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

    def run(self, input_data) -> Generator[Step, None, None]:
        """Invert a binary tree given level-order values.

        Args:
            input_data: A list of level-order values (ints, None for missing
                nodes), or a dict of shape {"values": [...]}.
        """
        self.reset()
        self.swaps = 0
        self.nodes_visited = 0

        # Accept both a bare list and {"values": [...]}
        if isinstance(input_data, dict):
            values = input_data.get("values", [])
        else:
            values = input_data

        root = self._build_tree_from_list(values)

        yield self.emit_step(
            operation="init",
            description="Invert the binary tree: swap the two children of every node, top to bottom.",
            state={"type": "tree", "tree": self._tree_to_dict(root)},
            highlights=[],
            metadata={"swaps": 0, "nodes_visited": 0},
        )

        if root is None:
            yield self.emit_step(
                operation="complete",
                description="Tree is empty - nothing to invert.",
                state={"type": "tree", "tree": self._tree_to_dict(root)},
                highlights=[],
                metadata={"swaps": 0, "nodes_visited": 0},
            )
            return

        yield from self._invert_helper(root, root)

        yield self.emit_step(
            operation="complete",
            description=(
                f"Inversion complete: {self.swaps} swap(s) across "
                f"{self.nodes_visited} node(s). The tree is now mirrored."
            ),
            state={"type": "tree", "tree": self._tree_to_dict(root)},
            highlights=[],
            metadata={"swaps": self.swaps, "nodes_visited": self.nodes_visited},
        )

    def _invert_helper(self, node: TreeNode | None, root: TreeNode) -> Generator[Step, None, None]:
        """Recursively swap each node's children, emitting a frame per swap."""
        if node is None:
            return

        self.nodes_visited += 1

        left_val = node.left.val if node.left else None
        right_val = node.right.val if node.right else None

        # Only nodes that actually have a child produce a visible swap.
        if node.left is not None or node.right is not None:
            # BEFORE: highlight the node about to swap and its two children.
            before_highlights = [{"type": "node", "id": node.val, "color": "active"}]
            if node.left is not None:
                before_highlights.append(
                    {"type": "node", "id": node.left.val, "color": "comparing"}
                )
            if node.right is not None:
                before_highlights.append(
                    {"type": "node", "id": node.right.val, "color": "comparing"}
                )

            yield self.emit_step(
                operation="swap_children",
                description=(
                    f"At node {node.val}: about to swap left child "
                    f"({left_val if left_val is not None else '∅'}) with right child "
                    f"({right_val if right_val is not None else '∅'})."
                ),
                state={"type": "tree", "tree": self._tree_to_dict(root)},
                highlights=before_highlights,
                metadata={
                    "current": node.val,
                    "swaps": self.swaps,
                    "nodes_visited": self.nodes_visited,
                },
            )

            # Perform the swap.
            node.left, node.right = node.right, node.left
            self.swaps += 1

            # AFTER: same nodes highlighted, tree state now reflects the mirror.
            after_highlights = [{"type": "node", "id": node.val, "color": "sorted"}]
            if node.left is not None:
                after_highlights.append({"type": "node", "id": node.left.val, "color": "sorted"})
            if node.right is not None:
                after_highlights.append({"type": "node", "id": node.right.val, "color": "sorted"})

            yield self.emit_step(
                operation="swapped",
                description=(
                    f"Swapped at node {node.val}: children are now mirrored "
                    f"(left ↔ right). Recurse into each subtree next."
                ),
                state={"type": "tree", "tree": self._tree_to_dict(root)},
                highlights=after_highlights,
                metadata={
                    "current": node.val,
                    "swaps": self.swaps,
                    "nodes_visited": self.nodes_visited,
                },
            )
        else:
            # Leaf node: nothing to swap, just mark it as done.
            yield self.emit_step(
                operation="leaf",
                description=f"Node {node.val} is a leaf - no children to swap.",
                state={"type": "tree", "tree": self._tree_to_dict(root)},
                highlights=[{"type": "node", "id": node.val, "color": "sorted"}],
                metadata={
                    "current": node.val,
                    "swaps": self.swaps,
                    "nodes_visited": self.nodes_visited,
                },
            )

        # Recurse into (now-swapped) children.
        yield from self._invert_helper(node.left, root)
        yield from self._invert_helper(node.right, root)
