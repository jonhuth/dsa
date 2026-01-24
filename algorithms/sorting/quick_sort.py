"""Quick Sort - Efficient divide-and-conquer sorting algorithm.

Time Complexity:
    Best: O(n log n) - balanced partitions
    Average: O(n log n)
    Worst: O(n²) - already sorted with poor pivot selection

Space Complexity:
    O(log n) - recursion stack for balanced partitions
    O(n) - worst case recursion depth

Stability: Not stable (relative order of equal elements may change)

Key Insights:
    - Divide-and-conquer: partition around pivot, recursively sort subarrays
    - In-place sorting with O(log n) extra space for recursion
    - Pivot selection affects performance (median-of-three helps avoid worst case)
    - Cache-friendly due to in-place nature
    - Often fastest in practice despite O(n²) worst case
"""

from typing import Generator
from algorithms.base import StepTracker, Step, VisualizerType


class QuickSort(StepTracker):
    """Quick Sort implementation with visualization step tracking."""

    visualizer_type = VisualizerType.ARRAY

    def __init__(self):
        super().__init__()
        self.comparisons = 0
        self.swaps = 0
        self.partitions = 0

    def sort(self, arr: list[int]) -> Generator[Step, None, None]:
        """Sort array using quick sort algorithm.

        Args:
            arr: List of integers to sort

        Yields:
            Step objects for visualization
        """
        self.reset()
        self.comparisons = 0
        self.swaps = 0
        self.partitions = 0
        n = len(arr)

        yield self.emit_step(
            operation="init",
            description=f"Starting quick sort on array of {n} elements",
            state={"type": "array", "values": arr.copy()},
            highlights=[],
            metadata={
                "comparisons": self.comparisons,
                "swaps": self.swaps,
                "partitions": self.partitions,
            },
        )

        # Perform quick sort recursively
        yield from self._quick_sort_recursive(arr, 0, n - 1)

        yield self.emit_step(
            operation="complete",
            description=f"Array sorted! ({self.comparisons} comparisons, {self.swaps} swaps, {self.partitions} partitions)",
            state={"type": "array", "values": arr.copy()},
            highlights=[{"indices": list(range(n)), "color": "sorted"}],
            metadata={
                "comparisons": self.comparisons,
                "swaps": self.swaps,
                "partitions": self.partitions,
            },
        )

    def _quick_sort_recursive(
        self, arr: list[int], low: int, high: int
    ) -> Generator[Step, None, None]:
        """Recursively sort subarray using quick sort.

        Args:
            arr: Array to sort
            low: Starting index of subarray
            high: Ending index of subarray

        Yields:
            Step objects for visualization
        """
        if low < high:
            # Partition and get pivot index
            yield from self._partition(arr, low, high)
            pivot_idx = self._last_pivot_idx

            # Recursively sort left and right subarrays
            yield from self._quick_sort_recursive(arr, low, pivot_idx - 1)
            yield from self._quick_sort_recursive(arr, pivot_idx + 1, high)

    def _partition(
        self, arr: list[int], low: int, high: int
    ) -> Generator[Step, None, None]:
        """Partition array around pivot element.

        Uses last element as pivot. Elements <= pivot go to left,
        elements > pivot go to right.

        Args:
            arr: Array to partition
            low: Starting index
            high: Ending index (pivot)

        Yields:
            Step objects for visualization
        """
        self.partitions += 1
        pivot = arr[high]

        yield self.emit_step(
            operation="select_pivot",
            description=f"Selected pivot: {pivot} (index {high})",
            state={"type": "array", "values": arr.copy()},
            highlights=[
                {"indices": [high], "color": "active"},
                {"indices": list(range(low, high + 1)), "color": "comparing"},
            ],
            metadata={
                "comparisons": self.comparisons,
                "swaps": self.swaps,
                "partitions": self.partitions,
                "pivot": pivot,
                "pivot_idx": high,
            },
        )

        i = low - 1  # Index of smaller element

        for j in range(low, high):
            self.comparisons += 1

            highlights_list = [
                {"indices": [j], "color": "comparing"},
                {"indices": [high], "color": "active"},
            ]
            if i >= low:
                highlights_list.append(
                    {"indices": list(range(low, i + 1)), "color": "sorted"}
                )

            yield self.emit_step(
                operation="compare",
                description=f"Comparing {arr[j]} with pivot {pivot}",
                state={"type": "array", "values": arr.copy()},
                highlights=highlights_list,
                metadata={
                    "comparisons": self.comparisons,
                    "swaps": self.swaps,
                    "partitions": self.partitions,
                    "pivot": pivot,
                },
            )

            if arr[j] <= pivot:
                i += 1

                if i != j:
                    self.swaps += 1
                    arr[i], arr[j] = arr[j], arr[i]

                    yield self.emit_step(
                        operation="swap",
                        description=f"Swapped {arr[j]} ↔ {arr[i]} (moving ≤ pivot to left)",
                        state={"type": "array", "values": arr.copy()},
                        highlights=[
                            {"indices": [i, j], "color": "swapped"},
                            {"indices": [high], "color": "active"},
                        ],
                        metadata={
                            "comparisons": self.comparisons,
                            "swaps": self.swaps,
                            "partitions": self.partitions,
                            "pivot": pivot,
                        },
                    )

        # Place pivot in correct position
        self.swaps += 1
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        pivot_final_idx = i + 1
        self._last_pivot_idx = pivot_final_idx

        highlights_list = [{"indices": [pivot_final_idx], "color": "sorted"}]
        if pivot_final_idx > low:
            highlights_list.append(
                {"indices": list(range(low, pivot_final_idx)), "color": "comparing"}
            )
        if pivot_final_idx < high:
            highlights_list.append(
                {"indices": list(range(pivot_final_idx + 1, high + 1)), "color": "comparing"}
            )

        yield self.emit_step(
            operation="pivot_placed",
            description=f"Placed pivot {pivot} at final position {pivot_final_idx}",
            state={"type": "array", "values": arr.copy()},
            highlights=highlights_list,
            metadata={
                "comparisons": self.comparisons,
                "swaps": self.swaps,
                "partitions": self.partitions,
                "pivot": pivot,
                "pivot_final_idx": pivot_final_idx,
            },
        )
