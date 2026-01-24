"""Tests for Insertion Sort implementation."""

import pytest
from algorithms.sorting.insertion_sort import InsertionSort


class TestInsertionSortCorrectness:
    """Test that Insertion Sort produces correct sorted results."""

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
        """Test that insertion sort produces correct sorted output."""
        sorter = InsertionSort()
        arr_copy = input_arr.copy()
        steps = list(sorter.sort(arr_copy))
        assert arr_copy == expected


class TestInsertionSortBestCase:
    """Test Insertion Sort's O(n) best case."""

    def test_already_sorted_minimal_comparisons(self):
        """Test that already sorted array has minimal comparisons."""
        sorter = InsertionSort()
        arr = [1, 2, 3, 4, 5]
        steps = list(sorter.sort(arr))
        final = steps[-1]
        # Should make n-1 comparisons for already sorted array
        assert final.metadata["comparisons"] == 4  # n-1 = 5-1


class TestInsertionSortMetadata:
    """Test Insertion Sort metadata tracking."""

    def test_metadata_tracks_line_numbers(self):
        """Test that source line numbers are captured."""
        sorter = InsertionSort()
        steps = list(sorter.sort([5, 2, 8]))
        steps_with_lines = [s for s in steps if "source_line" in s.metadata]
        assert len(steps_with_lines) > 0
