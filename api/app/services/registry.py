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
        from algorithms.sorting.insertion_sort import InsertionSort
        from algorithms.sorting.selection_sort import SelectionSort
        from algorithms.sorting.heap_sort import HeapSort
        from algorithms.graphs.bfs import BFS
        from algorithms.graphs.dfs import DFS
        from algorithms.graphs.dijkstra import Dijkstra
        from algorithms.search.binary_search import BinarySearch
        from algorithms.search.linear_search import LinearSearch
        from algorithms.trees.bst import BST
        from algorithms.dynamic_programming.fibonacci import Fibonacci
        from algorithms.dynamic_programming.knapsack import Knapsack
        from algorithms.dynamic_programming.lcs import LCS

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

        self._algorithms["insertion_sort"] = {
            "id": "insertion_sort",
            "name": "Insertion Sort",
            "category": "sorting",
            "class": InsertionSort,
            "visualizer_type": InsertionSort.visualizer_type.value,
        }

        self._algorithms["selection_sort"] = {
            "id": "selection_sort",
            "name": "Selection Sort",
            "category": "sorting",
            "class": SelectionSort,
            "visualizer_type": SelectionSort.visualizer_type.value,
        }

        self._algorithms["heap_sort"] = {
            "id": "heap_sort",
            "name": "Heap Sort",
            "category": "sorting",
            "class": HeapSort,
            "visualizer_type": HeapSort.visualizer_type.value,
        }

        self._algorithms["bfs"] = {
            "id": "bfs",
            "name": "Breadth-First Search",
            "category": "graphs",
            "class": BFS,
            "visualizer_type": BFS.visualizer_type.value,
        }

        self._algorithms["dfs"] = {
            "id": "dfs",
            "name": "Depth-First Search",
            "category": "graphs",
            "class": DFS,
            "visualizer_type": DFS.visualizer_type.value,
        }

        self._algorithms["dijkstra"] = {
            "id": "dijkstra",
            "name": "Dijkstra's Algorithm",
            "category": "graphs",
            "class": Dijkstra,
            "visualizer_type": Dijkstra.visualizer_type.value,
        }

        self._algorithms["binary_search"] = {
            "id": "binary_search",
            "name": "Binary Search",
            "category": "search",
            "class": BinarySearch,
            "visualizer_type": BinarySearch.visualizer_type.value,
        }

        self._algorithms["linear_search"] = {
            "id": "linear_search",
            "name": "Linear Search",
            "category": "search",
            "class": LinearSearch,
            "visualizer_type": LinearSearch.visualizer_type.value,
        }

        self._algorithms["bst_insert"] = {
            "id": "bst_insert",
            "name": "BST Insert",
            "category": "trees",
            "class": BST,
            "visualizer_type": BST.visualizer_type.value,
        }

        self._algorithms["bst_search"] = {
            "id": "bst_search",
            "name": "BST Search",
            "category": "trees",
            "class": BST,
            "visualizer_type": BST.visualizer_type.value,
        }

        self._algorithms["fibonacci_memo"] = {
            "id": "fibonacci_memo",
            "name": "Fibonacci (Memoization)",
            "category": "dynamic_programming",
            "class": Fibonacci,
            "visualizer_type": Fibonacci.visualizer_type.value,
        }

        self._algorithms["fibonacci_tab"] = {
            "id": "fibonacci_tab",
            "name": "Fibonacci (Tabulation)",
            "category": "dynamic_programming",
            "class": Fibonacci,
            "visualizer_type": Fibonacci.visualizer_type.value,
        }

        self._algorithms["knapsack"] = {
            "id": "knapsack",
            "name": "0/1 Knapsack",
            "category": "dynamic_programming",
            "class": Knapsack,
            "visualizer_type": Knapsack.visualizer_type.value,
        }

        self._algorithms["lcs"] = {
            "id": "lcs",
            "name": "Longest Common Subsequence",
            "category": "dynamic_programming",
            "class": LCS,
            "visualizer_type": LCS.visualizer_type.value,
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
        if algorithm_id in [
            "bubble_sort",
            "quick_sort",
            "merge_sort",
            "insertion_sort",
            "selection_sort",
            "heap_sort",
        ]:
            steps = list(instance.sort(input_data))
        elif algorithm_id in ["bfs", "dfs"]:
            # Graph algorithms expect: {"graph": {}, "start": int, "target": int}
            graph = input_data.get("graph", {})
            start = input_data.get("start", 0)
            target = input_data.get("target")
            steps = list(instance.search(graph, start, target))
        elif algorithm_id == "dijkstra":
            # Dijkstra expects: {"graph": {node: [(neighbor, weight), ...]}, "start": int, "target": int}
            graph = input_data.get("graph", {})
            start = input_data.get("start", 0)
            target = input_data.get("target")
            steps = list(instance.shortest_path(graph, start, target))
        elif algorithm_id in ["binary_search", "linear_search"]:
            # Search algorithms expect: {"array": [], "target": int}
            arr = input_data.get("array", input_data if isinstance(input_data, dict) else [])
            target = input_data.get("target", 0) if isinstance(input_data, dict) else 0
            steps = list(instance.search(arr, target))
        elif algorithm_id == "bst_insert":
            # BST insert expects: list of values
            values = input_data if isinstance(input_data, list) else input_data.get("values", [])
            steps = list(instance.insert(values))
        elif algorithm_id == "bst_search":
            # BST search expects: {"values": [], "target": int}
            values = input_data.get("values", [])
            target = input_data.get("target", 0)
            steps = list(instance.search(values, target))
        elif algorithm_id == "fibonacci_memo":
            # Fibonacci memoization expects: int or {"n": int}
            n = input_data if isinstance(input_data, int) else input_data.get("n", 10)
            steps = list(instance.compute_memoization(n))
        elif algorithm_id == "fibonacci_tab":
            # Fibonacci tabulation expects: int or {"n": int}
            n = input_data if isinstance(input_data, int) else input_data.get("n", 10)
            steps = list(instance.compute_tabulation(n))
        elif algorithm_id == "knapsack":
            # Knapsack expects: {"items": [(weight, value), ...], "capacity": int}
            items = input_data.get("items", [])
            capacity = input_data.get("capacity", 10)
            steps = list(instance.solve(items, capacity))
        elif algorithm_id == "lcs":
            # LCS expects: {"str1": str, "str2": str}
            str1 = input_data.get("str1", "")
            str2 = input_data.get("str2", "")
            steps = list(instance.compute(str1, str2))
        else:
            raise ValueError(f"Unknown execution method for algorithm: {algorithm_id}")

        # Convert Step objects to dictionaries
        return [step.model_dump() for step in steps]


# Global registry instance
registry = AlgorithmRegistry()
