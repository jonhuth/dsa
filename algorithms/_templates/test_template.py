"""Template for algorithm tests.

Copy this file and customize for your algorithm.
"""

import pytest
from algorithms._templates.algorithm_template import AlgorithmTemplate


class TestAlgorithmTemplate:
    """Test suite for AlgorithmTemplate."""

    @pytest.fixture
    def algo(self):
        """Create a fresh algorithm instance."""
        return AlgorithmTemplate()

    def test_empty_input(self, algo):
        """Test with empty input."""
        steps = list(algo.execute([]))
        assert len(steps) >= 2  # At least init and complete

    def test_single_element(self, algo):
        """Test with single element."""
        steps = list(algo.execute([1]))
        assert len(steps) >= 2

    def test_basic_functionality(self, algo):
        """Test basic algorithm functionality."""
        input_data = [5, 2, 8, 1, 9]
        steps = list(algo.execute(input_data))

        # Verify steps were generated
        assert len(steps) > 0

        # Verify first step is initialization
        assert steps[0].operation == "init"

        # Verify last step is completion
        assert steps[-1].operation == "complete"

    def test_already_processed(self, algo):
        """Test with already processed input (best case)."""
        # TODO: Implement based on algorithm (e.g., sorted array for sorting)
        pass

    def test_worst_case(self, algo):
        """Test worst-case input."""
        # TODO: Implement based on algorithm (e.g., reverse sorted for sorting)
        pass

    def test_duplicates(self, algo):
        """Test with duplicate elements."""
        input_data = [5, 2, 5, 1, 2]
        steps = list(algo.execute(input_data))
        assert len(steps) > 0

    @pytest.mark.parametrize(
        "input_data",
        [
            [1],
            [1, 2],
            [2, 1],
            [1, 2, 3],
            [3, 2, 1],
            [5, 2, 8, 1, 9],
        ],
    )
    def test_various_inputs(self, algo, input_data):
        """Test with various input sizes and orderings."""
        steps = list(algo.execute(input_data))
        assert len(steps) > 0
        assert steps[0].operation == "init"
        assert steps[-1].operation == "complete"

    def test_step_properties(self, algo):
        """Test that steps have required properties."""
        steps = list(algo.execute([3, 1, 2]))

        for step in steps:
            # Verify step has required fields
            assert hasattr(step, "step_number")
            assert hasattr(step, "operation")
            assert hasattr(step, "description")
            assert hasattr(step, "state")
            assert hasattr(step, "highlights")
            assert hasattr(step, "metadata")

            # Verify step number is positive
            assert step.step_number > 0

            # Verify description is not empty
            assert len(step.description) > 0

    def test_reset(self, algo):
        """Test that reset clears steps."""
        list(algo.execute([1, 2, 3]))
        algo.reset()
        assert len(algo.get_all_steps()) == 0
