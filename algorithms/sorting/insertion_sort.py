"""Insertion Sort - Simple sorting by inserting elements into sorted portion.

Time Complexity:
    Best: O(n) - when array is already sorted
    Average: O(n²)
    Worst: O(n²) - when array is reverse sorted

Space Complexity: O(1) - sorts in place

Stability: Stable (preserves relative order of equal elements)

Key Insights:
    - Builds sorted array one element at a time
    - Efficient for small datasets or nearly sorted data
    - Online algorithm: can sort data as it's received
    - Adaptive: performance improves with partially sorted data
    - Simple implementation, good for learning
"""

from typing import Generator
from algorithms.base import StepTracker, Step, VisualizerType


class InsertionSort(StepTracker):
    """Insertion Sort implementation with visualization step tracking."""

    visualizer_type = VisualizerType.ARRAY

    def __init__(self):
        super().__init__()
        self.comparisons = 0
        self.swaps = 0
        self.shifts = 0

    def sort(self, arr: list[int]) -> Generator[Step, None, None]:
        """Sort array using insertion sort algorithm.

        Args:
            arr: List of integers to sort

        Yields:
            Step objects for visualization
        """
        self.reset()
        self.comparisons = 0
        self.swaps = 0
        self.shifts = 0
        n = len(arr)

        yield self.emit_step(
            operation="init",
            description=f"Starting insertion sort on array of {n} elements",
            state={"type": "array", "values": arr.copy()},
            highlights=[{"indices": [0], "color": "sorted"}] if n > 0 else [],
            metadata={
                "comparisons": self.comparisons,
                "swaps": self.swaps,
                "shifts": self.shifts,
            },
        )

        # First element is already "sorted"
        for i in range(1, n):
            key = arr[i]

            yield self.emit_step(
                operation="select",
                description=f"Selecting {key} to insert into sorted portion",
                state={"type": "array", "values": arr.copy()},
                highlights=[
                    {"indices": list(range(i)), "color": "sorted"},
                    {"indices": [i], "color": "active"},
                ],
                metadata={
                    "comparisons": self.comparisons,
                    "swaps": self.swaps,
                    "shifts": self.shifts,
                    "key": key,
                    "position": i,
                },
            )

            j = i - 1

            # Move elements greater than key one position ahead
            while j >= 0:
                self.comparisons += 1

                yield self.emit_step(
                    operation="compare",
                    description=f"Comparing {key} with {arr[j]}",
                    state={"type": "array", "values": arr.copy()},
                    highlights=[
                        {"indices": [j], "color": "comparing"},
                        {"indices": [j + 1], "color": "active"},
                    ],
                    metadata={
                        "comparisons": self.comparisons,
                        "swaps": self.swaps,
                        "shifts": self.shifts,
                        "key": key,
                    },
                )

                if arr[j] > key:
                    self.shifts += 1
                    arr[j + 1] = arr[j]

                    yield self.emit_step(
                        operation="shift",
                        description=f"Shifting {arr[j]} right (from {j} to {j+1})",
                        state={"type": "array", "values": arr.copy()},
                        highlights=[
                            {"indices": [j + 1], "color": "swapped"},
                        ],
                        metadata={
                            "comparisons": self.comparisons,
                            "swaps": self.swaps,
                            "shifts": self.shifts,
                            "key": key,
                        },
                    )

                    j -= 1
                else:
                    break

            # Insert key at correct position
            arr[j + 1] = key

            yield self.emit_step(
                operation="insert",
                description=f"Inserting {key} at position {j+1}",
                state={"type": "array", "values": arr.copy()},
                highlights=[
                    {"indices": list(range(i + 1)), "color": "sorted"},
                ],
                metadata={
                    "comparisons": self.comparisons,
                    "swaps": self.swaps,
                    "shifts": self.shifts,
                    "key": key,
                    "final_position": j + 1,
                },
            )

        yield self.emit_step(
            operation="complete",
            description=f"Array sorted! ({self.comparisons} comparisons, {self.shifts} shifts)",
            state={"type": "array", "values": arr.copy()},
            highlights=[{"indices": list(range(n)), "color": "sorted"}],
            metadata={
                "comparisons": self.comparisons,
                "swaps": self.swaps,
                "shifts": self.shifts,
            },
        )
