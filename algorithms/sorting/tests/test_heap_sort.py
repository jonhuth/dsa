"""Tests for Heap Sort implementation."""

import pytest
from algorithms.sorting.heap_sort import HeapSort


class TestHeapSortCorrectness:
    """Test that Heap Sort produces correct sorted results."""

    @pytest.mark.parametrize(
        "input_arr,expected",
        [
            ([], []),
            ([42], [42]),
            ([5, 2, 8, 1, 9], [1, 2, 5, 8, 9]),
            ([1, 2, 3, 4, 5], [1, 2, 3, 4, 5]),
            ([5, 4, 3, 2, 1], [1, 2, 3, 4, 5]),
            ([3, 3, 3, 3], [3, 3, 3, 3]),
            ([5, 2, 8, 2, 9, 5], [2, 2, 5, 5, 8, 9]),
            ([-5, 3, -1, 7, -3], [-5, -3, -1, 3, 7]),
        ],
    )
    def test_sort_correctness(self, input_arr, expected):
        """Test that heap sort produces correct sorted output."""
        sorter = HeapSort()
        arr_copy = input_arr.copy()
        steps = list(sorter.sort(arr_copy))
        assert arr_copy == expected


class TestHeapSortGuarantee:
    """Test Heap Sort's O(n log n) guarantee."""

    def test_worst_case_efficient(self):
        """Test that heap sort maintains O(n log n) even in worst case."""
        sorter = HeapSort()
        arr = list(range(50, 0, -1))
        steps = list(sorter.sort(arr))
        final = steps[-1]
        # Should be O(n log n) comparisons
        import math
        n = 50
        max_comparisons = n * math.ceil(math.log2(n)) * 3
        assert final.metadata["comparisons"] < max_comparisons


class TestHeapSortMetadata:
    """Test Heap Sort metadata tracking."""

    def test_metadata_tracks_line_numbers(self):
        """Test that source line numbers are captured."""
        sorter = HeapSort()
        steps = list(sorter.sort([5, 2, 8]))
        steps_with_lines = [s for s in steps if "source_line" in s.metadata]
        assert len(steps_with_lines) > 0
