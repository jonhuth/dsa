# DSA Visualizer Implementation Plan

## Overview

Transform the existing `~/dev/dsa` repository into an **interactive learning platform** for data structures and algorithms. Primary goal: help people learn or refresh on DSA concepts through visualization, rich documentation, and AI-assisted Q&A.

**Tech Stack:** TypeScript, Bun, Biome, Next.js 14+, TailwindCSS, shadcn/ui, Recharts, Flask (Python backend), Anthropic API (Sonnet), Railway

---

## Tooling & Testing (Modern, Fast, DX-Focused)

### Frontend Tooling
| Tool | Purpose | Why |
|------|---------|-----|
| **Bun** | Runtime + Package Manager | 25x faster than npm, built-in TypeScript |
| **Next.js 14+** | Framework | App Router, Server Components, best React DX |
| **Biome** | Linter + Formatter | 35x faster than ESLint+Prettier, single tool |
| **TailwindCSS** | Styling | Utility-first, great mobile support |
| **shadcn/ui** | Components | Copy-paste, accessible, customizable |
| **Zod** | Validation | Type-safe runtime validation |
| **Recharts** | Charts | React-native charting for complexity viz |

### Backend Tooling (Python)
| Tool | Purpose | Why |
|------|---------|-----|
| **uv** | Package Manager | 10-100x faster than pip, Rust-based |
| **Ruff** | Linter + Formatter | Extremely fast, replaces flake8+black+isort |
| **Flask** | Web Framework | Simple, proven, great for APIs |
| **Pydantic** | Validation | Type hints → runtime validation |

### Testing Strategy (Confidence in Implementations)

**Python Algorithm Tests (Critical):**
- **pytest** with parametrized test cases
- Each algorithm has dedicated test file: `algorithms/sorting/tests/test_bubble_sort.py`
- Test categories:
  - **Correctness:** Known inputs → expected outputs
  - **Edge cases:** Empty, single element, duplicates, sorted, reverse-sorted
  - **Large inputs:** Performance doesn't degrade unexpectedly
  - **Property-based tests (Hypothesis):** Random inputs, verify invariants
- Coverage target: 95%+ on algorithm logic

**Frontend Tests:**
- **Vitest** - Fast, Vite-compatible, great DX
- **React Testing Library** - Component tests
- **Playwright** - E2E tests for critical flows

**CI Pipeline:**
```yaml
# On every PR:
- bun lint              # Biome
- bun typecheck         # TypeScript
- bun test              # Vitest unit tests
- uv run ruff check     # Python lint
- uv run pytest         # Python tests
- bun test:e2e          # Playwright (on merge)
```

---

## Architecture

**Hybrid Flask + Next.js approach:**
- Flask backend executes Python algorithms with step-tracking instrumentation
- Next.js frontend handles visualization, playback controls, and UI
- Server-Sent Events (SSE) for real-time streaming of algorithm steps
- Pre-computed step caching for common inputs

---

## Project Structure (in-place transformation of ~/dev/dsa)

```
dsa/                                  # Existing repo, transformed
├── web/                              # Next.js frontend
│   ├── app/
│   │   ├── page.tsx                  # Landing/Index page
│   │   ├── algorithms/
│   │   │   ├── page.tsx              # All algorithms index
│   │   │   └── [category]/
│   │   │       ├── page.tsx          # Category index
│   │   │       └── [slug]/page.tsx   # Algorithm exhibit
│   │   ├── data-structures/
│   │   │   ├── page.tsx              # All DS index
│   │   │   └── [slug]/page.tsx       # DS exhibit
│   │   ├── problems/
│   │   │   ├── page.tsx              # Problems index
│   │   │   └── [slug]/page.tsx       # Problem exhibit
│   │   ├── mini-systems/
│   │   │   ├── page.tsx              # Mini-systems index
│   │   │   └── [slug]/page.tsx       # Mini-system exhibit
│   │   ├── suggestions/
│   │   │   ├── page.tsx              # Suggestions board + submit form
│   │   │   └── [id]/page.tsx         # Single suggestion detail
│   │   ├── api/
│   │   │   ├── chat/route.ts         # Anthropic API proxy
│   │   │   └── suggestions/route.ts  # Suggestions CRUD
│   │   └── settings/page.tsx         # API key config
│   ├── components/
│   │   ├── ui/                       # shadcn/ui
│   │   ├── visualizers/              # ArrayVisualizer, GraphVisualizer, etc.
│   │   ├── controls/                 # PlaybackControls, SpeedSlider, InputSelector
│   │   ├── layout/                   # Header, Sidebar, SearchDialog, Breadcrumb
│   │   ├── learning/                 # NEW: Learning-focused components
│   │   │   ├── ComplexityChart.tsx   # Visual Big-O comparison
│   │   │   ├── EdgeCases.tsx         # Edge cases display
│   │   │   ├── RelatedLinks.tsx      # Related algorithms sidebar
│   │   │   ├── Prerequisites.tsx     # Prerequisite concepts
│   │   │   ├── KeyInsights.tsx       # "Aha" moments
│   │   │   └── DifficultyBadge.tsx   # Easy/Medium/Hard
│   │   ├── chat/                     # NEW: AI tutor components
│   │   │   ├── ChatPanel.tsx         # Slide-out chat panel
│   │   │   ├── ChatMessage.tsx       # Message bubble
│   │   │   └── ApiKeyInput.tsx       # API key configuration
│   │   ├── index/                    # NEW: Index/navigation
│   │   │   ├── CategoryCard.tsx      # Category preview card
│   │   │   ├── AlgorithmCard.tsx     # Algorithm preview card
│   │   │   └── IndexGrid.tsx         # Grid layout for index pages
│   │   └── docs/                     # AlgorithmDocs, SourceCode, Pseudocode
│   ├── hooks/
│   │   ├── useAlgorithmRunner.ts
│   │   ├── useKeyboardShortcuts.ts
│   │   ├── useChat.ts                # NEW: AI chat hook
│   │   └── useApiKey.ts              # NEW: API key management
│   ├── lib/
│   │   ├── registry.ts               # Central content registry (algorithms, DS, problems, mini-systems)
│   │   ├── algorithms.ts             # Algorithm metadata
│   │   ├── data-structures.ts        # DS metadata
│   │   ├── problems.ts               # Problem metadata
│   │   ├── mini-systems.ts           # Mini-system metadata
│   │   ├── relationships.ts          # Cross-content relationships/links
│   │   ├── tags.ts                   # Tag definitions and utilities
│   │   ├── anthropic.ts              # Anthropic API client
│   │   └── supabase.ts               # Supabase client (for suggestions)
│   ├── content/                      # Rich content data (auto-discovered)
│   │   ├── algorithms/               # Per-algorithm content
│   │   ├── data-structures/          # Per-DS content
│   │   ├── problems/                 # Per-problem content
│   │   ├── mini-systems/             # Per-mini-system content
│   │   └── _templates/               # Templates for new content
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── biome.json
│
├── api/                              # Flask backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── routes/algorithms.py
│   │   └── services/step_tracker.py
│   ├── pyproject.toml                # uv + ruff config
│   └── Dockerfile
│
├── algorithms/                       # Reorganized Python DSA code (moved from root)
│   ├── base/step_tracker.py          # Base class with step emission
│   ├── sorting/
│   ├── searching/
│   ├── graphs/
│   ├── trees/
│   ├── heaps/
│   ├── dynamic_programming/
│   ├── linked_lists/
│   ├── hash_tables/
│   └── ...
│
├── docs/
│   ├── todo.md                       # Missing DS/algos
│   └── SETUP.md
├── docker-compose.yml
├── railway.json
├── CLAUDE.md                         # Existing, will update
└── README.md                         # Existing, will update
```

**Key Changes:**
- Top-level folders (Arrays/, Graphs/, etc.) → `algorithms/` with new structure
- New `web/` folder for Next.js frontend
- New `api/` folder for Flask backend
- Existing project-euler/ stays or moves to algorithms/problems/

---

## File Migration Map

Move existing top-level folders into `algorithms/`:

| Current Location | New Location |
|------------------|--------------|
| `Arrays/` | `algorithms/arrays/` |
| `Sorting/` | `algorithms/sorting/` |
| `BinarySearch/` | `algorithms/searching/` |
| `Graphs/` | `algorithms/graphs/` |
| `Trees/` | `algorithms/trees/` |
| `Heaps/` | `algorithms/heaps/` |
| `DynamicProgramming/` | `algorithms/dynamic_programming/` |
| `LinkedLists/` | `algorithms/linked_lists/` |
| `HashTables/` | `algorithms/hash_tables/` |
| `Stack/`, `Queue/` | `algorithms/stacks_queues/` |
| `UnionFind/` | `algorithms/union_find/` |
| `Strings/` | `algorithms/strings/` |
| `BitManipulation/` | `algorithms/bit_manipulation/` |
| `Recursion/` | `algorithms/recursion/` |
| `Math/` | `algorithms/math/` |
| `SlidingWindow/` | `algorithms/sliding_window/` |
| `RangeQueries/` | `algorithms/range_queries/` |
| `project-euler/` | `algorithms/problems/math/` (mixed with other math problems) |

## Reorganized Python DSA Structure

```
algorithms/
├── _templates/               # Templates for new content (copy to start)
│   ├── algorithm_template.py
│   ├── data_structure_template.py
│   ├── problem_template.py
│   └── test_template.py
├── base/
│   ├── __init__.py
│   ├── step_tracker.py       # Base class all algorithms inherit
│   ├── visualizer_types.py   # Enum of visualizer types
│   └── types.py
├── sorting/
│   ├── __init__.py
│   ├── _base.py              # SortingAlgorithm base
│   ├── bubble_sort.py
│   ├── insertion_sort.py
│   ├── selection_sort.py
│   ├── merge_sort.py
│   ├── quick_sort.py
│   └── utils/partition.py
├── graphs/
│   ├── structures/           # Graph, Digraph, WeightedGraph
│   ├── traversal/            # BFS, DFS
│   ├── shortest_path/        # Dijkstra
│   └── problems/             # num_islands, cycle_detection
├── trees/
│   ├── structures/           # BinaryTree, BST
│   ├── traversal/            # in/pre/post/level order
│   ├── operations/           # insert, delete, search
│   └── tries/
├── heaps/
├── dynamic_programming/
├── linked_lists/
├── hash_tables/
├── stacks_queues/
├── union_find/
├── matrices/
├── strings/
├── problems/                 # All problems (LeetCode, Project Euler, etc.)
│   ├── arrays/               # Array problems
│   ├── trees/                # Tree problems
│   ├── graphs/               # Graph problems
│   ├── math/                 # Math/number theory problems (incl. Project Euler)
│   └── strings/              # String problems
└── mini_systems/             # Combinations of DS + algorithms
    ├── lru_cache.py          # Hash Table + Doubly Linked List
    ├── autocomplete.py       # Trie + BFS
    └── shortest_path.py      # Graph + Priority Queue (Dijkstra)
```

---

## Algorithm Metadata Schema (Rich Content)

Each algorithm has comprehensive metadata for learning:

```typescript
interface AlgorithmMetadata {
  id: string;                    // 'bubble_sort'
  name: string;                  // 'Bubble Sort'
  category: string;              // 'sorting'
  difficulty: 'easy' | 'medium' | 'hard';

  // Tags for search and linking
  tags: string[];                // ['comparison-based', 'stable', 'in-place', 'O(n²)', 'foundational']

  // Complexity analysis
  complexity: {
    time: { best: string; average: string; worst: string; };
    space: string;
    explanation: string;         // Why these complexities?
  };

  // Learning content
  description: string;           // What it does
  howItWorks: string;            // Step-by-step explanation
  keyInsights: string[];         // "Aha" moments
  edgeCases: EdgeCase[];         // Pitfalls and boundary conditions
  whenToUse: string[];           // Real-world applications
  interviewTips: string[];       // Interview-specific advice

  // Relationships
  prerequisites: string[];       // Algorithm IDs to learn first
  relatedAlgorithms: string[];   // Similar or contrasting
  usesDataStructures: string[];  // DS this algorithm relies on

  // Visualization config
  visualizationType: string;
  defaultInputs: any[];
  sampleInputs: SampleInput[];
}

interface EdgeCase {
  name: string;                  // "Already sorted array"
  description: string;           // "Best case - O(n) with optimization"
  input: any;                    // Example input demonstrating this case
}
```

---

## Step Tracking Instrumentation

Python algorithms will be instrumented to yield visualization steps:

```python
class BubbleSort(StepTracker):
    def sort(self, arr: list) -> Generator:
        for i in range(n - 1):
            for j in range(n - i - 1):
                yield self.emit_step(
                    operation="compare",
                    description=f"Comparing {arr[j]} with {arr[j+1]}",
                    state={"type": "array", "values": arr.copy()},
                    highlights=[{"indices": [j, j+1], "color": "comparing"}]
                )
                if arr[j] > arr[j + 1]:
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]
                    yield self.emit_step(operation="swap", ...)
```

---

## Visualizer Components

| Type | Used For |
|------|----------|
| ArrayVisualizer | Sorting, searching, arrays |
| GraphVisualizer | BFS, DFS, Dijkstra, cycle detection |
| TreeVisualizer | BST operations, traversals |
| HeapVisualizer | Min/max heap (tree + array dual view) |
| GridVisualizer | Matrix algorithms, Game of Life, DP tables |
| LinkedListVisualizer | Singly/doubly linked list operations |
| DPTableVisualizer | Knapsack, LCS, Levenshtein |
| StackQueueVisualizer | Stack, queue, circular queue |
| TrieVisualizer | Prefix/suffix trie |
| HashTableVisualizer | Separate chaining, linear probing |

---

## Two Visualization Modes

1. **Interactive Mode**
   - User selects from predefined inputs
   - Step forward/back with buttons or keyboard
   - Pause at any step, inspect state

2. **Run Mode**
   - Auto-play with adjustable speed (0.5x - 3x)
   - Watch the algorithm lifecycle unfold
   - Metrics display: comparisons, swaps, operations

---

## Learning Features (Core Focus)

### Rich Exhibit Information
Each algorithm/DS page includes:
- **Complexity Analysis:** Time (best/avg/worst), Space with visual Big-O comparison chart
- **Edge Cases:** Common pitfalls, boundary conditions, what breaks the algorithm
- **When to Use:** Real-world use cases, interview tips, comparison with alternatives
- **Prerequisites:** What concepts you should understand first (linked)
- **Key Insights:** The "aha" moments - what makes this algorithm clever

### Related Content Linking
- **"Related Algorithms"** sidebar: Links to similar or contrasting algorithms
  - e.g., Quick Sort → Merge Sort, Heap Sort, Quick Select
  - e.g., BFS → DFS, Dijkstra, A*
- **"Uses This Data Structure"** links: Algorithm ↔ DS connections
  - e.g., Dijkstra → Priority Queue/Heap
  - e.g., DFS → Stack (implicit/explicit)
- **"See Also"** section: Prerequisite and follow-up concepts
- **Bidirectional linking:** If A links to B, B shows "Referenced by A"

### AI Tutor (Anthropic Sonnet)
- **Chat panel** on each exhibit page
- Ask questions about the current algorithm/DS
- Context-aware: AI knows which algorithm you're viewing, current step, and has algorithm metadata
- Example prompts:
  - "Why is quicksort O(n²) in the worst case?"
  - "When would I use BFS instead of DFS?"
  - "Explain step 5 of this visualization"
- **API key configuration:** User provides their own Anthropic API key (stored in localStorage)

### Index & Navigation
- **Landing page:** Visual index organized by category with preview cards
- **Category pages:** Grid of all algorithms/DS in that category
- **Breadcrumb navigation:** Home > Sorting > Quick Sort
- **Progress tracking (optional):** Mark algorithms as "learned" or "to review"
- **Difficulty indicators:** Easy/Medium/Hard badges
- **Filter/sort options:** By difficulty, by complexity, alphabetical

---

## QoL Features

- **Global Search (Cmd+K):** Fuzzy search by name, category, tags, complexity
- **Keyboard Shortcuts:** Space (play/pause), Arrow keys (step), +/- (speed), ? (help)
- **Obsidian-inspired Theme:** Dark mode with Obsidian color scheme
- **Mobile-First Design:** Touch-friendly controls, responsive layouts, works on all devices
- **Share Links:** Deep links to specific algorithms with optional input state

---

## Tagging System

Tags provide another dimension for search, filtering, and discovering related content:

**Tag Categories:**
- **Technique:** `divide-and-conquer`, `greedy`, `two-pointers`, `sliding-window`, `backtracking`, `memoization`, `tabulation`
- **Pattern:** `in-place`, `stable`, `comparison-based`, `non-comparison`, `recursive`, `iterative`
- **Use Case:** `interview-favorite`, `real-world`, `foundational`, `optimization`
- **Complexity Class:** `O(1)`, `O(log n)`, `O(n)`, `O(n log n)`, `O(n²)`, `O(2^n)`

**Tag Benefits:**
- Search: "Show me all divide-and-conquer algorithms"
- Related: Algorithms sharing tags are automatically linked
- Learning paths: "Start with foundational, then interview-favorite"

---

## Mobile-First Design

- **Touch Controls:** Large tap targets for play/pause/step, swipe to step
- **Responsive Visualizers:** Visualizations scale and adapt to screen size
- **Collapsible Panels:** Documentation, code, chat collapse on mobile
- **Bottom Navigation:** Key actions accessible with thumb
- **Portrait Mode:** Visualization stacked above controls (not side-by-side)
- **Offline Support:** Service worker caches algorithm metadata and UI

---

## Extensibility Architecture

The platform is designed for easy addition of new content types:

### Content Types Supported
1. **Algorithms** - Step-by-step procedures (sorting, searching, traversal)
2. **Data Structures** - Interactive DS operations (insert, delete, search)
3. **Problems** - LeetCode-style problems with solution visualizations
4. **Mini-Systems** - Combinations of DS + algorithms working together
   - e.g., "LRU Cache" = Hash Table + Doubly Linked List
   - e.g., "Dijkstra's Algorithm" = Graph + Priority Queue
   - e.g., "Autocomplete" = Trie + BFS

### Registry-Based Architecture

All content is registered in a central registry, making additions trivial:

```typescript
// web/lib/registry.ts
export const registry = {
  algorithms: Map<string, AlgorithmMetadata>,
  dataStructures: Map<string, DataStructureMetadata>,
  problems: Map<string, ProblemMetadata>,
  miniSystems: Map<string, MiniSystemMetadata>,
}
```

### Adding New Content (Step-by-Step)

**To add a new algorithm:**
1. Create Python implementation: `algorithms/[category]/[name].py`
2. Inherit from `StepTracker`, add `emit_step()` calls
3. Create test file: `algorithms/[category]/tests/test_[name].py`
4. Add metadata: `web/content/algorithms/[name].json`
5. Register in `web/lib/algorithms.ts`
6. Done! Auto-discovered by routing and search

**To add a new data structure:**
1. Create Python implementation: `algorithms/data_structures/[name].py`
2. Implement operations (insert, delete, search, etc.) with step tracking
3. Create/reuse appropriate visualizer component
4. Add metadata and register

**To add a new problem:**
1. Create solution: `algorithms/problems/[name].py`
2. Define problem statement, constraints, examples in metadata
3. Link to algorithms/DS used in solution
4. Register

**To add a mini-system:**
1. Identify component algorithms and data structures
2. Create orchestration code showing how they work together
3. Define composite visualization (multiple visualizers in sync)
4. Add metadata explaining the system architecture

### File Templates

```
algorithms/
├── _templates/
│   ├── algorithm_template.py      # Copy for new algorithms
│   ├── data_structure_template.py # Copy for new DS
│   ├── problem_template.py        # Copy for new problems
│   └── test_template.py           # Copy for new tests

web/content/
├── _templates/
│   ├── algorithm.json             # Metadata template
│   ├── data_structure.json
│   ├── problem.json
│   └── mini_system.json
```

### Visualizer Reuse

Visualizers are designed for reuse across content types:

| Visualizer | Used By |
|------------|---------|
| ArrayVisualizer | Sorting, Searching, Dynamic Arrays, Problems |
| GraphVisualizer | Graph Algorithms, Trees (alternative view), Problems |
| TreeVisualizer | BST, Heaps, Tries, Tree Problems |
| GridVisualizer | DP, Matrix Problems, Game of Life |
| CompositeVisualizer | Mini-Systems (multiple visualizers synced) |

### Auto-Discovery

- New content in `web/content/` is auto-discovered
- Routes are dynamically generated from registry
- Search index is auto-updated
- Related content links are auto-computed from tags and relationships

---

## Suggestions Page

Allow users to submit ideas for new content:

### Features
- **Submission Form:**
  - Content type: Algorithm / Data Structure / Problem / Mini-System
  - Name and description
  - Why it would be useful for learning
  - Optional: Links to resources, pseudocode, implementation ideas
  - Optional: Email for follow-up

- **Public Suggestions Board:**
  - View all submitted suggestions
  - Upvote suggestions you want to see
  - Status indicators: Submitted → Under Review → In Progress → Complete
  - Filter by type, status, popularity

- **Implementation:**
  - Store in Supabase (simple table)
  - No auth required to submit (spam protection via rate limiting)
  - Admin view for reviewing/updating status

### Routes
```
/suggestions          # View all suggestions, submit new
/suggestions/[id]     # View single suggestion details
```

### Schema
```typescript
interface Suggestion {
  id: string;
  type: 'algorithm' | 'data_structure' | 'problem' | 'mini_system';
  name: string;
  description: string;
  rationale: string;           // Why useful for learning
  resources?: string[];        // Links to resources
  email?: string;              // Optional contact
  upvotes: number;
  status: 'submitted' | 'under_review' | 'in_progress' | 'complete' | 'declined';
  createdAt: Date;
  updatedAt: Date;
}
```

---

## API Endpoints

**Flask Backend (Python execution):**
```
POST /api/algorithms/{id}/execute     # Stream steps via SSE
POST /api/algorithms/{id}/steps/all   # Get all steps (small inputs)
GET  /api/algorithms                  # List all algorithms
GET  /api/algorithms/{id}             # Get metadata + relationships
GET  /api/algorithms/{id}/source      # Get Python source
```

**Next.js API Routes (AI chat):**
```
POST /api/chat                        # Proxy to Anthropic API (Sonnet)
  Request: {
    messages: [...],
    context: { algorithmId, currentStep? }
  }
  Response: Streamed AI response
```

**Note:** User's Anthropic API key stored in localStorage, passed in request header. Next.js route proxies to Anthropic to avoid CORS.

---

## Implementation Phases

### Phase 1: Foundation (scaffold + bubble sort end-to-end)
- Project setup (Next.js, Flask, folder structure)
- Migrate Python files to `algorithms/` structure
- StepTracker base class
- Instrument bubble sort
- ArrayVisualizer component
- PlaybackControls (play/pause/step)
- Basic landing page with one working algorithm

### Phase 2: Index & Navigation
- Landing page with category cards
- Category index pages (e.g., /algorithms/sorting)
- Algorithm metadata registry (`lib/algorithms.ts`)
- Relationships data (`lib/relationships.ts`)
- Breadcrumb navigation
- Global search (Cmd+K)

### Phase 3: Core Algorithms + Learning Content
- All sorting algorithms instrumented
- Binary search
- Graph BFS/DFS + GraphVisualizer
- **Add rich content for each:** complexity, edge cases, insights
- RelatedLinks sidebar component
- Prerequisites component
- ComplexityChart visualization

### Phase 4: AI Tutor Integration
- Anthropic API proxy route (Sonnet)
- ChatPanel component (slide-out)
- API key configuration (settings page + localStorage)
- Context-aware prompts (knows current algorithm, step, metadata)

### Phase 5: Data Structures
- BST operations + TreeVisualizer
- Heap operations + HeapVisualizer
- Linked list + LinkedListVisualizer
- Stack/Queue visualizers
- Hash tables + HashTableVisualizer

### Phase 6: Advanced Algorithms
- DP algorithms + DPTableVisualizer
- Dijkstra + weighted GraphVisualizer
- Tries + TrieVisualizer
- Remaining algorithm instrumentation

### Phase 7: Problems & Mini-Systems
- Problem exhibit pages
- Mini-system composite visualizations
- CompositeVisualizer component (synced multi-visualizers)
- Example mini-systems: LRU Cache, Autocomplete, Dijkstra

### Phase 8: Suggestions & Community
- Supabase setup for suggestions storage
- Suggestions submission form
- Public suggestions board with upvoting
- Admin status management

### Phase 9: Polish & Launch
- Obsidian-inspired dark theme
- Responsive design (mobile/tablet)
- Keyboard shortcuts help modal
- Content templates for contributors
- Testing (Vitest + Playwright)
- Deploy to Railway
- Link from ~/dev/personal site
- Update CLAUDE.md

---

## Files to Create

1. **todo.md** - Missing algorithms and data structures:
   - Bellman-Ford, A*, MST (Prim's, Kruskal's)
   - AVL tree, Red-Black tree, Segment tree
   - KMP string matching
   - Counting/Radix/Bucket sort

2. **Setup instructions** in README.md

---

## Verification

**Automated Tests (Run First):**
```bash
# Python algorithm tests (should be 95%+ coverage)
cd api && uv run pytest --cov=algorithms --cov-report=term-missing

# Frontend unit tests
cd web && bun test

# Lint and typecheck
cd web && bun lint && bun typecheck
cd api && uv run ruff check
```

**Manual Testing:**
1. Run project: `bun dev` (starts both frontend and backend)
2. Navigate to http://localhost:3000
4. **Index test:** Landing page shows category cards, click through to algorithms
5. **Visualization test:** Select bubble sort, click "Run" - watch animation
6. **Controls test:** Use step controls to move forward/back
7. **Keyboard test:** Test shortcuts (Space, Arrow keys, Cmd+K for search)
8. **Tag test:** Search by tag (e.g., "divide-and-conquer"), verify results
9. **Learning content test:** Verify complexity chart, edge cases, related links display
10. **AI chat test:** Go to Settings, add Anthropic API key, open chat panel, ask a question
11. **Related links test:** Click a related algorithm link, verify bidirectional linking
12. **Mobile test:** Open on phone or use DevTools mobile emulation, verify touch controls work
13. **Mini-system test:** Navigate to mini-systems, view LRU Cache, verify composite visualization
14. **Suggestions test:** Submit a suggestion, verify it appears on board, test upvoting
15. **Extensibility test:** Copy template, add new algorithm, verify auto-discovery works

**E2E Tests (On Merge):**
```bash
cd web && bun test:e2e
```

---

## Critical Files to Create

**Frontend - Core (web/):**
- `web/app/page.tsx` - Landing page with index grid
- `web/app/algorithms/page.tsx` - Algorithms index
- `web/app/algorithms/[category]/page.tsx` - Category index
- `web/app/algorithms/[category]/[slug]/page.tsx` - Algorithm exhibit
- `web/app/settings/page.tsx` - API key configuration
- `web/app/api/chat/route.ts` - Anthropic API proxy

**Frontend - Components:**
- `web/components/visualizers/ArrayVisualizer.tsx` - First visualizer
- `web/components/controls/PlaybackControls.tsx` - Play/pause/step
- `web/components/layout/SearchDialog.tsx` - Global search (Cmd+K)
- `web/components/layout/Breadcrumb.tsx` - Navigation breadcrumb
- `web/components/index/CategoryCard.tsx` - Category preview card
- `web/components/index/AlgorithmCard.tsx` - Algorithm preview card

**Frontend - Learning Components:**
- `web/components/learning/ComplexityChart.tsx` - Big-O visualization
- `web/components/learning/RelatedLinks.tsx` - Related algorithms sidebar
- `web/components/learning/EdgeCases.tsx` - Edge cases display
- `web/components/learning/KeyInsights.tsx` - "Aha" moments

**Frontend - AI Chat:**
- `web/components/chat/ChatPanel.tsx` - Slide-out chat panel
- `web/components/chat/ApiKeyInput.tsx` - API key configuration
- `web/hooks/useChat.ts` - AI chat hook
- `web/lib/anthropic.ts` - Anthropic API client

**Frontend - Data & Registry:**
- `web/lib/registry.ts` - Central content registry
- `web/lib/algorithms.ts` - Algorithm metadata
- `web/lib/data-structures.ts` - DS metadata
- `web/lib/problems.ts` - Problem metadata
- `web/lib/mini-systems.ts` - Mini-system metadata
- `web/lib/relationships.ts` - Cross-content relationships
- `web/lib/tags.ts` - Tag definitions
- `web/lib/supabase.ts` - Supabase client
- `web/content/algorithms/*.json` - Rich content per algorithm
- `web/content/_templates/*.json` - Templates for new content

**Frontend - Suggestions:**
- `web/app/suggestions/page.tsx` - Suggestions board + form
- `web/app/api/suggestions/route.ts` - Suggestions API

**Frontend - Mini-Systems:**
- `web/app/mini-systems/page.tsx` - Mini-systems index
- `web/app/mini-systems/[slug]/page.tsx` - Mini-system exhibit
- `web/components/visualizers/CompositeVisualizer.tsx` - Synced multi-visualizer

**Backend (api/):**
- `api/app/main.py` - Flask app entry
- `api/app/routes/algorithms.py` - Algorithm execution endpoints
- `api/app/services/step_tracker.py` - Step tracking service

**Python DSA (algorithms/):**
- `algorithms/base/step_tracker.py` - Base class with step emission
- `algorithms/base/types.py` - Type definitions
- `algorithms/sorting/bubble_sort.py` - First instrumented algorithm
- `algorithms/sorting/tests/test_bubble_sort.py` - Comprehensive tests
- `algorithms/conftest.py` - Shared pytest fixtures

**Tests:**
- `web/vitest.config.ts` - Vitest configuration
- `web/__tests__/` - Frontend unit tests
- `web/e2e/` - Playwright E2E tests
- `algorithms/**/tests/` - Per-algorithm test suites

**Docs:**
- `docs/todo.md` - Missing algorithms/DS list
- `docs/SETUP.md` - Setup instructions

**Config:**
- `docker-compose.yml` - Local development
- `railway.json` - Railway deployment config
- `.env.example` - Environment variables template

---

## Setup Instructions to Provide

```bash
# Prerequisites
# - Bun 1.0+ (handles both package management and runtime)
# - Python 3.11+ with uv

# 1. Install all dependencies
bun setup        # Runs: bun install && cd api && uv sync

# 2. Run everything with one command
bun dev          # Starts both frontend (localhost:3000) and backend (localhost:5000)

# 3. Open http://localhost:3000

# 4. (Optional) Configure AI tutor
# Go to Settings, add your Anthropic API key
```

### Single Command Setup (package.json scripts)

```json
{
  "scripts": {
    "setup": "bun install && cd api && uv sync",
    "dev": "concurrently \"bun run dev:web\" \"bun run dev:api\"",
    "dev:web": "cd web && bun dev",
    "dev:api": "cd api && uv run flask run --port 5000",
    "build": "cd web && bun run build",
    "test": "bun run test:web && bun run test:api",
    "test:web": "cd web && bun test",
    "test:api": "cd api && uv run pytest",
    "lint": "cd web && bun lint && cd ../api && uv run ruff check"
  }
}
```

Uses `concurrently` to run both servers in one terminal with colored output.
