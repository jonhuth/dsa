"""Binary Tree Level-Order Traversal (BFS) - Visit nodes level by level.

Level-order traversal walks a binary tree breadth-first: it visits the root,
then every node at depth 1 (left to right), then every node at depth 2, and so
on. The natural tool is a FIFO queue - dequeue a node, record it, and enqueue
its children. Because a queue preserves insertion order, nodes come back out in
exactly the order they should be visited. Tracking the queue size at the start of
each round lets you carve the flat stream of nodes into per-level groups, which
is what turns a plain BFS into the classic "list of levels" result.

Time Complexity:
    Best: O(n) - every node is enqueued and dequeued exactly once
    Average: O(n) - each node visited once
    Worst: O(n) - full traversal regardless of shape

Space Complexity: O(n) - the queue holds up to a full level of nodes; the
    widest level of a balanced tree is ~n/2 nodes, so the queue is O(n).

Key Insights:
    - A FIFO queue is what makes traversal breadth-first: children enqueued now
      are only visited after every node already waiting, so order = depth order.
    - Snapshot the queue length before each round - that count is exactly the
      number of nodes on the current level, letting you group them cleanly.
    - Left child is always enqueued before the right child, which preserves the
      left-to-right order within every level.
    - Swap the queue for a stack (LIFO) and the very same skeleton becomes a
      depth-first traversal - the data structure alone dictates the strategy.
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


class LevelOrder(StepTracker):
    """Level-order (BFS) traversal of a binary tree with per-level grouping."""

    visualizer_type = VisualizerType.TREE

    def __init__(self):
        super().__init__()
        self.visited: list[int] = []
        self.levels: list[list[int]] = []

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

    def _highlights(self, current: int | None) -> list[dict]:
        """Green for already-visited nodes, blue for the node being visited."""
        highlights: list[dict] = [
            {"type": "node", "id": v, "color": "sorted"} for v in self.visited
        ]
        if current is not None:
            highlights.append({"type": "node", "id": current, "color": "active"})
        return highlights

    def run(self, input_data) -> Generator[Step, None, None]:
        """Traverse a tree level-by-level, emitting a step per node dequeued.

        Args:
            input_data: level-order values as a ``list`` (use ``None`` for
                missing nodes) or a dict ``{"values": [...]}``.
        """
        self.reset()
        self.visited = []
        self.levels = []

        values = input_data["values"] if isinstance(input_data, dict) else input_data
        root = self._build_tree_from_list(values)
        tree_dict = self._tree_to_dict(root)

        yield self.emit_step(
            operation="init",
            description=(
                "Level-order (BFS) traversal: visit nodes depth by depth using a "
                "FIFO queue. Seed the queue with the root, then repeatedly dequeue a "
                "node, record it, and enqueue its children."
            ),
            state={"type": "tree", "tree": tree_dict},
            highlights=[],
            metadata={
                "current": None,
                "current_level": None,
                "level_values": [],
                "order": [],
                "levels": [],
                "queue": [] if root is None else [root.val],
            },
        )

        if root is None:
            yield self.emit_step(
                operation="complete",
                description="Empty tree - nothing to traverse. Result: []",
                state={"type": "tree", "tree": tree_dict},
                highlights=[],
                metadata={
                    "current": None,
                    "current_level": None,
                    "level_values": [],
                    "order": [],
                    "levels": [],
                    "queue": [],
                },
            )
            return

        queue: deque[TreeNode] = deque([root])
        level_index = 0

        while queue:
            level_size = len(queue)
            level_values: list[int] = []

            yield self.emit_step(
                operation="level_start",
                description=(
                    f"Start level {level_index}: the queue currently holds "
                    f"{level_size} node(s). Snapshot that count - those are exactly "
                    f"the nodes on this level."
                ),
                state={"type": "tree", "tree": tree_dict},
                highlights=self._highlights(None),
                metadata={
                    "current": None,
                    "current_level": level_index,
                    "level_values": [],
                    "order": self.visited.copy(),
                    "levels": [lvl.copy() for lvl in self.levels],
                    "queue": [n.val for n in queue],
                },
            )

            for _ in range(level_size):
                node = queue.popleft()
                self.visited.append(node.val)
                level_values.append(node.val)

                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)

                children = [c.val for c in (node.left, node.right) if c]
                child_str = (
                    f"enqueue its child(ren) {children}"
                    if children
                    else "it has no children to enqueue"
                )

                yield self.emit_step(
                    operation="visit",
                    description=(
                        f"Dequeue {node.val} (level {level_index}) and record it, then {child_str}."
                    ),
                    state={"type": "tree", "tree": tree_dict},
                    highlights=self._highlights(node.val),
                    metadata={
                        "current": node.val,
                        "current_level": level_index,
                        "level_values": level_values.copy(),
                        "order": self.visited.copy(),
                        "levels": [lvl.copy() for lvl in self.levels],
                        "queue": [n.val for n in queue],
                    },
                )

            self.levels.append(level_values)

            yield self.emit_step(
                operation="level_end",
                description=(
                    f"Finished level {level_index}: {level_values}. Every node on this "
                    f"depth has been visited left-to-right."
                ),
                state={"type": "tree", "tree": tree_dict},
                highlights=self._highlights(None),
                metadata={
                    "current": None,
                    "current_level": level_index,
                    "level_values": level_values.copy(),
                    "order": self.visited.copy(),
                    "levels": [lvl.copy() for lvl in self.levels],
                    "queue": [n.val for n in queue],
                },
            )

            level_index += 1

        yield self.emit_step(
            operation="complete",
            description=(
                f"Level-order traversal complete. Result (grouped by level): "
                f"{self.levels}. Flat visit order: {self.visited}."
            ),
            state={"type": "tree", "tree": tree_dict},
            highlights=self._highlights(None),
            metadata={
                "current": None,
                "current_level": None,
                "level_values": [],
                "order": self.visited.copy(),
                "levels": [lvl.copy() for lvl in self.levels],
                "queue": [],
            },
        )
