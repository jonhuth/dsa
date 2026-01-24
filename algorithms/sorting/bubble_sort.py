"""Bubble Sort - Simple comparison-based sorting algorithm.

Repeatedly steps through the list, compares adjacent elements and swaps them
if they're in the wrong order. The pass through the list is repeated until
the list is sorted.

The algorithm gets its name from the way smaller elements "bubble" to the top
of the list (beginning of the array).

Time Complexity:
    Best: O(n) - when array is already sorted (with optimization)
    Average: O(n²)
    Worst: O(n²) - when array is reverse sorted

Space Complexity: O(1) - sorts in place

Characteristics:
    - Stable: maintains relative order of equal elements
    - In-place: requires constant extra space
    - Comparison-based
    - Simple to understand and implement
    - Not efficient for large datasets
"""

from typing import Generator
from algorithms.base import Step, StepTracker, VisualizerType


class BubbleSort(StepTracker):
    """Bubble Sort algorithm with step-by-step visualization.

    Example:
        >>> sorter = BubbleSort()
        >>> steps = list(sorter.sort([5, 2, 8, 1, 9]))
        >>> sorted_array = steps[-1].state["values"]
        >>> sorted_array
        [1, 2, 5, 8, 9]
    """

    visualizer_type = VisualizerType.ARRAY

    def sort(self, arr: list[int]) -> Generator[Step, None, None]:
        """Sort an array using bubble sort algorithm.

        Args:
            arr: List of integers to sort

        Yields:
            Step objects for visualization

        Returns:
            The sorted array (in-place modification)
        """
        self.reset()
        n = len(arr)

        # Initial state
        yield self.emit_step(
            operation="init",
            description=f"Starting bubble sort on array of {n} elements",
            state={"type": "array", "values": arr.copy()},
            metadata={
                "comparisons": 0,
                "swaps": 0,
                "passes": 0,
            },
        )

        comparisons = 0
        swaps = 0

        # Main bubble sort algorithm
        for i in range(n - 1):
            flag = False  # Track if any swaps were made this pass

            # Show start of pass
            yield self.emit_step(
                operation="pass_start",
                description=f"Pass {i + 1}: Comparing elements 0 to {n - i - 2}",
                state={"type": "array", "values": arr.copy()},
                highlights=[
                    {
                        "indices": list(range(n - i)),
                        "color": "active",
                    }
                ],
                metadata={
                    "comparisons": comparisons,
                    "swaps": swaps,
                    "passes": i + 1,
                    "current_pass": i + 1,
                },
            )

            for j in range(n - i - 1):
                # Compare adjacent elements
                comparisons += 1

                yield self.emit_step(
                    operation="compare",
                    description=f"Comparing {arr[j]} and {arr[j+1]}",
                    state={"type": "array", "values": arr.copy()},
                    highlights=[
                        {
                            "indices": [j, j + 1],
                            "color": "comparing",
                        }
                    ],
                    metadata={
                        "comparisons": comparisons,
                        "swaps": swaps,
                        "passes": i + 1,
                        "comparing_indices": [j, j + 1],
                    },
                )

                if arr[j] > arr[j + 1]:
                    # Swap if they're in the wrong order
                    flag = True
                    swaps += 1
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]

                    yield self.emit_step(
                        operation="swap",
                        description=f"Swapped {arr[j+1]} and {arr[j]} (now at positions {j} and {j+1})",
                        state={"type": "array", "values": arr.copy()},
                        highlights=[
                            {
                                "indices": [j, j + 1],
                                "color": "swapped",
                            }
                        ],
                        metadata={
                            "comparisons": comparisons,
                            "swaps": swaps,
                            "passes": i + 1,
                            "swapped_indices": [j, j + 1],
                        },
                    )

            # Mark the last element of this pass as sorted
            yield self.emit_step(
                operation="pass_complete",
                description=f"Pass {i + 1} complete. Element at position {n - i - 1} is now in final position",
                state={"type": "array", "values": arr.copy()},
                highlights=[
                    {
                        "indices": [n - i - 1],
                        "color": "sorted",
                    }
                ],
                metadata={
                    "comparisons": comparisons,
                    "swaps": swaps,
                    "passes": i + 1,
                    "sorted_count": i + 1,
                },
            )

            # Optimization: if no swaps were made, array is sorted
            if not flag:
                yield self.emit_step(
                    operation="early_exit",
                    description="No swaps made in this pass - array is sorted!",
                    state={"type": "array", "values": arr.copy()},
                    highlights=[
                        {
                            "indices": list(range(n)),
                            "color": "sorted",
                        }
                    ],
                    metadata={
                        "comparisons": comparisons,
                        "swaps": swaps,
                        "passes": i + 1,
                        "early_exit": True,
                    },
                )
                break

        # Final state
        yield self.emit_step(
            operation="complete",
            description=f"Sorting complete! Made {comparisons} comparisons and {swaps} swaps",
            state={"type": "array", "values": arr.copy()},
            highlights=[
                {
                    "indices": list(range(n)),
                    "color": "sorted",
                }
            ],
            metadata={
                "comparisons": comparisons,
                "swaps": swaps,
                "passes": i + 1 if "i" in locals() else 0,
                "sorted": True,
            },
        )

        return arr


if __name__ == "__main__":
    # Example usage
    print("Bubble Sort Visualization")
    print("=" * 50)

    test_cases = [
        [5, 2, 8, 1, 9],
        [1, 2, 3, 4, 5],  # Already sorted (best case)
        [5, 4, 3, 2, 1],  # Reverse sorted (worst case)
        [3, 3, 3, 3, 3],  # All same
        [42],  # Single element
        [],  # Empty
    ]

    for test_arr in test_cases:
        print(f"\nInput: {test_arr}")
        sorter = BubbleSort()
        steps = list(sorter.sort(test_arr.copy()))
        final_step = steps[-1] if steps else None

        if final_step:
            print(f"Output: {final_step.state['values']}")
            print(
                f"Stats: {final_step.metadata['comparisons']} comparisons, "
                f"{final_step.metadata['swaps']} swaps, "
                f"{final_step.metadata.get('passes', 0)} passes"
            )
        else:
            print("Output: []")
