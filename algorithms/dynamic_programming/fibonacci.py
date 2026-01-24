"""Fibonacci - Classic dynamic programming problem.

Time Complexity:
    Naive Recursive: O(2^n) - exponential
    Memoization: O(n)
    Tabulation: O(n)

Space Complexity:
    Memoization: O(n) - call stack + memo table
    Tabulation: O(n) - DP table
    Optimized: O(1) - only store last 2 values

Key Insights:
    - Classic example of overlapping subproblems
    - Demonstrates power of memoization/tabulation
    - Exponential → Linear time improvement
    - Used in: algorithm analysis, golden ratio, nature patterns
"""

from typing import Generator, Dict
from algorithms.base import StepTracker, Step, VisualizerType


class Fibonacci(StepTracker):
    """Fibonacci with memoization visualization."""

    visualizer_type = VisualizerType.ARRAY

    def __init__(self):
        super().__init__()
        self.memo: Dict[int, int] = {}
        self.calls = 0

    def compute_memoization(self, n: int) -> Generator[Step, None, None]:
        """Compute Fibonacci using memoization (top-down DP).

        Args:
            n: Which Fibonacci number to compute

        Yields:
            Step objects for visualization
        """
        self.reset()
        self.memo = {}
        self.calls = 0

        yield self.emit_step(
            operation="init",
            description=f"Computing Fibonacci({n}) using memoization",
            state={"type": "array", "values": list(range(n + 1))},
            highlights=[],
            metadata={
                "n": n,
                "calls": self.calls,
                "memo_size": len(self.memo),
            },
        )

        # Compute fibonacci
        result = yield from self._fib_memo(n)

        yield self.emit_step(
            operation="complete",
            description=f"Fibonacci({n}) = {result}",
            state={"type": "array", "values": [self.memo.get(i, 0) for i in range(n + 1)]},
            highlights=[{"indices": [n], "color": "sorted"}],
            metadata={
                "n": n,
                "result": result,
                "calls": self.calls,
                "memo_size": len(self.memo),
            },
        )

    def _fib_memo(self, n: int) -> Generator[int, None, None]:
        """Helper for memoized fibonacci."""
        self.calls += 1

        if n in self.memo:
            yield self.emit_step(
                operation="memo_hit",
                description=f"Memo hit: F({n}) = {self.memo[n]}",
                state={"type": "array", "values": [self.memo.get(i, 0) for i in range(n + 1)]},
                highlights=[{"indices": [n], "color": "sorted"}],
                metadata={
                    "n": n,
                    "calls": self.calls,
                    "memo_size": len(self.memo),
                    "value": self.memo[n],
                },
            )
            return self.memo[n]

        if n <= 1:
            self.memo[n] = n
            yield self.emit_step(
                operation="base_case",
                description=f"Base case: F({n}) = {n}",
                state={"type": "array", "values": [self.memo.get(i, 0) for i in range(n + 1)]},
                highlights=[{"indices": [n], "color": "active"}],
                metadata={
                    "n": n,
                    "calls": self.calls,
                    "memo_size": len(self.memo),
                },
            )
            return n

        yield self.emit_step(
            operation="compute",
            description=f"Computing F({n}) = F({n-1}) + F({n-2})",
            state={"type": "array", "values": [self.memo.get(i, 0) for i in range(n + 1)]},
            highlights=[{"indices": [n], "color": "comparing"}],
            metadata={
                "n": n,
                "calls": self.calls,
                "memo_size": len(self.memo),
            },
        )

        fib_n_minus_1 = yield from self._fib_memo(n - 1)
        fib_n_minus_2 = yield from self._fib_memo(n - 2)

        self.memo[n] = fib_n_minus_1 + fib_n_minus_2

        yield self.emit_step(
            operation="memoize",
            description=f"Memoized: F({n}) = {self.memo[n]}",
            state={"type": "array", "values": [self.memo.get(i, 0) for i in range(n + 1)]},
            highlights=[{"indices": [n], "color": "sorted"}],
            metadata={
                "n": n,
                "calls": self.calls,
                "memo_size": len(self.memo),
                "value": self.memo[n],
            },
        )

        return self.memo[n]

    def compute_tabulation(self, n: int) -> Generator[Step, None, None]:
        """Compute Fibonacci using tabulation (bottom-up DP).

        Args:
            n: Which Fibonacci number to compute

        Yields:
            Step objects for visualization
        """
        self.reset()

        if n <= 1:
            yield self.emit_step(
                operation="base_case",
                description=f"Base case: F({n}) = {n}",
                state={"type": "array", "values": [n]},
                highlights=[{"indices": [0], "color": "sorted"}],
                metadata={"n": n, "result": n},
            )
            return

        # Initialize DP table
        dp = [0] * (n + 1)
        dp[0] = 0
        dp[1] = 1

        yield self.emit_step(
            operation="init",
            description=f"Initialize: F(0)=0, F(1)=1",
            state={"type": "array", "values": dp.copy()},
            highlights=[
                {"indices": [0, 1], "color": "sorted"},
            ],
            metadata={"n": n, "computed": 2},
        )

        # Build up from bottom
        for i in range(2, n + 1):
            dp[i] = dp[i - 1] + dp[i - 2]

            yield self.emit_step(
                operation="compute",
                description=f"F({i}) = F({i-1}) + F({i-2}) = {dp[i-1]} + {dp[i-2]} = {dp[i]}",
                state={"type": "array", "values": dp.copy()},
                highlights=[
                    {"indices": [i], "color": "active"},
                    {"indices": [i - 1, i - 2], "color": "comparing"},
                    {"indices": list(range(i)), "color": "sorted"},
                ],
                metadata={
                    "n": n,
                    "i": i,
                    "computed": i + 1,
                },
            )

        yield self.emit_step(
            operation="complete",
            description=f"Fibonacci({n}) = {dp[n]}",
            state={"type": "array", "values": dp.copy()},
            highlights=[{"indices": [n], "color": "sorted"}],
            metadata={
                "n": n,
                "result": dp[n],
                "computed": n + 1,
            },
        )
