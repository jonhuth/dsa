"""Binary Search Tree - Self-balancing not implemented.

Time Complexity:
    Search/Insert/Delete: O(log n) average, O(n) worst case (unbalanced)

Space Complexity: O(n)

Key Insights:
    - Left subtree < node < right subtree
    - In-order traversal gives sorted sequence
    - Can become unbalanced (degenerates to linked list)
    - Foundation for balanced trees (AVL, Red-Black)
    - Used in: databases, file systems, expression trees
"""

from typing import Generator, Optional, Dict, Any
from algorithms.base import StepTracker, Step, VisualizerType


class TreeNode:
    """Binary tree node."""

    def __init__(self, val: int):
        self.val = val
        self.left: Optional[TreeNode] = None
        self.right: Optional[TreeNode] = None


class BST(StepTracker):
    """Binary Search Tree implementation with visualization."""

    visualizer_type = VisualizerType.TREE

    def __init__(self):
        super().__init__()
        self.root: Optional[TreeNode] = None
        self.comparisons = 0

    def insert(self, values: list[int]) -> Generator[Step, None, None]:
        """Insert values into BST one by one.

        Args:
            values: List of integers to insert

        Yields:
            Step objects for visualization
        """
        self.reset()
        self.comparisons = 0
        self.root = None

        yield self.emit_step(
            operation="init",
            description=f"Building BST from {len(values)} values",
            state={"type": "tree", "tree": self._tree_to_dict()},
            highlights=[],
            metadata={
                "comparisons": self.comparisons,
                "size": 0,
            },
        )

        for value in values:
            yield from self._insert_recursive(value)

        yield self.emit_step(
            operation="complete",
            description=f"BST built with {len(values)} nodes",
            state={"type": "tree", "tree": self._tree_to_dict()},
            highlights=[],
            metadata={
                "comparisons": self.comparisons,
                "size": len(values),
            },
        )

    def _insert_recursive(self, value: int) -> Generator[Step, None, None]:
        """Insert value into BST.

        Args:
            value: Value to insert

        Yields:
            Step objects for visualization
        """
        if self.root is None:
            self.root = TreeNode(value)

            yield self.emit_step(
                operation="insert_root",
                description=f"Inserted {value} as root",
                state={"type": "tree", "tree": self._tree_to_dict()},
                highlights=[{"type": "node", "id": value, "color": "active"}],
                metadata={
                    "comparisons": self.comparisons,
                    "inserted_value": value,
                },
            )
            return

        current = self.root
        path = []

        while True:
            self.comparisons += 1
            path.append(current.val)

            yield self.emit_step(
                operation="compare",
                description=f"Comparing {value} with {current.val}",
                state={"type": "tree", "tree": self._tree_to_dict()},
                highlights=[
                    {"type": "node", "id": current.val, "color": "comparing"},
                    *[{"type": "node", "id": p, "color": "visited"} for p in path[:-1]],
                ],
                metadata={
                    "comparisons": self.comparisons,
                    "comparing_with": current.val,
                },
            )

            if value < current.val:
                if current.left is None:
                    current.left = TreeNode(value)

                    yield self.emit_step(
                        operation="insert_left",
                        description=f"Inserted {value} as left child of {current.val}",
                        state={"type": "tree", "tree": self._tree_to_dict()},
                        highlights=[
                            {"type": "node", "id": value, "color": "active"},
                            {"type": "node", "id": current.val, "color": "sorted"},
                        ],
                        metadata={
                            "comparisons": self.comparisons,
                            "inserted_value": value,
                            "parent": current.val,
                        },
                    )
                    break
                else:
                    current = current.left

            else:
                if current.right is None:
                    current.right = TreeNode(value)

                    yield self.emit_step(
                        operation="insert_right",
                        description=f"Inserted {value} as right child of {current.val}",
                        state={"type": "tree", "tree": self._tree_to_dict()},
                        highlights=[
                            {"type": "node", "id": value, "color": "active"},
                            {"type": "node", "id": current.val, "color": "sorted"},
                        ],
                        metadata={
                            "comparisons": self.comparisons,
                            "inserted_value": value,
                            "parent": current.val,
                        },
                    )
                    break
                else:
                    current = current.right

    def search(self, tree_values: list[int], target: int) -> Generator[Step, None, None]:
        """Search for target in BST.

        Args:
            tree_values: Values to build BST from
            target: Value to find

        Yields:
            Step objects for visualization
        """
        # Build tree first (without yielding steps)
        self.reset()
        self.comparisons = 0
        self.root = None
        for val in tree_values:
            self._insert_silent(val)

        yield self.emit_step(
            operation="init",
            description=f"Searching for {target} in BST",
            state={"type": "tree", "tree": self._tree_to_dict()},
            highlights=[],
            metadata={
                "comparisons": self.comparisons,
                "target": target,
            },
        )

        current = self.root
        path = []

        while current:
            self.comparisons += 1
            path.append(current.val)

            yield self.emit_step(
                operation="compare",
                description=f"Comparing {target} with {current.val}",
                state={"type": "tree", "tree": self._tree_to_dict()},
                highlights=[
                    {"type": "node", "id": current.val, "color": "comparing"},
                    *[{"type": "node", "id": p, "color": "visited"} for p in path[:-1]],
                ],
                metadata={
                    "comparisons": self.comparisons,
                    "target": target,
                    "current": current.val,
                },
            )

            if current.val == target:
                yield self.emit_step(
                    operation="found",
                    description=f"Found {target}!",
                    state={"type": "tree", "tree": self._tree_to_dict()},
                    highlights=[
                        {"type": "node", "id": target, "color": "sorted"},
                        *[{"type": "node", "id": p, "color": "visited"} for p in path[:-1]],
                    ],
                    metadata={
                        "comparisons": self.comparisons,
                        "target": target,
                        "path": path,
                    },
                )
                return

            elif target < current.val:
                current = current.left
            else:
                current = current.right

        yield self.emit_step(
            operation="not_found",
            description=f"{target} not found in BST",
            state={"type": "tree", "tree": self._tree_to_dict()},
            highlights=[
                *[{"type": "node", "id": p, "color": "visited"} for p in path],
            ],
            metadata={
                "comparisons": self.comparisons,
                "target": target,
                "found": False,
            },
        )

    def _insert_silent(self, value: int):
        """Insert without yielding steps (for setup)."""
        if self.root is None:
            self.root = TreeNode(value)
            return

        current = self.root
        while True:
            if value < current.val:
                if current.left is None:
                    current.left = TreeNode(value)
                    break
                current = current.left
            else:
                if current.right is None:
                    current.right = TreeNode(value)
                    break
                current = current.right

    def _tree_to_dict(self) -> Dict[str, Any]:
        """Convert tree to dictionary for visualization."""
        if not self.root:
            return {}

        def node_to_dict(node: Optional[TreeNode]) -> Optional[Dict[str, Any]]:
            if not node:
                return None
            return {
                "val": node.val,
                "left": node_to_dict(node.left),
                "right": node_to_dict(node.right),
            }

        return node_to_dict(self.root)
