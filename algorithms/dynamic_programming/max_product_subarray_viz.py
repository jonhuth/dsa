"""Maximum Product Subarray - Largest product of a contiguous subarray.

Given an integer array (which may contain negative numbers and zeros), find
the contiguous subarray with the largest PRODUCT and return that product.

Time Complexity:
    Best: O(n) - single pass over the array
    Average: O(n)
    Worst: O(n) - always exactly one pass

Space Complexity:
    O(1) - only a handful of running scalars are tracked

Key Insights:
    - Unlike Kadane's SUM problem, the product recurrence must track TWO running
      values at each index: the maximum product ending at i AND the minimum
      product ending at i.
    - Why the min matters: a negative number times a very negative (small)
      running product becomes a large POSITIVE product. The current minimum is
      a "candidate max" waiting for a sign flip.
    - Recurrence:
          cur_max = max(nums[i], cur_max * nums[i], cur_min * nums[i])
          cur_min = min(nums[i], cur_max * nums[i], cur_min * nums[i])
      (compute both from the OLD cur_max/cur_min before overwriting either).
    - best = max(best, cur_max) tracks the global answer.
    - Zeros act as hard resets: any product through a 0 is 0, so both cur_max
      and cur_min collapse and the window effectively restarts after the zero.
    - Initialize best to nums[0] (never assume an empty subarray of product 1),
      so single-element and all-negative arrays are handled correctly.
"""

from collections.abc import Generator
from typing import Any

from algorithms.base import Step, StepTracker, VisualizerType


class MaxProductSubarray(StepTracker):
    """Maximum product subarray with visualization step tracking."""

    visualizer_type = VisualizerType.ARRAY

    def __init__(self):
        super().__init__()
        self.iterations = 0
        self.swaps = 0

    def run(self, input_data: Any) -> Generator[Step, None, None]:
        """Find the maximum-product contiguous subarray.

        Args:
            input_data: List of integers (may include negatives and zeros). A
                dict with a "values" key is also accepted for convenience.

        Yields:
            Step objects for visualization.
        """
        self.reset()
        self.iterations = 0
        self.swaps = 0

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
                    "cur_max": 0,
                    "cur_min": 0,
                    "best": 0,
                    "best_start": -1,
                    "best_end": -1,
                    "iterations": self.iterations,
                    "swaps": self.swaps,
                },
            )
            return

        # Initialize all three running values to the first element so
        # single-element and all-negative arrays are handled correctly.
        cur_max = nums[0]
        cur_min = nums[0]
        best = nums[0]
        start = 0
        best_start = 0
        best_end = 0

        yield self.emit_step(
            operation="init",
            description=(
                f"Start on {n} elements. cur_max = cur_min = best = nums[0] = {nums[0]}. "
                "We track BOTH the max and min product ending here because a "
                "future negative can flip the min into the new max."
            ),
            state={"type": "array", "values": nums},
            highlights=[
                {"indices": [0], "color": "active"},
                {"indices": [0], "color": "sorted"},
            ],
            metadata={
                "cur_max": cur_max,
                "cur_min": cur_min,
                "best": best,
                "best_start": best_start,
                "best_end": best_end,
                "iterations": self.iterations,
                "swaps": self.swaps,
            },
        )

        for i in range(1, n):
            self.iterations += 1
            x = nums[i]

            # A negative element swaps the roles of max and min: multiplying by
            # a negative turns the largest product into the smallest and vice
            # versa. Emit a dedicated step to emphasize the sign flip.
            if x < 0:
                self.swaps += 1
                yield self.emit_step(
                    operation="sign_flip",
                    description=(
                        f"i={i}: nums[i] = {x} is negative. Multiplying flips signs, "
                        f"so the old cur_min ({cur_min}) is the candidate for the new "
                        f"cur_max. This is why we must track the min."
                    ),
                    state={"type": "array", "values": nums},
                    highlights=self._build_highlights(i, start, best_start, best_end),
                    metadata={
                        "cur_max": cur_max,
                        "cur_min": cur_min,
                        "best": best,
                        "best_start": best_start,
                        "best_end": best_end,
                        "iterations": self.iterations,
                        "swaps": self.swaps,
                    },
                )

            # Compute both candidates from the OLD cur_max / cur_min.
            cand_extend_max = cur_max * x
            cand_extend_min = cur_min * x
            new_max = max(x, cand_extend_max, cand_extend_min)
            new_min = min(x, cand_extend_max, cand_extend_min)

            # A window "reset" happens when starting fresh at nums[i] beats
            # extending the previous window (typically right after a zero, or
            # when the running product hurts more than it helps).
            if new_max == x and cand_extend_max <= x and cand_extend_min <= x:
                start = i

            cur_max = new_max
            cur_min = new_min

            if x == 0:
                # Zero collapses everything; the window restarts after it.
                start = i
                yield self.emit_step(
                    operation="reset",
                    description=(
                        f"i={i}: nums[i] = 0 resets both products to 0. Any subarray "
                        f"crossing this zero has product 0, so the window restarts."
                    ),
                    state={"type": "array", "values": nums},
                    highlights=self._build_highlights(i, start, best_start, best_end),
                    metadata={
                        "cur_max": cur_max,
                        "cur_min": cur_min,
                        "best": best,
                        "best_start": best_start,
                        "best_end": best_end,
                        "iterations": self.iterations,
                        "swaps": self.swaps,
                    },
                )
            else:
                yield self.emit_step(
                    operation="extend",
                    description=(
                        f"i={i}: cur_max = max({x}, {cand_extend_max}, {cand_extend_min}) "
                        f"= {cur_max}; cur_min = {cur_min}. Window [{start}..{i}]."
                    ),
                    state={"type": "array", "values": nums},
                    highlights=self._build_highlights(i, start, best_start, best_end),
                    metadata={
                        "cur_max": cur_max,
                        "cur_min": cur_min,
                        "best": best,
                        "best_start": best_start,
                        "best_end": best_end,
                        "iterations": self.iterations,
                        "swaps": self.swaps,
                    },
                )

            # Update the global best if the current max product beats it.
            if cur_max > best:
                best = cur_max
                best_start = start
                best_end = i
                yield self.emit_step(
                    operation="new_best",
                    description=(
                        f"New best! best = {best} for subarray [{best_start}..{best_end}]."
                    ),
                    state={"type": "array", "values": nums},
                    highlights=self._build_highlights(i, start, best_start, best_end),
                    metadata={
                        "cur_max": cur_max,
                        "cur_min": cur_min,
                        "best": best,
                        "best_start": best_start,
                        "best_end": best_end,
                        "iterations": self.iterations,
                        "swaps": self.swaps,
                    },
                )

        best_subarray = nums[best_start : best_end + 1]

        yield self.emit_step(
            operation="complete",
            description=(
                f"Done! Maximum product is {best} from indices "
                f"[{best_start}..{best_end}] = {best_subarray}."
            ),
            state={"type": "array", "values": nums},
            highlights=[
                {
                    "indices": list(range(best_start, best_end + 1)),
                    "color": "swapped",
                }
            ],
            metadata={
                "cur_max": cur_max,
                "cur_min": cur_min,
                "best": best,
                "best_start": best_start,
                "best_end": best_end,
                "best_subarray": best_subarray,
                "iterations": self.iterations,
                "swaps": self.swaps,
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
