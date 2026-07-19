"""Counting Sort - Non-comparison integer sorting algorithm.

Time Complexity:
    Best: O(n + k) - n elements, k = range of input (max value + 1)
    Average: O(n + k)
    Worst: O(n + k)

Space Complexity:
    O(n + k) - count array of size k plus output array of size n

Stability: Stable (equal elements keep their relative order when built
    right-to-left from the prefix-summed count array)

Key Insights:
    - Non-comparison sort: never compares two elements against each other.
      It counts occurrences and derives positions arithmetically, so it
      beats the O(n log n) comparison lower bound.
    - Runs in O(n + k) linear time when the key range k is comparable to n.
      Degrades badly when k >> n (e.g. sorting [0, 1_000_000] wastes a huge
      count array).
    - Only works on non-negative integers (or values mappable to a bounded
      integer range). Not a general-purpose comparison sort.
    - Prefix-summing the count array turns counts into end positions, which
      is what makes stable placement possible.
    - Iterating the input from right to left during placement preserves
      stability - the key building block that makes Counting Sort usable as
      the stable subroutine inside Radix Sort.
"""

from collections.abc import Generator

from algorithms.base import Step, StepTracker, VisualizerType


class CountingSort(StepTracker):
    """Counting Sort implementation with visualization step tracking."""

    visualizer_type = VisualizerType.ARRAY

    def __init__(self):
        super().__init__()
        self.count_writes = 0
        self.placements = 0

    def run(self, input_data: list[int]) -> Generator[Step, None, None]:
        """Sort a list of non-negative integers using counting sort.

        Args:
            input_data: List of non-negative integers to sort

        Yields:
            Step objects for visualization
        """
        self.reset()
        self.count_writes = 0
        self.placements = 0

        arr = list(input_data)
        n = len(arr)

        yield self.emit_step(
            operation="init",
            description=f"Starting counting sort on array of {n} elements",
            state={"type": "array", "values": arr.copy()},
            highlights=[],
            metadata={
                "count_writes": self.count_writes,
                "placements": self.placements,
                "counts": [],
            },
        )

        # Empty or single-element arrays are already sorted.
        if n <= 1:
            yield self.emit_step(
                operation="complete",
                description="Array has 0 or 1 elements - already sorted!",
                state={"type": "array", "values": arr.copy()},
                highlights=[{"indices": list(range(n)), "color": "sorted"}],
                metadata={
                    "count_writes": self.count_writes,
                    "placements": self.placements,
                    "counts": [],
                },
            )
            return

        # Determine the value range k = max + 1.
        max_val = max(arr)
        k = max_val + 1
        counts = [0] * k

        yield self.emit_step(
            operation="setup",
            description=f"Max value is {max_val}, so allocate a count array of size k = {k} (indices 0..{max_val})",
            state={"type": "array", "values": arr.copy()},
            highlights=[{"indices": [arr.index(max_val)], "color": "active"}],
            metadata={
                "count_writes": self.count_writes,
                "placements": self.placements,
                "counts": counts.copy(),
                "max_val": max_val,
                "k": k,
                "phase": "setup",
            },
        )

        # Phase 1: tally each value into its count bucket.
        for i in range(n):
            value = arr[i]
            counts[value] += 1
            self.count_writes += 1

            yield self.emit_step(
                operation="count",
                description=f"Counting element {value} at index {i} -> counts[{value}] is now {counts[value]}",
                state={"type": "array", "values": arr.copy()},
                highlights=[{"indices": [i], "color": "comparing"}],
                metadata={
                    "count_writes": self.count_writes,
                    "placements": self.placements,
                    "counts": counts.copy(),
                    "current_value": value,
                    "count_index": value,
                    "phase": "count",
                },
            )

        yield self.emit_step(
            operation="counts_done",
            description=f"Count array complete: each index holds how many times that value appears. counts = {counts}",
            state={"type": "array", "values": arr.copy()},
            highlights=[],
            metadata={
                "count_writes": self.count_writes,
                "placements": self.placements,
                "counts": counts.copy(),
                "phase": "count",
            },
        )

        # Phase 2: prefix-sum the counts so counts[v] becomes the number of
        # elements <= v, i.e. the exclusive end position for value v.
        for v in range(1, k):
            counts[v] += counts[v - 1]

            yield self.emit_step(
                operation="prefix_sum",
                description=f"Prefix sum: counts[{v}] += counts[{v - 1}] -> {counts[v]} (running total of elements <= {v})",
                state={"type": "array", "values": arr.copy()},
                highlights=[],
                metadata={
                    "count_writes": self.count_writes,
                    "placements": self.placements,
                    "counts": counts.copy(),
                    "prefix_index": v,
                    "phase": "prefix",
                },
            )

        yield self.emit_step(
            operation="prefix_done",
            description=f"Prefix sums done: counts[v] now gives the end position for value v. counts = {counts}",
            state={"type": "array", "values": arr.copy()},
            highlights=[],
            metadata={
                "count_writes": self.count_writes,
                "placements": self.placements,
                "counts": counts.copy(),
                "phase": "prefix",
            },
        )

        # Phase 3: build the output array. Iterate right-to-left to keep the
        # sort stable (equal keys retain their original relative order).
        output = [0] * n
        for i in range(n - 1, -1, -1):
            value = arr[i]
            counts[value] -= 1
            pos = counts[value]
            output[pos] = value
            self.placements += 1

            # Show the partially-built output. Slots not yet written stay 0
            # but everything placed so far is highlighted as sorted.
            placed_indices = [j for j in range(n) if output[j] != 0 or j == pos]
            yield self.emit_step(
                operation="place",
                description=f"Place {value} (from input index {i}) at output index {pos}, then decrement counts[{value}] to {counts[value]}",
                state={"type": "array", "values": output.copy()},
                highlights=[
                    {"indices": [pos], "color": "swapped"},
                    {"indices": [j for j in placed_indices if j != pos], "color": "sorted"},
                ],
                metadata={
                    "count_writes": self.count_writes,
                    "placements": self.placements,
                    "counts": counts.copy(),
                    "source_index": i,
                    "output_index": pos,
                    "current_value": value,
                    "phase": "place",
                },
            )

        # Final validating step: fully sorted output.
        is_sorted = all(output[i] <= output[i + 1] for i in range(n - 1))
        yield self.emit_step(
            operation="complete",
            description=(
                f"Array sorted! ({self.count_writes} count writes, {self.placements} placements) "
                f"[verified sorted: {is_sorted}]"
            ),
            state={"type": "array", "values": output.copy()},
            highlights=[{"indices": list(range(n)), "color": "sorted"}],
            metadata={
                "count_writes": self.count_writes,
                "placements": self.placements,
                "counts": counts.copy(),
                "sorted": is_sorted,
                "phase": "complete",
            },
        )
