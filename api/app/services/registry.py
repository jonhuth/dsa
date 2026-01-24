"""Algorithm registry service for discovering and managing algorithms."""

import sys
from pathlib import Path
from typing import Any

# Add parent directory to path to import algorithms
algorithms_path = Path(__file__).parent.parent.parent.parent / "algorithms"
sys.path.insert(0, str(algorithms_path.parent))


class AlgorithmRegistry:
    """Registry for discovering and executing algorithms."""

    def __init__(self):
        self._algorithms = {}
        self._discover_algorithms()

    def _discover_algorithms(self):
        """Discover available algorithms."""
        # For now, manually register algorithms
        # TODO: Auto-discover from algorithms directory
        from algorithms.sorting.bubble_sort import BubbleSort
        from algorithms.sorting.quick_sort import QuickSort
        from algorithms.sorting.merge_sort import MergeSort

        self._algorithms["bubble_sort"] = {
            "id": "bubble_sort",
            "name": "Bubble Sort",
            "category": "sorting",
            "class": BubbleSort,
            "visualizer_type": BubbleSort.visualizer_type.value,
        }

        self._algorithms["quick_sort"] = {
            "id": "quick_sort",
            "name": "Quick Sort",
            "category": "sorting",
            "class": QuickSort,
            "visualizer_type": QuickSort.visualizer_type.value,
        }

        self._algorithms["merge_sort"] = {
            "id": "merge_sort",
            "name": "Merge Sort",
            "category": "sorting",
            "class": MergeSort,
            "visualizer_type": MergeSort.visualizer_type.value,
        }

    def get_algorithm(self, algorithm_id: str) -> dict[str, Any] | None:
        """Get algorithm metadata by ID."""
        return self._algorithms.get(algorithm_id)

    def list_algorithms(self) -> list[dict[str, Any]]:
        """List all available algorithms."""
        return [
            {
                "id": algo["id"],
                "name": algo["name"],
                "category": algo["category"],
                "visualizer_type": algo["visualizer_type"],
            }
            for algo in self._algorithms.values()
        ]

    def execute_algorithm(self, algorithm_id: str, input_data: Any) -> list[dict[str, Any]]:
        """Execute an algorithm and return all steps.

        Args:
            algorithm_id: ID of the algorithm to execute
            input_data: Input data for the algorithm

        Returns:
            List of step dictionaries
        """
        algo_info = self.get_algorithm(algorithm_id)
        if not algo_info:
            raise ValueError(f"Algorithm not found: {algorithm_id}")

        # Instantiate and execute
        algo_class = algo_info["class"]
        instance = algo_class()

        # Execute based on algorithm type
        if algorithm_id in ["bubble_sort", "quick_sort", "merge_sort"]:
            steps = list(instance.sort(input_data))
        else:
            raise ValueError(f"Unknown execution method for algorithm: {algorithm_id}")

        # Convert Step objects to dictionaries
        return [step.model_dump() for step in steps]


# Global registry instance
registry = AlgorithmRegistry()
