"""0/1 Knapsack - Classic optimization problem using dynamic programming.

Time Complexity: O(n * W) where n = items, W = capacity
Space Complexity: O(n * W) for DP table

Key Insights:
    - Each item can be taken or not taken (0/1 decision)
    - Subproblem: max value with first i items and capacity w
    - Recurrence: dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])
    - Used in: resource allocation, budget optimization, cargo loading
"""

from typing import Generator, List, Tuple
from algorithms.base import StepTracker, Step, VisualizerType


class Knapsack(StepTracker):
    """0/1 Knapsack problem solver with DP table visualization."""

    visualizer_type = VisualizerType.ARRAY

    def __init__(self):
        super().__init__()
        self.comparisons = 0

    def solve(
        self, items: List[Tuple[int, int]], capacity: int
    ) -> Generator[Step, None, None]:
        """Solve 0/1 knapsack problem.

        Args:
            items: List of (weight, value) tuples
            capacity: Maximum weight capacity

        Yields:
            Step objects for visualization
        """
        self.reset()
        self.comparisons = 0
        n = len(items)

        # Create DP table
        dp = [[0 for _ in range(capacity + 1)] for _ in range(n + 1)]

        yield self.emit_step(
            operation="init",
            description=f"Solving knapsack: {n} items, capacity {capacity}",
            state={"type": "array", "values": [0] * (capacity + 1)},
            highlights=[],
            metadata={
                "n": n,
                "capacity": capacity,
                "items": items,
                "comparisons": self.comparisons,
            },
        )

        # Build DP table
        for i in range(1, n + 1):
            weight, value = items[i - 1]

            for w in range(capacity + 1):
                # Item too heavy, can't take it
                if weight > w:
                    dp[i][w] = dp[i - 1][w]

                    yield self.emit_step(
                        operation="skip",
                        description=f"Item {i} (w={weight}, v={value}) too heavy for capacity {w}",
                        state={"type": "array", "values": dp[i].copy()},
                        highlights=[{"indices": [w], "color": "visited"}],
                        metadata={
                            "item": i,
                            "weight": weight,
                            "value": value,
                            "capacity_current": w,
                            "comparisons": self.comparisons,
                        },
                    )
                else:
                    # Choose max of taking or not taking the item
                    take = dp[i - 1][w - weight] + value
                    skip = dp[i - 1][w]
                    self.comparisons += 1

                    dp[i][w] = max(take, skip)
                    decision = "take" if take > skip else "skip"

                    yield self.emit_step(
                        operation="decide",
                        description=f"Item {i} (w={weight}, v={value}): {decision} (take={take}, skip={skip})",
                        state={"type": "array", "values": dp[i].copy()},
                        highlights=[
                            {"indices": [w], "color": "active"},
                            {"indices": list(range(w)), "color": "sorted"},
                        ],
                        metadata={
                            "item": i,
                            "weight": weight,
                            "value": value,
                            "capacity_current": w,
                            "take_value": take,
                            "skip_value": skip,
                            "decision": decision,
                            "comparisons": self.comparisons,
                        },
                    )

        # Backtrack to find which items were selected
        selected = []
        w = capacity
        for i in range(n, 0, -1):
            if dp[i][w] != dp[i - 1][w]:
                selected.append(i)
                weight, value = items[i - 1]
                w -= weight

        selected.reverse()

        total_weight = sum(items[i - 1][0] for i in selected)
        total_value = dp[n][capacity]

        yield self.emit_step(
            operation="complete",
            description=f"Optimal value: {total_value} (items: {selected})",
            state={"type": "array", "values": dp[n].copy()},
            highlights=[{"indices": [capacity], "color": "sorted"}],
            metadata={
                "max_value": total_value,
                "selected_items": selected,
                "total_weight": total_weight,
                "total_value": total_value,
                "comparisons": self.comparisons,
            },
        )
