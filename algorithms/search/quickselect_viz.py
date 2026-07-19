"""Quickselect - Find the k-th smallest element in average linear time.

Given an unordered array and an integer k, return the k-th SMALLEST element
(1-indexed) WITHOUT fully sorting the array. Quickselect is a selection
algorithm derived from Quick Sort: it partitions around a pivot, then recurses
into only the ONE side that must contain the target rank.

Time Complexity:
    Best: O(n) - balanced partitions, each step halves the search window
    Average: O(n) - expected linear because we discard one side every step
    Worst: O(n^2) - adversarial input with consistently poor pivots
                    (e.g. already-sorted input with last-element pivot)

Space Complexity:
    O(1) - partitions in place; the iterative form uses no recursion stack
    O(log n) - if written recursively (tail recursion into one side)

Key Insights:
    - Same Lomuto partition as Quick Sort, but recurse into ONLY one side.
      After partitioning, the pivot sits at its final sorted index p. Because
      everything left of p is <= pivot and everything right is > pivot, the
      pivot is exactly the (p+1)-th smallest element - its rank is fixed.
    - Convert the 1-indexed k to a 0-indexed target rank (k - 1). If the pivot
      lands on the target rank we are done; otherwise discard the half that
      cannot contain it and repeat.
    - Discarding a side each step is what turns Quick Sort's O(n log n) into an
      expected O(n): n + n/2 + n/4 + ... = O(n).
    - Unlike a full sort, the array is left only PARTIALLY ordered - just enough
      to place the k-th element. Finding the median is the classic use case.
    - A randomized or median-of-medians pivot avoids the O(n^2) worst case;
      median-of-medians guarantees O(n) worst case at a higher constant factor.
"""

from collections.abc import Generator
from typing import Any

from algorithms.base import Step, StepTracker, VisualizerType


class QuickSelect(StepTracker):
    """Quickselect (k-th smallest) with visualization step tracking."""

    visualizer_type = VisualizerType.ARRAY

    def __init__(self):
        super().__init__()
        self.comparisons = 0
        self.swaps = 0

    def run(self, input_data: Any) -> Generator[Step, None, None]:
        """Find the k-th smallest element using Quickselect.

        Args:
            input_data: Dict of the form {"array": list[int], "k": int} where
                k is 1-indexed (k=1 -> minimum, k=n -> maximum). A raw list is
                also accepted, defaulting k to 1.

        Yields:
            Step objects for visualization.
        """
        self.reset()
        self.comparisons = 0
        self.swaps = 0

        if isinstance(input_data, dict):
            arr = list(input_data.get("array", []))
            k = int(input_data.get("k", 1))
        else:
            arr = list(input_data)
            k = 1

        n = len(arr)

        # Validate inputs - emit a single terminal step for degenerate cases.
        if n == 0:
            yield self.emit_step(
                operation="complete",
                description="Empty array - there is no k-th smallest element.",
                state={"type": "array", "values": []},
                highlights=[],
                metadata={"k": k, "pivot": None, "comparisons": self.comparisons},
            )
            return

        if k < 1 or k > n:
            yield self.emit_step(
                operation="complete",
                description=(
                    f"k = {k} is out of range for an array of {n} elements "
                    f"(k must satisfy 1 <= k <= {n})."
                ),
                state={"type": "array", "values": arr.copy()},
                highlights=[],
                metadata={"k": k, "pivot": None, "comparisons": self.comparisons},
            )
            return

        target = k - 1  # Convert 1-indexed k to a 0-indexed target rank.

        yield self.emit_step(
            operation="init",
            description=(
                f"Find the {self._ordinal(k)} smallest of {n} elements "
                f"(target rank {target} once the array is partially ordered)."
            ),
            state={"type": "array", "values": arr.copy()},
            highlights=[{"indices": list(range(n)), "color": "comparing"}],
            metadata={
                "k": k,
                "target_rank": target,
                "pivot": None,
                "comparisons": self.comparisons,
                "swaps": self.swaps,
                "lo": 0,
                "hi": n - 1,
            },
        )

        lo, hi = 0, n - 1

        while True:
            if lo == hi:
                # Search window narrowed to a single element - it is the answer.
                yield self.emit_step(
                    operation="found",
                    description=(
                        f"Search window narrowed to one element: "
                        f"the {self._ordinal(k)} smallest is {arr[lo]} (index {lo})."
                    ),
                    state={"type": "array", "values": arr.copy()},
                    highlights=[{"indices": [lo], "color": "swapped"}],
                    metadata={
                        "k": k,
                        "target_rank": target,
                        "pivot": arr[lo],
                        "comparisons": self.comparisons,
                        "swaps": self.swaps,
                        "result": arr[lo],
                        "result_index": lo,
                        "lo": lo,
                        "hi": hi,
                    },
                )
                break

            # Partition arr[lo..hi] around a pivot; pivot lands at index p.
            gen = self._partition(arr, lo, hi, target, k)
            p = yield from gen

            if p == target:
                yield self.emit_step(
                    operation="found",
                    description=(
                        f"Pivot {arr[p]} landed on target rank {target} - "
                        f"the {self._ordinal(k)} smallest element is {arr[p]}."
                    ),
                    state={"type": "array", "values": arr.copy()},
                    highlights=[{"indices": [p], "color": "swapped"}],
                    metadata={
                        "k": k,
                        "target_rank": target,
                        "pivot": arr[p],
                        "comparisons": self.comparisons,
                        "swaps": self.swaps,
                        "result": arr[p],
                        "result_index": p,
                        "lo": lo,
                        "hi": hi,
                    },
                )
                break
            elif target < p:
                # Target is in the left partition; discard the right side.
                new_hi = p - 1
                yield self.emit_step(
                    operation="recurse_left",
                    description=(
                        f"Pivot at index {p} > target {target}: the "
                        f"{self._ordinal(k)} smallest is to the LEFT. "
                        f"Discard indices [{p}..{hi}], search [{lo}..{new_hi}]."
                    ),
                    state={"type": "array", "values": arr.copy()},
                    highlights=[
                        {"indices": [p], "color": "active"},
                        {"indices": list(range(lo, new_hi + 1)), "color": "comparing"},
                    ],
                    metadata={
                        "k": k,
                        "target_rank": target,
                        "pivot": arr[p],
                        "comparisons": self.comparisons,
                        "swaps": self.swaps,
                        "lo": lo,
                        "hi": new_hi,
                    },
                )
                hi = new_hi
            else:
                # Target is in the right partition; discard the left side.
                new_lo = p + 1
                yield self.emit_step(
                    operation="recurse_right",
                    description=(
                        f"Pivot at index {p} < target {target}: the "
                        f"{self._ordinal(k)} smallest is to the RIGHT. "
                        f"Discard indices [{lo}..{p}], search [{new_lo}..{hi}]."
                    ),
                    state={"type": "array", "values": arr.copy()},
                    highlights=[
                        {"indices": [p], "color": "active"},
                        {"indices": list(range(new_lo, hi + 1)), "color": "comparing"},
                    ],
                    metadata={
                        "k": k,
                        "target_rank": target,
                        "pivot": arr[p],
                        "comparisons": self.comparisons,
                        "swaps": self.swaps,
                        "lo": new_lo,
                        "hi": hi,
                    },
                )
                lo = new_lo

        result = arr[target]
        yield self.emit_step(
            operation="complete",
            description=(
                f"Done! The {self._ordinal(k)} smallest element is {result} "
                f"({self.comparisons} comparisons, {self.swaps} swaps). "
                f"The array is only partially ordered around rank {target}."
            ),
            state={"type": "array", "values": arr.copy()},
            highlights=[{"indices": [target], "color": "sorted"}],
            metadata={
                "k": k,
                "target_rank": target,
                "pivot": result,
                "comparisons": self.comparisons,
                "swaps": self.swaps,
                "result": result,
                "result_index": target,
                "lo": target,
                "hi": target,
            },
        )

    def _partition(
        self, arr: list[int], low: int, high: int, target: int, k: int
    ) -> Generator[Step, None, int]:
        """Lomuto-partition arr[low..high] around the last element as pivot.

        Elements <= pivot are moved to the left, elements > pivot to the right.
        Yields visualization steps and RETURNS the pivot's final index so the
        caller can decide which side to keep searching.

        Args:
            arr: Array being selected over (mutated in place).
            low: Start of the active search window.
            high: End of the active search window (initial pivot position).
            target: 0-indexed rank we are hunting for (for descriptions).
            k: 1-indexed k (for descriptions).

        Returns:
            The final resting index of the pivot after partitioning.
        """
        pivot = arr[high]

        yield self.emit_step(
            operation="select_pivot",
            description=(
                f"Partition window [{low}..{high}]: choose pivot {pivot} "
                f"(index {high}, the last element of the window)."
            ),
            state={"type": "array", "values": arr.copy()},
            highlights=[
                {"indices": [high], "color": "active"},
                {"indices": list(range(low, high + 1)), "color": "comparing"},
            ],
            metadata={
                "k": k,
                "target_rank": target,
                "pivot": pivot,
                "pivot_idx": high,
                "comparisons": self.comparisons,
                "swaps": self.swaps,
                "lo": low,
                "hi": high,
            },
        )

        i = low - 1  # Boundary of the "<= pivot" region.

        for j in range(low, high):
            self.comparisons += 1

            highlights_list: list[dict[str, Any]] = [
                {"indices": [j], "color": "comparing"},
                {"indices": [high], "color": "active"},
            ]
            if i >= low:
                highlights_list.append({"indices": list(range(low, i + 1)), "color": "sorted"})

            yield self.emit_step(
                operation="compare",
                description=f"Comparing {arr[j]} with pivot {pivot}.",
                state={"type": "array", "values": arr.copy()},
                highlights=highlights_list,
                metadata={
                    "k": k,
                    "target_rank": target,
                    "pivot": pivot,
                    "comparisons": self.comparisons,
                    "swaps": self.swaps,
                    "lo": low,
                    "hi": high,
                },
            )

            if arr[j] <= pivot:
                i += 1
                if i != j:
                    self.swaps += 1
                    arr[i], arr[j] = arr[j], arr[i]
                    yield self.emit_step(
                        operation="swap",
                        description=(
                            f"{arr[i]} <= pivot {pivot}: swap it into the left "
                            f"region (indices {i} and {j})."
                        ),
                        state={"type": "array", "values": arr.copy()},
                        highlights=[
                            {"indices": [i, j], "color": "swapped"},
                            {"indices": [high], "color": "active"},
                        ],
                        metadata={
                            "k": k,
                            "target_rank": target,
                            "pivot": pivot,
                            "comparisons": self.comparisons,
                            "swaps": self.swaps,
                            "lo": low,
                            "hi": high,
                        },
                    )

        # Move the pivot to its final position, just after the "<= pivot" region.
        pivot_final = i + 1
        if pivot_final != high:
            self.swaps += 1
        arr[pivot_final], arr[high] = arr[high], arr[pivot_final]

        yield self.emit_step(
            operation="pivot_placed",
            description=(
                f"Pivot {pivot} settles at index {pivot_final} - its FINAL "
                f"sorted position, so it is the {self._ordinal(pivot_final + 1)} "
                f"smallest overall."
            ),
            state={"type": "array", "values": arr.copy()},
            highlights=[{"indices": [pivot_final], "color": "sorted"}],
            metadata={
                "k": k,
                "target_rank": target,
                "pivot": pivot,
                "pivot_final_idx": pivot_final,
                "comparisons": self.comparisons,
                "swaps": self.swaps,
                "lo": low,
                "hi": high,
            },
        )

        return pivot_final

    @staticmethod
    def _ordinal(n: int) -> str:
        """Return the English ordinal for a positive integer (1 -> '1st')."""
        if 10 <= n % 100 <= 20:
            suffix = "th"
        else:
            suffix = {1: "st", 2: "nd", 3: "rd"}.get(n % 10, "th")
        return f"{n}{suffix}"
