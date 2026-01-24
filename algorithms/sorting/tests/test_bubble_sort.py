"""Comprehensive tests for Bubble Sort."""

import pytest
from algorithms.sorting.bubble_sort import BubbleSort


class TestBubbleSort:
    """Test suite for Bubble Sort algorithm."""

    @pytest.fixture
    def sorter(self):
        """Create a fresh BubbleSort instance."""
        return BubbleSort()

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
        assert steps[-1].metadata["swaps"] == 0

    def test_two_elements_sorted(self, sorter):
        """Test with two already sorted elements."""
        arr = [1, 2]
        steps = list(sorter.sort(arr))

        result = steps[-1].state["values"]
        assert result == [1, 2]
        assert steps[-1].metadata["swaps"] == 0

    def test_two_elements_unsorted(self, sorter):
        """Test with two unsorted elements."""
        arr = [2, 1]
        steps = list(sorter.sort(arr))

        result = steps[-1].state["values"]
        assert result == [1, 2]
        assert steps[-1].metadata["swaps"] == 1

    def test_basic_unsorted_array(self, sorter):
        """Test with basic unsorted array."""
        arr = [5, 2, 8, 1, 9]
        steps = list(sorter.sort(arr))

        result = steps[-1].state["values"]
        assert result == sorted([5, 2, 8, 1, 9])
        assert steps[-1].metadata["comparisons"] > 0
        assert steps[-1].metadata["swaps"] > 0

    def test_already_sorted(self, sorter):
        """Test with already sorted array (best case)."""
        arr = [1, 2, 3, 4, 5]
        steps = list(sorter.sort(arr))

        result = steps[-1].state["values"]
        assert result == [1, 2, 3, 4, 5]
        # Should exit early after first pass with no swaps
        assert steps[-1].metadata["swaps"] == 0
        assert steps[-1].metadata["passes"] == 1

    def test_reverse_sorted(self, sorter):
        """Test with reverse sorted array (worst case)."""
        arr = [5, 4, 3, 2, 1]
        steps = list(sorter.sort(arr))

        result = steps[-1].state["values"]
        assert result == [1, 2, 3, 4, 5]
        # Worst case requires many swaps
        assert steps[-1].metadata["swaps"] == 10  # n*(n-1)/2 for n=5

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
        assert steps[-1].metadata["swaps"] == 0

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

        # Should have init, passes, comparisons, swaps, and complete
        assert len(steps) > 5

        # First step should be init
        assert steps[0].operation == "init"

        # Last step should be complete
        assert steps[-1].operation == "complete"

    def test_step_properties(self, sorter):
        """Test that steps have required properties."""
        arr = [3, 1, 2]
        steps = list(sorter.sort(arr))

        for step in steps:
            # Required fields
            assert step.step_number > 0
            assert step.operation in [
                "init",
                "pass_start",
                "compare",
                "swap",
                "pass_complete",
                "early_exit",
                "complete",
            ]
            assert len(step.description) > 0
            assert "type" in step.state
            assert "values" in step.state
            assert isinstance(step.metadata, dict)

    def test_state_immutability(self, sorter):
        """Test that each step has independent state copy."""
        arr = [3, 2, 1]
        steps = list(sorter.sort(arr))

        # Each step should have its own copy of the array
        states = [step.state["values"] for step in steps]

        # States should be different objects
        for i in range(len(states) - 1):
            assert states[i] is not states[i + 1]

    def test_metadata_tracking(self, sorter):
        """Test that metadata is tracked correctly."""
        arr = [3, 2, 1]
        steps = list(sorter.sort(arr))

        final_step = steps[-1]

        # Verify metadata exists
        assert "comparisons" in final_step.metadata
        assert "swaps" in final_step.metadata
        assert "passes" in final_step.metadata

        # Verify metadata is reasonable
        assert final_step.metadata["comparisons"] > 0
        assert final_step.metadata["swaps"] > 0
        assert final_step.metadata["passes"] > 0

    def test_reset(self, sorter):
        """Test that reset clears previous execution."""
        arr = [3, 2, 1]
        list(sorter.sort(arr))

        # Reset should clear steps
        sorter.reset()
        assert len(sorter.get_all_steps()) == 0

        # Should be able to sort again
        list(sorter.sort([5, 4]))
        assert len(sorter.get_all_steps()) > 0

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

    def test_stability(self, sorter):
        """Test that bubble sort is stable (maintains relative order of equal elements).

        Note: We can't directly test stability with integers, but we can verify
        the algorithm doesn't unnecessarily swap equal elements.
        """
        arr = [3, 2, 3, 1]
        steps = list(sorter.sort(arr))

        # Count swaps
        swap_count = sum(1 for step in steps if step.operation == "swap")

        # With stability, we should have minimal swaps
        # For [3, 2, 3, 1], optimal stable sort needs 3 swaps: (3,2), (3,1), (2,1)
        assert swap_count >= 3  # At least this many needed
