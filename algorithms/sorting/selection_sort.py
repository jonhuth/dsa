"""Selection Sort - Sorting by repeatedly selecting minimum element.

Time Complexity:
    Best: O(n²) - no improvement for sorted data
    Average: O(n²)
    Worst: O(n²)

Space Complexity: O(1) - sorts in place

Stability: Not stable (can swap equal elements out of order)

Key Insights:
    - Finds minimum element and places it at beginning
    - Makes exactly n-1 swaps (minimum possible for comparison sort)
    - Good when write operations are expensive (fewer swaps than bubble/insertion)
    - Not adaptive: same performance regardless of input order
    - Simple to understand and implement
"""

from typing import Generator
from algorithms.base import StepTracker, Step, VisualizerType


class SelectionSort(StepTracker):
    """Selection Sort implementation with visualization step tracking."""

    visualizer_type = VisualizerType.ARRAY

    def __init__(self):
        super().__init__()
        self.comparisons = 0
        self.swaps = 0

    def sort(self, arr: list[int]) -> Generator[Step, None, None]:
        """Sort array using selection sort algorithm.

        Args:
            arr: List of integers to sort

        Yields:
            Step objects for visualization
        """
        self.reset()
        self.comparisons = 0
        self.swaps = 0
        n = len(arr)

        yield self.emit_step(
            operation="init",
            description=f"Starting selection sort on array of {n} elements",
            state={"type": "array", "values": arr.copy()},
            highlights=[],
            metadata={
                "comparisons": self.comparisons,
                "swaps": self.swaps,
            },
        )

        for i in range(n - 1):
            min_idx = i

            yield self.emit_step(
                operation="new_pass",
                description=f"Finding minimum element in unsorted portion (starting at {i})",
                state={"type": "array", "values": arr.copy()},
                highlights=[
                    {"indices": list(range(i)), "color": "sorted"},
                    {"indices": [i], "color": "active"},
                ],
                metadata={
                    "comparisons": self.comparisons,
                    "swaps": self.swaps,
                    "current_min": arr[min_idx],
                    "min_idx": min_idx,
                },
            )

            # Find minimum element in unsorted portion
            for j in range(i + 1, n):
                self.comparisons += 1

                yield self.emit_step(
                    operation="compare",
                    description=f"Comparing {arr[j]} with current min {arr[min_idx]}",
                    state={"type": "array", "values": arr.copy()},
                    highlights=[
                        {"indices": list(range(i)), "color": "sorted"},
                        {"indices": [min_idx], "color": "active"},
                        {"indices": [j], "color": "comparing"},
                    ],
                    metadata={
                        "comparisons": self.comparisons,
                        "swaps": self.swaps,
                        "current_min": arr[min_idx],
                        "min_idx": min_idx,
                    },
                )

                if arr[j] < arr[min_idx]:
                    min_idx = j

                    yield self.emit_step(
                        operation="update_min",
                        description=f"Found new minimum: {arr[min_idx]} at index {min_idx}",
                        state={"type": "array", "values": arr.copy()},
                        highlights=[
                            {"indices": list(range(i)), "color": "sorted"},
                            {"indices": [min_idx], "color": "active"},
                        ],
                        metadata={
                            "comparisons": self.comparisons,
                            "swaps": self.swaps,
                            "current_min": arr[min_idx],
                            "min_idx": min_idx,
                        },
                    )

            # Swap minimum element with first element of unsorted portion
            if min_idx != i:
                self.swaps += 1
                arr[i], arr[min_idx] = arr[min_idx], arr[i]

                yield self.emit_step(
                    operation="swap",
                    description=f"Swapping {arr[min_idx]} ↔ {arr[i]} (placing min at position {i})",
                    state={"type": "array", "values": arr.copy()},
                    highlights=[
                        {"indices": [i, min_idx], "color": "swapped"},
                    ],
                    metadata={
                        "comparisons": self.comparisons,
                        "swaps": self.swaps,
                    },
                )

            yield self.emit_step(
                operation="pass_complete",
                description=f"Position {i} now sorted with value {arr[i]}",
                state={"type": "array", "values": arr.copy()},
                highlights=[
                    {"indices": list(range(i + 1)), "color": "sorted"},
                ],
                metadata={
                    "comparisons": self.comparisons,
                    "swaps": self.swaps,
                },
            )

        yield self.emit_step(
            operation="complete",
            description=f"Array sorted! ({self.comparisons} comparisons, {self.swaps} swaps)",
            state={"type": "array", "values": arr.copy()},
            highlights=[{"indices": list(range(n)), "color": "sorted"}],
            metadata={
                "comparisons": self.comparisons,
                "swaps": self.swaps,
            },
        )
