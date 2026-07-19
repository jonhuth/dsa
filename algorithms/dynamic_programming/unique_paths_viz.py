"""Unique Paths - Count lattice paths in a grid using dynamic programming.

A robot sits in the top-left corner of an ``rows x cols`` grid and wants to
reach the bottom-right corner. It can only move either **right** or **down**
at any point in time. How many distinct paths are there?

Time Complexity: O(rows * cols) - fill each cell of the DP grid once
Space Complexity: O(rows * cols) for the DP grid (optimizable to O(cols))

Key Insights:
    - Every cell in the first row/column has exactly one path (straight line)
    - Recurrence: dp[i][j] = dp[i-1][j] + dp[i][j-1]
      (paths into a cell = paths from directly above + paths from the left)
    - Overlapping subproblems + optimal substructure => classic 2D DP
    - Closed form exists: C(rows+cols-2, rows-1) choose combinations
    - Used in: robot/grid path planning, combinatorics, probability lattices
"""

from collections.abc import Generator
from typing import Any

from algorithms.base import Step, StepTracker, VisualizerType


class UniquePaths(StepTracker):
    """Unique Paths counter with grid DP visualization."""

    visualizer_type = VisualizerType.GRID

    # Upper bound on visualized grid size (keeps the emitted step count sane).
    # Chosen well above the exhibit's UI inputs so normal use is never capped.
    MAX_DIM = 20

    def __init__(self):
        super().__init__()
        self.cells_filled = 0

    def run(self, input_data: dict[str, Any]) -> Generator[Step, None, None]:
        """Count unique top-left -> bottom-right paths in a grid.

        Args:
            input_data: dict with "rows" and "cols" (positive ints). Very large
                grids are capped at ``MAX_DIM`` purely to keep the step count
                visualizable; when that happens the answer is for the capped
                grid and the step descriptions say so explicitly.

        Yields:
            Step objects for visualization
        """
        self.reset()
        self.cells_filled = 0

        # Requested dimensions (at least 1x1). We compute the exact answer for
        # whatever grid we actually render -- never silently truncate a valid
        # count. MAX_DIM only bounds how big a grid we visualize.
        req_rows = max(1, int(input_data.get("rows", 3)))
        req_cols = max(1, int(input_data.get("cols", 7)))
        rows = min(self.MAX_DIM, req_rows)
        cols = min(self.MAX_DIM, req_cols)
        capped = rows != req_rows or cols != req_cols

        # dp[i][j] = number of unique paths from (0, 0) to (i, j)
        dp = [[0 for _ in range(cols)] for _ in range(rows)]

        cap_note = (
            f" (requested {req_rows}x{req_cols}, capped to {rows}x{cols} for visualization)"
            if capped
            else ""
        )
        yield self.emit_step(
            operation="init",
            description=(
                f"Counting unique paths in a {rows}x{cols} grid "
                f"(moving only right or down){cap_note}"
            ),
            state={"type": "grid", "grid": [row.copy() for row in dp]},
            highlights=[],
            metadata={
                "rows": rows,
                "cols": cols,
                "requested_rows": req_rows,
                "requested_cols": req_cols,
                "capped": capped,
                "cells_filled": self.cells_filled,
            },
        )

        for i in range(rows):
            for j in range(cols):
                if i == 0 or j == 0:
                    # Base case: only one straight-line path along an edge
                    dp[i][j] = 1
                    self.cells_filled += 1

                    yield self.emit_step(
                        operation="base",
                        description=(
                            f"Cell ({i}, {j}) is on the top row / left column - "
                            f"exactly 1 path to reach it"
                        ),
                        state={"type": "grid", "grid": [row.copy() for row in dp]},
                        highlights=[
                            {"type": "cell", "row": i, "col": j, "color": "active"},
                        ],
                        metadata={
                            "rows": rows,
                            "cols": cols,
                            "current_cell": (i, j),
                            "value": dp[i][j],
                            "cells_filled": self.cells_filled,
                        },
                    )
                else:
                    # Recurrence: paths in = paths from above + paths from left
                    from_above = dp[i - 1][j]
                    from_left = dp[i][j - 1]
                    dp[i][j] = from_above + from_left
                    self.cells_filled += 1

                    yield self.emit_step(
                        operation="compute",
                        description=(
                            f"Cell ({i}, {j}) = above ({from_above}) + "
                            f"left ({from_left}) = {dp[i][j]} paths"
                        ),
                        state={"type": "grid", "grid": [row.copy() for row in dp]},
                        highlights=[
                            {"type": "cell", "row": i, "col": j, "color": "active"},
                            {"type": "cell", "row": i - 1, "col": j, "color": "comparing"},
                            {"type": "cell", "row": i, "col": j - 1, "color": "visited"},
                        ],
                        metadata={
                            "rows": rows,
                            "cols": cols,
                            "current_cell": (i, j),
                            "from_above": from_above,
                            "from_left": from_left,
                            "value": dp[i][j],
                            "cells_filled": self.cells_filled,
                        },
                    )

        total_paths = dp[rows - 1][cols - 1]

        yield self.emit_step(
            operation="complete",
            description=(
                f"Done! There are {total_paths} unique path"
                f"{'s' if total_paths != 1 else ''} "
                f"from the top-left to the bottom-right of a {rows}x{cols} grid"
            ),
            state={"type": "grid", "grid": [row.copy() for row in dp]},
            highlights=[
                {"type": "cell", "row": rows - 1, "col": cols - 1, "color": "sorted"},
            ],
            metadata={
                "rows": rows,
                "cols": cols,
                "total_paths": total_paths,
                "cells_filled": self.cells_filled,
            },
        )
