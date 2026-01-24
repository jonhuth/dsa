"""Base class for algorithms that emit visualization steps."""

import inspect
from typing import Any, Generator
from pydantic import BaseModel


class Highlight(BaseModel):
    """Represents a highlighted element in a visualization."""

    indices: list[int] = []
    nodes: list[Any] = []
    edges: list[tuple[Any, Any]] = []
    color: str = "primary"


class Step(BaseModel):
    """Represents a single step in an algorithm execution."""

    step_number: int
    operation: str
    description: str
    state: dict[str, Any]
    highlights: list[Highlight] = []
    metadata: dict[str, Any] = {}


class StepTracker:
    """Base class for algorithms that emit visualization steps.

    All algorithms inherit from this class and use emit_step() to yield
    visualization data that can be consumed by the frontend.

    Example:
        class BubbleSort(StepTracker):
            def sort(self, arr: list) -> Generator[Step, None, None]:
                for i in range(len(arr) - 1):
                    for j in range(len(arr) - i - 1):
                        yield self.emit_step(
                            operation="compare",
                            description=f"Comparing {arr[j]} with {arr[j+1]}",
                            state={"type": "array", "values": arr.copy()},
                            highlights=[{
                                "indices": [j, j+1],
                                "color": "comparing"
                            }]
                        )
                        if arr[j] > arr[j + 1]:
                            arr[j], arr[j + 1] = arr[j + 1], arr[j]
                            yield self.emit_step(...)
    """

    def __init__(self):
        self._step_count = 0
        self._steps: list[Step] = []

    def emit_step(
        self,
        operation: str,
        description: str,
        state: dict[str, Any],
        highlights: list[dict[str, Any]] | None = None,
        metadata: dict[str, Any] | None = None,
    ) -> Step:
        """Emit a visualization step.

        Args:
            operation: Type of operation (e.g., "compare", "swap", "insert")
            description: Human-readable description of what's happening
            state: Current state of the data structure (e.g., {"type": "array", "values": [...]})
            highlights: List of elements to highlight (indices, nodes, edges)
            metadata: Additional metadata (e.g., comparisons_count, swaps_count)

        Returns:
            Step object representing this visualization step
        """
        self._step_count += 1

        # Capture source location for code highlighting
        caller_frame = inspect.currentframe()
        if caller_frame and caller_frame.f_back:
            source_line = caller_frame.f_back.f_lineno
            source_file = caller_frame.f_back.f_code.co_filename
        else:
            source_line = None
            source_file = None

        # Convert highlight dicts to Highlight objects
        highlight_objects = []
        if highlights:
            for h in highlights:
                highlight_objects.append(Highlight(**h))

        # Merge source location into metadata
        step_metadata = metadata or {}
        if source_line is not None:
            step_metadata["source_line"] = source_line
        if source_file is not None:
            step_metadata["source_file"] = source_file

        step = Step(
            step_number=self._step_count,
            operation=operation,
            description=description,
            state=state,
            highlights=highlight_objects,
            metadata=step_metadata,
        )

        self._steps.append(step)
        return step

    def get_all_steps(self) -> list[Step]:
        """Get all emitted steps."""
        return self._steps

    def reset(self):
        """Reset step counter and stored steps."""
        self._step_count = 0
        self._steps = []
