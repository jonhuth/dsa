"""Lowest Common Ancestor (BST) - Find the deepest node that is an ancestor of both p and q.

The Lowest Common Ancestor (LCA) of two nodes ``p`` and ``q`` is the deepest
node in the tree that has *both* of them as descendants (a node is allowed to be
a descendant of itself). In a general binary tree this needs a full search, but a
Binary Search Tree gives us a shortcut: the ordering property tells us which way
to walk. Starting at the root, if both ``p`` and ``q`` are smaller than the
current node they must live in the left subtree; if both are larger, the right
subtree. The moment they *split* - one on each side, or one equals the current
node - the current node is the lowest common ancestor. No backtracking, no extra
storage: a single top-down walk.

Time Complexity:
    Best: O(1) - root is already the split point (p and q straddle the root)
    Average: O(log n) - one comparison per level of a balanced BST
    Worst: O(n) - degenerate/skewed tree collapses to a linked list

Space Complexity: O(1) - iterative descent keeps only a pointer to the current
    node (O(h) if written recursively for the call stack).

Key Insights:
    - The BST ordering is a built-in decision function: compare both targets to
      the current node and the sign tells you left, right, or "you're the LCA".
    - The LCA is exactly the first (highest) node where p and q diverge - where
      one is <= node and the other is >= node. Before that they share the path.
    - A node can be the ancestor of itself: if p (or q) equals the current node,
      that node is the LCA immediately.
    - Because each step drops a whole subtree, the walk is O(h) - the tree's
      height - which is what makes the BST version so much cheaper than the
      general-binary-tree LCA.
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


class LowestCommonAncestor(StepTracker):
    """Find the lowest common ancestor of two nodes in a BST via top-down descent."""

    visualizer_type = VisualizerType.TREE

    def __init__(self):
        super().__init__()
        self.path: list[int] = []

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

    def _descent_highlights(self, current: int, p: int, q: int) -> list[dict]:
        """Green for the path already walked, blue for the current node, yellow for targets."""
        highlights: list[dict] = [
            {"type": "node", "id": v, "color": "sorted"} for v in self.path if v != current
        ]
        highlights.append({"type": "node", "id": current, "color": "active"})
        # Mark the two targets so learners can see where we are heading.
        for target in (p, q):
            if target != current and target not in self.path:
                highlights.append({"type": "node", "id": target, "color": "comparing"})
        return highlights

    def run(self, input_data) -> Generator[Step, None, None]:
        """Find the LCA of p and q in a BST, emitting a step per node on the descent.

        Args:
            input_data: dict ``{"values": [...], "p": int, "q": int}`` where
                ``values`` is a level-order list (``None`` for missing nodes) that
                forms a BST, and ``p``/``q`` are the two node values to find the
                lowest common ancestor of.
        """
        self.reset()
        self.path = []

        values = input_data["values"]
        p = input_data["p"]
        q = input_data["q"]
        root = self._build_tree_from_list(values)
        tree_dict = self._tree_to_dict(root)

        yield self.emit_step(
            operation="init",
            description=(
                f"Find the Lowest Common Ancestor of {p} and {q}. Start at the root "
                "and use the BST ordering to walk down: if both targets are smaller "
                "go left, if both are larger go right, otherwise we have found it."
            ),
            state={"type": "tree", "tree": tree_dict},
            highlights=[
                {"type": "node", "id": p, "color": "comparing"},
                {"type": "node", "id": q, "color": "comparing"},
            ],
            metadata={"p": p, "q": q, "current": None},
        )

        node = root
        lca: TreeNode | None = None

        while node is not None:
            self.path.append(node.val)

            if p < node.val and q < node.val:
                yield self.emit_step(
                    operation="go_left",
                    description=(
                        f"Both {p} and {q} are less than {node.val}, so the LCA must be "
                        f"in the left subtree. Move left from {node.val}."
                    ),
                    state={"type": "tree", "tree": tree_dict},
                    highlights=self._descent_highlights(node.val, p, q),
                    metadata={"p": p, "q": q, "current": node.val, "direction": "left"},
                )
                node = node.left
            elif p > node.val and q > node.val:
                yield self.emit_step(
                    operation="go_right",
                    description=(
                        f"Both {p} and {q} are greater than {node.val}, so the LCA must "
                        f"be in the right subtree. Move right from {node.val}."
                    ),
                    state={"type": "tree", "tree": tree_dict},
                    highlights=self._descent_highlights(node.val, p, q),
                    metadata={"p": p, "q": q, "current": node.val, "direction": "right"},
                )
                node = node.right
            else:
                # Split point: p and q diverge here (or one equals node.val).
                lca = node
                yield self.emit_step(
                    operation="found",
                    description=(
                        f"{p} and {q} split at {node.val} (one is <= it, the other >= it), "
                        f"so {node.val} is their lowest common ancestor - the highest node "
                        "whose subtrees still contain both targets."
                    ),
                    state={"type": "tree", "tree": tree_dict},
                    highlights=self._descent_highlights(node.val, p, q),
                    metadata={"p": p, "q": q, "current": node.val, "direction": "split"},
                )
                break

        lca_val = lca.val if lca is not None else None
        complete_highlights: list[dict] = [
            {"type": "node", "id": v, "color": "sorted"}
            for v in self.path
            if v != lca_val and v != p and v != q
        ]
        for target in (p, q):
            if target != lca_val:
                complete_highlights.append({"type": "node", "id": target, "color": "comparing"})
        if lca_val is not None:
            complete_highlights.append({"type": "node", "id": lca_val, "color": "active"})

        yield self.emit_step(
            operation="complete",
            description=(
                f"Done. The lowest common ancestor of {p} and {q} is {lca_val}. "
                f"We reached it in {len(self.path)} step(s) by following the BST "
                "ordering straight down - no backtracking needed."
            ),
            state={"type": "tree", "tree": tree_dict},
            highlights=complete_highlights,
            metadata={"p": p, "q": q, "current": lca_val, "lca": lca_val},
        )
