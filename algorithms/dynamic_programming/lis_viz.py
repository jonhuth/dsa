"""Longest Increasing Subsequence (LIS) - length of the longest strictly
increasing subsequence via bottom-up dynamic programming.

Given an integer array ``nums``, find the length of the longest subsequence
whose elements are in strictly increasing order. A subsequence keeps the
original relative order but need not be contiguous.

Time Complexity:
    Best: O(n^2) - the classic DP always fills an n x n comparison structure
    Average: O(n^2)
    Worst: O(n^2)
    (A patience-sorting / binary-search variant reaches O(n log n).)

Space Complexity:
    O(n) - one dp entry per index (plus a parent array for reconstruction)

Key Insights:
    - Define dp[i] = length of the longest increasing subsequence that ENDS at
      index i. Every LIS ending at i must extend some earlier LIS ending at an
      index j < i with nums[j] < nums[i].
    - Recurrence: dp[i] = 1 + max(dp[j] for all j < i with nums[j] < nums[i]),
      or dp[i] = 1 when no such j exists (the element starts its own run).
    - The answer is max(dp) over all i - the LIS can end anywhere, not just at
      the last element.
    - Track a parent pointer for each i (the j that produced dp[i]) so the actual
      subsequence can be reconstructed by walking the pointers backwards.
    - Classic optimal-substructure + overlapping-subproblems DP: each dp[i]
      reuses previously computed dp[j] values instead of recomputing them.
"""

from collections.abc import Generator
from typing import Any

from algorithms.base import Step, StepTracker, VisualizerType


class LongestIncreasingSubsequence(StepTracker):
    """Longest Increasing Subsequence with visualization step tracking."""

    visualizer_type = VisualizerType.ARRAY

    def __init__(self):
        super().__init__()
        self.comparisons = 0
        self.updates = 0

    def run(self, input_data: Any) -> Generator[Step, None, None]:
        """Compute the length of the LIS using O(n^2) dynamic programming.

        Args:
            input_data: List of integers. A dict with a "values" key is also
                accepted for convenience.

        Yields:
            Step objects for visualization. The visualized ``state`` is the dp
            array (dp[i] = LIS length ending at i); the original ``nums`` are
            carried in each step's metadata.
        """
        self.reset()
        self.comparisons = 0
        self.updates = 0

        # Accept a raw list or a {"values": [...]} wrapper.
        if isinstance(input_data, dict):
            nums = list(input_data.get("values", []))
        else:
            nums = list(input_data)

        n = len(nums)

        if n == 0:
            yield self.emit_step(
                operation="complete",
                description="Empty array - the longest increasing subsequence has length 0.",
                state={"type": "array", "values": []},
                highlights=[],
                metadata={
                    "nums": [],
                    "dp": [],
                    "lis_length": 0,
                    "lis": [],
                    "comparisons": self.comparisons,
                    "updates": self.updates,
                },
            )
            return

        # dp[i] = length of the LIS ending at index i (every element is a run of 1).
        dp = [1] * n
        parent = [-1] * n

        yield self.emit_step(
            operation="init",
            description=(
                f"Initialize dp = [1] * {n}. Every element is an increasing "
                f"subsequence of length 1 on its own."
            ),
            state={"type": "array", "values": dp.copy()},
            highlights=[{"indices": list(range(n)), "color": "comparing"}],
            metadata={
                "nums": nums.copy(),
                "dp": dp.copy(),
                "lis_length": 1,
                "comparisons": self.comparisons,
                "updates": self.updates,
            },
        )

        for i in range(1, n):
            # Compare nums[i] against every earlier element nums[j].
            for j in range(i):
                self.comparisons += 1
                extends = nums[j] < nums[i]

                if extends and dp[j] + 1 > dp[i]:
                    # Extending the LIS ending at j gives a longer LIS ending at i.
                    self.updates += 1
                    dp[i] = dp[j] + 1
                    parent[i] = j
                    yield self.emit_step(
                        operation="update",
                        description=(
                            f"i={i} (nums[i]={nums[i]}), j={j} (nums[j]={nums[j]}): "
                            f"{nums[j]} < {nums[i]} and dp[{j}]+1 = {dp[j] + 1} > dp[{i}]. "
                            f"Extend it -> dp[{i}] = {dp[i]}."
                        ),
                        state={"type": "array", "values": dp.copy()},
                        highlights=self._build_highlights(i, j, extends),
                        metadata={
                            "nums": nums.copy(),
                            "dp": dp.copy(),
                            "i": i,
                            "j": j,
                            "current": nums[i],
                            "candidate": nums[j],
                            "lis_length": max(dp),
                            "comparisons": self.comparisons,
                            "updates": self.updates,
                        },
                    )
                else:
                    # Either not increasing, or extending would not beat dp[i].
                    if extends:
                        reason = (
                            f"{nums[j]} < {nums[i]} but dp[{j}]+1 = {dp[j] + 1} "
                            f"does not beat dp[{i}] = {dp[i]}"
                        )
                    else:
                        reason = f"{nums[j]} >= {nums[i]} (not increasing)"
                    yield self.emit_step(
                        operation="compare",
                        description=(
                            f"i={i} (nums[i]={nums[i]}), j={j} (nums[j]={nums[j]}): "
                            f"{reason}. Keep dp[{i}] = {dp[i]}."
                        ),
                        state={"type": "array", "values": dp.copy()},
                        highlights=self._build_highlights(i, j, extends),
                        metadata={
                            "nums": nums.copy(),
                            "dp": dp.copy(),
                            "i": i,
                            "j": j,
                            "current": nums[i],
                            "candidate": nums[j],
                            "lis_length": max(dp),
                            "comparisons": self.comparisons,
                            "updates": self.updates,
                        },
                    )

        # The LIS can end at any index - pick the index with the largest dp value.
        best_end = max(range(n), key=lambda idx: dp[idx])
        lis_length = dp[best_end]

        # Reconstruct one actual LIS by walking parent pointers backwards.
        seq_indices: list[int] = []
        k = best_end
        while k != -1:
            seq_indices.append(k)
            k = parent[k]
        seq_indices.reverse()
        lis_values = [nums[idx] for idx in seq_indices]

        yield self.emit_step(
            operation="complete",
            description=(
                f"Done! The longest increasing subsequence has length {lis_length}: "
                f"{lis_values} (at indices {seq_indices})."
            ),
            state={"type": "array", "values": dp.copy()},
            highlights=[{"indices": seq_indices, "color": "swapped"}],
            metadata={
                "nums": nums.copy(),
                "dp": dp.copy(),
                "lis_length": lis_length,
                "lis": lis_values,
                "lis_indices": seq_indices,
                "comparisons": self.comparisons,
                "updates": self.updates,
            },
        )

    def _build_highlights(self, i: int, j: int, extends: bool) -> list[dict[str, Any]]:
        """Build layered highlights for a running frame.

        Priority (first match wins in the array visualizer):
            1. current index i          -> "active" (blue)
            2. candidate index j         -> "swapped" green if it extends the
               subsequence, otherwise "comparing" yellow
        """
        return [
            {"indices": [i], "color": "active"},
            {"indices": [j], "color": "swapped" if extends else "comparing"},
        ]
