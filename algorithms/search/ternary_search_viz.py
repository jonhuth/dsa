"""Ternary Search - Divide a sorted array into thirds instead of halves.

Ternary search generalises binary search: instead of one midpoint that splits the
window in half, it uses two split points (``mid1`` and ``mid2``) that cut the
window ``[lo, hi]`` into three roughly equal segments. Comparing the target to
``arr[mid1]`` and ``arr[mid2]`` lets us discard TWO of the three segments each
iteration, so the surviving search space shrinks by a factor of 3.

Time Complexity:
    Best: O(1) - target lands on mid1 or mid2 on the first iteration
    Average: O(log_3 n)
    Worst: O(log_3 n)

Space Complexity: O(1) - iterative, only a handful of index variables

Key Insights:
    - It shrinks the window by 1/3 per step (log base 3), but each step costs TWO
      comparisons. Total comparisons ~ 2*log_3(n) = 2/log2(3)*log2(n) ≈ 1.26*log2(n),
      which is MORE than binary search's ~1*log2(n). So on a plain sorted array,
      binary search wins - ternary search here is mainly PEDAGOGICAL.
    - Its real home is UNIMODAL optimization: finding the extremum of a function
      that strictly increases then decreases (or vice versa), where a single
      midpoint comparison can't tell you which side the peak is on but two can.
    - The two split points are mid1 = lo + (hi-lo)//3 and mid2 = hi - (hi-lo)//3.
    - Like binary search, it requires the array to be sorted.
"""

from collections.abc import Generator

from algorithms.base import Step, StepTracker, VisualizerType


class TernarySearch(StepTracker):
    """Ternary Search on a sorted array with step-by-step visualization."""

    visualizer_type = VisualizerType.ARRAY

    def __init__(self):
        super().__init__()
        self.comparisons = 0

    def run(self, input_data: dict) -> Generator[Step, None, None]:
        """Search for a target in a sorted array by splitting into thirds.

        Args:
            input_data: Dict with keys:
                - "array": list[int], sorted ascending
                - "target": int, the value to find

        Yields:
            Step objects for visualization. The final "complete" step reports the
            found index or -1.
        """
        self.reset()
        self.comparisons = 0

        arr: list[int] = list(input_data.get("array", []))
        target: int = input_data.get("target")
        n = len(arr)

        yield self.emit_step(
            operation="init",
            description=(
                f"Searching for {target} in a sorted array of {n} "
                f"element{'s' if n != 1 else ''} by splitting into thirds"
            ),
            state={"type": "array", "values": arr.copy()},
            highlights=[],
            metadata={
                "comparisons": self.comparisons,
                "target": target,
            },
        )

        lo = 0
        hi = n - 1
        found_index = -1

        while lo <= hi:
            third = (hi - lo) // 3
            mid1 = lo + third
            mid2 = hi - third
            # Two comparisons per iteration: target vs arr[mid1] and vs arr[mid2].
            self.comparisons += 2

            yield self.emit_step(
                operation="check_thirds",
                description=(
                    f"Split window [{lo}..{hi}] into thirds: "
                    f"arr[{mid1}] = {arr[mid1]}, arr[{mid2}] = {arr[mid2]}"
                ),
                state={"type": "array", "values": arr.copy()},
                highlights=[
                    {"indices": list(range(lo, hi + 1)), "color": "comparing"},
                    {"indices": [mid1], "color": "active"},
                    {"indices": [mid2], "color": "active"},
                ],
                metadata={
                    "comparisons": self.comparisons,
                    "target": target,
                    "lo": lo,
                    "hi": hi,
                    "mid1": mid1,
                    "mid2": mid2,
                    "mid1_value": arr[mid1],
                    "mid2_value": arr[mid2],
                },
            )

            if arr[mid1] == target:
                found_index = mid1
                yield self.emit_step(
                    operation="found",
                    description=f"Found {target} at index {mid1} (first split point)!",
                    state={"type": "array", "values": arr.copy()},
                    highlights=[
                        {"indices": [mid1], "color": "sorted"},
                    ],
                    metadata={
                        "comparisons": self.comparisons,
                        "target": target,
                        "found_index": mid1,
                    },
                )
                break

            if arr[mid2] == target:
                found_index = mid2
                yield self.emit_step(
                    operation="found",
                    description=f"Found {target} at index {mid2} (second split point)!",
                    state={"type": "array", "values": arr.copy()},
                    highlights=[
                        {"indices": [mid2], "color": "sorted"},
                    ],
                    metadata={
                        "comparisons": self.comparisons,
                        "target": target,
                        "found_index": mid2,
                    },
                )
                break

            if target < arr[mid1]:
                # Target is in the first third; discard the other two.
                new_lo, new_hi = lo, mid1 - 1
                yield self.emit_step(
                    operation="search_first_third",
                    description=(
                        f"{target} < {arr[mid1]}: keep the first third "
                        f"[{new_lo}..{new_hi}], discard the rest"
                    ),
                    state={"type": "array", "values": arr.copy()},
                    highlights=(
                        [{"indices": list(range(new_lo, new_hi + 1)), "color": "comparing"}]
                        if new_lo <= new_hi
                        else []
                    ),
                    metadata={
                        "comparisons": self.comparisons,
                        "target": target,
                        "surviving_third": "first",
                        "eliminated": f"[{mid1}..{hi}]",
                    },
                )
                lo, hi = new_lo, new_hi
            elif target > arr[mid2]:
                # Target is in the last third; discard the other two.
                new_lo, new_hi = mid2 + 1, hi
                yield self.emit_step(
                    operation="search_last_third",
                    description=(
                        f"{target} > {arr[mid2]}: keep the last third "
                        f"[{new_lo}..{new_hi}], discard the rest"
                    ),
                    state={"type": "array", "values": arr.copy()},
                    highlights=(
                        [{"indices": list(range(new_lo, new_hi + 1)), "color": "comparing"}]
                        if new_lo <= new_hi
                        else []
                    ),
                    metadata={
                        "comparisons": self.comparisons,
                        "target": target,
                        "surviving_third": "last",
                        "eliminated": f"[{lo}..{mid2}]",
                    },
                )
                lo, hi = new_lo, new_hi
            else:
                # arr[mid1] < target < arr[mid2]: target is in the middle third.
                new_lo, new_hi = mid1 + 1, mid2 - 1
                yield self.emit_step(
                    operation="search_middle_third",
                    description=(
                        f"{arr[mid1]} < {target} < {arr[mid2]}: keep the middle "
                        f"third [{new_lo}..{new_hi}], discard both ends"
                    ),
                    state={"type": "array", "values": arr.copy()},
                    highlights=(
                        [{"indices": list(range(new_lo, new_hi + 1)), "color": "comparing"}]
                        if new_lo <= new_hi
                        else []
                    ),
                    metadata={
                        "comparisons": self.comparisons,
                        "target": target,
                        "surviving_third": "middle",
                        "eliminated": f"[{lo}..{mid1}] and [{mid2}..{hi}]",
                    },
                )
                lo, hi = new_lo, new_hi

        if found_index == -1:
            yield self.emit_step(
                operation="not_found",
                description=f"{target} is not present in the array (returned -1)",
                state={"type": "array", "values": arr.copy()},
                highlights=[],
                metadata={
                    "comparisons": self.comparisons,
                    "target": target,
                    "found": False,
                },
            )

        yield self.emit_step(
            operation="complete",
            description=(
                f"Search complete: {target} found at index {found_index}"
                if found_index != -1
                else f"Search complete: {target} not found, result is -1"
            ),
            state={"type": "array", "values": arr.copy()},
            highlights=(
                [{"indices": [found_index], "color": "sorted"}] if found_index != -1 else []
            ),
            metadata={
                "comparisons": self.comparisons,
                "target": target,
                "result_index": found_index,
                "found": found_index != -1,
            },
        )
