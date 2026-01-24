"""Type definitions for DSA visualizer."""

from enum import Enum


class VisualizerType(str, Enum):
    """Types of visualizers available."""

    ARRAY = "array"
    GRAPH = "graph"
    TREE = "tree"
    HEAP = "heap"
    GRID = "grid"
    LINKED_LIST = "linked_list"
    DP_TABLE = "dp_table"
    STACK_QUEUE = "stack_queue"
    TRIE = "trie"
    HASH_TABLE = "hash_table"
    COMPOSITE = "composite"
