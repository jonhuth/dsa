"""Binary Tree Traversals - In-order, Pre-order, Post-order, Level-order.

Time Complexity: O(n) where n = number of nodes
Space Complexity: O(h) for recursion stack where h = height

Key Insights:
    - In-order (Left-Root-Right): Gives sorted sequence for BST
    - Pre-order (Root-Left-Right): Useful for creating copy of tree
    - Post-order (Left-Right-Root): Useful for deleting tree
    - Level-order (BFS): Layer by layer, uses queue
    - All visit each node exactly once - O(n) time
"""

from typing import Generator, Optional
from collections import deque
from algorithms.base import StepTracker, Step, VisualizerType


class TreeNode:
    """Binary tree node."""

    def __init__(self, val: int):
        self.val = val
        self.left: Optional[TreeNode] = None
        self.right: Optional[TreeNode] = None


class TreeTraversals(StepTracker):
    """Binary tree traversals with visualization."""

    visualizer_type = VisualizerType.TREE

    def __init__(self):
        super().__init__()
        self.traversal_order = []

    def _build_tree_from_list(self, values: list[int | None]) -> Optional[TreeNode]:
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

    def _tree_to_dict(self, node: Optional[TreeNode]) -> dict | None:
        """Convert tree to dict for visualization."""
        if not node:
            return None
        return {
            "val": node.val,
            "left": self._tree_to_dict(node.left),
            "right": self._tree_to_dict(node.right),
        }

    def inorder(self, values: list[int | None]) -> Generator[Step, None, None]:
        """In-order traversal (Left-Root-Right)."""
        self.reset()
        self.traversal_order = []
        root = self._build_tree_from_list(values)

        yield self.emit_step(
            operation="init",
            description="In-order traversal: Left → Root → Right",
            state={"type": "tree", "tree": self._tree_to_dict(root)},
            highlights=[],
            metadata={"traversal_type": "inorder", "order": []},
        )

        yield from self._inorder_helper(root, root)

        yield self.emit_step(
            operation="complete",
            description=f"In-order complete: {self.traversal_order}",
            state={"type": "tree", "tree": self._tree_to_dict(root)},
            highlights=[],
            metadata={"traversal_type": "inorder", "order": self.traversal_order},
        )

    def _inorder_helper(
        self, node: Optional[TreeNode], root: TreeNode
    ) -> Generator[Step, None, None]:
        """Recursive in-order helper."""
        if not node:
            return

        # Visit left subtree
        if node.left:
            yield self.emit_step(
                operation="traverse_left",
                description=f"Going left from {node.val} to {node.left.val}",
                state={"type": "tree", "tree": self._tree_to_dict(root)},
                highlights=[
                    {"type": "node", "id": node.val, "color": "active"},
                    {"type": "node", "id": node.left.val, "color": "comparing"},
                ],
                metadata={"current": node.val, "order": self.traversal_order.copy()},
            )
            yield from self._inorder_helper(node.left, root)

        # Visit root
        self.traversal_order.append(node.val)
        yield self.emit_step(
            operation="visit",
            description=f"Visit {node.val}",
            state={"type": "tree", "tree": self._tree_to_dict(root)},
            highlights=[{"type": "node", "id": node.val, "color": "sorted"}],
            metadata={"current": node.val, "order": self.traversal_order.copy()},
        )

        # Visit right subtree
        if node.right:
            yield self.emit_step(
                operation="traverse_right",
                description=f"Going right from {node.val} to {node.right.val}",
                state={"type": "tree", "tree": self._tree_to_dict(root)},
                highlights=[
                    {"type": "node", "id": node.val, "color": "sorted"},
                    {"type": "node", "id": node.right.val, "color": "comparing"},
                ],
                metadata={"current": node.val, "order": self.traversal_order.copy()},
            )
            yield from self._inorder_helper(node.right, root)

    def preorder(self, values: list[int | None]) -> Generator[Step, None, None]:
        """Pre-order traversal (Root-Left-Right)."""
        self.reset()
        self.traversal_order = []
        root = self._build_tree_from_list(values)

        yield self.emit_step(
            operation="init",
            description="Pre-order traversal: Root → Left → Right",
            state={"type": "tree", "tree": self._tree_to_dict(root)},
            highlights=[],
            metadata={"traversal_type": "preorder", "order": []},
        )

        yield from self._preorder_helper(root, root)

        yield self.emit_step(
            operation="complete",
            description=f"Pre-order complete: {self.traversal_order}",
            state={"type": "tree", "tree": self._tree_to_dict(root)},
            highlights=[],
            metadata={"traversal_type": "preorder", "order": self.traversal_order},
        )

    def _preorder_helper(
        self, node: Optional[TreeNode], root: TreeNode
    ) -> Generator[Step, None, None]:
        """Recursive pre-order helper."""
        if not node:
            return

        # Visit root first
        self.traversal_order.append(node.val)
        yield self.emit_step(
            operation="visit",
            description=f"Visit {node.val}",
            state={"type": "tree", "tree": self._tree_to_dict(root)},
            highlights=[{"type": "node", "id": node.val, "color": "sorted"}],
            metadata={"current": node.val, "order": self.traversal_order.copy()},
        )

        # Visit left subtree
        if node.left:
            yield self.emit_step(
                operation="traverse_left",
                description=f"Going left from {node.val} to {node.left.val}",
                state={"type": "tree", "tree": self._tree_to_dict(root)},
                highlights=[
                    {"type": "node", "id": node.val, "color": "sorted"},
                    {"type": "node", "id": node.left.val, "color": "comparing"},
                ],
                metadata={"current": node.val, "order": self.traversal_order.copy()},
            )
            yield from self._preorder_helper(node.left, root)

        # Visit right subtree
        if node.right:
            yield self.emit_step(
                operation="traverse_right",
                description=f"Going right from {node.val} to {node.right.val}",
                state={"type": "tree", "tree": self._tree_to_dict(root)},
                highlights=[
                    {"type": "node", "id": node.val, "color": "sorted"},
                    {"type": "node", "id": node.right.val, "color": "comparing"},
                ],
                metadata={"current": node.val, "order": self.traversal_order.copy()},
            )
            yield from self._preorder_helper(node.right, root)

    def postorder(self, values: list[int | None]) -> Generator[Step, None, None]:
        """Post-order traversal (Left-Right-Root)."""
        self.reset()
        self.traversal_order = []
        root = self._build_tree_from_list(values)

        yield self.emit_step(
            operation="init",
            description="Post-order traversal: Left → Right → Root",
            state={"type": "tree", "tree": self._tree_to_dict(root)},
            highlights=[],
            metadata={"traversal_type": "postorder", "order": []},
        )

        yield from self._postorder_helper(root, root)

        yield self.emit_step(
            operation="complete",
            description=f"Post-order complete: {self.traversal_order}",
            state={"type": "tree", "tree": self._tree_to_dict(root)},
            highlights=[],
            metadata={"traversal_type": "postorder", "order": self.traversal_order},
        )

    def _postorder_helper(
        self, node: Optional[TreeNode], root: TreeNode
    ) -> Generator[Step, None, None]:
        """Recursive post-order helper."""
        if not node:
            return

        # Visit left subtree
        if node.left:
            yield self.emit_step(
                operation="traverse_left",
                description=f"Going left from {node.val} to {node.left.val}",
                state={"type": "tree", "tree": self._tree_to_dict(root)},
                highlights=[
                    {"type": "node", "id": node.val, "color": "active"},
                    {"type": "node", "id": node.left.val, "color": "comparing"},
                ],
                metadata={"current": node.val, "order": self.traversal_order.copy()},
            )
            yield from self._postorder_helper(node.left, root)

        # Visit right subtree
        if node.right:
            yield self.emit_step(
                operation="traverse_right",
                description=f"Going right from {node.val} to {node.right.val}",
                state={"type": "tree", "tree": self._tree_to_dict(root)},
                highlights=[
                    {"type": "node", "id": node.val, "color": "active"},
                    {"type": "node", "id": node.right.val, "color": "comparing"},
                ],
                metadata={"current": node.val, "order": self.traversal_order.copy()},
            )
            yield from self._postorder_helper(node.right, root)

        # Visit root last
        self.traversal_order.append(node.val)
        yield self.emit_step(
            operation="visit",
            description=f"Visit {node.val}",
            state={"type": "tree", "tree": self._tree_to_dict(root)},
            highlights=[{"type": "node", "id": node.val, "color": "sorted"}],
            metadata={"current": node.val, "order": self.traversal_order.copy()},
        )
