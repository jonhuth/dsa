"""Edit Distance (Levenshtein) - Minimum edits to transform one string into another.

Time Complexity: O(m * n) where m = len(word1), n = len(word2)
Space Complexity: O(m * n) for the DP table (optimizable to O(min(m, n)))

Key Insights:
    - dp[i][j] = edit distance between word1[:i] and word2[:j]
    - Three allowed operations, each cost 1: insert, delete, replace
    - Base cases: dp[i][0] = i (delete all), dp[0][j] = j (insert all)
    - Recurrence:
        if word1[i-1] == word2[j-1]: dp[i][j] = dp[i-1][j-1]  (free diagonal, no edit)
        else: dp[i][j] = 1 + min(
            dp[i][j-1],    # insert a char into word1
            dp[i-1][j],    # delete a char from word1
            dp[i-1][j-1],  # replace a char
        )
    - Answer is dp[m][n]
    - Used in: spell checkers, DNA/sequence alignment, diff tools, fuzzy search
"""

from collections.abc import Generator
from typing import Any

from algorithms.base import Step, StepTracker, VisualizerType


class EditDistance(StepTracker):
    """Edit Distance (Levenshtein) solver with DP grid visualization."""

    visualizer_type = VisualizerType.GRID

    def __init__(self):
        super().__init__()
        self.operations = 0

    def run(self, input_data: dict[str, Any]) -> Generator[Step, None, None]:
        """Compute the Levenshtein edit distance between two words.

        Args:
            input_data: Dict with keys ``word1`` and ``word2`` (strings).

        Yields:
            Step objects for grid visualization.
        """
        self.reset()
        self.operations = 0

        word1 = input_data.get("word1", "")
        word2 = input_data.get("word2", "")
        m, n = len(word1), len(word2)

        # dp[i][j] = edit distance between word1[:i] and word2[:j]
        dp = [[0 for _ in range(n + 1)] for _ in range(m + 1)]

        yield self.emit_step(
            operation="init",
            description=(
                f'Building ({m + 1})×({n + 1}) DP table to transform "{word1}" into "{word2}"'
            ),
            state={"type": "grid", "grid": [row[:] for row in dp]},
            highlights=[],
            metadata={
                "word1": word1,
                "word2": word2,
                "m": m,
                "n": n,
                "operations": self.operations,
            },
        )

        # Base cases: first column (delete all i chars) and first row (insert all j chars)
        for i in range(m + 1):
            dp[i][0] = i
        for j in range(n + 1):
            dp[0][j] = j

        yield self.emit_step(
            operation="base_case",
            description=("Base cases: dp[i][0]=i (delete i chars), dp[0][j]=j (insert j chars)"),
            state={"type": "grid", "grid": [row[:] for row in dp]},
            highlights=[
                *[{"type": "cell", "row": i, "col": 0, "color": "visited"} for i in range(m + 1)],
                *[{"type": "cell", "row": 0, "col": j, "color": "visited"} for j in range(n + 1)],
            ],
            metadata={
                "word1": word1,
                "word2": word2,
                "m": m,
                "n": n,
                "operations": self.operations,
            },
        )

        # Fill the table
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                char1 = word1[i - 1]
                char2 = word2[j - 1]

                if char1 == char2:
                    # Characters match - no edit needed, take the diagonal for free
                    dp[i][j] = dp[i - 1][j - 1]
                    won = "match"

                    yield self.emit_step(
                        operation="match",
                        description=(
                            f"word1[{i - 1}]='{char1}' == word2[{j - 1}]='{char2}': "
                            f"free diagonal, dp[{i}][{j}]=dp[{i - 1}][{j - 1}]={dp[i][j]}"
                        ),
                        state={"type": "grid", "grid": [row[:] for row in dp]},
                        highlights=[
                            {"type": "cell", "row": i, "col": j, "color": "active"},
                            {"type": "cell", "row": i - 1, "col": j - 1, "color": "sorted"},
                        ],
                        metadata={
                            "word1": word1,
                            "word2": word2,
                            "i": i,
                            "j": j,
                            "char1": char1,
                            "char2": char2,
                            "operation_won": won,
                            "value": dp[i][j],
                            "operations": self.operations,
                        },
                    )
                else:
                    insert = dp[i][j - 1]
                    delete = dp[i - 1][j]
                    replace = dp[i - 1][j - 1]
                    self.operations += 1

                    best = min(insert, delete, replace)
                    dp[i][j] = 1 + best

                    # Determine which operation won (prefer replace, then delete, then insert)
                    if replace == best:
                        won = "replace"
                        won_row, won_col = i - 1, j - 1
                    elif delete == best:
                        won = "delete"
                        won_row, won_col = i - 1, j
                    else:
                        won = "insert"
                        won_row, won_col = i, j - 1

                    yield self.emit_step(
                        operation="edit",
                        description=(
                            f"word1[{i - 1}]='{char1}' != word2[{j - 1}]='{char2}': "
                            f"{won} (insert={insert}, delete={delete}, replace={replace}) "
                            f"→ dp[{i}][{j}]=1+{best}={dp[i][j]}"
                        ),
                        state={"type": "grid", "grid": [row[:] for row in dp]},
                        highlights=[
                            {"type": "cell", "row": i, "col": j, "color": "active"},
                            {"type": "cell", "row": won_row, "col": won_col, "color": "comparing"},
                            {"type": "cell", "row": i, "col": j - 1, "color": "visited"},
                            {"type": "cell", "row": i - 1, "col": j, "color": "visited"},
                            {"type": "cell", "row": i - 1, "col": j - 1, "color": "visited"},
                        ],
                        metadata={
                            "word1": word1,
                            "word2": word2,
                            "i": i,
                            "j": j,
                            "char1": char1,
                            "char2": char2,
                            "insert": insert,
                            "delete": delete,
                            "replace": replace,
                            "operation_won": won,
                            "value": dp[i][j],
                            "operations": self.operations,
                        },
                    )

        distance = dp[m][n]

        yield self.emit_step(
            operation="complete",
            description=(
                f'Edit distance between "{word1}" and "{word2}" is {distance} '
                f"(bottom-right cell dp[{m}][{n}])"
            ),
            state={"type": "grid", "grid": [row[:] for row in dp]},
            highlights=[{"type": "cell", "row": m, "col": n, "color": "sorted"}],
            metadata={
                "word1": word1,
                "word2": word2,
                "m": m,
                "n": n,
                "edit_distance": distance,
                "operations": self.operations,
            },
        )
