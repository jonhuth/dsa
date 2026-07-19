"""Climbing Stairs - Count distinct ways to reach the top of a staircase.

Problem:
    You are climbing a staircase with ``n`` steps. Each time you can climb
    either 1 or 2 steps. In how many distinct ways can you climb to the top?

    This is the Fibonacci sequence in disguise: to reach step ``i`` you must
    have taken your last move from step ``i - 1`` (a 1-step) or from step
    ``i - 2`` (a 2-step), so ways[i] = ways[i-1] + ways[i-2].

Time Complexity:
    Best: O(n) - each step computed exactly once
    Average: O(n)
    Worst: O(n)

Space Complexity:
    O(n) - stores the dp array of size n + 1
    (can be reduced to O(1) by keeping only the last two values)

Key Insights:
    - Bottom-up DP: ways[i] = ways[i-1] + ways[i-2]
    - Optimal substructure: the count for step i depends only on smaller steps
    - Overlapping subproblems: each ways[i] is reused by ways[i+1] and ways[i+2]
    - Identical recurrence to Fibonacci, just framed as a staircase
    - Base cases: 1 way to stand at the ground (do nothing), 1 way to reach step 1
"""

from collections.abc import Generator
from typing import Any

from algorithms.base import Step, StepTracker, VisualizerType


class ClimbingStairs(StepTracker):
    """Climbing Stairs (bottom-up DP) with visualization step tracking."""

    visualizer_type = VisualizerType.ARRAY

    def __init__(self):
        super().__init__()
        self.additions = 0

    def run(self, input_data: Any) -> Generator[Step, None, None]:
        """Count the number of distinct ways to climb ``n`` stairs.

        Args:
            input_data: Number of stairs as an ``int`` or ``{"n": int}``.

        Yields:
            Step objects for visualization.
        """
        self.reset()
        self.additions = 0

        # Accept both a bare int and {"n": int}
        n = input_data if isinstance(input_data, int) else input_data.get("n", 5)
        if n < 0:
            n = 0

        # dp array: ways[i] = number of distinct ways to reach step i
        ways = [0] * (n + 1)

        yield self.emit_step(
            operation="init",
            description=(
                f"Climbing a staircase with {n} steps. Each move is 1 or 2 steps. "
                f"ways[i] will hold the number of distinct ways to reach step i."
            ),
            state={"type": "array", "values": ways.copy()},
            highlights=[],
            metadata={"n": n, "additions": self.additions},
        )

        # Base case: 1 way to be at the ground (take no steps)
        ways[0] = 1
        yield self.emit_step(
            operation="base_case",
            description=(
                "Base case: there is exactly 1 way to be at the ground (step 0) - "
                "make no moves. Set ways[0] = 1."
            ),
            state={"type": "array", "values": ways.copy()},
            highlights=[{"indices": [0], "color": "sorted"}],
            metadata={"n": n, "additions": self.additions},
        )

        # Base case: 1 way to reach step 1 (a single 1-step)
        if n >= 1:
            ways[1] = 1
            yield self.emit_step(
                operation="base_case",
                description=(
                    "Base case: there is exactly 1 way to reach step 1 - a single "
                    "1-step. Set ways[1] = 1."
                ),
                state={"type": "array", "values": ways.copy()},
                highlights=[{"indices": [1], "color": "sorted"}],
                metadata={"n": n, "additions": self.additions},
            )

        # Fill the table bottom-up
        for i in range(2, n + 1):
            # Highlight the two subproblems we depend on before combining them
            yield self.emit_step(
                operation="compare",
                description=(
                    f"To reach step {i} you either came from step {i - 1} (a 1-step) "
                    f"or from step {i - 2} (a 2-step). Add ways[{i - 1}]={ways[i - 1]} "
                    f"and ways[{i - 2}]={ways[i - 2]}."
                ),
                state={"type": "array", "values": ways.copy()},
                highlights=[
                    {"indices": [i], "color": "active"},
                    {"indices": [i - 1, i - 2], "color": "comparing"},
                ],
                metadata={"n": n, "additions": self.additions, "i": i},
            )

            ways[i] = ways[i - 1] + ways[i - 2]
            self.additions += 1

            yield self.emit_step(
                operation="compute",
                description=(
                    f"ways[{i}] = ways[{i - 1}] + ways[{i - 2}] = "
                    f"{ways[i - 1]} + {ways[i - 2]} = {ways[i]}. "
                    f"There are {ways[i]} distinct ways to reach step {i}."
                ),
                state={"type": "array", "values": ways.copy()},
                highlights=[
                    {"indices": [i], "color": "swapped"},
                    {"indices": [i - 1, i - 2], "color": "comparing"},
                ],
                metadata={
                    "n": n,
                    "additions": self.additions,
                    "i": i,
                    "result": ways[i],
                },
            )

        result = ways[n]
        yield self.emit_step(
            operation="complete",
            description=(
                f"Done! There are {result} distinct ways to climb a staircase of "
                f"{n} steps ({self.additions} additions performed)."
            ),
            state={"type": "array", "values": ways.copy()},
            highlights=[{"indices": [n], "color": "sorted"}],
            metadata={
                "n": n,
                "additions": self.additions,
                "result": result,
                "computed": result,
            },
        )
