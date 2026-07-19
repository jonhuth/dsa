"""Exponential Search - Find a range by doubling, then binary search within it.

Exponential search (also called doubling or galloping search) operates on a
sorted array. It first finds a range in which the target must lie by starting
with a bound of 1 and repeatedly doubling it (1, 2, 4, 8, ...) until the value
at the bound is greater than or equal to the target (or the bound runs past the
end of the array). It then performs a standard binary search within the last
doubled range ``[bound / 2, min(bound, n - 1)]``.

Time Complexity:
    Best: O(1) - target is at index 0 (or the first probe already matches)
    Average: O(log i) - where i is the index of the target
    Worst: O(log n) - target near the end or absent; doubling takes
        ~log(i) steps and the bounded binary search takes ~log(i) more

Space Complexity: O(1) - iterative, uses only a few index pointers

Key Insights:
    - The doubling phase locates a range of size at most 2i in O(log i) probes,
      where i is the target's index, so the cost depends on i, not n.
    - Excellent for unbounded or infinite sorted streams where the length is
      unknown - you never index past the first bound that overshoots the target.
    - When the target is near the front, exponential search beats plain binary
      search because it converges in O(log i) rather than O(log n).
    - The second phase is an ordinary binary search confined to the last
      doubled window, so correctness reduces to binary search on a sorted range.
"""

from collections.abc import Generator

from algorithms.base import Step, StepTracker, VisualizerType


class ExponentialSearch(StepTracker):
    """Exponential Search with step-by-step visualization."""

    visualizer_type = VisualizerType.ARRAY

    def __init__(self):
        super().__init__()
        self.comparisons = 0

    def run(self, input_data: dict) -> Generator[Step, None, None]:
        """Search for a target in a sorted array using exponential search.

        Args:
            input_data: Dict with keys:
                - "array": list[int], sorted in ascending order
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
                f"Searching for {target} in a sorted array of {n} "
                f"element{'s' if n != 1 else ''} using exponential search"
            ),
            state={"type": "array", "values": arr.copy()},
            highlights=[],
            metadata={
                "phase": "expand",
                "comparisons": self.comparisons,
                "target": target,
            },
        )

        found_index = -1

        if n == 0:
            yield self.emit_step(
                operation="not_found",
                description=f"Array is empty, {target} cannot be found (result is -1)",
                state={"type": "array", "values": arr.copy()},
                highlights=[],
                metadata={
                    "phase": "expand",
                    "comparisons": self.comparisons,
                    "target": target,
                    "found": False,
                },
            )
            yield self._complete_step(arr, target, found_index)
            return

        # --- Phase 1: exponential expansion to bracket the target ---
        # Check index 0 first: if it matches we are done immediately.
        self.comparisons += 1
        yield self.emit_step(
            operation="probe",
            description=f"Check arr[0] = {arr[0]} against target {target}",
            state={"type": "array", "values": arr.copy()},
            highlights=[{"indices": [0], "color": "active"}],
            metadata={
                "phase": "expand",
                "comparisons": self.comparisons,
                "target": target,
                "bound": 0,
            },
        )

        if arr[0] == target:
            found_index = 0
            yield self.emit_step(
                operation="found",
                description=f"Found {target} at index 0!",
                state={"type": "array", "values": arr.copy()},
                highlights=[{"indices": [0], "color": "sorted"}],
                metadata={
                    "phase": "expand",
                    "comparisons": self.comparisons,
                    "target": target,
                    "found_index": 0,
                },
            )
            yield self._complete_step(arr, target, found_index)
            return

        # Double the bound (1, 2, 4, 8, ...) until arr[bound] >= target or we
        # run off the end of the array.
        bound = 1
        while bound < n and arr[bound] < target:
            self.comparisons += 1
            yield self.emit_step(
                operation="probe",
                description=(
                    f"arr[{bound}] = {arr[bound]} < {target}; double the bound to {bound * 2}"
                ),
                state={"type": "array", "values": arr.copy()},
                highlights=[
                    {"indices": list(range(0, bound + 1)), "color": "comparing"},
                    {"indices": [bound], "color": "active"},
                ],
                metadata={
                    "phase": "expand",
                    "comparisons": self.comparisons,
                    "target": target,
                    "bound": bound,
                    "bound_value": arr[bound],
                },
            )
            bound *= 2

        # Establish the binary-search window: [bound / 2, min(bound, n - 1)].
        lo = bound // 2
        hi = min(bound, n - 1)

        if bound < n:
            self.comparisons += 1

        yield self.emit_step(
            operation="range_found",
            description=(
                f"Range located: target must lie in window [{lo}..{hi}] "
                f"(values {arr[lo]}..{arr[hi]}); binary search here"
            ),
            state={"type": "array", "values": arr.copy()},
            highlights=[
                {"indices": list(range(lo, hi + 1)), "color": "comparing"},
                {"indices": [hi], "color": "active"},
            ],
            metadata={
                "phase": "binary",
                "comparisons": self.comparisons,
                "target": target,
                "bound": bound,
                "lo": lo,
                "hi": hi,
            },
        )

        # --- Phase 2: binary search within [lo, hi] ---
        while lo <= hi:
            mid = (lo + hi) // 2
            self.comparisons += 1

            yield self.emit_step(
                operation="check_mid",
                description=(
                    f"Binary search: check middle arr[{mid}] = {arr[mid]} "
                    f"within window [{lo}..{hi}]"
                ),
                state={"type": "array", "values": arr.copy()},
                highlights=[
                    {"indices": list(range(lo, hi + 1)), "color": "comparing"},
                    {"indices": [mid], "color": "active"},
                ],
                metadata={
                    "phase": "binary",
                    "comparisons": self.comparisons,
                    "target": target,
                    "lo": lo,
                    "mid": mid,
                    "hi": hi,
                    "mid_value": arr[mid],
                },
            )

            if arr[mid] == target:
                found_index = mid
                yield self.emit_step(
                    operation="found",
                    description=f"Found {target} at index {mid}!",
                    state={"type": "array", "values": arr.copy()},
                    highlights=[{"indices": [mid], "color": "sorted"}],
                    metadata={
                        "phase": "binary",
                        "comparisons": self.comparisons,
                        "target": target,
                        "found_index": mid,
                    },
                )
                break

            if arr[mid] < target:
                yield self.emit_step(
                    operation="search_right",
                    description=f"{arr[mid]} < {target}, search right half",
                    state={"type": "array", "values": arr.copy()},
                    highlights=[
                        {"indices": list(range(mid + 1, hi + 1)), "color": "comparing"},
                    ],
                    metadata={
                        "phase": "binary",
                        "comparisons": self.comparisons,
                        "target": target,
                        "lo": mid + 1,
                        "hi": hi,
                        "eliminated": f"[{lo}..{mid}]",
                    },
                )
                lo = mid + 1
            else:
                yield self.emit_step(
                    operation="search_left",
                    description=f"{arr[mid]} > {target}, search left half",
                    state={"type": "array", "values": arr.copy()},
                    highlights=[
                        {"indices": list(range(lo, mid)), "color": "comparing"},
                    ],
                    metadata={
                        "phase": "binary",
                        "comparisons": self.comparisons,
                        "target": target,
                        "lo": lo,
                        "hi": mid - 1,
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
                    "phase": "binary",
                    "comparisons": self.comparisons,
                    "target": target,
                    "found": False,
                },
            )

        yield self._complete_step(arr, target, found_index)

    def _complete_step(self, arr: list[int], target: int, found_index: int) -> Step:
        """Emit the terminal "complete" step summarizing the result."""
        return self.emit_step(
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
                "phase": "binary",
                "comparisons": self.comparisons,
                "target": target,
                "result_index": found_index,
                "found": found_index != -1,
            },
        )
