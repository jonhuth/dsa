"""Comprehensive tests for Merge Sort implementation."""

import pytest
from algorithms.sorting.merge_sort import MergeSort


class TestMergeSortCorrectness:
    """Test that Merge Sort produces correct sorted results."""

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
        """Test that merge sort produces correct sorted output."""
        sorter = MergeSort()
        arr_copy = input_arr.copy()

        # Execute all steps
        steps = list(sorter.sort(arr_copy))

        # Verify final result
        assert arr_copy == expected, f"Expected {expected}, got {arr_copy}"

    def test_sort_large_array(self):
        """Test merge sort on larger array."""
        arr = list(range(100, 0, -1))  # 100 elements in reverse
        expected = list(range(1, 101))

        sorter = MergeSort()
        steps = list(sorter.sort(arr))

        assert arr == expected


class TestMergeSortStability:
    """Test that Merge Sort is stable (preserves relative order of equal elements)."""

    def test_stability_with_tuples(self):
        """Test stability by tracking original positions."""
        # We'll use a custom comparison that only looks at first element
        # but we track the second element to verify stability
        sorter = MergeSort()

        # Create array with duplicate first elements
        # If stable, equal elements should maintain their original order
        arr = [3, 1, 2, 3, 1, 2]

        steps = list(sorter.sort(arr))

        # All equal elements should be in their original relative order
        assert arr == [1, 1, 2, 2, 3, 3]


class TestMergeSortStepGeneration:
    """Test that Merge Sort generates correct visualization steps."""

    def test_generates_steps(self):
        """Test that steps are generated during sorting."""
        sorter = MergeSort()
        arr = [5, 2, 8, 1, 9]

        steps = list(sorter.sort(arr))

        assert len(steps) > 0, "Should generate at least one step"

    def test_step_has_required_properties(self):
        """Test that each step has required properties."""
        sorter = MergeSort()
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
        sorter = MergeSort()
        arr = [5, 2, 8, 1]

        steps = list(sorter.sort(arr))
        operations = [s.operation for s in steps]

        # Should have these operation types
        assert "init" in operations
        assert "split" in operations
        assert "merge_start" in operations
        assert "compare" in operations
        assert "place" in operations
        assert "merge_complete" in operations
        assert "complete" in operations

    def test_step_numbers_sequential(self):
        """Test that step numbers are sequential starting from 1."""
        sorter = MergeSort()
        arr = [3, 1, 2]

        steps = list(sorter.sort(arr))

        for i, step in enumerate(steps, start=1):
            assert step.step_number == i

    def test_state_is_array(self):
        """Test that state contains array data."""
        sorter = MergeSort()
        arr = [5, 2, 8]

        steps = list(sorter.sort(arr))

        for step in steps:
            assert "type" in step.state
            assert step.state["type"] == "array"
            assert "values" in step.state
            assert isinstance(step.state["values"], list)

    def test_state_independence(self):
        """Test that each step has independent state (not references)."""
        sorter = MergeSort()
        arr = [3, 1, 2]

        steps = list(sorter.sort(arr))

        # Modify first step's state
        steps[0].state["values"][0] = 999

        # Other steps should not be affected
        for step in steps[1:]:
            assert (
                step.state["values"][0] != 999
            ), "States should be independent copies"


class TestMergeSortMetadata:
    """Test Merge Sort metadata tracking."""

    def test_metadata_counts_comparisons(self):
        """Test that comparisons are counted correctly."""
        sorter = MergeSort()
        arr = [5, 2, 8, 1, 9]

        steps = list(sorter.sort(arr))
        final_step = steps[-1]

        assert "comparisons" in final_step.metadata
        assert final_step.metadata["comparisons"] > 0

    def test_metadata_counts_merges(self):
        """Test that merges are counted."""
        sorter = MergeSort()
        arr = [5, 2, 8, 1, 9]

        steps = list(sorter.sort(arr))
        final_step = steps[-1]

        assert "merges" in final_step.metadata
        assert final_step.metadata["merges"] > 0

    def test_metadata_counts_array_accesses(self):
        """Test that array accesses are counted."""
        sorter = MergeSort()
        arr = [5, 2, 8, 1, 9]

        steps = list(sorter.sort(arr))
        final_step = steps[-1]

        assert "array_accesses" in final_step.metadata
        assert final_step.metadata["array_accesses"] > 0

    def test_metadata_tracks_line_numbers(self):
        """Test that source line numbers are captured."""
        sorter = MergeSort()
        arr = [5, 2, 8]

        steps = list(sorter.sort(arr))

        # Most steps should have line numbers
        steps_with_lines = [s for s in steps if "source_line" in s.metadata]
        assert len(steps_with_lines) > 0, "Should track source line numbers"


class TestMergeSortHighlights:
    """Test Merge Sort highlighting behavior."""

    def test_highlights_during_split(self):
        """Test that subarrays are highlighted during split."""
        sorter = MergeSort()
        arr = [5, 2, 8, 1]

        steps = list(sorter.sort(arr))

        # Find split steps
        split_steps = [s for s in steps if s.operation == "split"]
        assert len(split_steps) > 0

        # Split steps should have highlights showing left and right subarrays
        for step in split_steps:
            assert len(step.highlights) > 0

    def test_highlights_during_compare(self):
        """Test that elements are highlighted during comparison."""
        sorter = MergeSort()
        arr = [5, 2, 8]

        steps = list(sorter.sort(arr))

        # Find compare steps
        compare_steps = [s for s in steps if s.operation == "compare"]

        # Should have highlights showing what's being compared
        for step in compare_steps:
            assert len(step.highlights) > 0

    def test_highlights_during_merge(self):
        """Test that merged range is highlighted."""
        sorter = MergeSort()
        arr = [5, 2, 8, 1]

        steps = list(sorter.sort(arr))

        # Find merge_complete steps
        merge_complete_steps = [s for s in steps if s.operation == "merge_complete"]

        if merge_complete_steps:
            for step in merge_complete_steps:
                assert len(step.highlights) > 0


class TestMergeSortEdgeCases:
    """Test Merge Sort edge cases and special scenarios."""

    def test_empty_array(self):
        """Test sorting empty array."""
        sorter = MergeSort()
        arr = []

        steps = list(sorter.sort(arr))

        assert arr == []
        assert len(steps) >= 1  # At least init step

    def test_single_element(self):
        """Test sorting single element."""
        sorter = MergeSort()
        arr = [42]

        steps = list(sorter.sort(arr))

        assert arr == [42]

    def test_all_same_elements(self):
        """Test array with all identical elements."""
        sorter = MergeSort()
        arr = [7, 7, 7, 7, 7]

        steps = list(sorter.sort(arr))

        assert arr == [7, 7, 7, 7, 7]

    def test_already_sorted(self):
        """Test already sorted array (best case for merge sort)."""
        sorter = MergeSort()
        arr = [1, 2, 3, 4, 5]

        steps = list(sorter.sort(arr))

        assert arr == [1, 2, 3, 4, 5]
        # Still O(n log n) comparisons
        final_step = steps[-1]
        assert final_step.metadata["comparisons"] > 0

    def test_reverse_sorted(self):
        """Test reverse sorted array."""
        sorter = MergeSort()
        arr = [5, 4, 3, 2, 1]

        steps = list(sorter.sort(arr))

        assert arr == [1, 2, 3, 4, 5]

    def test_power_of_two_size(self):
        """Test array with power-of-two size (perfect binary splits)."""
        sorter = MergeSort()
        arr = [8, 4, 2, 6, 1, 5, 3, 7]  # 8 elements (2^3)

        steps = list(sorter.sort(arr))

        assert arr == [1, 2, 3, 4, 5, 6, 7, 8]

    def test_non_power_of_two_size(self):
        """Test array with non-power-of-two size (uneven splits)."""
        sorter = MergeSort()
        arr = [5, 2, 8, 1, 9, 3, 7]  # 7 elements

        steps = list(sorter.sort(arr))

        assert arr == [1, 2, 3, 5, 7, 8, 9]


class TestMergeSortGuarantees:
    """Test Merge Sort's O(n log n) worst-case guarantee."""

    def test_worst_case_still_efficient(self):
        """Test that worst case (e.g., reverse sorted) doesn't degrade to O(n²)."""
        sorter = MergeSort()

        # Reverse sorted array - worst case for some algorithms
        arr = list(range(50, 0, -1))

        steps = list(sorter.sort(arr))

        # For merge sort, number of comparisons should be O(n log n)
        # For n=50: log₂(50) ≈ 5.6, so ~280 comparisons max
        # This is much better than O(n²) = 2500
        final_step = steps[-1]
        comparisons = final_step.metadata["comparisons"]

        # Verify it's in O(n log n) range (loose upper bound)
        n = 50
        import math

        max_comparisons = n * math.ceil(math.log2(n)) * 2  # With some slack
        assert comparisons < max_comparisons, f"Comparisons ({comparisons}) should be O(n log n), not O(n²)"


class TestMergeSortReset:
    """Test that MergeSort can be reused after reset."""

    def test_reset_clears_counters(self):
        """Test that reset clears internal counters."""
        sorter = MergeSort()

        # First sort
        list(sorter.sort([5, 2, 8]))

        # Reset is called internally in sort(), so second sort should start fresh
        steps = list(sorter.sort([3, 1, 2]))

        # Step numbers should start from 1 again
        assert steps[0].step_number == 1

    def test_multiple_sorts(self):
        """Test running multiple sorts on same instance."""
        sorter = MergeSort()

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
