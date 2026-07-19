"""Word Break - Can a string be segmented into dictionary words?

Given a string ``s`` and a dictionary of words, determine whether ``s`` can be
segmented into a space-separated sequence of one or more dictionary words.

Approach (bottom-up boolean DP):
    Let ``ok[i]`` be True if the prefix ``s[:i]`` can be fully segmented into
    dictionary words. Then:
        ok[0] = True                      (the empty prefix is trivially segmentable)
        ok[i] = True  iff  there exists j < i with ok[j] AND s[j:i] in words.
    The final answer is ``ok[len(s)]``.

Time Complexity:
    Best: O(n) - answer settles as soon as no prefix can be extended
    Average: O(n^2 * k) - for each end i we try every split point j and compare
        the substring s[j:i] (length up to k) against the dictionary set
    Worst: O(n^2 * k) - n end positions, up to n split points each, substring
        comparison/hashing costs O(k)

Space Complexity:
    O(n + W) - the ok[] table of size n+1 plus the word set (W total characters)

Key Insights:
    - ok[i] means "s[:i] is segmentable". Building left to right, every answer we
      need (ok[j] for j < i) is already computed - classic optimal substructure
      with overlapping subproblems.
    - Storing the dictionary in a set turns each "is this substring a word?" check
      into an O(k) hash lookup instead of scanning the whole dictionary.
    - We can stop scanning split points for a given i the moment we find one that
      works: ok[i] only needs a single valid (ok[j] and s[j:i] in words).
    - The boolean table is naturally visualized as a 0/1 array of length n+1, where
      a 1 at position i means the prefix of length i can be broken into words.
"""

from collections.abc import Generator
from typing import Any

from algorithms.base import Step, StepTracker, VisualizerType


class WordBreak(StepTracker):
    """Word Break boolean DP with visualization step tracking."""

    visualizer_type = VisualizerType.ARRAY

    def __init__(self):
        super().__init__()
        self.comparisons = 0
        self.matches = 0

    def run(self, input_data: Any) -> Generator[Step, None, None]:
        """Determine whether ``s`` can be segmented into dictionary words.

        Args:
            input_data: A dict ``{"s": str, "words": list[str]}``. For
                convenience a ``{"values": {...}}`` wrapper or a raw ``s`` with a
                separate ``words`` key is also tolerated.

        Yields:
            Step objects for visualization. The state is the boolean ``ok`` table
            rendered as a 0/1 integer array of length ``len(s) + 1``.
        """
        self.reset()
        self.comparisons = 0
        self.matches = 0

        s, words = self._parse_input(input_data)
        word_set = {w for w in words if w}
        n = len(s)

        # ok[i] == True  ->  s[:i] can be segmented into dictionary words.
        ok = [False] * (n + 1)
        ok[0] = True  # empty prefix is trivially segmentable

        yield self.emit_step(
            operation="init",
            description=(
                f'Initialize DP over "{s}" (length {n}). '
                f"ok[0] = 1 because the empty prefix needs no words. "
                f"Dictionary: {sorted(word_set)}."
            ),
            state={"type": "array", "values": self._dp_values(ok)},
            highlights=[{"indices": [0], "color": "sorted"}],
            metadata={
                "string": s,
                "words": sorted(word_set),
                "comparisons": self.comparisons,
                "matches": self.matches,
            },
        )

        if n == 0:
            yield self.emit_step(
                operation="complete",
                description="Empty string is segmentable (vacuously true). Result: True.",
                state={"type": "array", "values": self._dp_values(ok)},
                highlights=[{"indices": [0], "color": "swapped"}],
                metadata={
                    "string": s,
                    "words": sorted(word_set),
                    "result": True,
                    "comparisons": self.comparisons,
                    "matches": self.matches,
                },
            )
            return

        for i in range(1, n + 1):
            for j in range(i):
                substring = s[j:i]

                # Only a split point whose prefix is already segmentable can help.
                if not ok[j]:
                    yield self.emit_step(
                        operation="skip",
                        description=(
                            f"End i={i}, split j={j}: ok[{j}] = 0, so the prefix "
                            f'"{s[:j]}" is not segmentable - skip "{substring}".'
                        ),
                        state={"type": "array", "values": self._dp_values(ok)},
                        highlights=self._build_highlights(i, j, ok, matched=False),
                        metadata={
                            "string": s,
                            "end": i,
                            "split": j,
                            "substring": substring,
                            "prefix_ok": False,
                            "in_dictionary": None,
                            "comparisons": self.comparisons,
                            "matches": self.matches,
                        },
                    )
                    continue

                self.comparisons += 1
                in_dict = substring in word_set

                yield self.emit_step(
                    operation="check",
                    description=(
                        f"End i={i}, split j={j}: ok[{j}] = 1, so check whether "
                        f'"{substring}" is in the dictionary -> '
                        f"{'yes' if in_dict else 'no'}."
                    ),
                    state={"type": "array", "values": self._dp_values(ok)},
                    highlights=self._build_highlights(i, j, ok, matched=in_dict),
                    metadata={
                        "string": s,
                        "end": i,
                        "split": j,
                        "substring": substring,
                        "prefix_ok": True,
                        "in_dictionary": in_dict,
                        "comparisons": self.comparisons,
                        "matches": self.matches,
                    },
                )

                if in_dict:
                    # Found a valid segmentation of s[:i]; no need to try more splits.
                    self.matches += 1
                    ok[i] = True
                    yield self.emit_step(
                        operation="mark",
                        description=(
                            f'Match! "{s[:j]}" + "{substring}" segments "{s[:i]}". '
                            f"Set ok[{i}] = 1 and move to the next end."
                        ),
                        state={"type": "array", "values": self._dp_values(ok)},
                        highlights=self._build_highlights(i, j, ok, matched=True),
                        metadata={
                            "string": s,
                            "end": i,
                            "split": j,
                            "substring": substring,
                            "prefix_ok": True,
                            "in_dictionary": True,
                            "comparisons": self.comparisons,
                            "matches": self.matches,
                        },
                    )
                    break

        result = ok[n]
        yield self.emit_step(
            operation="complete",
            description=(
                f'Done! ok[{n}] = {int(result)}, so "{s}" '
                f"{'CAN' if result else 'CANNOT'} be segmented into dictionary words. "
                f"Result: {result}."
            ),
            state={"type": "array", "values": self._dp_values(ok)},
            highlights=[
                {"indices": [n], "color": "swapped" if result else "comparing"},
            ],
            metadata={
                "string": s,
                "words": sorted(word_set),
                "result": result,
                "comparisons": self.comparisons,
                "matches": self.matches,
            },
        )

    @staticmethod
    def _parse_input(input_data: Any) -> tuple[str, list[str]]:
        """Normalize the input into (s, words)."""
        if isinstance(input_data, dict):
            data = input_data.get("values", input_data)
            if not isinstance(data, dict):
                data = input_data
            s = str(data.get("s", ""))
            words = data.get("words", []) or []
            if isinstance(words, str):
                words = [w.strip() for w in words.split(",")]
            return s, [str(w).strip() for w in words if str(w).strip()]
        # Fallback: a bare string with no dictionary.
        return str(input_data), []

    @staticmethod
    def _dp_values(ok: list[bool]) -> list[int]:
        """Render the boolean DP table as a 0/1 integer array."""
        return [1 if b else 0 for b in ok]

    @staticmethod
    def _build_highlights(i: int, j: int, ok: list[bool], matched: bool) -> list[dict[str, Any]]:
        """Build layered highlights for the DP array.

        Priority (first match wins in the array visualizer):
            1. split point j   -> "sorted" (purple) when matched, else "comparing"
            2. current end i    -> "active" (blue)
        """
        split_color = "swapped" if matched else "comparing"
        return [
            {"indices": [j], "color": split_color},
            {"indices": [i], "color": "active"},
        ]
