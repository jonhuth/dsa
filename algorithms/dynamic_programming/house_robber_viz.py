"""House Robber - Maximum non-adjacent sum via dynamic programming.

Problem:
    You are a robber planning to rob houses along a street. Each house has a
    certain amount of money stashed. The only constraint stopping you from
    robbing every house is that adjacent houses have connected security systems
    that will automatically alert the police if two adjacent houses are broken
    into on the same night. Given an array of non-negative integers representing
    the amount of money in each house, return the maximum amount you can rob
    tonight without alerting the police.

Recurrence:
    dp[i] = max(dp[i-1], dp[i-2] + nums[i])
        - skip house i        -> inherit best-so-far dp[i-1]
        - rob house i         -> nums[i] + best up to two houses back dp[i-2]
    Base cases:
        dp[0] = nums[0]
        dp[1] = max(nums[0], nums[1])
    Final answer: dp[-1]

Time Complexity:
    Best: O(n) - single pass over the houses
    Average: O(n)
    Worst: O(n)

Space Complexity:
    O(n) - dp table of size n (can be reduced to O(1) with two rolling variables)

Key Insights:
    - Classic 1D DP: optimal substructure + overlapping subproblems.
    - At each house you make a binary choice: rob it (and skip the neighbor) or
      skip it. dp[i] stores the best loot considering houses 0..i.
    - Because you can never take two adjacent houses, the "rob" branch reaches
      back to dp[i-2], not dp[i-1].
    - The running maximum is monotonic non-decreasing: dp is sorted ascending.
    - Space can be optimized to O(1) since only the last two dp values matter.
"""

from collections.abc import Generator

from algorithms.base import Step, StepTracker, VisualizerType


class HouseRobber(StepTracker):
    """House Robber DP implementation with visualization step tracking."""

    visualizer_type = VisualizerType.ARRAY

    def __init__(self):
        super().__init__()
        self.choices = 0

    def run(self, input_data: list[int]) -> Generator[Step, None, None]:
        """Compute the maximum non-adjacent sum using bottom-up DP.

        Args:
            input_data: List of non-negative integers, money in each house.

        Yields:
            Step objects for visualization.
        """
        self.reset()
        self.choices = 0
        nums = list(input_data)
        n = len(nums)

        yield self.emit_step(
            operation="init",
            description=f"Planning a heist on {n} house(s): {nums}. Goal: maximize loot without robbing two adjacent houses.",
            state={"type": "array", "values": nums.copy()},
            highlights=[{"indices": list(range(n)), "color": "default"}],
            metadata={"nums": nums.copy(), "choices": self.choices, "n": n},
        )

        # Edge case: no houses
        if n == 0:
            yield self.emit_step(
                operation="complete",
                description="No houses to rob. Maximum loot is 0.",
                state={"type": "array", "values": []},
                highlights=[],
                metadata={"nums": [], "choices": self.choices, "result": 0, "n": 0},
            )
            return

        dp = [0] * n

        # Base case dp[0]
        dp[0] = nums[0]
        yield self.emit_step(
            operation="base_case",
            description=f"Base case: only house 0 available, so dp[0] = nums[0] = {nums[0]}.",
            state={"type": "array", "values": dp.copy()},
            highlights=[{"indices": [0], "color": "swapped"}],
            metadata={
                "nums": nums.copy(),
                "choices": self.choices,
                "current_index": 0,
                "best": dp[0],
            },
        )

        # Edge case: single house
        if n == 1:
            yield self.emit_step(
                operation="complete",
                description=f"Only one house. Maximum loot is dp[0] = {dp[0]}.",
                state={"type": "array", "values": dp.copy()},
                highlights=[{"indices": [0], "color": "sorted"}],
                metadata={
                    "nums": nums.copy(),
                    "choices": self.choices,
                    "result": dp[-1],
                    "n": n,
                },
            )
            return

        # Base case dp[1]
        self.choices += 1
        rob_first = nums[0]
        rob_second = nums[1]
        dp[1] = max(rob_first, rob_second)
        winner = "house 1" if rob_second >= rob_first else "house 0"
        yield self.emit_step(
            operation="base_case",
            description=(
                f"Base case: dp[1] = max(nums[0], nums[1]) = max({rob_first}, {rob_second}) = {dp[1]} "
                f"(rob {winner})."
            ),
            state={"type": "array", "values": dp.copy()},
            highlights=[
                {"indices": [0, 1], "color": "comparing"},
                {"indices": [1], "color": "swapped"},
            ],
            metadata={
                "nums": nums.copy(),
                "choices": self.choices,
                "current_index": 1,
                "best": dp[1],
            },
        )

        # Fill dp[2..n-1]
        for i in range(2, n):
            skip = dp[i - 1]
            rob = dp[i - 2] + nums[i]

            # Show the decision being evaluated
            yield self.emit_step(
                operation="compare",
                description=(
                    f"House {i}: choose the better of "
                    f"SKIP = dp[{i - 1}] = {skip}  vs  "
                    f"ROB = dp[{i - 2}] + nums[{i}] = {dp[i - 2]} + {nums[i]} = {rob}."
                ),
                state={"type": "array", "values": dp.copy()},
                highlights=[
                    {"indices": [i - 1], "color": "comparing"},
                    {"indices": [i - 2], "color": "active"},
                ],
                metadata={
                    "nums": nums.copy(),
                    "choices": self.choices,
                    "current_index": i,
                    "skip_value": skip,
                    "rob_value": rob,
                },
            )

            self.choices += 1
            dp[i] = max(skip, rob)
            robbed = rob >= skip
            decision = "ROB it" if robbed else "SKIP it"

            yield self.emit_step(
                operation="decide",
                description=(f"dp[{i}] = max({skip}, {rob}) = {dp[i]}. Best move: {decision}."),
                state={"type": "array", "values": dp.copy()},
                highlights=[
                    {"indices": [i], "color": "swapped"},
                    (
                        {"indices": [i - 2], "color": "active"}
                        if robbed
                        else {"indices": [i - 1], "color": "comparing"}
                    ),
                ],
                metadata={
                    "nums": nums.copy(),
                    "choices": self.choices,
                    "current_index": i,
                    "best": dp[i],
                    "robbed": robbed,
                },
            )

        yield self.emit_step(
            operation="complete",
            description=(
                f"Done! Maximum loot = dp[{n - 1}] = {dp[-1]} (evaluated {self.choices} choices)."
            ),
            state={"type": "array", "values": dp.copy()},
            highlights=[
                {"indices": list(range(n)), "color": "sorted"},
                {"indices": [n - 1], "color": "swapped"},
            ],
            metadata={
                "nums": nums.copy(),
                "choices": self.choices,
                "result": dp[-1],
                "n": n,
            },
        )
