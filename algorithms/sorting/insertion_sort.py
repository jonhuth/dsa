"""Insertion Sort - Build a sorted portion one element at a time.

Insertion sort iterates from left to right, selecting the current element and
inserting it into the already-sorted portion on the left by shifting larger
elements to the right.

Time Complexity:
    Best: O(n) - when array is already sorted
    Average: O(n²)
    Worst: O(n²) - when array is reverse sorted

Space Complexity: O(1) - sorts in place

Characteristics:
    - Stable: maintains relative order of equal elements
    - In-place: requires constant extra space
    - Comparison-based
    - Adaptive: performs well on nearly-sorted input
"""

from typing import Generator
from algorithms.base import Step, StepTracker, VisualizerType


class InsertionSort(StepTracker):
    """Insertion Sort algorithm with step-by-step visualization."""

    visualizer_type = VisualizerType.ARRAY

    def sort(self, arr: list[int]) -> Generator[Step, None, None]:
        """Sort an array using insertion sort algorithm.

        Args:
            arr: List of integers to sort

        Yields:
            Step objects for visualization

        Returns:
            The sorted array (in-place modification)
        """
        self.reset()
        n = len(arr)

        comparisons = 0
        shifts = 0
        inserts = 0

        # Initial state
        yield self.emit_step(
            operation="init",
            description=f"Starting insertion sort on array of {n} elements",
            state={"type": "array", "values": arr.copy()},
            highlights=[
                {
                    "indices": [0],
                    "color": "sorted",
                }
            ]
            if n > 0
            else [],
            metadata={
                "comparisons": comparisons,
                "shifts": shifts,
                "inserts": inserts,
                "sorted_boundary": 1 if n > 0 else 0,
            },
        )

        for i in range(1, n):
            key = arr[i]

            # Show current key and sorted/unsorted split
            yield self.emit_step(
                operation="select_key",
                description=f"Selecting {key} at index {i} for insertion",
                state={"type": "array", "values": arr.copy()},
                highlights=[
                    {
                        "indices": list(range(i)),
                        "color": "sorted",
                    },
                    {
                        "indices": [i],
                        "color": "active",
                    },
                ],
                metadata={
                    "comparisons": comparisons,
                    "shifts": shifts,
                    "inserts": inserts,
                    "current_index": i,
                    "current_key": key,
                    "sorted_boundary": i,
                },
            )

            j = i - 1
            while j >= 0:
                comparisons += 1

                yield self.emit_step(
                    operation="compare",
                    description=f"Comparing key {key} with {arr[j]} at index {j}",
                    state={"type": "array", "values": arr.copy()},
                    highlights=[
                        {
                            "indices": list(range(i)),
                            "color": "sorted",
                        },
                        {
                            "indices": [j],
                            "color": "comparing",
                        },
                        {
                            "indices": [j + 1],
                            "color": "active",
                        },
                    ],
                    metadata={
                        "comparisons": comparisons,
                        "shifts": shifts,
                        "inserts": inserts,
                        "current_index": i,
                        "compare_index": j,
                        "current_key": key,
                        "sorted_boundary": i,
                    },
                )

                if arr[j] > key:
                    arr[j + 1] = arr[j]
                    shifts += 1

                    yield self.emit_step(
                        operation="shift",
                        description=f"Shifting {arr[j]} from index {j} to {j + 1}",
                        state={"type": "array", "values": arr.copy()},
                        highlights=[
                            {
                                "indices": list(range(i + 1)),
                                "color": "active",
                            },
                            {
                                "indices": [j + 1],
                                "color": "swapped",
                            },
                        ],
                        metadata={
                            "comparisons": comparisons,
                            "shifts": shifts,
                            "inserts": inserts,
                            "current_index": i,
                            "shifted_from": j,
                            "shifted_to": j + 1,
                            "current_key": key,
                            "sorted_boundary": i,
                        },
                    )
                    j -= 1
                else:
                    break

            arr[j + 1] = key
            inserts += 1

            yield self.emit_step(
                operation="insert",
                description=f"Inserted {key} at index {j + 1}",
                state={"type": "array", "values": arr.copy()},
                highlights=[
                    {
                        "indices": list(range(i + 1)),
                        "color": "sorted",
                    },
                    {
                        "indices": [j + 1],
                        "color": "swapped",
                    },
                ],
                metadata={
                    "comparisons": comparisons,
                    "shifts": shifts,
                    "inserts": inserts,
                    "current_index": i,
                    "inserted_index": j + 1,
                    "current_key": key,
                    "sorted_boundary": i + 1,
                },
            )

        # Final state
        yield self.emit_step(
            operation="complete",
            description=(
                "Sorting complete! "
                f"Made {comparisons} comparisons, {shifts} shifts, and {inserts} inserts"
            ),
            state={"type": "array", "values": arr.copy()},
            highlights=[
                {
                    "indices": list(range(n)),
                    "color": "sorted",
                }
            ],
            metadata={
                "comparisons": comparisons,
                "shifts": shifts,
                "inserts": inserts,
                "sorted": True,
            },
        )

        return arr


if __name__ == "__main__":
    print("Insertion Sort Visualization")
    print("=" * 50)

    test_cases = [
        [5, 2, 8, 1, 9],
        [1, 2, 3, 4, 5],
        [5, 4, 3, 2, 1],
        [3, 3, 3, 3, 3],
        [42],
        [],
    ]

    for test_arr in test_cases:
        print(f"\nInput: {test_arr}")
        sorter = InsertionSort()
        steps = list(sorter.sort(test_arr.copy()))
        final_step = steps[-1] if steps else None

        if final_step:
            print(f"Output: {final_step.state['values']}")
            print(
                f"Stats: {final_step.metadata['comparisons']} comparisons, "
                f"{final_step.metadata['shifts']} shifts, "
                f"{final_step.metadata['inserts']} inserts"
            )
        else:
            print("Output: []")
