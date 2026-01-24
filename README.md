# DSA Visualizer

**Interactive learning platform for data structures and algorithms**

Transform your understanding of DSA through interactive visualizations, comprehensive learning resources, and AI-powered tutoring. This project combines a Python backend for algorithm execution with a modern Next.js frontend for rich, step-by-step visualizations.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11+-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue.svg)

## Features

- 🎨 **Interactive Visualizations** - Step through algorithms with beautiful, animated visualizations
- 📚 **Rich Learning Content** - Complexity analysis, edge cases, key insights, and when to use each algorithm
- 🤖 **AI Tutor** - Context-aware chat powered by Anthropic Sonnet to answer questions as you learn
- 🔗 **Smart Linking** - Related algorithms, prerequisites, and "uses this data structure" connections
- 📱 **Mobile-First** - Responsive design with touch controls for learning on any device
- 🌙 **Obsidian-Inspired Theme** - Beautiful dark theme optimized for long study sessions
- ⚡ **Modern Stack** - Bun, Next.js 14+, Flask, TailwindCSS, shadcn/ui
- 🧪 **Comprehensive Testing** - 95%+ coverage on algorithms with pytest + Hypothesis

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) 1.0+ (handles package management and runtime)
- Python 3.11+ with [uv](https://github.com/astral-sh/uv) (fast Python package manager)

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd dsa

# 2. Install all dependencies
bun setup

# 3. Run everything with one command
bun dev

# 4. Open http://localhost:3000
```

That's it! The command starts both the Next.js frontend (port 3000) and Flask backend (port 5000).

### Development Commands

```bash
# Start development servers
bun dev              # Run both frontend and backend
bun dev:web          # Run only frontend
bun dev:api          # Run only backend

# Testing
bun test             # Run all tests (frontend + backend)
bun test:web         # Run frontend tests (Vitest)
bun test:api         # Run backend tests (pytest)
bun test:e2e         # Run E2E tests (Playwright)

# Linting and formatting
bun lint             # Lint everything
bun format           # Format everything
bun typecheck        # TypeScript type checking

# Build
bun build            # Build frontend for production
```

## Project Structure

```
dsa/
├── web/                              # Next.js frontend
│   ├── app/                          # App router pages
│   │   ├── page.tsx                  # Landing page
│   │   ├── algorithms/               # Algorithm exhibits
│   │   │   ├── sorting/
│   │   │   │   └── bubble-sort/
│   │   │   │       └── page.tsx
│   │   └── api/                      # Next.js API routes
│   ├── components/                   # React components
│   │   ├── visualizers/              # Visualization components
│   │   ├── controls/                 # Playback controls
│   │   ├── learning/                 # Learning-focused components
│   │   └── chat/                     # AI chat components
│   ├── lib/                          # Utilities and registry
│   └── content/                      # Algorithm metadata
│
├── api/                              # Flask backend
│   ├── app/
│   │   ├── main.py                   # Flask entry point
│   │   ├── routes/                   # API endpoints
│   │   └── services/                 # Business logic
│   └── pyproject.toml                # Python dependencies
│
├── algorithms/                       # Python DSA implementations
│   ├── base/
│   │   └── step_tracker.py           # Base class for visualizations
│   ├── sorting/
│   │   ├── bubble_sort.py
│   │   └── tests/
│   ├── graphs/
│   ├── trees/
│   └── _templates/                   # Templates for new algorithms
│
├── docs/
│   ├── todo.md                       # Feature roadmap
│   └── SETUP.md                      # Detailed setup guide
│
├── package.json                      # Root package.json (scripts)
└── docker-compose.yml                # Docker setup
```

## How It Works

### Algorithm Execution Flow

1. **User Input** → User selects an algorithm and provides input (e.g., array to sort)
2. **Frontend Request** → Next.js sends input to Flask backend
3. **Step Generation** → Python algorithm inherits from `StepTracker` and yields visualization steps
4. **Step Delivery** → Backend returns all steps as JSON
5. **Visualization** → Frontend renders steps with playback controls

### Example: Bubble Sort

```python
# algorithms/sorting/bubble_sort.py
from algorithms.base import StepTracker, VisualizerType

class BubbleSort(StepTracker):
    visualizer_type = VisualizerType.ARRAY

    def sort(self, arr: list[int]):
        self.reset()
        for i in range(len(arr) - 1):
            for j in range(len(arr) - i - 1):
                # Emit comparison step
                yield self.emit_step(
                    operation="compare",
                    description=f"Comparing {arr[j]} and {arr[j+1]}",
                    state={"type": "array", "values": arr.copy()},
                    highlights=[{"indices": [j, j+1], "color": "comparing"}]
                )
                if arr[j] > arr[j + 1]:
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]
                    # Emit swap step
                    yield self.emit_step(...)
```

Each `emit_step()` call creates a visualization frame that the frontend can render and animate.

## Tech Stack

### Frontend
- **Runtime:** Bun (25x faster than npm)
- **Framework:** Next.js 14+ (App Router, Server Components)
- **Styling:** TailwindCSS + shadcn/ui
- **Linting:** Biome (35x faster than ESLint+Prettier)
- **Testing:** Vitest + Playwright
- **Charts:** Recharts (for complexity visualizations)
- **AI:** Anthropic SDK (Claude Sonnet)

### Backend
- **Language:** Python 3.11+
- **Framework:** Flask + Flask-CORS
- **Package Manager:** uv (10-100x faster than pip)
- **Linting:** Ruff (extremely fast, replaces flake8+black+isort)
- **Testing:** pytest + pytest-cov + Hypothesis

## Adding New Algorithms

Adding a new algorithm is straightforward:

1. **Copy the template:**
   ```bash
   cp algorithms/_templates/algorithm_template.py algorithms/sorting/my_sort.py
   ```

2. **Implement the algorithm:**
   - Inherit from `StepTracker`
   - Use `emit_step()` to yield visualization steps
   - Add docstrings with complexity analysis

3. **Add tests:**
   ```bash
   cp algorithms/_templates/test_template.py algorithms/sorting/tests/test_my_sort.py
   ```

4. **Register in the backend:**
   Edit `api/app/services/registry.py` to add your algorithm

5. **Add metadata:**
   Create `web/content/algorithms/my-sort.json` with learning content

6. **Create exhibit page:**
   Create `web/app/algorithms/sorting/my-sort/page.tsx`

See `docs/todo.md` for algorithms we'd love to add!

## API Endpoints

### Backend (Flask)

```
GET  /api/algorithms              # List all algorithms
GET  /api/algorithms/{id}          # Get algorithm metadata
POST /api/algorithms/{id}/execute  # Execute and get all steps
POST /api/algorithms/{id}/execute/stream  # Stream steps via SSE
GET  /api/algorithms/{id}/source   # Get Python source code
```

### Example Request

```bash
curl -X POST http://localhost:5000/api/algorithms/bubble_sort/execute \
  -H "Content-Type: application/json" \
  -d '{"input": [5, 2, 8, 1, 9]}'
```

## Testing

### Python Algorithm Tests

```bash
# Run all algorithm tests
cd api && uv run pytest

# Run with coverage
cd api && uv run pytest --cov=algorithms --cov-report=term-missing

# Run specific test file
cd api && uv run pytest ../algorithms/sorting/tests/test_bubble_sort.py -v
```

### Frontend Tests

```bash
cd web && bun test           # Unit tests
cd web && bun test:e2e       # E2E tests
```

## Contributing

We welcome contributions! See `docs/todo.md` for feature ideas and missing algorithms.

### Contribution Guidelines

1. **Algorithm implementations** must include:
   - Step-by-step visualization via `StepTracker`
   - Comprehensive test suite (95%+ coverage)
   - Docstrings with complexity analysis
   - Learning metadata (edge cases, key insights)

2. **Code quality:**
   - Run `bun lint` before committing
   - Run `bun test` to ensure tests pass
   - Follow existing patterns and conventions

3. **Documentation:**
   - Update `docs/todo.md` when adding features
   - Add examples for complex features

## Deployment

### Local (Docker Compose)

```bash
docker-compose up
```

### Production (Railway)

1. Connect your GitHub repository to Railway
2. Railway will auto-detect the Next.js app
3. Set environment variables (API keys, etc.)
4. Deploy!

## Roadmap

See `docs/todo.md` for the full roadmap, including:

- 🔥 **Live Code Execution Viewer** - See highlighted source code as visualization runs
- 📊 More algorithms (Quick Sort, Merge Sort, BFS, DFS, Dijkstra, etc.)
- 🎓 Learning paths and progress tracking
- 🌍 Community suggestions and voting
- 📱 Progressive Web App (PWA) support

## Resources

This project was inspired by:

- **Books:** Cracking the Coding Interview, Grokking Algorithms, Algorithm Design Manual
- **Sites:** LeetCode, HackerRank, Visualgo
- **Community:** [Haseeb Qureshi's blog](https://haseebq.com/), Software Engineering Daily

## License

MIT License - see LICENSE file for details

## Acknowledgments

Much credit goes to Haseeb Qureshi and [his blog post](https://haseebq.com/how-to-break-into-tech-job-hunting-and-interviews/)
on breaking into tech, which was a major inspiration for creating comprehensive learning resources.

---

**Built with ❤️ for learning**

Questions? Open an issue or start a discussion!
