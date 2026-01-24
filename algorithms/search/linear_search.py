"""Linear Search - Simple sequential search.

Time Complexity: O(n)
Space Complexity: O(1)

Key Insights:
    - Works on unsorted arrays
    - Checks each element sequentially
    - Simple but inefficient for large datasets
    - Best when: array is small, unsorted, or target near start
    - Used as baseline for comparison
"""

from typing import Generator
from algorithms.base import StepTracker, Step, VisualizerType


class LinearSearch(StepTracker):
    """Linear Search implementation with visualization."""

    visualizer_type = VisualizerType.ARRAY

    def __init__(self):
        super().__init__()
        self.comparisons = 0

    def search(self, arr: list[int], target: int) -> Generator[Step, None, None]:
        """Search for target in array using linear search.

        Args:
            arr: List of integers (can be unsorted)
            target: Value to find

        Yields:
            Step objects for visualization
        """
        self.reset()
        self.comparisons = 0
        n = len(arr)

        yield self.emit_step(
            operation="init",
            description=f"Searching for {target} in array of {n} elements",
            state={"type": "array", "values": arr.copy()},
            highlights=[],
            metadata={
                "comparisons": self.comparisons,
                "target": target,
            },
        )

        for i in range(n):
            self.comparisons += 1

            yield self.emit_step(
                operation="compare",
                description=f"Checking arr[{i}] = {arr[i]}",
                state={"type": "array", "values": arr.copy()},
                highlights=[
                    {"indices": [i], "color": "comparing"},
                    {"indices": list(range(i)), "color": "visited"},
                ],
                metadata={
                    "comparisons": self.comparisons,
                    "target": target,
                    "current_index": i,
                    "current_value": arr[i],
                },
            )

            if arr[i] == target:
                yield self.emit_step(
                    operation="found",
                    description=f"Found {target} at index {i}!",
                    state={"type": "array", "values": arr.copy()},
                    highlights=[
                        {"indices": [i], "color": "sorted"},
                    ],
                    metadata={
                        "comparisons": self.comparisons,
                        "target": target,
                        "found_index": i,
                    },
                )
                return

        yield self.emit_step(
            operation="not_found",
            description=f"{target} not found in array",
            state={"type": "array", "values": arr.copy()},
            highlights=[
                {"indices": list(range(n)), "color": "visited"},
            ],
            metadata={
                "comparisons": self.comparisons,
                "target": target,
                "found": False,
            },
        )
