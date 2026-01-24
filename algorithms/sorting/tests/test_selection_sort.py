"""Tests for Selection Sort implementation."""

import pytest
from algorithms.sorting.selection_sort import SelectionSort


class TestSelectionSortCorrectness:
    """Test that Selection Sort produces correct sorted results."""

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
        """Test that selection sort produces correct sorted output."""
        sorter = SelectionSort()
        arr_copy = input_arr.copy()
        steps = list(sorter.sort(arr_copy))
        assert arr_copy == expected


class TestSelectionSortSwaps:
    """Test Selection Sort's minimal swaps."""

    def test_minimal_swaps(self):
        """Test that selection sort makes exactly n-1 swaps or fewer."""
        sorter = SelectionSort()
        arr = [5, 4, 3, 2, 1]
        steps = list(sorter.sort(arr))
        final = steps[-1]
        # Should make at most n-1 swaps
        assert final.metadata["swaps"] <= 4  # n-1 = 5-1


class TestSelectionSortMetadata:
    """Test Selection Sort metadata tracking."""

    def test_metadata_tracks_line_numbers(self):
        """Test that source line numbers are captured."""
        sorter = SelectionSort()
        steps = list(sorter.sort([5, 2, 8]))
        steps_with_lines = [s for s in steps if "source_line" in s.metadata]
        assert len(steps_with_lines) > 0
