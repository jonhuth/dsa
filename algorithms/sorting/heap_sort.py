"""Heap Sort - Sorting using binary heap data structure.

Time Complexity:
    Best: O(n log n)
    Average: O(n log n)
    Worst: O(n log n) - guaranteed like Merge Sort

Space Complexity: O(1) - sorts in place

Stability: Not stable (heap operations can reorder equal elements)

Key Insights:
    - Uses binary heap data structure (max heap for ascending sort)
    - Two phases: heapify (build heap) and extract (repeatedly remove max)
    - In-place with O(n log n) guarantee (unlike Quick Sort)
    - Not cache-friendly due to non-sequential access patterns
    - Commonly used in priority queues
"""

from typing import Generator
from algorithms.base import StepTracker, Step, VisualizerType


class HeapSort(StepTracker):
    """Heap Sort implementation with visualization step tracking."""

    visualizer_type = VisualizerType.ARRAY

    def __init__(self):
        super().__init__()
        self.comparisons = 0
        self.swaps = 0
        self.heapify_calls = 0

    def sort(self, arr: list[int]) -> Generator[Step, None, None]:
        """Sort array using heap sort algorithm.

        Args:
            arr: List of integers to sort

        Yields:
            Step objects for visualization
        """
        self.reset()
        self.comparisons = 0
        self.swaps = 0
        self.heapify_calls = 0
        n = len(arr)

        yield self.emit_step(
            operation="init",
            description=f"Starting heap sort on array of {n} elements",
            state={"type": "array", "values": arr.copy()},
            highlights=[],
            metadata={
                "comparisons": self.comparisons,
                "swaps": self.swaps,
                "heapify_calls": self.heapify_calls,
            },
        )

        # Build max heap (heapify phase)
        yield self.emit_step(
            operation="build_heap_start",
            description="Building max heap from array",
            state={"type": "array", "values": arr.copy()},
            highlights=[],
            metadata={
                "comparisons": self.comparisons,
                "swaps": self.swaps,
                "heapify_calls": self.heapify_calls,
            },
        )

        # Start from last non-leaf node and heapify
        for i in range(n // 2 - 1, -1, -1):
            yield from self._heapify(arr, n, i)

        yield self.emit_step(
            operation="build_heap_complete",
            description="Max heap built! Largest element is at root",
            state={"type": "array", "values": arr.copy()},
            highlights=[{"indices": [0], "color": "active"}],
            metadata={
                "comparisons": self.comparisons,
                "swaps": self.swaps,
                "heapify_calls": self.heapify_calls,
            },
        )

        # Extract elements from heap one by one (sorting phase)
        for i in range(n - 1, 0, -1):
            # Move current root to end (largest element to sorted position)
            self.swaps += 1
            arr[0], arr[i] = arr[i], arr[0]

            yield self.emit_step(
                operation="extract_max",
                description=f"Extracting max {arr[i]} to position {i}",
                state={"type": "array", "values": arr.copy()},
                highlights=[
                    {"indices": [0, i], "color": "swapped"},
                    {"indices": list(range(i + 1, n)), "color": "sorted"},
                ],
                metadata={
                    "comparisons": self.comparisons,
                    "swaps": self.swaps,
                    "heapify_calls": self.heapify_calls,
                    "heap_size": i,
                },
            )

            # Heapify reduced heap
            yield from self._heapify(arr, i, 0)

        yield self.emit_step(
            operation="complete",
            description=f"Array sorted! ({self.comparisons} comparisons, {self.swaps} swaps, {self.heapify_calls} heapify calls)",
            state={"type": "array", "values": arr.copy()},
            highlights=[{"indices": list(range(n)), "color": "sorted"}],
            metadata={
                "comparisons": self.comparisons,
                "swaps": self.swaps,
                "heapify_calls": self.heapify_calls,
            },
        )

    def _heapify(self, arr: list[int], heap_size: int, root_idx: int) -> Generator[Step, None, None]:
        """Heapify subtree rooted at root_idx.

        Args:
            arr: Array to heapify
            heap_size: Size of heap
            root_idx: Index of root of subtree

        Yields:
            Step objects for visualization
        """
        self.heapify_calls += 1
        largest = root_idx
        left = 2 * root_idx + 1
        right = 2 * root_idx + 2

        yield self.emit_step(
            operation="heapify_start",
            description=f"Heapifying subtree rooted at index {root_idx}",
            state={"type": "array", "values": arr.copy()},
            highlights=[
                {"indices": [root_idx], "color": "active"},
            ],
            metadata={
                "comparisons": self.comparisons,
                "swaps": self.swaps,
                "heapify_calls": self.heapify_calls,
                "root": root_idx,
                "heap_size": heap_size,
            },
        )

        # Check if left child exists and is greater than root
        if left < heap_size:
            self.comparisons += 1
            if arr[left] > arr[largest]:
                largest = left

        # Check if right child exists and is greater than current largest
        if right < heap_size:
            self.comparisons += 1
            if arr[right] > arr[largest]:
                largest = right

        # If largest is not root, swap and continue heapifying
        if largest != root_idx:
            self.swaps += 1
            arr[root_idx], arr[largest] = arr[largest], arr[root_idx]

            yield self.emit_step(
                operation="heapify_swap",
                description=f"Swapping {arr[largest]} ↔ {arr[root_idx]} to maintain heap property",
                state={"type": "array", "values": arr.copy()},
                highlights=[
                    {"indices": [root_idx, largest], "color": "swapped"},
                ],
                metadata={
                    "comparisons": self.comparisons,
                    "swaps": self.swaps,
                    "heapify_calls": self.heapify_calls,
                },
            )

            # Recursively heapify affected subtree
            yield from self._heapify(arr, heap_size, largest)
