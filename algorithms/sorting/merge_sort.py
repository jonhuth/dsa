"""Merge Sort - Stable divide-and-conquer sorting algorithm.

Time Complexity:
    Best: O(n log n)
    Average: O(n log n)
    Worst: O(n log n) - guaranteed, unlike Quick Sort

Space Complexity:
    O(n) - requires extra space for merging

Stability: Stable (preserves relative order of equal elements)

Key Insights:
    - Divide-and-conquer: split array in half, recursively sort, then merge
    - Guaranteed O(n log n) worst case (better than Quick Sort)
    - Stable sorting (maintains relative order of equal elements)
    - Not in-place (requires O(n) extra space)
    - External sorting: great for sorting data that doesn't fit in memory
    - Predictable performance: no worst-case scenarios like Quick Sort
"""

from typing import Generator
from algorithms.base import StepTracker, Step, VisualizerType


class MergeSort(StepTracker):
    """Merge Sort implementation with visualization step tracking."""

    visualizer_type = VisualizerType.ARRAY

    def __init__(self):
        super().__init__()
        self.comparisons = 0
        self.merges = 0
        self.array_accesses = 0

    def sort(self, arr: list[int]) -> Generator[Step, None, None]:
        """Sort array using merge sort algorithm.

        Args:
            arr: List of integers to sort

        Yields:
            Step objects for visualization
        """
        self.reset()
        self.comparisons = 0
        self.merges = 0
        self.array_accesses = 0
        n = len(arr)

        yield self.emit_step(
            operation="init",
            description=f"Starting merge sort on array of {n} elements",
            state={"type": "array", "values": arr.copy()},
            highlights=[],
            metadata={
                "comparisons": self.comparisons,
                "merges": self.merges,
                "array_accesses": self.array_accesses,
            },
        )

        # Perform merge sort recursively
        yield from self._merge_sort_recursive(arr, 0, n - 1)

        yield self.emit_step(
            operation="complete",
            description=f"Array sorted! ({self.comparisons} comparisons, {self.merges} merges, {self.array_accesses} array accesses)",
            state={"type": "array", "values": arr.copy()},
            highlights=[{"indices": list(range(n)), "color": "sorted"}],
            metadata={
                "comparisons": self.comparisons,
                "merges": self.merges,
                "array_accesses": self.array_accesses,
            },
        )

    def _merge_sort_recursive(
        self, arr: list[int], left: int, right: int
    ) -> Generator[Step, None, None]:
        """Recursively sort subarray using merge sort.

        Args:
            arr: Array to sort
            left: Starting index of subarray
            right: Ending index of subarray

        Yields:
            Step objects for visualization
        """
        if left < right:
            mid = (left + right) // 2

            yield self.emit_step(
                operation="split",
                description=f"Splitting array at index {mid}: [{left}..{mid}] and [{mid+1}..{right}]",
                state={"type": "array", "values": arr.copy()},
                highlights=[
                    {"indices": list(range(left, mid + 1)), "color": "comparing"},
                    {"indices": list(range(mid + 1, right + 1)), "color": "active"},
                ],
                metadata={
                    "comparisons": self.comparisons,
                    "merges": self.merges,
                    "array_accesses": self.array_accesses,
                    "left": left,
                    "mid": mid,
                    "right": right,
                },
            )

            # Recursively sort left and right halves
            yield from self._merge_sort_recursive(arr, left, mid)
            yield from self._merge_sort_recursive(arr, mid + 1, right)

            # Merge the sorted halves
            yield from self._merge(arr, left, mid, right)

    def _merge(
        self, arr: list[int], left: int, mid: int, right: int
    ) -> Generator[Step, None, None]:
        """Merge two sorted subarrays into one sorted subarray.

        Args:
            arr: Array containing the subarrays
            left: Starting index of first subarray
            mid: Ending index of first subarray
            right: Ending index of second subarray

        Yields:
            Step objects for visualization
        """
        self.merges += 1

        # Create temp arrays for left and right halves
        left_arr = arr[left : mid + 1].copy()
        right_arr = arr[mid + 1 : right + 1].copy()

        yield self.emit_step(
            operation="merge_start",
            description=f"Merging sorted subarrays [{left}..{mid}] and [{mid+1}..{right}]",
            state={"type": "array", "values": arr.copy()},
            highlights=[
                {"indices": list(range(left, mid + 1)), "color": "comparing"},
                {"indices": list(range(mid + 1, right + 1)), "color": "active"},
            ],
            metadata={
                "comparisons": self.comparisons,
                "merges": self.merges,
                "array_accesses": self.array_accesses,
                "left_subarray": left_arr,
                "right_subarray": right_arr,
            },
        )

        i = 0  # Index for left_arr
        j = 0  # Index for right_arr
        k = left  # Index for merged array

        # Merge arrays by comparing elements
        while i < len(left_arr) and j < len(right_arr):
            self.comparisons += 1
            self.array_accesses += 2

            left_val = left_arr[i]
            right_val = right_arr[j]

            yield self.emit_step(
                operation="compare",
                description=f"Comparing {left_val} (left) with {right_val} (right)",
                state={"type": "array", "values": arr.copy()},
                highlights=[
                    {"indices": [left + i], "color": "comparing"},
                    {"indices": [mid + 1 + j], "color": "active"},
                ],
                metadata={
                    "comparisons": self.comparisons,
                    "merges": self.merges,
                    "array_accesses": self.array_accesses,
                },
            )

            if left_val <= right_val:
                arr[k] = left_val
                self.array_accesses += 1

                yield self.emit_step(
                    operation="place",
                    description=f"Placing {left_val} from left subarray at position {k}",
                    state={"type": "array", "values": arr.copy()},
                    highlights=[{"indices": [k], "color": "swapped"}],
                    metadata={
                        "comparisons": self.comparisons,
                        "merges": self.merges,
                        "array_accesses": self.array_accesses,
                    },
                )

                i += 1
            else:
                arr[k] = right_val
                self.array_accesses += 1

                yield self.emit_step(
                    operation="place",
                    description=f"Placing {right_val} from right subarray at position {k}",
                    state={"type": "array", "values": arr.copy()},
                    highlights=[{"indices": [k], "color": "swapped"}],
                    metadata={
                        "comparisons": self.comparisons,
                        "merges": self.merges,
                        "array_accesses": self.array_accesses,
                    },
                )

                j += 1

            k += 1

        # Copy remaining elements from left subarray (if any)
        while i < len(left_arr):
            self.array_accesses += 2
            arr[k] = left_arr[i]

            yield self.emit_step(
                operation="place_remaining",
                description=f"Placing remaining {left_arr[i]} from left subarray at position {k}",
                state={"type": "array", "values": arr.copy()},
                highlights=[{"indices": [k], "color": "swapped"}],
                metadata={
                    "comparisons": self.comparisons,
                    "merges": self.merges,
                    "array_accesses": self.array_accesses,
                },
            )

            i += 1
            k += 1

        # Copy remaining elements from right subarray (if any)
        while j < len(right_arr):
            self.array_accesses += 2
            arr[k] = right_arr[j]

            yield self.emit_step(
                operation="place_remaining",
                description=f"Placing remaining {right_arr[j]} from right subarray at position {k}",
                state={"type": "array", "values": arr.copy()},
                highlights=[{"indices": [k], "color": "swapped"}],
                metadata={
                    "comparisons": self.comparisons,
                    "merges": self.merges,
                    "array_accesses": self.array_accesses,
                },
            )

            j += 1
            k += 1

        # Merge complete
        yield self.emit_step(
            operation="merge_complete",
            description=f"Merge complete for range [{left}..{right}]",
            state={"type": "array", "values": arr.copy()},
            highlights=[{"indices": list(range(left, right + 1)), "color": "sorted"}],
            metadata={
                "comparisons": self.comparisons,
                "merges": self.merges,
                "array_accesses": self.array_accesses,
            },
        )
