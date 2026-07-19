"""Correctness + visualization-invariant tests for Wave 2 exhibit algorithms.

Same contract as Wave 1: each algorithm exposes a uniform ``run(input_data)``
generator yielding ``Step`` objects. These tests assert the visualization
contract holds and the final step reports the correct answer.
"""

import pytest

from algorithms.dynamic_programming.lis_viz import LongestIncreasingSubsequence
from algorithms.dynamic_programming.min_path_sum_viz import MinPathSum
from algorithms.dynamic_programming.word_break_viz import WordBreak
from algorithms.graphs.connected_components_viz import ConnectedComponents
from algorithms.graphs.course_schedule_viz import CourseSchedule
from algorithms.search.quickselect_viz import QuickSelect
from algorithms.search.rotated_array_search_viz import RotatedArraySearch
from algorithms.trees.lca_viz import LowestCommonAncestor
from algorithms.trees.level_order_viz import LevelOrder
from algorithms.trees.max_depth_viz import MaxDepth


def _collect(cls, input_data):
    return [step.model_dump() for step in cls().run(input_data)]


def _final(cls, input_data):
    return _collect(cls, input_data)[-1]["description"]


# ---------------------------------------------------------------------------
# Contract: all Wave 2 algorithms emit well-formed steps.
# ---------------------------------------------------------------------------

CONTRACT_CASES = [
    (QuickSelect, {"array": [7, 2, 1, 6, 8, 5, 3, 4], "k": 4}),
    (RotatedArraySearch, {"array": [4, 5, 6, 7, 0, 1, 2], "target": 0}),
    (LongestIncreasingSubsequence, [10, 9, 2, 5, 3, 7, 101, 18]),
    (WordBreak, {"s": "leetcode", "words": ["leet", "code"]}),
    (MinPathSum, {"grid": [[1, 3, 1], [1, 5, 1], [4, 2, 1]]}),
    (LowestCommonAncestor, {"values": [6, 2, 8, 0, 4, 7, 9, None, None, 3, 5], "p": 2, "q": 8}),
    (MaxDepth, [3, 9, 20, None, None, 15, 7]),
    (LevelOrder, [3, 9, 20, None, None, 15, 7]),
    (CourseSchedule, {"graph": {"0": [1], "1": [2], "2": []}}),
    (ConnectedComponents, {"graph": {"0": [1], "1": [0], "2": [3], "3": [2], "4": []}}),
]


@pytest.mark.parametrize("cls,input_data", CONTRACT_CASES, ids=lambda v: getattr(v, "__name__", ""))
def test_step_contract(cls, input_data):
    steps = _collect(cls, input_data)
    assert len(steps) >= 1
    for i, step in enumerate(steps):
        for key in ("step_number", "operation", "description", "state", "metadata"):
            assert key in step, f"step {i} missing {key!r}"
        assert isinstance(step["state"], dict) and step["state"].get("type")
        assert "source_line" in step["metadata"]
    assert [s["step_number"] for s in steps] == list(range(1, len(steps) + 1))


# ---------------------------------------------------------------------------
# Correctness.
# ---------------------------------------------------------------------------


@pytest.mark.parametrize(
    "arr,k,expected",
    [
        ([7, 2, 1, 6, 8, 5, 3, 4], 4, 4),
        ([3, 1, 2], 1, 1),
        ([3, 1, 2], 3, 3),
        ([42], 1, 42),
        ([5, 5, 5, 5], 2, 5),
    ],
)
def test_quickselect(arr, k, expected):
    assert str(expected) in _final(QuickSelect, {"array": arr, "k": k})


def test_rotated_search_found():
    assert "4" in _final(RotatedArraySearch, {"array": [4, 5, 6, 7, 0, 1, 2], "target": 0})


def test_rotated_search_not_found():
    desc = _final(RotatedArraySearch, {"array": [4, 5, 6, 7, 0, 1, 2], "target": 3}).lower()
    assert "-1" in desc or "not" in desc


def test_lis_length():
    # [2,3,7,101] or [2,3,7,18] -> length 4.
    assert "4" in _final(LongestIncreasingSubsequence, [10, 9, 2, 5, 3, 7, 101, 18])


def test_word_break_positive():
    assert "CAN" in _final(WordBreak, {"s": "leetcode", "words": ["leet", "code"]}).upper()


def test_word_break_negative():
    desc = _final(
        WordBreak,
        {"s": "catsandog", "words": ["cats", "dog", "sand", "and", "cat"]},
    ).upper()
    assert "CANNOT" in desc or "NOT" in desc


def test_min_path_sum():
    steps = _collect(MinPathSum, {"grid": [[1, 3, 1], [1, 5, 1], [4, 2, 1]]})
    # 1->3->1->1->1 = 7 is the minimum-cost path.
    assert steps[-1]["state"]["grid"][2][2] == 7


def test_lca_bst():
    assert "6" in _final(
        LowestCommonAncestor,
        {"values": [6, 2, 8, 0, 4, 7, 9, None, None, 3, 5], "p": 2, "q": 8},
    )


def test_lca_deeper():
    # LCA of 3 and 5 (both under 4) is 4.
    assert "4" in _final(
        LowestCommonAncestor,
        {"values": [6, 2, 8, 0, 4, 7, 9, None, None, 3, 5], "p": 3, "q": 5},
    )


def test_max_depth():
    assert "3" in _final(MaxDepth, [3, 9, 20, None, None, 15, 7])


def test_max_depth_empty():
    assert "0" in _final(MaxDepth, [])


def test_level_order_visits_all():
    steps = _collect(LevelOrder, [3, 9, 20, None, None, 15, 7])
    joined = " ".join(s["description"] for s in steps)
    for v in ("3", "9", "20", "15", "7"):
        assert v in joined


def test_course_schedule_can_finish():
    assert "finish" in _final(CourseSchedule, {"graph": {"0": [1], "1": [2], "2": []}}).lower()


def test_course_schedule_cycle():
    desc = _final(CourseSchedule, {"graph": {"0": [1], "1": [2], "2": [0]}}).lower()
    assert "cannot" in desc or "cycle" in desc


def test_connected_components_count():
    steps = _collect(
        ConnectedComponents,
        {"graph": {"0": [1], "1": [0], "2": [3], "3": [2], "4": []}},
    )
    assert steps[-1]["metadata"].get("component_count") == 3


def test_connected_components_single():
    steps = _collect(
        ConnectedComponents,
        {"graph": {"0": [1, 2], "1": [0, 2], "2": [0, 1]}},
    )
    assert steps[-1]["metadata"].get("component_count") == 1
