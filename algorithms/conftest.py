"""Shared pytest fixtures for algorithm tests."""

import pytest


@pytest.fixture
def sample_array():
    """Sample unsorted array for testing."""
    return [64, 34, 25, 12, 22, 11, 90]


@pytest.fixture
def sorted_array():
    """Already sorted array (best case for many algorithms)."""
    return [1, 2, 3, 4, 5, 6, 7, 8, 9]


@pytest.fixture
def reverse_sorted_array():
    """Reverse sorted array (worst case for many algorithms)."""
    return [9, 8, 7, 6, 5, 4, 3, 2, 1]


@pytest.fixture
def array_with_duplicates():
    """Array with duplicate elements."""
    return [5, 2, 8, 2, 9, 1, 5, 5]


@pytest.fixture
def single_element_array():
    """Array with a single element."""
    return [42]


@pytest.fixture
def empty_array():
    """Empty array."""
    return []


@pytest.fixture
def large_array():
    """Large array for performance testing."""
    import random

    random.seed(42)  # Reproducible
    return [random.randint(1, 1000) for _ in range(100)]
