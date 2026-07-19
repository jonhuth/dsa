"""Kadane's Algorithm - Maximum subarray sum in linear time.

Given an integer array (which may contain negative numbers), find the
contiguous subarray with the largest sum and return that sum.

Time Complexity:
    Best: O(n) - single pass over the array
    Average: O(n)
    Worst: O(n) - always exactly one pass

Space Complexity:
    O(1) - only a handful of running scalars are tracked

Key Insights:
    - Dynamic programming on a single running value: current_sum is the best
      subarray sum that ENDS at index i.
    - The recurrence is current_sum = max(nums[i], current_sum + nums[i]).
      If the running sum has gone negative, it can only hurt the next element,
      so we "reset" the window and start fresh at nums[i].
    - best_sum tracks the maximum current_sum ever seen, along with the window
      [best_start, best_end] that produced it.
    - Handles all-negative arrays correctly by initializing best to the first
      element (never assuming an empty subarray of sum 0).
    - Classic example of optimal substructure + overlapping subproblems solved
      with O(1) space instead of an explicit DP table.
"""

from collections.abc import Generator
from typing import Any

from algorithms.base import Step, StepTracker, VisualizerType


class Kadane(StepTracker):
    """Kadane's maximum-subarray algorithm with visualization step tracking."""

    visualizer_type = VisualizerType.ARRAY

    def __init__(self):
        super().__init__()
        self.iterations = 0
        self.resets = 0

    def run(self, input_data: Any) -> Generator[Step, None, None]:
        """Find the maximum-sum contiguous subarray using Kadane's algorithm.

        Args:
            input_data: List of integers (may include negatives). A dict with a
                "values" key is also accepted for convenience.

        Yields:
            Step objects for visualization.
        """
        self.reset()
        self.iterations = 0
        self.resets = 0

        # Accept a raw list or a {"values": [...]} wrapper.
        if isinstance(input_data, dict):
            nums = list(input_data.get("values", []))
        else:
            nums = list(input_data)

        n = len(nums)

        if n == 0:
            yield self.emit_step(
                operation="complete",
                description="Empty array - no subarray exists.",
                state={"type": "array", "values": []},
                highlights=[],
                metadata={
                    "current_sum": 0,
                    "best_sum": 0,
                    "best_start": -1,
                    "best_end": -1,
                    "iterations": self.iterations,
                    "resets": self.resets,
                },
            )
            return

        # Initialize with the first element so all-negative arrays work.
        current_sum = nums[0]
        best_sum = nums[0]
        start = 0
        best_start = 0
        best_end = 0

        yield self.emit_step(
            operation="init",
            description=(
                f"Start Kadane's on {n} elements. current_sum = best_sum = nums[0] = {nums[0]}."
            ),
            state={"type": "array", "values": nums},
            highlights=[
                {"indices": [0], "color": "active"},
                {"indices": [0], "color": "sorted"},
            ],
            metadata={
                "current_sum": current_sum,
                "best_sum": best_sum,
                "best_start": best_start,
                "best_end": best_end,
                "iterations": self.iterations,
                "resets": self.resets,
            },
        )

        for i in range(1, n):
            self.iterations += 1

            # Decide whether to extend the current window or reset to nums[i].
            prev_sum = current_sum
            if prev_sum + nums[i] < nums[i]:
                # Running sum was negative - reset the window to start at i.
                self.resets += 1
                current_sum = nums[i]
                start = i
                yield self.emit_step(
                    operation="reset",
                    description=(
                        f"i={i}: running sum went negative "
                        f"({prev_sum} + {nums[i]} < {nums[i]}), "
                        f"reset window to start at index {i}. current_sum = {current_sum}."
                    ),
                    state={"type": "array", "values": nums},
                    highlights=self._build_highlights(i, start, best_start, best_end),
                    metadata={
                        "current_sum": current_sum,
                        "best_sum": best_sum,
                        "best_start": best_start,
                        "best_end": best_end,
                        "iterations": self.iterations,
                        "resets": self.resets,
                    },
                )
            else:
                # Extend the current window to include nums[i].
                current_sum = prev_sum + nums[i]
                yield self.emit_step(
                    operation="extend",
                    description=(
                        f"i={i}: extend window with {nums[i]}. "
                        f"current_sum = {current_sum} (window [{start}..{i}])."
                    ),
                    state={"type": "array", "values": nums},
                    highlights=self._build_highlights(i, start, best_start, best_end),
                    metadata={
                        "current_sum": current_sum,
                        "best_sum": best_sum,
                        "best_start": best_start,
                        "best_end": best_end,
                        "iterations": self.iterations,
                        "resets": self.resets,
                    },
                )

            # Update the best window if the current window is better.
            if current_sum > best_sum:
                best_sum = current_sum
                best_start = start
                best_end = i
                yield self.emit_step(
                    operation="new_best",
                    description=(
                        f"New best! best_sum = {best_sum} for subarray [{best_start}..{best_end}]."
                    ),
                    state={"type": "array", "values": nums},
                    highlights=self._build_highlights(i, start, best_start, best_end),
                    metadata={
                        "current_sum": current_sum,
                        "best_sum": best_sum,
                        "best_start": best_start,
                        "best_end": best_end,
                        "iterations": self.iterations,
                        "resets": self.resets,
                    },
                )

        best_subarray = nums[best_start : best_end + 1]

        yield self.emit_step(
            operation="complete",
            description=(
                f"Done! Maximum subarray sum is {best_sum} "
                f"from indices [{best_start}..{best_end}] = {best_subarray}."
            ),
            state={"type": "array", "values": nums},
            highlights=[
                {
                    "indices": list(range(best_start, best_end + 1)),
                    "color": "swapped",
                }
            ],
            metadata={
                "current_sum": current_sum,
                "best_sum": best_sum,
                "best_start": best_start,
                "best_end": best_end,
                "best_subarray": best_subarray,
                "iterations": self.iterations,
                "resets": self.resets,
            },
        )

    def _build_highlights(
        self, i: int, start: int, best_start: int, best_end: int
    ) -> list[dict[str, Any]]:
        """Build layered highlights for a running frame.

        Priority (first match wins in the array visualizer):
            1. current index i        -> "active" (blue)
            2. best window so far      -> "sorted" (purple)
            3. current running window  -> "comparing" (yellow)
        """
        return [
            {"indices": [i], "color": "active"},
            {"indices": list(range(best_start, best_end + 1)), "color": "sorted"},
            {"indices": list(range(start, i + 1)), "color": "comparing"},
        ]
