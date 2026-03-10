"""Comprehensive tests for Binary Search."""

import pytest
from algorithms.search.binary_search import BinarySearch


class TestBinarySearch:
    """Test suite for Binary Search algorithm."""

    @pytest.fixture
    def searcher(self):
        """Create a fresh BinarySearch instance."""
        return BinarySearch()

    def test_empty_array(self, searcher):
        """Test with empty array - target not found."""
        arr = []
        steps = list(searcher.search(arr, 5))

        # init + not_found
        assert len(steps) >= 1
        last = steps[-1]
        assert last.operation == "not_found"
        assert last.metadata["found"] is False

    def test_single_element_found(self, searcher):
        """Test with single element that matches target."""
        arr = [42]
        steps = list(searcher.search(arr, 42))

        assert steps[-1].operation == "found"
        assert steps[-1].metadata["found_index"] == 0

    def test_single_element_not_found(self, searcher):
        """Test with single element that does not match target."""
        arr = [42]
        steps = list(searcher.search(arr, 99))

        assert steps[-1].operation == "not_found"
        assert steps[-1].metadata["found"] is False

    def test_target_at_beginning(self, searcher):
        """Test with target at the first index."""
        arr = [1, 3, 5, 7, 9]
        steps = list(searcher.search(arr, 1))

        assert steps[-1].operation == "found"
        assert steps[-1].metadata["found_index"] == 0

    def test_target_at_end(self, searcher):
        """Test with target at the last index."""
        arr = [1, 3, 5, 7, 9]
        steps = list(searcher.search(arr, 9))

        assert steps[-1].operation == "found"
        assert steps[-1].metadata["found_index"] == 4

    def test_target_at_middle(self, searcher):
        """Test with target exactly at the middle index."""
        arr = [1, 3, 5, 7, 9]
        steps = list(searcher.search(arr, 5))

        assert steps[-1].operation == "found"
        assert steps[-1].metadata["found_index"] == 2
        # Mid hit on first comparison - only 1 comparison
        assert steps[-1].metadata["comparisons"] == 1

    def test_target_not_found(self, searcher):
        """Test when target is not in the array."""
        arr = [1, 3, 5, 7, 9]
        steps = list(searcher.search(arr, 4))

        assert steps[-1].operation == "not_found"
        assert steps[-1].metadata["found"] is False

    def test_target_less_than_all(self, searcher):
        """Test when target is less than all elements."""
        arr = [10, 20, 30, 40, 50]
        steps = list(searcher.search(arr, 5))

        assert steps[-1].operation == "not_found"

    def test_target_greater_than_all(self, searcher):
        """Test when target is greater than all elements."""
        arr = [10, 20, 30, 40, 50]
        steps = list(searcher.search(arr, 99))

        assert steps[-1].operation == "not_found"

    def test_even_length_array(self, searcher):
        """Test with an even-length sorted array."""
        arr = [2, 4, 6, 8]
        steps = list(searcher.search(arr, 6))

        assert steps[-1].operation == "found"
        assert steps[-1].metadata["found_index"] == 2

    def test_step_count_reasonable(self, searcher):
        """Test that the number of steps is reasonable (log n)."""
        arr = list(range(1, 33, 2))  # 16 odd numbers: 1,3,...,31
        target = 15
        steps = list(searcher.search(arr, target))

        # Total comparisons should be at most log2(16)+1 = 5
        comparisons = steps[-1].metadata["comparisons"]
        assert comparisons <= 5

    def test_first_step_is_init(self, searcher):
        """Test that the first step is always init."""
        arr = [1, 2, 3]
        steps = list(searcher.search(arr, 2))

        assert steps[0].operation == "init"
        assert steps[0].metadata["target"] == 2

    def test_step_properties(self, searcher):
        """Test that every step has required properties."""
        arr = [1, 3, 5, 7, 9, 11, 13]
        steps = list(searcher.search(arr, 7))

        valid_ops = {"init", "check_mid", "found", "not_found", "search_right", "search_left"}

        for step in steps:
            assert step.step_number > 0
            assert step.operation in valid_ops
            assert len(step.description) > 0
            assert "type" in step.state
            assert "values" in step.state
            assert isinstance(step.metadata, dict)
            assert "comparisons" in step.metadata
            assert "target" in step.metadata

    def test_state_immutability(self, searcher):
        """Test that each step has an independent copy of the array state."""
        arr = [1, 3, 5, 7, 9]
        steps = list(searcher.search(arr, 7))

        states = [step.state["values"] for step in steps]
        for i in range(len(states) - 1):
            assert states[i] is not states[i + 1]

    def test_metadata_comparisons_increase(self, searcher):
        """Test that comparison count only ever increases across steps."""
        arr = [1, 3, 5, 7, 9, 11, 13, 15]
        steps = list(searcher.search(arr, 11))

        comparisons = [s.metadata["comparisons"] for s in steps if "comparisons" in s.metadata]
        for i in range(len(comparisons) - 1):
            assert comparisons[i + 1] >= comparisons[i]

    def test_check_mid_highlights_mid_index(self, searcher):
        """Test that check_mid steps highlight the mid index."""
        arr = [1, 3, 5, 7, 9]
        steps = list(searcher.search(arr, 9))

        check_mid_steps = [s for s in steps if s.operation == "check_mid"]
        assert len(check_mid_steps) > 0

        for step in check_mid_steps:
            mid = step.metadata["mid"]
            # At least one highlight set should contain the mid index
            all_highlighted = [idx for h in step.highlights for idx in h.indices]
            assert mid in all_highlighted

    def test_reset(self, searcher):
        """Test that reset clears previous execution state."""
        arr = [1, 3, 5]
        list(searcher.search(arr, 3))

        searcher.reset()
        assert len(searcher.get_all_steps()) == 0

        list(searcher.search(arr, 1))
        assert len(searcher.get_all_steps()) > 0

    @pytest.mark.parametrize(
        "arr,target,expected_op",
        [
            ([1, 3, 5, 7, 9], 5, "found"),
            ([1, 3, 5, 7, 9], 1, "found"),
            ([1, 3, 5, 7, 9], 9, "found"),
            ([1, 3, 5, 7, 9], 4, "not_found"),
            ([], 5, "not_found"),
            ([42], 42, "found"),
            ([42], 1, "not_found"),
            ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 7, "found"),
            ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 0, "not_found"),
            ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 11, "not_found"),
        ],
    )
    def test_correctness(self, searcher, arr, target, expected_op):
        """Test search correctness for various inputs."""
        steps = list(searcher.search(arr, target))
        assert steps[-1].operation == expected_op

        if expected_op == "found":
            found_index = steps[-1].metadata["found_index"]
            assert arr[found_index] == target

    @pytest.mark.parametrize(
        "arr,target,expected_index",
        [
            ([1, 3, 5, 7, 9], 1, 0),
            ([1, 3, 5, 7, 9], 3, 1),
            ([1, 3, 5, 7, 9], 5, 2),
            ([1, 3, 5, 7, 9], 7, 3),
            ([1, 3, 5, 7, 9], 9, 4),
        ],
    )
    def test_found_index_accuracy(self, searcher, arr, target, expected_index):
        """Test that found_index is correct for every position."""
        steps = list(searcher.search(arr, target))
        assert steps[-1].operation == "found"
        assert steps[-1].metadata["found_index"] == expected_index

    def test_large_array_logarithmic(self, searcher):
        """Test that binary search is logarithmic on a large array."""
        n = 1024
        arr = list(range(0, n * 2, 2))  # 0, 2, 4, ..., 2046
        target = arr[512]  # middle element
        steps = list(searcher.search(arr, target))

        assert steps[-1].operation == "found"
        # log2(1024) = 10, so at most 11 comparisons
        assert steps[-1].metadata["comparisons"] <= 11
