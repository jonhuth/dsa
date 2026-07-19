"""Longest Palindromic Subsequence - Longest subsequence of a string that reads the same forwards and backwards.

Time Complexity: O(n^2) where n = len(s) — every (i, j) interval with i <= j is filled once.
Space Complexity: O(n^2) for the DP table (optimizable to O(n) with a rolling 1D array).

Key Insights:
    - dp[i][j] = length of the longest palindromic subsequence within s[i..j] (inclusive).
    - Base case: dp[i][i] = 1 — every single character is a palindrome of length 1.
    - Recurrence (interval DP over increasing substring length):
        if s[i] == s[j]: dp[i][j] = 2 + dp[i+1][j-1]  (matching ends wrap an inner palindrome)
        else:            dp[i][j] = max(dp[i+1][j], dp[i][j-1])  (drop one end)
    - Fill order matters: dp[i][j] reads dp[i+1][...] and dp[i][j-1], so iterate i from
      high to low and j from i upward (equivalently, by increasing interval length).
    - Answer is dp[0][n-1] — the whole string.
    - Equivalent formulation: LPS(s) == LCS(s, reverse(s)).
    - Used in: bioinformatics (RNA secondary structure), text similarity, and as the
      classic "minimum deletions to make a string a palindrome" (n - LPS) problem.
"""

from collections.abc import Generator
from typing import Any

from algorithms.base import Step, StepTracker, VisualizerType


class LongestPalindromicSubsequence(StepTracker):
    """Longest Palindromic Subsequence solver with DP grid visualization."""

    visualizer_type = VisualizerType.GRID

    def __init__(self):
        super().__init__()
        self.comparisons = 0

    def run(self, input_data: dict[str, Any] | str) -> Generator[Step, None, None]:
        """Compute the length of the longest palindromic subsequence of a string.

        Args:
            input_data: Dict with key ``s`` (string), or a raw string.

        Yields:
            Step objects for grid visualization.
        """
        self.reset()
        self.comparisons = 0

        if isinstance(input_data, str):
            s = input_data
        else:
            s = input_data.get("s", "")

        n = len(s)

        # dp[i][j] = length of the longest palindromic subsequence within s[i..j].
        dp = [[0 for _ in range(n)] for _ in range(n)]

        yield self.emit_step(
            operation="init",
            description=(
                f'Building {n}×{n} DP table for the longest palindromic subsequence of "{s}"'
                if n
                else "Empty string: the longest palindromic subsequence has length 0"
            ),
            state={"type": "grid", "grid": [row[:] for row in dp]},
            highlights=[],
            metadata={
                "s": s,
                "n": n,
                "comparisons": self.comparisons,
            },
        )

        if n == 0:
            yield self.emit_step(
                operation="complete",
                description="Longest palindromic subsequence length is 0 (empty string)",
                state={"type": "grid", "grid": [row[:] for row in dp]},
                highlights=[],
                metadata={"s": s, "n": n, "lps_length": 0, "comparisons": self.comparisons},
            )
            return

        # Base case: every single character is a palindrome of length 1.
        for i in range(n):
            dp[i][i] = 1

        yield self.emit_step(
            operation="base_case",
            description="Base case: dp[i][i] = 1 — each single character is a palindrome of length 1",
            state={"type": "grid", "grid": [row[:] for row in dp]},
            highlights=[{"type": "cell", "row": i, "col": i, "color": "visited"} for i in range(n)],
            metadata={
                "s": s,
                "n": n,
                "comparisons": self.comparisons,
            },
        )

        # Fill by increasing interval length: i from high to low, j from i+1 upward.
        for i in range(n - 1, -1, -1):
            for j in range(i + 1, n):
                char_i = s[i]
                char_j = s[j]
                self.comparisons += 1

                if char_i == char_j:
                    inner = dp[i + 1][j - 1]  # empty (=0) when j == i + 1
                    dp[i][j] = 2 + inner
                    won = "match"

                    yield self.emit_step(
                        operation="match",
                        description=(
                            f"s[{i}]='{char_i}' == s[{j}]='{char_j}': wrap the inner palindrome, "
                            f"dp[{i}][{j}]=2+dp[{i + 1}][{j - 1}]=2+{inner}={dp[i][j]}"
                        ),
                        state={"type": "grid", "grid": [row[:] for row in dp]},
                        highlights=[
                            {"type": "cell", "row": i, "col": j, "color": "active"},
                            {"type": "cell", "row": i + 1, "col": j - 1, "color": "comparing"},
                        ],
                        metadata={
                            "s": s,
                            "i": i,
                            "j": j,
                            "char_i": char_i,
                            "char_j": char_j,
                            "operation_won": won,
                            "value": dp[i][j],
                            "comparisons": self.comparisons,
                        },
                    )
                else:
                    skip_left = dp[i + 1][j]
                    skip_right = dp[i][j - 1]
                    dp[i][j] = max(skip_left, skip_right)

                    if skip_left >= skip_right:
                        won = "skip_left"
                        won_row, won_col = i + 1, j
                    else:
                        won = "skip_right"
                        won_row, won_col = i, j - 1

                    yield self.emit_step(
                        operation="mismatch",
                        description=(
                            f"s[{i}]='{char_i}' != s[{j}]='{char_j}': drop one end, "
                            f"dp[{i}][{j}]=max(dp[{i + 1}][{j}]={skip_left}, "
                            f"dp[{i}][{j - 1}]={skip_right})={dp[i][j]}"
                        ),
                        state={"type": "grid", "grid": [row[:] for row in dp]},
                        highlights=[
                            {"type": "cell", "row": i, "col": j, "color": "active"},
                            {"type": "cell", "row": won_row, "col": won_col, "color": "comparing"},
                            {"type": "cell", "row": i + 1, "col": j, "color": "visited"},
                            {"type": "cell", "row": i, "col": j - 1, "color": "visited"},
                        ],
                        metadata={
                            "s": s,
                            "i": i,
                            "j": j,
                            "char_i": char_i,
                            "char_j": char_j,
                            "skip_left": skip_left,
                            "skip_right": skip_right,
                            "operation_won": won,
                            "value": dp[i][j],
                            "comparisons": self.comparisons,
                        },
                    )

        length = dp[0][n - 1]

        yield self.emit_step(
            operation="complete",
            description=(
                f'Longest palindromic subsequence of "{s}" has length {length} '
                f"(top-right cell dp[0][{n - 1}])"
            ),
            state={"type": "grid", "grid": [row[:] for row in dp]},
            highlights=[{"type": "cell", "row": 0, "col": n - 1, "color": "sorted"}],
            metadata={
                "s": s,
                "n": n,
                "lps_length": length,
                "comparisons": self.comparisons,
            },
        )
