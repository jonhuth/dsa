"""Binary Search - Efficient search in sorted arrays.

Time Complexity: O(log n)
Space Complexity: O(1) iterative, O(log n) recursive

Key Insights:
    - Requires sorted array
    - Divides search space in half each iteration
    - Much faster than linear search for large datasets
    - Used in: databases, libraries, standard algorithms
    - Foundation for many other algorithms
"""

from typing import Generator, Optional
from algorithms.base import StepTracker, Step, VisualizerType


class BinarySearch(StepTracker):
    """Binary Search implementation with visualization."""

    visualizer_type = VisualizerType.ARRAY

    def __init__(self):
        super().__init__()
        self.comparisons = 0

    def search(self, arr: list[int], target: int) -> Generator[Step, None, None]:
        """Search for target in sorted array using binary search.

        Args:
            arr: Sorted list of integers
            target: Value to find

        Yields:
            Step objects for visualization
        """
        self.reset()
        self.comparisons = 0
        n = len(arr)

        yield self.emit_step(
            operation="init",
            description=f"Searching for {target} in sorted array of {n} elements",
            state={"type": "array", "values": arr.copy()},
            highlights=[],
            metadata={
                "comparisons": self.comparisons,
                "target": target,
            },
        )

        left = 0
        right = n - 1

        while left <= right:
            mid = (left + right) // 2
            self.comparisons += 1

            yield self.emit_step(
                operation="check_mid",
                description=f"Checking middle element arr[{mid}] = {arr[mid]}",
                state={"type": "array", "values": arr.copy()},
                highlights=[
                    {"indices": [mid], "color": "active"},
                    {"indices": list(range(left, right + 1)), "color": "comparing"},
                ],
                metadata={
                    "comparisons": self.comparisons,
                    "target": target,
                    "left": left,
                    "right": right,
                    "mid": mid,
                    "mid_value": arr[mid],
                },
            )

            if arr[mid] == target:
                yield self.emit_step(
                    operation="found",
                    description=f"Found {target} at index {mid}!",
                    state={"type": "array", "values": arr.copy()},
                    highlights=[
                        {"indices": [mid], "color": "sorted"},
                    ],
                    metadata={
                        "comparisons": self.comparisons,
                        "target": target,
                        "found_index": mid,
                    },
                )
                return

            elif arr[mid] < target:
                yield self.emit_step(
                    operation="search_right",
                    description=f"{arr[mid]} < {target}, search right half",
                    state={"type": "array", "values": arr.copy()},
                    highlights=[
                        {"indices": list(range(mid + 1, right + 1)), "color": "comparing"},
                    ],
                    metadata={
                        "comparisons": self.comparisons,
                        "target": target,
                        "eliminated": f"[{left}..{mid}]",
                    },
                )
                left = mid + 1

            else:
                yield self.emit_step(
                    operation="search_left",
                    description=f"{arr[mid]} > {target}, search left half",
                    state={"type": "array", "values": arr.copy()},
                    highlights=[
                        {"indices": list(range(left, mid)), "color": "comparing"},
                    ],
                    metadata={
                        "comparisons": self.comparisons,
                        "target": target,
                        "eliminated": f"[{mid}..{right}]",
                    },
                )
                right = mid - 1

        yield self.emit_step(
            operation="not_found",
            description=f"{target} not found in array",
            state={"type": "array", "values": arr.copy()},
            highlights=[],
            metadata={
                "comparisons": self.comparisons,
                "target": target,
                "found": False,
            },
        )
