"""Template for creating a new algorithm.

Copy this file and fill in the implementation.
"""

from typing import Any, Generator
from algorithms.base import Step, StepTracker, VisualizerType


class AlgorithmTemplate(StepTracker):
    """[Brief description of the algorithm].

    Time Complexity:
        Best: O(?)
        Average: O(?)
        Worst: O(?)

    Space Complexity: O(?)

    Attributes:
        visualizer_type: Type of visualizer to use
    """

    visualizer_type = VisualizerType.ARRAY  # Change as needed

    def execute(self, input_data: Any) -> Generator[Step, None, None]:
        """Execute the algorithm and yield visualization steps.

        Args:
            input_data: Input to the algorithm

        Yields:
            Step objects for visualization

        Example:
            >>> algo = AlgorithmTemplate()
            >>> steps = list(algo.execute([5, 2, 8, 1]))
            >>> len(steps) > 0
            True
        """
        # Reset step counter for fresh execution
        self.reset()

        # Initial state
        yield self.emit_step(
            operation="init",
            description="Initialize algorithm",
            state={"type": "array", "values": input_data},
            metadata={"step": "initialization"},
        )

        # TODO: Implement algorithm logic here
        # Use self.emit_step() to yield visualization steps

        # Final state
        yield self.emit_step(
            operation="complete",
            description="Algorithm complete",
            state={"type": "array", "values": input_data},
            metadata={"step": "complete"},
        )


if __name__ == "__main__":
    # Example usage and simple test
    algo = AlgorithmTemplate()
    test_input = [5, 2, 8, 1, 9]

    print(f"Testing {algo.__class__.__name__}")
    print(f"Input: {test_input}")

    steps = list(algo.execute(test_input))
    print(f"Generated {len(steps)} steps")

    for i, step in enumerate(steps[:5]):  # Show first 5 steps
        print(f"Step {i+1}: {step.operation} - {step.description}")
