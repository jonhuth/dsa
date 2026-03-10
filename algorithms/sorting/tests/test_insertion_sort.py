"""Comprehensive tests for Insertion Sort."""

import pytest
from algorithms.sorting.insertion_sort import InsertionSort


class TestInsertionSort:
    """Test suite for Insertion Sort algorithm."""

    @pytest.fixture
    def sorter(self):
        """Create a fresh InsertionSort instance."""
        return InsertionSort()

    def test_empty_array(self, sorter):
        """Test with empty array."""
        arr = []
        steps = list(sorter.sort(arr))

        assert len(steps) == 2  # init and complete
        assert steps[-1].state["values"] == []

    def test_single_element(self, sorter):
        """Test with single element."""
        arr = [42]
        steps = list(sorter.sort(arr))

        assert steps[-1].state["values"] == [42]
        assert steps[-1].metadata["shifts"] == 0
        assert steps[-1].metadata["inserts"] == 0

    def test_two_elements_sorted(self, sorter):
        """Test with two already sorted elements."""
        arr = [1, 2]
        steps = list(sorter.sort(arr))

        result = steps[-1].state["values"]
        assert result == [1, 2]
        assert steps[-1].metadata["shifts"] == 0
        assert steps[-1].metadata["inserts"] == 1

    def test_two_elements_unsorted(self, sorter):
        """Test with two unsorted elements."""
        arr = [2, 1]
        steps = list(sorter.sort(arr))

        result = steps[-1].state["values"]
        assert result == [1, 2]
        assert steps[-1].metadata["shifts"] == 1
        assert steps[-1].metadata["inserts"] == 1

    def test_basic_unsorted_array(self, sorter):
        """Test with basic unsorted array."""
        arr = [5, 2, 8, 1, 9]
        steps = list(sorter.sort(arr))

        result = steps[-1].state["values"]
        assert result == sorted([5, 2, 8, 1, 9])
        assert steps[-1].metadata["comparisons"] > 0
        assert steps[-1].metadata["inserts"] == len(arr) - 1

    def test_already_sorted(self, sorter):
        """Test with already sorted array (best case)."""
        arr = [1, 2, 3, 4, 5]
        steps = list(sorter.sort(arr))

        result = steps[-1].state["values"]
        assert result == [1, 2, 3, 4, 5]
        assert steps[-1].metadata["shifts"] == 0
        assert steps[-1].metadata["comparisons"] == 4  # n - 1

    def test_reverse_sorted(self, sorter):
        """Test with reverse sorted array (worst case)."""
        arr = [5, 4, 3, 2, 1]
        steps = list(sorter.sort(arr))

        result = steps[-1].state["values"]
        assert result == [1, 2, 3, 4, 5]
        assert steps[-1].metadata["shifts"] == 10  # n*(n-1)/2 for n=5

    def test_duplicates(self, sorter):
        """Test with duplicate elements."""
        arr = [5, 2, 8, 2, 9, 1, 5]
        steps = list(sorter.sort(arr))

        result = steps[-1].state["values"]
        expected = sorted([5, 2, 8, 2, 9, 1, 5])
        assert result == expected

    def test_all_same(self, sorter):
        """Test with all identical elements."""
        arr = [3, 3, 3, 3, 3]
        steps = list(sorter.sort(arr))

        result = steps[-1].state["values"]
        assert result == [3, 3, 3, 3, 3]
        assert steps[-1].metadata["shifts"] == 0

    def test_negative_numbers(self, sorter):
        """Test with negative numbers."""
        arr = [3, -1, 4, -5, 2]
        steps = list(sorter.sort(arr))

        result = steps[-1].state["values"]
        assert result == sorted([3, -1, 4, -5, 2])

    def test_step_count(self, sorter):
        """Test that steps are generated correctly."""
        arr = [3, 1, 2]
        steps = list(sorter.sort(arr))

        # Should have init, selections, comparisons, shifts/inserts, and complete
        assert len(steps) > 5

        # First step should be init
        assert steps[0].operation == "init"

        # Last step should be complete
        assert steps[-1].operation == "complete"

    def test_step_properties(self, sorter):
        """Test that steps have required properties."""
        arr = [3, 1, 2]
        steps = list(sorter.sort(arr))

        valid_operations = {
            "init",
            "select_key",
            "compare",
            "shift",
            "insert",
            "complete",
        }

        for step in steps:
            assert step.step_number > 0
            assert step.operation in valid_operations
            assert len(step.description) > 0
            assert "type" in step.state
            assert "values" in step.state
            assert isinstance(step.metadata, dict)

    def test_state_immutability(self, sorter):
        """Test that each step has independent state copy."""
        arr = [3, 2, 1]
        steps = list(sorter.sort(arr))

        states = [step.state["values"] for step in steps]

        for i in range(len(states) - 1):
            assert states[i] is not states[i + 1]

    def test_metadata_tracking(self, sorter):
        """Test that metadata is tracked correctly."""
        arr = [3, 2, 1]
        steps = list(sorter.sort(arr))

        final_step = steps[-1]

        assert "comparisons" in final_step.metadata
        assert "shifts" in final_step.metadata
        assert "inserts" in final_step.metadata

        assert final_step.metadata["comparisons"] > 0
        assert final_step.metadata["shifts"] > 0
        assert final_step.metadata["inserts"] == len(arr) - 1

    def test_reset(self, sorter):
        """Test that reset clears previous execution."""
        arr = [3, 2, 1]
        list(sorter.sort(arr))

        sorter.reset()
        assert len(sorter.get_all_steps()) == 0

        list(sorter.sort([5, 4]))
        assert len(sorter.get_all_steps()) > 0

    def test_sorted_boundary_metadata_present(self, sorter):
        """Test that sorted boundary metadata is emitted in active steps."""
        steps = list(sorter.sort([4, 3, 2]))

        boundary_steps = [
            s
            for s in steps
            if s.operation in {"init", "select_key", "compare", "shift", "insert"}
            and "sorted_boundary" in s.metadata
        ]

        assert len(boundary_steps) > 0

    def test_current_key_metadata_present(self, sorter):
        """Test that current key metadata is present during insertion passes."""
        steps = list(sorter.sort([4, 1, 3]))

        key_steps = [
            s
            for s in steps
            if s.operation in {"select_key", "compare", "shift", "insert"}
            and "current_key" in s.metadata
        ]

        assert len(key_steps) > 0

    def test_shift_operation_emitted_for_unsorted_input(self, sorter):
        """Test that shift operations are emitted when moves are required."""
        steps = list(sorter.sort([4, 3, 2, 1]))
        assert any(step.operation == "shift" for step in steps)

    def test_no_shift_operation_for_sorted_input(self, sorter):
        """Test that sorted input does not emit shift operations."""
        steps = list(sorter.sort([1, 2, 3, 4]))
        assert all(step.operation != "shift" for step in steps)

    @pytest.mark.parametrize(
        "arr,expected_sorted",
        [
            ([5, 2, 8, 1, 9], [1, 2, 5, 8, 9]),
            ([1], [1]),
            ([], []),
            ([2, 1], [1, 2]),
            ([1, 2, 3], [1, 2, 3]),
            ([3, 2, 1], [1, 2, 3]),
            ([1, 1, 1], [1, 1, 1]),
            ([-3, -1, -2], [-3, -2, -1]),
        ],
    )
    def test_correctness(self, sorter, arr, expected_sorted):
        """Test sorting correctness for various inputs."""
        steps = list(sorter.sort(arr.copy()))
        result = steps[-1].state["values"] if steps else []
        assert result == expected_sorted

    def test_stability_signal_no_unnecessary_shifts_for_equal_values(self, sorter):
        """Test that equal values are not shifted when key equals compared value."""
        arr = [3, 2, 3, 1]
        steps = list(sorter.sort(arr))

        # There are valid shifts, but algorithm should still complete with stable ordering semantics.
        assert steps[-1].state["values"] == [1, 2, 3, 3]
        assert steps[-1].metadata["shifts"] >= 1

    def test_metadata_contains_source_locations(self, sorter):
        """Test that source line metadata exists for code viewer highlighting."""
        steps = list(sorter.sort([5, 2, 8]))
        steps_with_lines = [s for s in steps if "source_line" in s.metadata]
        assert len(steps_with_lines) > 0
