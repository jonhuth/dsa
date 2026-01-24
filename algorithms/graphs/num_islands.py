"""Number of Islands - Grid-based BFS/DFS problem.

Time Complexity: O(m × n) where m, n are grid dimensions
Space Complexity: O(min(m, n)) for BFS queue

Key Insights:
    - Classic connected components problem on a 2D grid
    - Each island is a connected component of '1's (land)
    - BFS/DFS to mark all cells of an island as visited
    - Count how many times we initiate a new search (= number of islands)
    - Used in: map analysis, image segmentation, cluster detection
"""

from typing import Generator
from collections import deque
from algorithms.base import StepTracker, Step, VisualizerType


class NumIslands(StepTracker):
    """Number of Islands with grid visualization."""

    visualizer_type = VisualizerType.GRID

    def __init__(self):
        super().__init__()
        self.island_count = 0

    def count_islands(self, grid: list[list[str]]) -> Generator[Step, None, None]:
        """Count number of islands in grid using BFS.

        Args:
            grid: 2D grid where '1' = land, '0' = water

        Yields:
            Step objects for visualization
        """
        self.reset()
        self.island_count = 0

        if not grid or not grid[0]:
            yield self.emit_step(
                operation="init",
                description="Empty grid - no islands",
                state={"type": "grid", "grid": []},
                highlights=[],
                metadata={"island_count": 0, "rows": 0, "cols": 0},
            )
            return

        rows, cols = len(grid), len(grid[0])
        visited = [[False] * cols for _ in range(rows)]

        yield self.emit_step(
            operation="init",
            description=f"Scanning {rows}×{cols} grid for islands",
            state={"type": "grid", "grid": [[int(cell == "1") for cell in row] for row in grid]},
            highlights=[],
            metadata={"island_count": self.island_count, "rows": rows, "cols": cols},
        )

        for i in range(rows):
            for j in range(cols):
                if grid[i][j] == "1" and not visited[i][j]:
                    # Found new island - start BFS
                    self.island_count += 1

                    yield self.emit_step(
                        operation="new_island",
                        description=f"Found island #{self.island_count} starting at ({i}, {j})",
                        state={
                            "type": "grid",
                            "grid": [[int(cell == "1") for cell in row] for row in grid],
                        },
                        highlights=[{"type": "cell", "row": i, "col": j, "color": "active"}],
                        metadata={
                            "island_count": self.island_count,
                            "start_pos": (i, j),
                            "operation": "new_island",
                        },
                    )

                    # BFS to mark all cells of this island
                    queue = deque([(i, j)])
                    visited[i][j] = True
                    island_cells = [(i, j)]

                    while queue:
                        r, c = queue.popleft()

                        yield self.emit_step(
                            operation="explore",
                            description=f"Exploring cell ({r}, {c}) of island #{self.island_count}",
                            state={
                                "type": "grid",
                                "grid": [[int(cell == "1") for cell in row] for row in grid],
                            },
                            highlights=[
                                {"type": "cell", "row": r, "col": c, "color": "active"},
                                *[
                                    {"type": "cell", "row": cr, "col": cc, "color": "visited"}
                                    for cr, cc in island_cells
                                    if (cr, cc) != (r, c)
                                ],
                            ],
                            metadata={
                                "island_count": self.island_count,
                                "current_pos": (r, c),
                                "island_size": len(island_cells),
                            },
                        )

                        # Check all 4 directions
                        directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
                        for dr, dc in directions:
                            nr, nc = r + dr, c + dc
                            if (
                                0 <= nr < rows
                                and 0 <= nc < cols
                                and grid[nr][nc] == "1"
                                and not visited[nr][nc]
                            ):
                                visited[nr][nc] = True
                                queue.append((nr, nc))
                                island_cells.append((nr, nc))

                    yield self.emit_step(
                        operation="island_complete",
                        description=f"Island #{self.island_count} complete - {len(island_cells)} cells",
                        state={
                            "type": "grid",
                            "grid": [[int(cell == "1") for cell in row] for row in grid],
                        },
                        highlights=[
                            {"type": "cell", "row": r, "col": c, "color": "sorted"}
                            for r, c in island_cells
                        ],
                        metadata={
                            "island_count": self.island_count,
                            "island_size": len(island_cells),
                            "island_cells": island_cells,
                        },
                    )

        yield self.emit_step(
            operation="complete",
            description=f"Found {self.island_count} island{'s' if self.island_count != 1 else ''}",
            state={"type": "grid", "grid": [[int(cell == "1") for cell in row] for row in grid]},
            highlights=[],
            metadata={
                "island_count": self.island_count,
                "total_cells": rows * cols,
                "land_cells": sum(row.count("1") for row in grid),
            },
        )
