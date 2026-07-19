"""Correctness + visualization-invariant tests for Wave 1 exhibit algorithms.

Each Wave 1 algorithm exposes a uniform ``run(input_data)`` generator that
yields ``Step`` objects for the frontend visualizer. These tests verify:

1. The generator yields a non-trivial sequence of steps.
2. Every emitted step satisfies the visualization contract (required fields,
   a ``state`` with a ``type``, and source-line metadata for code highlighting).
3. The algorithm computes the correct answer for known inputs (asserted against
   the human-readable final-step description, which is what users see).
"""

import pytest

from algorithms.dynamic_programming.climbing_stairs_viz import ClimbingStairs
from algorithms.dynamic_programming.coin_change_viz import CoinChange
from algorithms.dynamic_programming.edit_distance_viz import EditDistance
from algorithms.dynamic_programming.house_robber_viz import HouseRobber
from algorithms.dynamic_programming.kadane_viz import Kadane
from algorithms.dynamic_programming.unique_paths_viz import UniquePaths
from algorithms.graphs.topological_sort import TopologicalSort
from algorithms.sorting.counting_sort import CountingSort
from algorithms.sorting.radix_sort import RadixSort
from algorithms.trees.invert_binary_tree_viz import InvertBinaryTree
from algorithms.trees.validate_bst_viz import ValidateBST


def _collect(cls, input_data):
    """Run an algorithm and return its list of step dicts."""
    return [step.model_dump() for step in cls().run(input_data)]


def _assert_step_contract(steps):
    """Every step must satisfy the visualization contract."""
    assert len(steps) > 1, "expected a non-trivial sequence of steps"
    for i, step in enumerate(steps):
        for key in ("step_number", "operation", "description", "state", "metadata"):
            assert key in step, f"step {i} missing {key!r}"
        assert isinstance(step["state"], dict) and step["state"].get("type"), (
            f"step {i} state missing a visualizer 'type'"
        )
        # emit_step injects source_line for the live code viewer
        assert "source_line" in step["metadata"], f"step {i} missing source_line"
    # step numbers are monotonic starting at 1
    assert [s["step_number"] for s in steps] == list(range(1, len(steps) + 1))


# ---------------------------------------------------------------------------
# Contract: all Wave 1 algorithms emit well-formed steps.
# ---------------------------------------------------------------------------

CONTRACT_CASES = [
    (Kadane, [-2, 1, -3, 4, -1, 2, 1, -5, 4]),
    (CoinChange, {"coins": [1, 2, 5], "amount": 11}),
    (ClimbingStairs, 5),
    (HouseRobber, [2, 7, 9, 3, 1]),
    (EditDistance, {"word1": "horse", "word2": "ros"}),
    (UniquePaths, {"rows": 3, "cols": 7}),
    (CountingSort, [4, 2, 8, 3, 1, 4, 7, 2]),
    (RadixSort, [170, 45, 75, 90, 2, 802, 24, 66]),
    (ValidateBST, [5, 3, 8, 1, 4, 7, 9]),
    (InvertBinaryTree, [4, 2, 7, 1, 3, 6, 9]),
    (TopologicalSort, {"graph": {"0": [1, 2], "1": [3], "2": [3], "3": [4], "4": []}}),
]


@pytest.mark.parametrize("cls,input_data", CONTRACT_CASES, ids=lambda v: getattr(v, "__name__", ""))
def test_step_contract(cls, input_data):
    _assert_step_contract(_collect(cls, input_data))


# ---------------------------------------------------------------------------
# Correctness: the final step reports the right answer.
# ---------------------------------------------------------------------------


def _final(cls, input_data):
    return _collect(cls, input_data)[-1]["description"]


def test_kadane_max_subarray():
    # [4, -1, 2, 1] sums to 6, the maximum contiguous subarray.
    assert "6" in _final(Kadane, [-2, 1, -3, 4, -1, 2, 1, -5, 4])


def test_kadane_all_negative():
    # With all negatives the answer is the single largest element (-1).
    assert "-1" in _final(Kadane, [-3, -1, -4, -2])


def test_coin_change_minimum():
    # 11 = 5 + 5 + 1 -> 3 coins.
    assert "3" in _final(CoinChange, {"coins": [1, 2, 5], "amount": 11})


def test_coin_change_impossible():
    assert "-1" in _final(CoinChange, {"coins": [2], "amount": 3})


def test_climbing_stairs():
    # ways(5) = 8 (Fibonacci shifted by one).
    assert "8" in _final(ClimbingStairs, 5)


def test_house_robber():
    # max of [2,7,9,3,1] non-adjacent = 2 + 9 + 1 = 12.
    assert "12" in _final(HouseRobber, [2, 7, 9, 3, 1])


def test_edit_distance():
    # horse -> ros has edit distance 3.
    assert "3" in _final(EditDistance, {"word1": "horse", "word2": "ros"})


def test_unique_paths():
    # 3x7 grid -> C(8,2) = 28 unique paths.
    assert "28" in _final(UniquePaths, {"rows": 3, "cols": 7})


def test_unique_paths_no_silent_clamp():
    # Regression: dimensions > 10 must not be silently clamped (an 11x2 grid
    # has exactly 11 paths, not 10). See Codex audit finding.
    steps = _collect(UniquePaths, {"rows": 11, "cols": 2})
    assert steps[0]["metadata"]["capped"] is False
    assert steps[-1]["state"]["grid"][10][1] == 11


@pytest.mark.parametrize(
    "arr",
    [[4, 2, 8, 3, 1, 4, 7, 2], [], [5], [1, 1, 1], [9, 8, 7, 6, 5]],
)
def test_counting_sort_correct(arr):
    if len(arr) < 2:
        # Trivial arrays may short-circuit; just ensure no crash.
        list(CountingSort().run(arr))
        return
    steps = _collect(CountingSort, arr)
    final_values = steps[-1]["state"]["values"]
    assert final_values == sorted(arr)


@pytest.mark.parametrize(
    "arr",
    [[170, 45, 75, 90, 2, 802, 24, 66], [3, 3, 3], [10, 1, 100, 1000]],
)
def test_radix_sort_correct(arr):
    steps = _collect(RadixSort, arr)
    final_values = steps[-1]["state"]["values"]
    assert final_values == sorted(arr)


def test_validate_bst_valid():
    assert "Valid" in _final(ValidateBST, [5, 3, 8, 1, 4, 7, 9])


def test_validate_bst_invalid():
    # 6 in the right subtree of 5 but less than root's right child 8 boundary broken:
    # [5, 1, 4, None, None, 3, 6] is the classic invalid BST.
    desc = _final(ValidateBST, [5, 1, 4, None, None, 3, 6]).lower()
    assert "not a valid" in desc or "invalid" in desc


def test_invert_binary_tree():
    steps = _collect(InvertBinaryTree, [4, 2, 7, 1, 3, 6, 9])
    # After inversion the root's left subtree root becomes the old right child (7).
    final_tree = steps[-1]["state"]["tree"]
    assert final_tree["val"] == 4
    assert final_tree["left"]["val"] == 7
    assert final_tree["right"]["val"] == 2


def test_topological_sort_valid_order():
    graph = {"0": [1, 2], "1": [3], "2": [3], "3": [4], "4": []}
    steps = _collect(TopologicalSort, {"graph": graph})
    order = steps[-1]["metadata"].get("order")
    assert order is not None, "final step should expose the ordering in metadata"
    position = {node: i for i, node in enumerate(order)}
    # Every directed edge u -> v must place u before v.
    for u, neighbors in graph.items():
        for v in neighbors:
            assert position[int(u)] < position[int(v)], f"{u} must precede {v}"


def test_topological_sort_detects_cycle():
    # 0 -> 1 -> 2 -> 0 is a cycle; a full ordering is impossible.
    steps = _collect(TopologicalSort, {"graph": {"0": [1], "1": [2], "2": [0]}})
    assert "cycle" in steps[-1]["description"].lower()
