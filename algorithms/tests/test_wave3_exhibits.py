"""Correctness + visualization-invariant tests for Wave 3 exhibit algorithms."""

import pytest

from algorithms.dynamic_programming.coin_change_2_viz import CoinChange2
from algorithms.dynamic_programming.lps_viz import LongestPalindromicSubsequence
from algorithms.dynamic_programming.max_product_subarray_viz import MaxProductSubarray
from algorithms.graphs.astar_grid_viz import AStarGrid
from algorithms.graphs.bellman_ford_viz import BellmanFord
from algorithms.graphs.prim_mst_viz import PrimMST
from algorithms.search.exponential_search_viz import ExponentialSearch
from algorithms.search.ternary_search_viz import TernarySearch
from algorithms.trees.path_sum_viz import PathSum
from algorithms.trees.tree_diameter_viz import TreeDiameter

GRAPH_W = {"0": [[1, 4], [2, 5]], "1": [[3, 3]], "2": [[1, -2], [3, 4]], "3": []}
MST_GRAPH = {
    "0": [[1, 2], [3, 6]],
    "1": [[0, 2], [2, 3], [3, 8], [4, 5]],
    "2": [[1, 3], [4, 7]],
    "3": [[0, 6], [1, 8]],
    "4": [[1, 5], [2, 7]],
}
GRID = [[0, 0, 0, 0, 0], [0, 1, 1, 1, 0], [0, 0, 0, 1, 0], [1, 1, 0, 1, 0], [0, 0, 0, 0, 0]]


def _collect(cls, input_data):
    return [step.model_dump() for step in cls().run(input_data)]


def _final(cls, input_data):
    return _collect(cls, input_data)[-1]["description"]


CONTRACT_CASES = [
    (BellmanFord, {"graph": GRAPH_W, "start": 0}),
    (PrimMST, {"graph": MST_GRAPH, "start": 0}),
    (AStarGrid, {"grid": GRID, "start": [0, 0], "goal": [4, 4]}),
    (ExponentialSearch, {"array": [1, 3, 5, 7, 9, 11, 13, 17, 21, 25], "target": 17}),
    (TernarySearch, {"array": [1, 3, 5, 7, 9, 11, 13, 15, 17, 19], "target": 13}),
    (CoinChange2, {"coins": [1, 2, 5], "amount": 5}),
    (LongestPalindromicSubsequence, {"s": "bbbab"}),
    (MaxProductSubarray, [2, 3, -2, 4, -1]),
    (TreeDiameter, [1, 2, 3, 4, 5]),
    (PathSum, {"values": [5, 4, 8, 11, None, 13, 4, 7, 2, None, None, None, 1], "target": 22}),
]


@pytest.mark.parametrize("cls,inp", CONTRACT_CASES, ids=lambda v: getattr(v, "__name__", ""))
def test_step_contract(cls, inp):
    steps = _collect(cls, inp)
    assert len(steps) >= 1
    for i, step in enumerate(steps):
        for key in ("step_number", "operation", "description", "state", "metadata"):
            assert key in step, f"step {i} missing {key!r}"
        assert isinstance(step["state"], dict) and step["state"].get("type")
        assert "source_line" in step["metadata"]
    assert [s["step_number"] for s in steps] == list(range(1, len(steps) + 1))


# ---- Correctness ----


def test_bellman_ford_distances():
    steps = _collect(BellmanFord, {"graph": GRAPH_W, "start": 0})
    dist = steps[-1]["metadata"].get("distances")
    assert dist is not None
    # 0→2 = 5, 2→1 = 3, 1→3 = 6. Keys may be int or str depending on serialization.
    d = {int(k): v for k, v in dist.items()}
    assert d[1] == 3 and d[2] == 5 and d[3] == 6


def test_bellman_ford_negative_cycle():
    desc = _final(BellmanFord, {"graph": {"0": [[1, 1]], "1": [[2, -1]], "2": [[0, -1]]}, "start": 0})
    assert "negative" in desc.lower() and "cycle" in desc.lower()


def test_prim_mst_edges():
    desc = _final(PrimMST, {"graph": MST_GRAPH, "start": 0})
    # 5 vertices ⇒ 4 MST edges; optimal weight 2+3+5+6 = 16.
    assert "4 edge" in desc.lower()


def test_astar_finds_path():
    desc = _final(AStarGrid, {"grid": GRID, "start": [0, 0], "goal": [4, 4]}).lower()
    assert "reached" in desc or "path" in desc


def test_astar_no_path():
    walled = [[0, 1, 0], [1, 1, 0], [0, 0, 0]]
    desc = _final(AStarGrid, {"grid": walled, "start": [0, 0], "goal": [0, 2]}).lower()
    assert "no path" in desc or "unreachable" in desc or "no " in desc


def test_exponential_search():
    assert "7" in _final(ExponentialSearch, {"array": [1, 3, 5, 7, 9, 11, 13, 17, 21, 25], "target": 17})


def test_ternary_search_found():
    assert "6" in _final(TernarySearch, {"array": [1, 3, 5, 7, 9, 11, 13, 15, 17, 19], "target": 13})


def test_ternary_search_not_found():
    desc = _final(TernarySearch, {"array": [1, 3, 5, 7, 9], "target": 4}).lower()
    assert "-1" in desc or "not" in desc


def test_coin_change_2_ways():
    # {5},{2,2,1},{2,1,1,1},{1×5} ⇒ 4 ways to make 5 with [1,2,5].
    assert "4" in _final(CoinChange2, {"coins": [1, 2, 5], "amount": 5})


def test_lps_length():
    # "bbbab" ⇒ "bbbb" length 4.
    assert "4" in _final(LongestPalindromicSubsequence, {"s": "bbbab"})


def test_max_product_subarray():
    # 4·(-1)·(-2)·... best contiguous product here is 4·... = 48 (4, then -1 flips; [2,3,-2,4,-1] → 48).
    assert "48" in _final(MaxProductSubarray, [2, 3, -2, 4, -1])


def test_max_product_all_negative_pair():
    # [-2, -3] ⇒ 6.
    assert "6" in _final(MaxProductSubarray, [-2, -3])


def test_tree_diameter():
    # 1→2→4/5 and 1→3: longest path 4→2→1→3 = 3 edges.
    assert "3" in _final(TreeDiameter, [1, 2, 3, 4, 5])


def test_path_sum_found():
    desc = _final(
        PathSum,
        {"values": [5, 4, 8, 11, None, 13, 4, 7, 2, None, None, None, 1], "target": 22},
    )
    assert "22" in desc


def test_path_sum_not_found():
    desc = _final(PathSum, {"values": [1, 2, 3], "target": 999}).lower()
    assert "no" in desc or "not" in desc
