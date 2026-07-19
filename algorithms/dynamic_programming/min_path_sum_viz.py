"""Minimum Path Sum - Cheapest top-left to bottom-right path in a cost grid.

Given an m×n grid of non-negative numbers, find a path from the top-left cell
to the bottom-right cell that minimizes the sum of the numbers along the path.
You may only move either down or right at any point in time.

Time Complexity: O(m * n) - each cell is computed exactly once
Space Complexity: O(m * n) for the DP/cost table (optimizable to O(n) with a rolling row)

Key Insights:
    - cost[i][j] = minimum sum to reach cell (i, j) from the top-left
    - Recurrence: cost[i][j] = grid[i][j] + min(cost[i-1][j], cost[i][j-1])
    - First row is a prefix sum along the top (only "right" moves are possible)
    - First column is a prefix sum down the left (only "down" moves are possible)
    - Answer is the bottom-right cell cost[m-1][n-1]
    - Because all costs are non-negative, a simple DP (no Dijkstra) is optimal
    - Used in: grid pathfinding, image seam carving, dynamic-programming interviews
"""

from collections.abc import Generator
from typing import Any

from algorithms.base import Step, StepTracker, VisualizerType


class MinPathSum(StepTracker):
    """Minimum Path Sum solver with DP grid visualization."""

    visualizer_type = VisualizerType.GRID

    def __init__(self):
        super().__init__()
        self.cells_filled = 0

    def run(self, input_data: dict[str, Any]) -> Generator[Step, None, None]:
        """Compute the minimum path sum through a grid of non-negative costs.

        Args:
            input_data: Dict with key ``grid`` (a list of lists of non-negative ints).

        Yields:
            Step objects for grid visualization, ending with a "complete" step.
        """
        self.reset()
        self.cells_filled = 0

        grid = input_data.get("grid", [])
        m = len(grid)
        n = len(grid[0]) if m > 0 else 0

        # Handle degenerate empty grid gracefully.
        if m == 0 or n == 0:
            yield self.emit_step(
                operation="complete",
                description="Empty grid: minimum path sum is 0 (no cells to traverse)",
                state={"type": "grid", "grid": []},
                highlights=[],
                metadata={"m": m, "n": n, "min_path_sum": 0, "cells_filled": 0},
            )
            return

        # cost[i][j] = minimum sum to reach cell (i, j) from the top-left
        cost = [[0 for _ in range(n)] for _ in range(m)]

        yield self.emit_step(
            operation="init",
            description=(
                f"Building {m}×{n} cost table. cost[i][j] = minimum sum to reach cell (i, j) "
                f"moving only down or right"
            ),
            state={"type": "grid", "grid": [row[:] for row in grid]},
            highlights=[],
            metadata={"m": m, "n": n, "cells_filled": self.cells_filled},
        )

        # Fill the cost table row by row, left to right.
        for i in range(m):
            for j in range(n):
                if i == 0 and j == 0:
                    # Starting cell: cost is just its own value.
                    cost[i][j] = grid[i][j]
                    self.cells_filled += 1
                    yield self.emit_step(
                        operation="start",
                        description=(f"Start cell (0, 0): cost[0][0] = grid[0][0] = {cost[i][j]}"),
                        state={"type": "grid", "grid": [row[:] for row in cost]},
                        highlights=[{"type": "cell", "row": 0, "col": 0, "color": "active"}],
                        metadata={
                            "i": i,
                            "j": j,
                            "grid_value": grid[i][j],
                            "value": cost[i][j],
                            "cells_filled": self.cells_filled,
                        },
                    )
                elif i == 0:
                    # First row: can only arrive from the left (prefix sum).
                    left = cost[i][j - 1]
                    cost[i][j] = grid[i][j] + left
                    self.cells_filled += 1
                    yield self.emit_step(
                        operation="prefix_row",
                        description=(
                            f"First row cell (0, {j}): only 'right' moves reach here. "
                            f"cost[0][{j}] = grid[0][{j}]({grid[i][j]}) + left({left}) = {cost[i][j]}"
                        ),
                        state={"type": "grid", "grid": [row[:] for row in cost]},
                        highlights=[
                            {"type": "cell", "row": i, "col": j, "color": "active"},
                            {"type": "cell", "row": i, "col": j - 1, "color": "comparing"},
                        ],
                        metadata={
                            "i": i,
                            "j": j,
                            "grid_value": grid[i][j],
                            "from": "left",
                            "left": left,
                            "value": cost[i][j],
                            "cells_filled": self.cells_filled,
                        },
                    )
                elif j == 0:
                    # First column: can only arrive from above (prefix sum).
                    up = cost[i - 1][j]
                    cost[i][j] = grid[i][j] + up
                    self.cells_filled += 1
                    yield self.emit_step(
                        operation="prefix_col",
                        description=(
                            f"First column cell ({i}, 0): only 'down' moves reach here. "
                            f"cost[{i}][0] = grid[{i}][0]({grid[i][j]}) + up({up}) = {cost[i][j]}"
                        ),
                        state={"type": "grid", "grid": [row[:] for row in cost]},
                        highlights=[
                            {"type": "cell", "row": i, "col": j, "color": "active"},
                            {"type": "cell", "row": i - 1, "col": j, "color": "comparing"},
                        ],
                        metadata={
                            "i": i,
                            "j": j,
                            "grid_value": grid[i][j],
                            "from": "up",
                            "up": up,
                            "value": cost[i][j],
                            "cells_filled": self.cells_filled,
                        },
                    )
                else:
                    # Interior cell: choose the cheaper of the cell above and the cell to the left.
                    up = cost[i - 1][j]
                    left = cost[i][j - 1]
                    best = min(up, left)
                    cost[i][j] = grid[i][j] + best
                    self.cells_filled += 1

                    if up <= left:
                        won = "up"
                        won_row, won_col = i - 1, j
                    else:
                        won = "left"
                        won_row, won_col = i, j - 1

                    yield self.emit_step(
                        operation="fill",
                        description=(
                            f"Cell ({i}, {j}): cost = grid[{i}][{j}]({grid[i][j]}) + "
                            f"min(up={up}, left={left}) = {grid[i][j]} + {best} = {cost[i][j]} "
                            f"(came from {won})"
                        ),
                        state={"type": "grid", "grid": [row[:] for row in cost]},
                        highlights=[
                            {"type": "cell", "row": i, "col": j, "color": "active"},
                            {"type": "cell", "row": won_row, "col": won_col, "color": "comparing"},
                            {
                                "type": "cell",
                                "row": (i - 1) if won == "left" else i,
                                "col": j if won == "left" else (j - 1),
                                "color": "visited",
                            },
                        ],
                        metadata={
                            "i": i,
                            "j": j,
                            "grid_value": grid[i][j],
                            "up": up,
                            "left": left,
                            "from": won,
                            "value": cost[i][j],
                            "cells_filled": self.cells_filled,
                        },
                    )

        result = cost[m - 1][n - 1]

        yield self.emit_step(
            operation="complete",
            description=(
                f"Minimum path sum is {result} (bottom-right cell cost[{m - 1}][{n - 1}]). "
                f"Filled all {self.cells_filled} cells"
            ),
            state={"type": "grid", "grid": [row[:] for row in cost]},
            highlights=[{"type": "cell", "row": m - 1, "col": n - 1, "color": "sorted"}],
            metadata={
                "m": m,
                "n": n,
                "min_path_sum": result,
                "cells_filled": self.cells_filled,
            },
        )
