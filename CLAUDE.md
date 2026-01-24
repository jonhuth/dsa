# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **DSA Visualizer** - an interactive learning platform for data structures and algorithms. The project combines:

- **Python backend** (Flask) for algorithm execution with step-by-step tracking
- **Next.js frontend** (TypeScript, Bun, TailwindCSS) for rich visualizations
- **Algorithm implementations** in Python with comprehensive test suites
- **Learning resources** including complexity analysis, edge cases, and AI tutoring

The primary goal is to help people learn DSA concepts through visualization, rich documentation, and interactive exploration.

## Repository Structure

### High-Level Organization

```
dsa/
├── web/                    # Next.js 14+ frontend (TypeScript, Bun, TailwindCSS)
├── api/                    # Flask backend (Python 3.11+, uv, Ruff)
├── algorithms/             # Python DSA implementations with step tracking
├── docs/                   # Documentation and roadmap
├── package.json            # Root scripts (bun dev, bun test, etc.)
└── docker-compose.yml      # Docker development environment
```

### Frontend Structure (web/)

```
web/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with dark theme
│   ├── page.tsx            # Landing page
│   ├── algorithms/         # Algorithm exhibit pages
│   │   ├── page.tsx        # Index of all algorithms
│   │   └── sorting/
│   │       ├── page.tsx    # Sorting category index
│   │       └── bubble-sort/page.tsx  # Bubble sort exhibit
│   ├── api/                # Next.js API routes (for AI chat, etc.)
│   └── globals.css         # Tailwind + Obsidian-inspired theme
├── components/             # React components
│   ├── visualizers/        # ArrayVisualizer, GraphVisualizer, etc.
│   ├── controls/           # PlaybackControls, SpeedSlider
│   ├── learning/           # ComplexityChart, EdgeCases, RelatedLinks
│   ├── chat/               # AI tutor components
│   └── ui/                 # shadcn/ui components
├── lib/                    # Utilities, registries, API clients
├── content/                # Algorithm metadata (JSON)
├── hooks/                  # React hooks
├── package.json            # Frontend dependencies (Bun)
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # TailwindCSS configuration
└── biome.json              # Biome linter/formatter configuration
```

### Backend Structure (api/)

```
api/
├── app/
│   ├── __init__.py         # Flask app factory
│   ├── main.py             # Main entry point
│   ├── routes/
│   │   └── algorithms.py   # Algorithm execution endpoints
│   └── services/
│       └── registry.py     # Algorithm discovery and execution
├── pyproject.toml          # Python dependencies (uv + ruff)
└── Dockerfile              # Docker image for Flask
```

### Algorithm Structure (algorithms/)

```
algorithms/
├── base/
│   ├── step_tracker.py     # Base class all algorithms inherit from
│   ├── types.py            # VisualizerType enum, shared types
│   └── __init__.py
├── sorting/
│   ├── bubble_sort.py      # Instrumented bubble sort
│   ├── __init__.py
│   └── tests/
│       └── test_bubble_sort.py  # Comprehensive test suite
├── graphs/                 # Graph algorithms (BFS, DFS, etc.)
├── trees/                  # Tree algorithms (BST, traversals, etc.)
├── heaps/                  # Heap implementations
├── dynamic_programming/    # DP algorithms
├── _templates/             # Templates for new content
│   ├── algorithm_template.py
│   └── test_template.py
└── conftest.py             # Shared pytest fixtures
```

## Key Architectural Patterns

### 1. Step Tracking for Visualization

All algorithms inherit from `StepTracker` and use `emit_step()` to yield visualization frames:

```python
from algorithms.base import StepTracker, VisualizerType

class BubbleSort(StepTracker):
    visualizer_type = VisualizerType.ARRAY

    def sort(self, arr: list[int]):
        self.reset()
        for i in range(len(arr) - 1):
            for j in range(len(arr) - i - 1):
                yield self.emit_step(
                    operation="compare",
                    description=f"Comparing {arr[j]} and {arr[j+1]}",
                    state={"type": "array", "values": arr.copy()},
                    highlights=[{"indices": [j, j+1], "color": "comparing"}],
                    metadata={"comparisons": comparisons, "swaps": swaps}
                )
                # Algorithm logic here...
```

### 2. Flask API for Algorithm Execution

Backend provides REST endpoints for algorithm execution:

- `POST /api/algorithms/{id}/execute` - Execute and return all steps
- `POST /api/algorithms/{id}/execute/stream` - Stream steps via SSE
- `GET /api/algorithms/{id}/source` - Get Python source code
- `GET /api/algorithms` - List all algorithms

### 3. Frontend Visualization Flow

1. User selects algorithm and inputs
2. Frontend POSTs to `/api/algorithms/{id}/execute`
3. Backend executes algorithm, returns step array
4. Frontend renders with playback controls (first/prev/next/last)
5. Each step shows: array state, highlights, operation description, metadata

## Code Style and Conventions

### Python (algorithms/ and api/)

- **Linter/Formatter:** Ruff (configured in `api/pyproject.toml`)
- **Testing:** pytest with parametrized tests, fixtures, and Hypothesis
- **Docstrings:** Include problem statement, complexity analysis, examples
- **Type hints:** Use type hints for all function signatures
- **Naming:** `snake_case` for functions/variables, `PascalCase` for classes
- **Imports:** Absolute imports from `algorithms.` package

**Example docstring:**
```python
"""Bubble Sort - Simple comparison-based sorting algorithm.

Time Complexity:
    Best: O(n) - when array is already sorted
    Average: O(n²)
    Worst: O(n²)

Space Complexity: O(1) - sorts in place
"""
```

### TypeScript (web/)

- **Linter/Formatter:** Biome (configured in `web/biome.json`)
- **Type checking:** Strict TypeScript mode enabled
- **Components:** Functional components with TypeScript
- **Naming:** `camelCase` for variables/functions, `PascalCase` for components
- **Imports:** Use `@/` path alias for imports

## Running the Project

### Development (Recommended)

```bash
# From repository root
bun dev          # Runs both frontend and backend concurrently
```

This starts:
- Frontend on http://localhost:3000
- Backend on http://localhost:5000

### Individual Services

```bash
bun dev:web      # Frontend only
bun dev:api      # Backend only (Flask)
```

### Testing

```bash
bun test         # All tests (frontend + backend)
bun test:web     # Frontend tests (Vitest)
bun test:api     # Backend tests (pytest)
```

### Linting

```bash
bun lint         # Lint everything
bun format       # Format everything
```

## Adding New Algorithms

### Step-by-Step Process

1. **Copy template:**
   ```bash
   cp algorithms/_templates/algorithm_template.py algorithms/sorting/quick_sort.py
   ```

2. **Implement algorithm with step tracking:**
   - Inherit from `StepTracker`
   - Use `emit_step()` at key points
   - Include complexity analysis in docstring

3. **Add comprehensive tests:**
   ```bash
   cp algorithms/_templates/test_template.py algorithms/sorting/tests/test_quick_sort.py
   ```
   - Test edge cases (empty, single element, sorted, reverse, duplicates)
   - Use parametrized tests for multiple inputs
   - Verify step properties and correctness

4. **Register in backend:**
   - Edit `api/app/services/registry.py`
   - Add algorithm to `_discover_algorithms()`

5. **Create frontend exhibit:**
   - Create `web/app/algorithms/sorting/quick-sort/page.tsx`
   - Use existing bubble sort page as template

6. **Add learning content (future):**
   - Create `web/content/algorithms/quick-sort.json`
   - Include: complexity, edge cases, key insights, related algorithms

## Important Files

### Configuration Files

- `package.json` - Root package manager with dev scripts
- `web/package.json` - Frontend dependencies (Bun)
- `api/pyproject.toml` - Backend dependencies (uv)
- `web/biome.json` - Frontend linting/formatting
- `web/tsconfig.json` - TypeScript configuration
- `web/tailwind.config.ts` - TailwindCSS theme
- `web/next.config.ts` - Next.js configuration
- `docker-compose.yml` - Docker development setup

### Documentation

- `README.md` - Project overview, setup, architecture
- `CLAUDE.md` - This file (guidance for Claude Code)
- `docs/todo.md` - Feature roadmap and missing algorithms

### Entry Points

- `web/app/layout.tsx` - Root React layout
- `web/app/page.tsx` - Landing page
- `api/app/main.py` - Flask application
- `algorithms/base/step_tracker.py` - Base class for algorithms

## Current Implementation Status

### ✅ Completed

- [x] Project structure and tooling (Bun, Next.js, Flask, uv, Ruff, Biome)
- [x] Python base infrastructure (`StepTracker`, type system)
- [x] Flask backend with algorithm execution API
- [x] Bubble sort with comprehensive tests (24 tests, all passing)
- [x] Next.js frontend with routing and basic pages
- [x] Landing page and category navigation
- [x] Bubble sort exhibit page with visualization
- [x] Playback controls (first/prev/next/last)
- [x] Documentation (README, CLAUDE.md, todo.md)
- [x] Docker and Railway deployment configs

### 🚧 In Progress / TODO

See `docs/todo.md` for full roadmap. High-priority items:

- [ ] Live code execution viewer (see highlighted source as viz runs)
- [ ] More sorting algorithms (Quick Sort, Merge Sort, etc.)
- [ ] Graph visualizer and algorithms (BFS, DFS)
- [ ] Tree visualizer and algorithms
- [ ] AI chat integration (Anthropic Sonnet)
- [ ] Algorithm metadata registry
- [ ] Learning components (complexity charts, edge cases)
- [ ] Global search (Cmd+K)
- [ ] Mobile-optimized touch controls
- [ ] Comprehensive test coverage

## Testing Philosophy

### Python Algorithms

**Target: 95%+ coverage**

Tests should verify:
1. **Correctness** - Algorithm produces correct results
2. **Edge cases** - Empty, single element, duplicates, sorted, reverse
3. **Step generation** - Steps have required properties
4. **Metadata tracking** - Comparisons, swaps, etc. are accurate
5. **State immutability** - Each step has independent state copy

Use pytest fixtures from `algorithms/conftest.py` for common test data.

### Frontend Components

Use Vitest for unit tests, Playwright for E2E tests.

## Performance Considerations

- **Step tracking overhead:** Minimal - copy operations on each step
- **Large inputs:** Consider caching or streaming for N > 1000
- **Frontend rendering:** Virtualization for large arrays/graphs
- **API response size:** Steps array can be large; consider pagination/streaming

## Common Tasks

### Add a New Sorting Algorithm

```bash
# 1. Copy template and implement
cp algorithms/_templates/algorithm_template.py algorithms/sorting/merge_sort.py
# Edit merge_sort.py - add step tracking

# 2. Add tests
cp algorithms/_templates/test_template.py algorithms/sorting/tests/test_merge_sort.py
# Edit test file

# 3. Run tests
PYTHONPATH=/home/jhuth/dev/dsa uv run pytest ../algorithms/sorting/tests/test_merge_sort.py -v

# 4. Register in backend
# Edit api/app/services/registry.py

# 5. Create exhibit page
# Create web/app/algorithms/sorting/merge-sort/page.tsx
```

### Debug Backend Issues

```bash
# Start Flask with debug logs
PYTHONPATH=/home/jhuth/dev/dsa FLASK_APP=app.main uv run flask run --port 5000 --debug

# Test endpoint directly
curl -X POST http://localhost:5000/api/algorithms/bubble_sort/execute \
  -H "Content-Type: application/json" \
  -d '{"input": [5, 2, 8, 1, 9]}'
```

### Debug Frontend Issues

```bash
# Check Next.js logs
cd web && bun dev

# Open browser dev tools, check:
# - Network tab for API requests
# - Console for errors
# - React DevTools for component state
```

## Technology Choices - Why?

| Tool | Purpose | Why This Choice |
|------|---------|-----------------|
| **Bun** | JS runtime + package manager | 25x faster than npm, built-in TypeScript |
| **Next.js 14+** | React framework | App Router, Server Components, best DX |
| **Biome** | Linter + formatter | 35x faster than ESLint+Prettier, single tool |
| **uv** | Python package manager | 10-100x faster than pip, Rust-based |
| **Ruff** | Python linter + formatter | Extremely fast, replaces flake8+black+isort |
| **Flask** | Python web framework | Simple, proven, great for APIs |
| **TailwindCSS** | CSS framework | Utility-first, great mobile support |
| **shadcn/ui** | Component library | Copy-paste, accessible, customizable |
| **pytest** | Python testing | Powerful, parametrized tests, great fixtures |
| **Vitest** | JS testing | Fast, Vite-compatible, great DX |

## Git Workflow

The repository uses the following structure:

- **Main branch:** `main`
- **New directories:**
  - `web/` - Next.js frontend
  - `api/` - Flask backend
  - `algorithms/` - Reorganized Python DSA code
  - `docs/` - Documentation

When creating commits, focus on:
- Clear commit messages describing the change
- Grouping related changes together
- Running tests before committing

## Questions?

- Check `README.md` for setup and architecture
- Check `docs/todo.md` for feature roadmap
- Run `bun dev` and explore the running application
- Read algorithm implementations in `algorithms/` for examples
