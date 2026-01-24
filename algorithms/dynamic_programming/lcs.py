"""Longest Common Subsequence - Classic string DP problem.

Time Complexity: O(m * n) where m, n are string lengths
Space Complexity: O(m * n) for DP table

Key Insights:
    - Finds longest subsequence common to two sequences
    - Subsequence maintains relative order but need not be contiguous
    - 2D DP table: dp[i][j] = LCS of str1[0..i] and str2[0..j]
    - Recurrence: if chars match, dp[i][j] = 1 + dp[i-1][j-1]
                  else dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    - Used in: diff tools, DNA analysis, plagiarism detection, version control
"""

from typing import Generator, List
from algorithms.base import StepTracker, Step, VisualizerType


class LCS(StepTracker):
    """Longest Common Subsequence with DP table visualization."""

    visualizer_type = VisualizerType.ARRAY

    def __init__(self):
        super().__init__()
        self.comparisons = 0

    def compute(self, str1: str, str2: str) -> Generator[Step, None, None]:
        """Compute longest common subsequence using dynamic programming.

        Args:
            str1: First string
            str2: Second string

        Yields:
            Step objects for visualization
        """
        self.reset()
        self.comparisons = 0
        m, n = len(str1), len(str2)

        # Create DP table (m+1 x n+1)
        dp = [[0 for _ in range(n + 1)] for _ in range(m + 1)]

        yield self.emit_step(
            operation="init",
            description=f"Finding LCS of '{str1}' and '{str2}'",
            state={"type": "array", "values": [0] * (n + 1)},
            highlights=[],
            metadata={
                "str1": str1,
                "str2": str2,
                "m": m,
                "n": n,
                "comparisons": self.comparisons,
            },
        )

        # Build DP table
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                self.comparisons += 1

                if str1[i - 1] == str2[j - 1]:
                    # Characters match - extend LCS
                    dp[i][j] = dp[i - 1][j - 1] + 1

                    yield self.emit_step(
                        operation="match",
                        description=f"Match: '{str1[i-1]}' == '{str2[j-1]}' → LCS length {dp[i][j]}",
                        state={"type": "array", "values": dp[i].copy()},
                        highlights=[
                            {"indices": [j], "color": "active"},
                            {"indices": list(range(j)), "color": "sorted"},
                        ],
                        metadata={
                            "str1": str1,
                            "str2": str2,
                            "i": i,
                            "j": j,
                            "char1": str1[i - 1],
                            "char2": str2[j - 1],
                            "lcs_length": dp[i][j],
                            "comparisons": self.comparisons,
                        },
                    )
                else:
                    # Characters don't match - take max from adjacent cells
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

                    yield self.emit_step(
                        operation="no_match",
                        description=f"No match: '{str1[i-1]}' != '{str2[j-1]}' → max({dp[i-1][j]}, {dp[i][j-1]}) = {dp[i][j]}",
                        state={"type": "array", "values": dp[i].copy()},
                        highlights=[
                            {"indices": [j], "color": "comparing"},
                            {"indices": list(range(j)), "color": "visited"},
                        ],
                        metadata={
                            "str1": str1,
                            "str2": str2,
                            "i": i,
                            "j": j,
                            "char1": str1[i - 1],
                            "char2": str2[j - 1],
                            "lcs_length": dp[i][j],
                            "comparisons": self.comparisons,
                        },
                    )

        # Backtrack to find the actual LCS
        lcs = []
        i, j = m, n
        while i > 0 and j > 0:
            if str1[i - 1] == str2[j - 1]:
                lcs.append(str1[i - 1])
                i -= 1
                j -= 1
            elif dp[i - 1][j] > dp[i][j - 1]:
                i -= 1
            else:
                j -= 1

        lcs.reverse()
        lcs_string = "".join(lcs)

        yield self.emit_step(
            operation="complete",
            description=f"LCS: '{lcs_string}' (length: {dp[m][n]})",
            state={"type": "array", "values": dp[m].copy()},
            highlights=[{"indices": [n], "color": "sorted"}],
            metadata={
                "str1": str1,
                "str2": str2,
                "lcs": lcs_string,
                "lcs_length": dp[m][n],
                "comparisons": self.comparisons,
            },
        )
