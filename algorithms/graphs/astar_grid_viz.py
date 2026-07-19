"""A* Pathfinding (Grid) - Informed shortest-path search on a 4-connected grid.

A* finds the lowest-cost path between a start and goal cell by always expanding
the open-set node with the smallest f = g + h, where g is the known cost from the
start and h is an admissible heuristic estimate of the remaining cost to the goal.
On a 4-connected grid with unit step costs, the Manhattan distance is both
admissible and consistent, which guarantees A* returns an optimal (shortest) path.

Time Complexity:
    Best:    O(E) ~ O(V) when the heuristic guides search almost straight to goal
    Average: O(E log V) - each of E edges may trigger a heap push/pop (log V)
    Worst:   O(E log V) = O(V log V) on a grid (V = R*C cells, E = O(V) edges)
             degrading toward Dijkstra when the heuristic gives little guidance

Space Complexity: O(V) for the open set (heap), closed set, g-scores, and
    came_from map - all bounded by the number of grid cells R*C.

Key Insights:
    - f = g + h: combine the exact cost so far (g) with an optimistic estimate to
      goal (h). This focuses search toward the goal instead of exploring blindly.
    - An admissible heuristic (never overestimates) guarantees optimality. On a
      4-connected grid, Manhattan distance |dr| + |dc| is the tightest admissible
      choice since diagonal moves are disallowed.
    - With h = 0, A* degenerates into Dijkstra's algorithm; with a perfect
      heuristic it walks straight to the goal. The heuristic quality controls how
      much of the grid is explored.
    - A closed set (or "best g so far" check) prevents re-expanding cells and keeps
      the search efficient even when many paths reach the same cell.
    - Used in: game AI navigation, robotics motion planning, GPS routing, puzzle
      solving (15-puzzle), and any shortest-path search with a good distance guess.
"""

import heapq
from collections.abc import Generator
from typing import Any

from algorithms.base import Step, StepTracker, VisualizerType


class AStarGrid(StepTracker):
    """A* pathfinding on a 4-connected grid with grid visualization."""

    visualizer_type = VisualizerType.GRID

    def run(self, input_data: dict[str, Any]) -> Generator[Step, None, None]:
        """Run A* search on a grid, emitting a step per expansion.

        Args:
            input_data: {
                "grid": 2D list where 0 = open cell, 1 = wall,
                "start": [row, col] start cell,
                "goal": [row, col] goal cell,
            }

        Yields:
            Step objects for visualization. The final step highlights the
            reconstructed path (or reports that no path exists).
        """
        self.reset()

        grid = input_data.get("grid") or []
        start = input_data.get("start")
        goal = input_data.get("goal")

        if not grid or not grid[0] or start is None or goal is None:
            yield self.emit_step(
                operation="init",
                description="Empty grid or missing start/goal - nothing to search",
                state={"type": "grid", "grid": grid},
                highlights=[],
                metadata={"open_size": 0, "steps": 0},
            )
            return

        rows, cols = len(grid), len(grid[0])
        sr, sc = int(start[0]), int(start[1])
        gr, gc = int(goal[0]), int(goal[1])

        def in_bounds(r: int, c: int) -> bool:
            return 0 <= r < rows and 0 <= c < cols

        def heuristic(r: int, c: int) -> int:
            # Manhattan distance - admissible for a 4-connected grid.
            return abs(r - gr) + abs(c - gc)

        # Validate start/goal are usable cells.
        if not in_bounds(sr, sc) or not in_bounds(gr, gc) or grid[sr][sc] == 1 or grid[gr][gc] == 1:
            yield self.emit_step(
                operation="init",
                description="Start or goal is out of bounds or on a wall - no path",
                state={"type": "grid", "grid": grid},
                highlights=[
                    {"type": "cell", "row": sr, "col": sc, "color": "active"},
                    {"type": "cell", "row": gr, "col": gc, "color": "active"},
                ],
                metadata={"open_size": 0, "steps": 0},
            )
            return

        h0 = heuristic(sr, sc)
        yield self.emit_step(
            operation="init",
            description=(
                f"Searching {rows}x{cols} grid from ({sr}, {sc}) to ({gr}, {gc}) "
                f"with Manhattan heuristic"
            ),
            state={"type": "grid", "grid": grid},
            highlights=[
                {"type": "cell", "row": sr, "col": sc, "color": "active"},
                {"type": "cell", "row": gr, "col": gc, "color": "active"},
            ],
            metadata={
                "g": 0,
                "h": h0,
                "f": h0,
                "open_size": 1,
                "steps": 0,
                "current_pos": (sr, sc),
                "goal_pos": (gr, gc),
            },
        )

        # Open set as a min-heap keyed by (f, tie-breaker, cell).
        counter = 0
        open_heap: list[tuple[int, int, tuple[int, int]]] = [(h0, counter, (sr, sc))]
        g_score: dict[tuple[int, int], int] = {(sr, sc): 0}
        came_from: dict[tuple[int, int], tuple[int, int]] = {}
        closed: set[tuple[int, int]] = set()
        open_members: set[tuple[int, int]] = {(sr, sc)}

        directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
        expansions = 0

        while open_heap:
            f_cur, _, (r, c) = heapq.heappop(open_heap)
            open_members.discard((r, c))

            # A cell may sit in the heap multiple times with stale scores; skip
            # any pop that has already been finalized.
            if (r, c) in closed:
                continue

            closed.add((r, c))
            expansions += 1
            g_cur = g_score[(r, c)]
            h_cur = heuristic(r, c)

            # Goal reached - reconstruct and highlight the path.
            if (r, c) == (gr, gc):
                path: list[tuple[int, int]] = [(r, c)]
                node = (r, c)
                while node in came_from:
                    node = came_from[node]
                    path.append(node)
                path.reverse()
                path_sorted = sorted(path)

                yield self.emit_step(
                    operation="path_found",
                    description=(
                        f"Goal ({gr}, {gc}) reached! Shortest path has "
                        f"{len(path)} cells, total cost {g_cur}"
                    ),
                    state={"type": "grid", "grid": grid},
                    highlights=[
                        {"type": "cell", "row": pr, "col": pc, "color": "sorted"}
                        for pr, pc in path_sorted
                    ],
                    metadata={
                        "g": g_cur,
                        "h": 0,
                        "f": g_cur,
                        "open_size": len(open_members),
                        "steps": expansions,
                        "path_length": len(path),
                        "path_cost": g_cur,
                        "path": path,
                    },
                )
                return

            # Expand the current cell: relax each in-bounds, non-wall neighbor.
            tentative_g = g_cur + 1
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if not in_bounds(nr, nc) or grid[nr][nc] == 1:
                    continue
                if (nr, nc) in closed:
                    continue
                if tentative_g < g_score.get((nr, nc), float("inf")):
                    came_from[(nr, nc)] = (r, c)
                    g_score[(nr, nc)] = tentative_g
                    nf = tentative_g + heuristic(nr, nc)
                    counter += 1
                    heapq.heappush(open_heap, (nf, counter, (nr, nc)))
                    open_members.add((nr, nc))

            # Visualize this expansion: current cell, frontier, and closed set.
            highlights: list[dict[str, Any]] = [
                {"type": "cell", "row": cr, "col": cc, "color": "visited"}
                for (cr, cc) in closed
                if (cr, cc) != (r, c)
            ]
            highlights.extend(
                {"type": "cell", "row": orr, "col": occ, "color": "comparing"}
                for (orr, occ) in open_members
            )
            highlights.append({"type": "cell", "row": gr, "col": gc, "color": "active"})
            highlights.append({"type": "cell", "row": r, "col": c, "color": "active"})

            yield self.emit_step(
                operation="expand",
                description=(
                    f"Expand ({r}, {c}): g={g_cur}, h={h_cur}, f={f_cur}. "
                    f"Frontier has {len(open_members)} cell"
                    f"{'s' if len(open_members) != 1 else ''}"
                ),
                state={"type": "grid", "grid": grid},
                highlights=highlights,
                metadata={
                    "g": g_cur,
                    "h": h_cur,
                    "f": f_cur,
                    "open_size": len(open_members),
                    "steps": expansions,
                    "current_pos": (r, c),
                    "goal_pos": (gr, gc),
                },
            )

        # Open set exhausted without reaching the goal.
        yield self.emit_step(
            operation="no_path",
            description=(
                f"No path exists from ({sr}, {sc}) to ({gr}, {gc}) - "
                f"goal is unreachable (walls block every route)"
            ),
            state={"type": "grid", "grid": grid},
            highlights=[
                {"type": "cell", "row": cr, "col": cc, "color": "visited"} for (cr, cc) in closed
            ]
            + [{"type": "cell", "row": gr, "col": gc, "color": "active"}],
            metadata={
                "open_size": 0,
                "steps": expansions,
                "path_length": 0,
                "path_found": False,
            },
        )
