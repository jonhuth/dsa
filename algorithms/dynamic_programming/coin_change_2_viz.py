"""Coin Change II (Count Ways) - Count the number of combinations that make an amount.

Time Complexity: O(k * amount) where k = number of coin types
Space Complexity: O(k * amount) for the 2D DP table (optimizable to O(amount))

Key Insights:
    - dp[i][j] = number of ways to make amount j using only the first i coin types.
    - Order does NOT matter: {1,2} and {2,1} count as the SAME combination. We enforce
      this by adding one coin type at a time (outer loop over coins), which prevents
      permutations from being double-counted.
    - Base case: dp[i][0] = 1 for every i — there is exactly one way to make amount 0
      (use no coins, the empty combination).
    - Recurrence for j >= 1:
        dp[i][j] = dp[i-1][j]              # skip coin i entirely (cell directly above)
                 + dp[i][j - coin_i]       # use at least one coin i (cell coin_i to the left,
                                             same row so coin i may be reused), if coin_i <= j
    - The answer is dp[k][amount] — the bottom-right cell.

Contrast with Coin Change (min coins):
    - Coin Change (min coins) asks for the FEWEST coins to reach an amount and uses a
      min-of-(1 + subproblem) recurrence; unreachable amounts are +infinity.
    - Coin Change II asks HOW MANY distinct combinations reach an amount and uses a
      SUM recurrence; unreachable amounts are simply 0 ways.
    - Both are unbounded-knapsack style (coins reusable), but one minimizes a cost while
      the other counts combinations. The "use coin" transition reuses the SAME row
      (dp[i][j - coin_i]) precisely because a coin can be picked any number of times.

    - Used in: making change, counting partitions, combinatorics, knapsack-style counting.
"""

from collections.abc import Generator
from typing import Any

from algorithms.base import Step, StepTracker, VisualizerType


class CoinChange2(StepTracker):
    """Coin Change II (Count Ways) solver with DP grid visualization."""

    visualizer_type = VisualizerType.GRID

    def __init__(self):
        super().__init__()
        self.operations = 0

    def run(self, input_data: dict[str, Any]) -> Generator[Step, None, None]:
        """Count the number of combinations of coins that sum to ``amount``.

        Args:
            input_data: Dict with keys ``coins`` (list[int]) and ``amount`` (int).

        Yields:
            Step objects for grid visualization.
        """
        self.reset()
        self.operations = 0

        coins = list(input_data.get("coins", []))
        amount = int(input_data.get("amount", 0))
        k = len(coins)

        # dp[i][j] = number of ways to make amount j using the first i coin types.
        # Rows 0..k (row 0 is the "no coins yet" base row), cols 0..amount.
        dp = [[0 for _ in range(amount + 1)] for _ in range(k + 1)]

        yield self.emit_step(
            operation="init",
            description=(
                f"Building ({k + 1})×({amount + 1}) DP table to count ways to make "
                f"amount {amount} with coins {coins}"
            ),
            state={"type": "grid", "grid": [row[:] for row in dp]},
            highlights=[],
            metadata={
                "coins": coins,
                "amount": amount,
                "k": k,
                "operations": self.operations,
            },
        )

        # Base case: exactly one way (the empty combination) to make amount 0 for any
        # prefix of coins, so the entire first column is 1.
        for i in range(k + 1):
            dp[i][0] = 1

        yield self.emit_step(
            operation="base_case",
            description=(
                "Base case: dp[i][0]=1 for every row — exactly one way to make amount 0 "
                "(use no coins)"
            ),
            state={"type": "grid", "grid": [row[:] for row in dp]},
            highlights=[
                {"type": "cell", "row": i, "col": 0, "color": "visited"} for i in range(k + 1)
            ],
            metadata={
                "coins": coins,
                "amount": amount,
                "k": k,
                "operations": self.operations,
            },
        )

        # Fill the table one coin type (row) at a time, left to right.
        for i in range(1, k + 1):
            coin = coins[i - 1]
            for j in range(1, amount + 1):
                self.operations += 1

                skip = dp[i - 1][j]  # ways without using coin i (cell above)
                if coin <= j:
                    use = dp[i][j - coin]  # ways using coin i at least once (left by coin)
                    dp[i][j] = skip + use

                    highlights = [
                        {"type": "cell", "row": i, "col": j, "color": "active"},
                        {"type": "cell", "row": i - 1, "col": j, "color": "comparing"},
                        {"type": "cell", "row": i, "col": j - coin, "color": "visited"},
                    ]
                    description = (
                        f"coin={coin} fits in amount {j}: "
                        f"dp[{i}][{j}] = skip dp[{i - 1}][{j}]={skip} "
                        f"+ use dp[{i}][{j - coin}]={use} = {dp[i][j]}"
                    )
                    metadata = {
                        "coins": coins,
                        "amount": amount,
                        "i": i,
                        "j": j,
                        "coin": coin,
                        "skip": skip,
                        "use": use,
                        "value": dp[i][j],
                        "operations": self.operations,
                    }
                else:
                    # Coin too large for this amount — can only skip it.
                    use = 0
                    dp[i][j] = skip

                    highlights = [
                        {"type": "cell", "row": i, "col": j, "color": "active"},
                        {"type": "cell", "row": i - 1, "col": j, "color": "comparing"},
                    ]
                    description = (
                        f"coin={coin} > amount {j}: too large, only skip → "
                        f"dp[{i}][{j}] = dp[{i - 1}][{j}] = {skip}"
                    )
                    metadata = {
                        "coins": coins,
                        "amount": amount,
                        "i": i,
                        "j": j,
                        "coin": coin,
                        "skip": skip,
                        "use": use,
                        "value": dp[i][j],
                        "operations": self.operations,
                    }

                yield self.emit_step(
                    operation="count",
                    description=description,
                    state={"type": "grid", "grid": [row[:] for row in dp]},
                    highlights=highlights,
                    metadata=metadata,
                )

        ways = dp[k][amount]

        yield self.emit_step(
            operation="complete",
            description=(
                f"There are {ways} way(s) to make amount {amount} with coins {coins} "
                f"(bottom-right cell dp[{k}][{amount}])"
            ),
            state={"type": "grid", "grid": [row[:] for row in dp]},
            highlights=[{"type": "cell", "row": k, "col": amount, "color": "sorted"}],
            metadata={
                "coins": coins,
                "amount": amount,
                "k": k,
                "ways": ways,
                "operations": self.operations,
            },
        )
