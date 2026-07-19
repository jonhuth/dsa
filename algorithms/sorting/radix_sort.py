"""Radix Sort - Non-comparison, digit-by-digit integer sorting algorithm.

Least Significant Digit (LSD) radix sort processes the numbers one digit
position at a time, from the ones place up to the most significant digit.
Each pass distributes the numbers into 10 buckets (0-9) using a *stable*
counting sort keyed on the current digit, then concatenates the buckets back
into the array. Because each digit pass is stable, once every digit has been
processed the array is fully sorted.

Time Complexity:
    Best: O(d * (n + k)) - d digit passes over n elements with base k
    Average: O(d * (n + k))
    Worst: O(d * (n + k))
    where d = number of digits in the largest value, n = element count,
    k = radix/base (10 here). For fixed-width integers this is effectively O(n).

Space Complexity:
    O(n + k) - output buffer of size n plus the k (=10) digit buckets

Stability: Stable (equal keys keep their relative order, which is what makes
    the multi-pass LSD approach correct)

Key Insights:
    - Non-comparison sort: never compares two elements directly, so it side-steps
      the O(n log n) lower bound that comparison sorts are bound by.
    - Stability of the per-digit counting sort is essential - it preserves the
      ordering established by less significant digits already processed.
    - Runs in linear time O(d * (n + k)) when the number of digits d is treated
      as a small constant (e.g. 32-bit integers).
    - Works great for fixed-width keys (integers, fixed-length strings) but the
      classic form shown here assumes NON-NEGATIVE integers.
"""

from collections.abc import Generator

from algorithms.base import Step, StepTracker, VisualizerType


class RadixSort(StepTracker):
    """LSD Radix Sort implementation with visualization step tracking."""

    visualizer_type = VisualizerType.ARRAY

    def __init__(self):
        super().__init__()
        self.passes = 0
        self.placements = 0

    def run(self, input_data: list[int]) -> Generator[Step, None, None]:
        """Sort a list of non-negative integers using LSD radix sort.

        Args:
            input_data: List of non-negative integers to sort

        Yields:
            Step objects for visualization
        """
        self.reset()
        self.passes = 0
        self.placements = 0

        arr = list(input_data)
        n = len(arr)

        yield self.emit_step(
            operation="init",
            description=f"Starting LSD radix sort on {n} element(s). We sort by one digit at a time, from the ones place up to the highest place value.",
            state={"type": "array", "values": arr.copy()},
            highlights=[],
            metadata={
                "passes": self.passes,
                "placements": self.placements,
                "current_digit_place": None,
                "pass_number": 0,
            },
        )

        # Nothing to do for empty / single-element inputs.
        if n <= 1:
            yield self.emit_step(
                operation="complete",
                description="Array has 0 or 1 element(s) - already sorted!",
                state={"type": "array", "values": arr.copy()},
                highlights=[{"indices": list(range(n)), "color": "sorted"}],
                metadata={
                    "passes": self.passes,
                    "placements": self.placements,
                    "current_digit_place": None,
                    "pass_number": self.passes,
                },
            )
            return

        max_value = max(arr)

        # Iterate over each digit position: 1s, 10s, 100s, ...
        place = 1
        while max_value // place > 0:
            self.passes += 1
            digit_name = self._place_name(place)

            # Highlight every element that shares the currently-active digit,
            # grouping indices by their digit value so each group lights up.
            active_highlights = self._digit_highlights(arr, place)

            yield self.emit_step(
                operation="select_digit",
                description=f"Pass {self.passes}: sorting by the {digit_name} digit (place value {place}). Highlighted elements are grouped by their {digit_name} digit.",
                state={"type": "array", "values": arr.copy()},
                highlights=active_highlights,
                metadata={
                    "passes": self.passes,
                    "placements": self.placements,
                    "current_digit_place": place,
                    "current_digit_name": digit_name,
                    "pass_number": self.passes,
                },
            )

            # --- Stable counting sort on this digit ---
            buckets: list[list[int]] = [[] for _ in range(10)]

            for idx, value in enumerate(arr):
                digit = (value // place) % 10
                buckets[digit].append(value)
                self.placements += 1

                yield self.emit_step(
                    operation="bucket",
                    description=f"Value {value} has {digit_name} digit {digit} - placing it into bucket {digit}.",
                    state={"type": "array", "values": arr.copy()},
                    highlights=[
                        {"indices": [idx], "color": "active"},
                        {
                            "indices": self._indices_with_digit(arr, place, digit),
                            "color": "comparing",
                        },
                    ],
                    metadata={
                        "passes": self.passes,
                        "placements": self.placements,
                        "current_digit_place": place,
                        "current_digit_name": digit_name,
                        "pass_number": self.passes,
                        "bucket": digit,
                        "value": value,
                        "buckets": [bucket.copy() for bucket in buckets],
                    },
                )

            # --- Reassemble the array by reading buckets 0..9 in order ---
            arr = [value for bucket in buckets for value in bucket]

            yield self.emit_step(
                operation="reassemble",
                description=f"Concatenated buckets 0-9 back into the array. It is now stably sorted by the {digit_name} digit.",
                state={"type": "array", "values": arr.copy()},
                highlights=self._digit_highlights(arr, place),
                metadata={
                    "passes": self.passes,
                    "placements": self.placements,
                    "current_digit_place": place,
                    "current_digit_name": digit_name,
                    "pass_number": self.passes,
                    "buckets": [bucket.copy() for bucket in buckets],
                },
            )

            place *= 10

        yield self.emit_step(
            operation="complete",
            description=f"Array fully sorted after {self.passes} digit pass(es) and {self.placements} bucket placement(s)!",
            state={"type": "array", "values": arr.copy()},
            highlights=[{"indices": list(range(n)), "color": "sorted"}],
            metadata={
                "passes": self.passes,
                "placements": self.placements,
                "current_digit_place": None,
                "pass_number": self.passes,
            },
        )

    # Backwards/forwards-compatible alias: the sorting execution path in the
    # backend registry invokes ``.sort()`` on sorting algorithms.
    def sort(self, arr: list[int]) -> Generator[Step, None, None]:
        """Alias for :meth:`run` to match the sorting-algorithm interface."""
        yield from self.run(arr)

    @staticmethod
    def _place_name(place: int) -> str:
        """Human-readable name for a place value (1 -> 'ones', 10 -> 'tens')."""
        names = {1: "ones", 10: "tens", 100: "hundreds", 1000: "thousands"}
        return names.get(place, f"{place}s")

    @staticmethod
    def _indices_with_digit(arr: list[int], place: int, digit: int) -> list[int]:
        """Indices of elements whose digit at ``place`` equals ``digit``."""
        return [i for i, v in enumerate(arr) if (v // place) % 10 == digit]

    @staticmethod
    def _digit_highlights(arr: list[int], place: int) -> list[dict]:
        """Group all indices by their active digit for a single highlight set."""
        groups: dict[int, list[int]] = {}
        for i, v in enumerate(arr):
            digit = (v // place) % 10
            groups.setdefault(digit, []).append(i)
        # Alternate two colors so adjacent digit-groups are visually distinct.
        colors = ["comparing", "active"]
        highlights: list[dict] = []
        for order, digit in enumerate(sorted(groups)):
            highlights.append({"indices": groups[digit], "color": colors[order % 2]})
        return highlights
