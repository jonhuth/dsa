"""Search in Rotated Sorted Array - Modified binary search on a rotated array.

A sorted array of distinct values is rotated at some unknown pivot (e.g.
``[0,1,2,4,5,6,7]`` rotated becomes ``[4,5,6,7,0,1,2]``). The task is to find a
target value in O(log n) time without first un-rotating the array.

Time Complexity:
    Best: O(1) - target is at the first midpoint
    Average: O(log n)
    Worst: O(log n) - search space is halved every iteration

Space Complexity: O(1) - iterative, uses only a few pointers

Key Insights:
    - A rotated sorted array always has at least one sorted half around mid.
    - At each step, compare arr[lo] with arr[mid] to decide which half is sorted.
    - If the target falls inside the sorted half's value range, recurse there;
      otherwise recurse into the other (rotated) half.
    - Distinct values let us use strict comparisons; duplicates would degrade
      the worst case to O(n).
"""

from collections.abc import Generator

from algorithms.base import Step, StepTracker, VisualizerType


class RotatedArraySearch(StepTracker):
    """Search in Rotated Sorted Array with step-by-step visualization."""

    visualizer_type = VisualizerType.ARRAY

    def __init__(self):
        super().__init__()
        self.comparisons = 0

    def run(self, input_data: dict) -> Generator[Step, None, None]:
        """Search for a target in a rotated sorted array of distinct values.

        Args:
            input_data: Dict with keys:
                - "array": list[int], a sorted array rotated at an unknown pivot
                - "target": int, the value to find

        Yields:
            Step objects for visualization. The final "complete" step reports
            the found index or -1.
        """
        self.reset()
        self.comparisons = 0

        arr: list[int] = list(input_data.get("array", []))
        target: int = input_data.get("target")
        n = len(arr)

        yield self.emit_step(
            operation="init",
            description=(
                f"Searching for {target} in a rotated sorted array of {n} "
                f"element{'s' if n != 1 else ''}"
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
            mid = (lo + hi) // 2
            self.comparisons += 1

            yield self.emit_step(
                operation="check_mid",
                description=(f"Inspect middle arr[{mid}] = {arr[mid]} within window [{lo}..{hi}]"),
                state={"type": "array", "values": arr.copy()},
                highlights=[
                    {"indices": [lo], "color": "comparing"},
                    {"indices": [mid], "color": "active"},
                    {"indices": [hi], "color": "comparing"},
                ],
                metadata={
                    "comparisons": self.comparisons,
                    "target": target,
                    "lo": lo,
                    "mid": mid,
                    "hi": hi,
                    "lo_value": arr[lo],
                    "mid_value": arr[mid],
                    "hi_value": arr[hi],
                },
            )

            if arr[mid] == target:
                found_index = mid
                yield self.emit_step(
                    operation="found",
                    description=f"Found {target} at index {mid}!",
                    state={"type": "array", "values": arr.copy()},
                    highlights=[
                        {"indices": [mid], "color": "sorted"},
                    ],
                    metadata={
                        "comparisons": self.comparisons,
                        "target": target,
                        "found_index": mid,
                    },
                )
                break

            # Determine which half is sorted by comparing the low end to mid.
            if arr[lo] <= arr[mid]:
                # Left half [lo..mid] is sorted.
                if arr[lo] <= target < arr[mid]:
                    yield self.emit_step(
                        operation="search_left",
                        description=(
                            f"Left half [{lo}..{mid}] is sorted and "
                            f"{arr[lo]} <= {target} < {arr[mid]}; search left"
                        ),
                        state={"type": "array", "values": arr.copy()},
                        highlights=[
                            {"indices": list(range(lo, mid)), "color": "comparing"},
                        ],
                        metadata={
                            "comparisons": self.comparisons,
                            "target": target,
                            "sorted_half": "left",
                            "eliminated": f"[{mid}..{hi}]",
                        },
                    )
                    hi = mid - 1
                else:
                    yield self.emit_step(
                        operation="search_right",
                        description=(
                            f"Left half [{lo}..{mid}] is sorted but {target} "
                            f"is outside [{arr[lo]}, {arr[mid]}); search right"
                        ),
                        state={"type": "array", "values": arr.copy()},
                        highlights=[
                            {"indices": list(range(mid + 1, hi + 1)), "color": "comparing"},
                        ],
                        metadata={
                            "comparisons": self.comparisons,
                            "target": target,
                            "sorted_half": "left",
                            "eliminated": f"[{lo}..{mid}]",
                        },
                    )
                    lo = mid + 1
            else:
                # Right half [mid..hi] is sorted.
                if arr[mid] < target <= arr[hi]:
                    yield self.emit_step(
                        operation="search_right",
                        description=(
                            f"Right half [{mid}..{hi}] is sorted and "
                            f"{arr[mid]} < {target} <= {arr[hi]}; search right"
                        ),
                        state={"type": "array", "values": arr.copy()},
                        highlights=[
                            {"indices": list(range(mid + 1, hi + 1)), "color": "comparing"},
                        ],
                        metadata={
                            "comparisons": self.comparisons,
                            "target": target,
                            "sorted_half": "right",
                            "eliminated": f"[{lo}..{mid}]",
                        },
                    )
                    lo = mid + 1
                else:
                    yield self.emit_step(
                        operation="search_left",
                        description=(
                            f"Right half [{mid}..{hi}] is sorted but {target} "
                            f"is outside ({arr[mid]}, {arr[hi]}]; search left"
                        ),
                        state={"type": "array", "values": arr.copy()},
                        highlights=[
                            {"indices": list(range(lo, mid)), "color": "comparing"},
                        ],
                        metadata={
                            "comparisons": self.comparisons,
                            "target": target,
                            "sorted_half": "right",
                            "eliminated": f"[{mid}..{hi}]",
                        },
                    )
                    hi = mid - 1

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
