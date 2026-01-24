"""Comprehensive tests for Quick Sort implementation."""

import pytest
from algorithms.sorting.quick_sort import QuickSort


class TestQuickSortCorrectness:
    """Test that Quick Sort produces correct sorted results."""

    @pytest.mark.parametrize(
        "input_arr,expected",
        [
            # Empty array
            ([], []),
            # Single element
            ([42], [42]),
            # Two elements - sorted
            ([1, 2], [1, 2]),
            # Two elements - reversed
            ([2, 1], [1, 2]),
            # Small array - random order
            ([5, 2, 8, 1, 9], [1, 2, 5, 8, 9]),
            # Already sorted
            ([1, 2, 3, 4, 5], [1, 2, 3, 4, 5]),
            # Reverse sorted
            ([5, 4, 3, 2, 1], [1, 2, 3, 4, 5]),
            # All duplicates
            ([3, 3, 3, 3], [3, 3, 3, 3]),
            # Some duplicates
            ([5, 2, 8, 2, 9, 5], [2, 2, 5, 5, 8, 9]),
            # Negative numbers
            ([-5, 3, -1, 7, -3], [-5, -3, -1, 3, 7]),
            # Mixed positive and negative
            ([5, -2, 8, -1, 0, 9], [-2, -1, 0, 5, 8, 9]),
        ],
    )
    def test_sort_correctness(self, input_arr, expected):
        """Test that quick sort produces correct sorted output."""
        sorter = QuickSort()
        arr_copy = input_arr.copy()

        # Execute all steps
        steps = list(sorter.sort(arr_copy))

        # Verify final result
        assert arr_copy == expected, f"Expected {expected}, got {arr_copy}"

    def test_sort_large_array(self):
        """Test quick sort on larger array."""
        import random

        arr = list(range(100, 0, -1))  # 100 elements in reverse
        expected = list(range(1, 101))

        sorter = QuickSort()
        steps = list(sorter.sort(arr))

        assert arr == expected


class TestQuickSortStepGeneration:
    """Test that Quick Sort generates correct visualization steps."""

    def test_generates_steps(self):
        """Test that steps are generated during sorting."""
        sorter = QuickSort()
        arr = [5, 2, 8, 1, 9]

        steps = list(sorter.sort(arr))

        assert len(steps) > 0, "Should generate at least one step"

    def test_step_has_required_properties(self):
        """Test that each step has required properties."""
        sorter = QuickSort()
        arr = [5, 2, 8]

        steps = list(sorter.sort(arr))

        for step in steps:
            assert hasattr(step, "step_number")
            assert hasattr(step, "operation")
            assert hasattr(step, "description")
            assert hasattr(step, "state")
            assert hasattr(step, "highlights")
            assert hasattr(step, "metadata")

    def test_step_operations(self):
        """Test that expected operations are present."""
        sorter = QuickSort()
        arr = [5, 2, 8, 1]

        steps = list(sorter.sort(arr))
        operations = [s.operation for s in steps]

        # Should have these operation types
        assert "init" in operations
        assert "select_pivot" in operations
        assert "compare" in operations
        assert "pivot_placed" in operations
        assert "complete" in operations

    def test_step_numbers_sequential(self):
        """Test that step numbers are sequential starting from 1."""
        sorter = QuickSort()
        arr = [3, 1, 2]

        steps = list(sorter.sort(arr))

        for i, step in enumerate(steps, start=1):
            assert step.step_number == i

    def test_state_is_array(self):
        """Test that state contains array data."""
        sorter = QuickSort()
        arr = [5, 2, 8]

        steps = list(sorter.sort(arr))

        for step in steps:
            assert "type" in step.state
            assert step.state["type"] == "array"
            assert "values" in step.state
            assert isinstance(step.state["values"], list)

    def test_state_independence(self):
        """Test that each step has independent state (not references)."""
        sorter = QuickSort()
        arr = [3, 1, 2]

        steps = list(sorter.sort(arr))

        # Modify first step's state
        steps[0].state["values"][0] = 999

        # Other steps should not be affected
        for step in steps[1:]:
            assert (
                step.state["values"][0] != 999
            ), "States should be independent copies"


class TestQuickSortMetadata:
    """Test Quick Sort metadata tracking."""

    def test_metadata_counts_comparisons(self):
        """Test that comparisons are counted correctly."""
        sorter = QuickSort()
        arr = [5, 2, 8, 1, 9]

        steps = list(sorter.sort(arr))
        final_step = steps[-1]

        assert "comparisons" in final_step.metadata
        assert final_step.metadata["comparisons"] > 0

    def test_metadata_counts_swaps(self):
        """Test that swaps are counted."""
        sorter = QuickSort()
        arr = [5, 4, 3, 2, 1]  # Reverse sorted - will need swaps

        steps = list(sorter.sort(arr))
        final_step = steps[-1]

        assert "swaps" in final_step.metadata
        assert final_step.metadata["swaps"] > 0

    def test_metadata_counts_partitions(self):
        """Test that partitions are counted."""
        sorter = QuickSort()
        arr = [5, 2, 8, 1, 9]

        steps = list(sorter.sort(arr))
        final_step = steps[-1]

        assert "partitions" in final_step.metadata
        assert final_step.metadata["partitions"] > 0

    def test_metadata_tracks_line_numbers(self):
        """Test that source line numbers are captured."""
        sorter = QuickSort()
        arr = [5, 2, 8]

        steps = list(sorter.sort(arr))

        # Most steps should have line numbers
        steps_with_lines = [s for s in steps if "source_line" in s.metadata]
        assert len(steps_with_lines) > 0, "Should track source line numbers"


class TestQuickSortHighlights:
    """Test Quick Sort highlighting behavior."""

    def test_highlights_pivot(self):
        """Test that pivot is highlighted."""
        sorter = QuickSort()
        arr = [5, 2, 8, 1]

        steps = list(sorter.sort(arr))

        # Find select_pivot steps
        pivot_steps = [s for s in steps if s.operation == "select_pivot"]
        assert len(pivot_steps) > 0

        # Pivot steps should have highlights
        for step in pivot_steps:
            assert len(step.highlights) > 0

    def test_highlights_during_compare(self):
        """Test that elements are highlighted during comparison."""
        sorter = QuickSort()
        arr = [5, 2, 8]

        steps = list(sorter.sort(arr))

        # Find compare steps
        compare_steps = [s for s in steps if s.operation == "compare"]

        # Should have highlights showing what's being compared
        for step in compare_steps:
            assert len(step.highlights) > 0

    def test_highlights_during_swap(self):
        """Test that swapped elements are highlighted."""
        sorter = QuickSort()
        arr = [5, 2, 8, 1]  # Will cause swaps

        steps = list(sorter.sort(arr))

        # Find swap steps
        swap_steps = [s for s in steps if s.operation == "swap"]

        if swap_steps:  # Only if swaps occurred
            for step in swap_steps:
                assert len(step.highlights) > 0


class TestQuickSortEdgeCases:
    """Test Quick Sort edge cases and special scenarios."""

    def test_empty_array(self):
        """Test sorting empty array."""
        sorter = QuickSort()
        arr = []

        steps = list(sorter.sort(arr))

        assert arr == []
        assert len(steps) >= 1  # At least init step

    def test_single_element(self):
        """Test sorting single element."""
        sorter = QuickSort()
        arr = [42]

        steps = list(sorter.sort(arr))

        assert arr == [42]

    def test_all_same_elements(self):
        """Test array with all identical elements."""
        sorter = QuickSort()
        arr = [7, 7, 7, 7, 7]

        steps = list(sorter.sort(arr))

        assert arr == [7, 7, 7, 7, 7]

    def test_already_sorted(self):
        """Test already sorted array (worst case for basic quick sort)."""
        sorter = QuickSort()
        arr = [1, 2, 3, 4, 5]

        steps = list(sorter.sort(arr))

        assert arr == [1, 2, 3, 4, 5]
        # Note: This is worst case - many comparisons
        final_step = steps[-1]
        assert final_step.metadata["comparisons"] > 0

    def test_reverse_sorted(self):
        """Test reverse sorted array."""
        sorter = QuickSort()
        arr = [5, 4, 3, 2, 1]

        steps = list(sorter.sort(arr))

        assert arr == [1, 2, 3, 4, 5]


class TestQuickSortReset:
    """Test that QuickSort can be reused after reset."""

    def test_reset_clears_counters(self):
        """Test that reset clears internal counters."""
        sorter = QuickSort()

        # First sort
        list(sorter.sort([5, 2, 8]))

        # Reset is called internally in sort(), so second sort should start fresh
        steps = list(sorter.sort([3, 1, 2]))

        # Step numbers should start from 1 again
        assert steps[0].step_number == 1

    def test_multiple_sorts(self):
        """Test running multiple sorts on same instance."""
        sorter = QuickSort()

        # Sort 1
        arr1 = [5, 2, 8]
        steps1 = list(sorter.sort(arr1))
        assert arr1 == [2, 5, 8]

        # Sort 2
        arr2 = [9, 1, 4]
        steps2 = list(sorter.sort(arr2))
        assert arr2 == [1, 4, 9]

        # Both should have independent step sequences
        assert steps1[0].step_number == 1
        assert steps2[0].step_number == 1
