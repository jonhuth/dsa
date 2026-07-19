"""Coin Change - Minimum coins to make a target amount (bottom-up DP).

Problem:
    Given a list of coin denominations and a target amount, find the
    minimum number of coins needed to make up that amount. If the amount
    cannot be formed by any combination of the coins, return -1. You may
    use each denomination an unlimited number of times (unbounded knapsack).

Time Complexity:
    Best: O(amount * len(coins))
    Average: O(amount * len(coins))
    Worst: O(amount * len(coins))
    Every (amount, coin) pair is examined exactly once.

Space Complexity:
    O(amount) - a single 1D DP table of size (amount + 1)

Key Insights:
    - Bottom-up DP: dp[a] = minimum coins to make amount `a`.
    - Optimal substructure: dp[a] = 1 + min(dp[a - c]) over all coins c <= a.
    - Overlapping subproblems: each dp[a] is reused by larger amounts.
    - Order of loops (amount outer, coin inner) allows unlimited coin reuse.
    - A sentinel "infinity" marks unreachable amounts; the final answer is
      -1 when the target amount stays unreachable.
    - The greedy "always take the largest coin" approach can fail (e.g.
      coins [1, 3, 4], amount 6 -> greedy gives 4+1+1=3, DP gives 3+3=2).
"""

from collections.abc import Generator
from typing import Any

from algorithms.base import Step, StepTracker, VisualizerType

# Sentinel meaning "amount not (yet) reachable". Shown as -1 in the array viz.
INF = float("inf")


class CoinChange(StepTracker):
    """Coin Change (minimum coins) with visualization step tracking."""

    visualizer_type = VisualizerType.ARRAY

    def __init__(self) -> None:
        super().__init__()
        self.coins_tried = 0
        self.updates = 0

    def _display(self, dp: list[float]) -> list[int]:
        """Render the DP table with unreachable amounts shown as -1."""
        return [-1 if v == INF else int(v) for v in dp]

    def run(self, input_data: dict[str, Any]) -> Generator[Step, None, None]:
        """Run the coin change DP, yielding a visualization step per frame.

        Args:
            input_data: {"coins": list[int], "amount": int}

        Yields:
            Step objects for visualization.
        """
        self.reset()
        self.coins_tried = 0
        self.updates = 0

        coins = sorted({c for c in input_data.get("coins", []) if c > 0})
        amount = int(input_data.get("amount", 0))

        # dp[a] = min coins to make amount a; INF if unreachable.
        dp: list[float] = [INF] * (amount + 1)
        # parent[a] = the coin used to reach dp[a] (for reconstruction).
        parent: list[int | None] = [None] * (amount + 1)
        dp[0] = 0

        yield self.emit_step(
            operation="init",
            description=(
                f"Initialize dp[0..{amount}]. dp[0] = 0 (zero coins make amount 0); "
                f"every other amount starts unreachable (-1). Coins: {coins}"
            ),
            state={"type": "array", "values": self._display(dp)},
            highlights=[{"indices": [0], "color": "sorted"}],
            metadata={
                "coins": coins,
                "amount": amount,
                "coins_tried": self.coins_tried,
                "updates": self.updates,
            },
        )

        for a in range(1, amount + 1):
            yield self.emit_step(
                operation="consider_amount",
                description=f"Compute dp[{a}]: the minimum coins to make amount {a}",
                state={"type": "array", "values": self._display(dp)},
                highlights=[{"indices": [a], "color": "active"}],
                metadata={
                    "coins": coins,
                    "amount": amount,
                    "current_amount": a,
                    "coins_tried": self.coins_tried,
                    "updates": self.updates,
                },
            )

            for coin in coins:
                if coin > a:
                    # Coins are sorted; no larger coin can fit either.
                    break

                self.coins_tried += 1
                sub = a - coin

                if dp[sub] == INF:
                    # Sub-amount itself is unreachable; this coin can't help.
                    yield self.emit_step(
                        operation="try_coin",
                        description=(
                            f"Try coin {coin} for amount {a}: dp[{sub}] is unreachable, "
                            f"so coin {coin} cannot form amount {a} this way"
                        ),
                        state={"type": "array", "values": self._display(dp)},
                        highlights=[
                            {"indices": [a], "color": "active"},
                            {"indices": [sub], "color": "comparing"},
                        ],
                        metadata={
                            "coins": coins,
                            "amount": amount,
                            "current_amount": a,
                            "coin": coin,
                            "sub_amount": sub,
                            "coins_tried": self.coins_tried,
                            "updates": self.updates,
                        },
                    )
                    continue

                candidate = dp[sub] + 1
                improved = candidate < dp[a]

                yield self.emit_step(
                    operation="try_coin",
                    description=(
                        f"Try coin {coin} for amount {a}: dp[{sub}] + 1 = {int(candidate)} "
                        + (
                            f"improves current dp[{a}] ({'-1' if dp[a] == INF else int(dp[a])})"
                            if improved
                            else f"does not beat current dp[{a}] ({int(dp[a])})"
                        )
                    ),
                    state={"type": "array", "values": self._display(dp)},
                    highlights=[
                        {"indices": [a], "color": "active"},
                        {"indices": [sub], "color": "comparing"},
                    ],
                    metadata={
                        "coins": coins,
                        "amount": amount,
                        "current_amount": a,
                        "coin": coin,
                        "sub_amount": sub,
                        "candidate": int(candidate),
                        "coins_tried": self.coins_tried,
                        "updates": self.updates,
                    },
                )

                if improved:
                    dp[a] = candidate
                    parent[a] = coin
                    self.updates += 1

                    yield self.emit_step(
                        operation="update",
                        description=(
                            f"Update dp[{a}] = {int(candidate)} using coin {coin} "
                            f"(built on dp[{sub}])"
                        ),
                        state={"type": "array", "values": self._display(dp)},
                        highlights=[
                            {"indices": [a], "color": "swapped"},
                            {"indices": [sub], "color": "comparing"},
                        ],
                        metadata={
                            "coins": coins,
                            "amount": amount,
                            "current_amount": a,
                            "coin": coin,
                            "sub_amount": sub,
                            "coins_tried": self.coins_tried,
                            "updates": self.updates,
                        },
                    )

        # Reconstruct which coins were used for the target amount.
        used: list[int] = []
        if amount >= 0 and dp[amount] != INF:
            a = amount
            while a > 0 and parent[a] is not None:
                coin = parent[a]
                assert coin is not None
                used.append(coin)
                a -= coin

        reachable = amount >= 0 and dp[amount] != INF
        result = int(dp[amount]) if reachable else -1

        if reachable:
            breakdown = " + ".join(str(c) for c in sorted(used, reverse=True))
            description = (
                f"Done! Minimum coins to make {amount} = {result} "
                f"({breakdown if breakdown else '0 coins'})"
            )
        else:
            description = f"Done! Amount {amount} cannot be formed from coins {coins} -> return -1"

        yield self.emit_step(
            operation="complete",
            description=description,
            state={"type": "array", "values": self._display(dp)},
            highlights=[
                {
                    "indices": [amount] if amount >= 0 else [],
                    "color": "sorted" if reachable else "comparing",
                }
            ],
            metadata={
                "coins": coins,
                "amount": amount,
                "result": result,
                "coins_used": sorted(used, reverse=True),
                "coins_tried": self.coins_tried,
                "updates": self.updates,
            },
        )
