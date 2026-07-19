"""Validate Binary Search Tree - Check the global BST ordering property.

A binary tree is a valid BST when, for every node, *all* values in its left
subtree are strictly less than the node and *all* values in its right subtree
are strictly greater. Checking a node only against its immediate children is a
classic trap - the constraint is global, not local. The clean solution passes a
running ``(low, high)`` bound down the recursion: the root is allowed the full
range ``(-inf, +inf)``, going left tightens the upper bound to the current
value, and going right raises the lower bound to the current value.

Time Complexity:
    Best: O(1) - root already violates its bound (immediate reject)
    Average: O(n) - each node checked once
    Worst: O(n) - valid tree, every node visited

Space Complexity: O(h) - recursion stack, where h = tree height
    (O(log n) for a balanced tree, O(n) for a degenerate/skewed tree)

Key Insights:
    - The BST property is GLOBAL: node.left must be < node for the whole subtree,
      not just the direct child. Local parent/child checks give false positives.
    - Carry (low, high) bounds down: left child inherits (low, node.val),
      right child inherits (node.val, high).
    - Strict inequalities: duplicates break a strict BST (adjust to >=/<= if
      duplicates are allowed on one side).
    - An in-order traversal of a BST is strictly increasing - an equivalent
      validation is "is the in-order sequence sorted?".
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


class ValidateBST(StepTracker):
    """Validate a binary search tree with (low, high) bound visualization."""

    visualizer_type = VisualizerType.TREE

    def __init__(self):
        super().__init__()
        self.valid_nodes: list[int] = []
        self.violation: int | None = None

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

    @staticmethod
    def _bound_str(lo: int | None, hi: int | None) -> str:
        """Human-readable allowed range like (-inf, 5) or (3, +inf)."""
        lo_str = "-∞" if lo is None else str(lo)
        hi_str = "+∞" if hi is None else str(hi)
        return f"({lo_str}, {hi_str})"

    def _highlights(self, current: int | None, violation: int | None) -> list[dict]:
        """Green for already-valid nodes, blue for current, yellow for a violation."""
        highlights: list[dict] = [
            {"type": "node", "id": v, "color": "sorted"} for v in self.valid_nodes
        ]
        if violation is not None:
            highlights.append({"type": "node", "id": violation, "color": "comparing"})
        elif current is not None:
            highlights.append({"type": "node", "id": current, "color": "active"})
        return highlights

    def run(self, input_data) -> Generator[Step, None, None]:
        """Validate a BST from level-order input, emitting a step per node.

        Args:
            input_data: level-order values as a ``list`` (use ``None`` for
                missing nodes) or a dict ``{"values": [...]}``.
        """
        self.reset()
        self.valid_nodes = []
        self.violation = None

        values = input_data["values"] if isinstance(input_data, dict) else input_data
        root = self._build_tree_from_list(values)

        yield self.emit_step(
            operation="init",
            description=(
                "Validate BST: every node must fall strictly within an allowed "
                "(low, high) range. The root starts with the full range (-∞, +∞)."
            ),
            state={"type": "tree", "tree": self._tree_to_dict(root)},
            highlights=[],
            metadata={"current": None, "range": self._bound_str(None, None), "is_valid": None},
        )

        yield from self._validate(root, None, None, root)

        tree_dict = self._tree_to_dict(root)

        if self.violation is None:
            yield self.emit_step(
                operation="complete",
                description=(
                    "Valid BST! Every node satisfied its (low, high) bounds - "
                    "the tree respects the binary-search-tree ordering globally."
                ),
                state={"type": "tree", "tree": tree_dict},
                highlights=self._highlights(None, None),
                metadata={
                    "current": None,
                    "is_valid": True,
                    "checked": self.valid_nodes.copy(),
                },
            )
        else:
            yield self.emit_step(
                operation="complete",
                description=(
                    f"Not a valid BST. Node {self.violation} fell outside its allowed "
                    "range, so the search-tree ordering is broken."
                ),
                state={"type": "tree", "tree": tree_dict},
                highlights=self._highlights(None, self.violation),
                metadata={
                    "current": self.violation,
                    "is_valid": False,
                    "checked": self.valid_nodes.copy(),
                },
            )

    def _validate(
        self,
        node: TreeNode | None,
        lo: int | None,
        hi: int | None,
        root: TreeNode,
    ) -> Generator[Step, None, bool]:
        """Recursively check node against (lo, hi); returns True if subtree valid."""
        if node is None:
            return True
        if self.violation is not None:
            return False

        range_str = self._bound_str(lo, hi)
        within = (lo is None or node.val > lo) and (hi is None or node.val < hi)

        if not within:
            self.violation = node.val
            yield self.emit_step(
                operation="violation",
                description=(
                    f"Node {node.val} is OUTSIDE its allowed range {range_str} - "
                    "the BST property is violated here. Stop."
                ),
                state={"type": "tree", "tree": self._tree_to_dict(root)},
                highlights=self._highlights(node.val, node.val),
                metadata={"current": node.val, "range": range_str, "is_valid": False},
            )
            return False

        yield self.emit_step(
            operation="check",
            description=(
                f"Node {node.val} is within {range_str} - OK. Its left subtree must "
                f"stay below {node.val}, its right subtree above {node.val}."
            ),
            state={"type": "tree", "tree": self._tree_to_dict(root)},
            highlights=self._highlights(node.val, None),
            metadata={"current": node.val, "range": range_str, "is_valid": True},
        )
        self.valid_nodes.append(node.val)

        # Left subtree: upper bound tightens to node.val
        left_ok = yield from self._validate(node.left, lo, node.val, root)
        if not left_ok:
            return False

        # Right subtree: lower bound rises to node.val
        right_ok = yield from self._validate(node.right, node.val, hi, root)
        return right_ok
