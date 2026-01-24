# DSA Visualizer TODO

## High Priority Features

### ✅ Live Code Execution Viewer (COMPLETED)
**Impact:** 🔥 High - Major learning enhancement
**Effort:** ⚡ Medium (2-3 hours)

Add a side-by-side code viewer that highlights the currently executing line as the visualization progresses.

**Implementation:**
- [x] Add `source_line_number` to Step metadata in Python (use `inspect.currentframe()`)
- [x] Create `<CodeViewer>` component with syntax highlighting (react-syntax-highlighter)
- [x] Create split-pane layout option for exhibits
- [x] Highlight current line in code as steps progress
- [x] Add "Show Code" toggle to exhibit pages
- [x] Support collapsible code pane for mobile

**Benefits:**
- See exactly what code is running at each step
- Understand the relationship between code and visualization
- Learn Python implementation patterns
- Great for interview prep (see the actual algorithm code)

**Design Notes:**
```tsx
// Simple approach
<div className="grid grid-cols-2">
  <CodeViewer
    source={source}
    language="python"
    highlightLines={[currentStep.metadata.source_line]}
  />
  <ArrayVisualizer ... />
</div>
```

---

## Missing Algorithms & Data Structures

### Sorting Algorithms (Priority: High)
- [ ] Quick Sort
- [ ] Merge Sort
- [ ] Heap Sort
- [ ] Insertion Sort
- [ ] Selection Sort
- [ ] Counting Sort
- [ ] Radix Sort
- [ ] Bucket Sort

### Search Algorithms (Priority: High)
- [ ] Binary Search (iterative and recursive)
- [ ] Linear Search
- [ ] Jump Search
- [ ] Interpolation Search

### Graph Algorithms (Priority: High)
- [ ] BFS (Breadth-First Search)
- [ ] DFS (Depth-First Search)
- [ ] Dijkstra's Algorithm
- [ ] Bellman-Ford
- [ ] A* Search
- [ ] Kruskal's MST
- [ ] Prim's MST
- [ ] Topological Sort
- [ ] Cycle Detection

### Tree Algorithms (Priority: Medium)
- [ ] Binary Search Tree operations (insert, delete, search)
- [ ] AVL Tree
- [ ] Red-Black Tree
- [ ] Tree Traversals (in-order, pre-order, post-order, level-order)
- [ ] Lowest Common Ancestor
- [ ] Height/Depth calculations

### Dynamic Programming (Priority: Medium)
- [ ] Fibonacci (memoization & tabulation)
- [ ] Knapsack Problem
- [ ] Longest Common Subsequence
- [ ] Edit Distance (Levenshtein)
- [ ] Coin Change
- [ ] Matrix Chain Multiplication

### Data Structures (Priority: High)
- [ ] Stack (array and linked list implementations)
- [ ] Queue (array and linked list implementations)
- [ ] Circular Queue
- [ ] Priority Queue
- [ ] Hash Table (separate chaining & linear probing)
- [ ] Heap (min and max)
- [ ] Trie
- [ ] Segment Tree
- [ ] Fenwick Tree (Binary Indexed Tree)

### String Algorithms (Priority: Low)
- [ ] KMP Pattern Matching
- [ ] Rabin-Karp
- [ ] Boyer-Moore
- [ ] Longest Palindromic Substring
- [ ] String Matching with Tries

---

## UI/UX Enhancements

### Playback Features
- [ ] Auto-play with speed control (0.5x - 3x)
- [ ] Keyboard shortcuts (Space, Arrow keys, +/-)
- [ ] Step scrubber/timeline
- [ ] Bookmark important steps

### Learning Features
- [ ] Complexity comparison charts (Recharts)
- [ ] Edge cases display
- [ ] Related algorithms sidebar
- [ ] Prerequisites tree
- [ ] "Aha moments" highlights
- [ ] Difficulty badges (Easy/Medium/Hard)

### Navigation
- [ ] Global search (Cmd+K)
- [ ] Breadcrumb navigation
- [ ] Progress tracking (mark as learned)
- [ ] Tag-based filtering
- [ ] Category cards on landing page

---

## AI Integration

- [ ] Anthropic Sonnet chat integration
- [ ] Context-aware prompts (knows current algorithm + step)
- [ ] API key configuration in settings
- [ ] Chat panel (slide-out)
- [ ] Suggested questions per algorithm

---

## Mini-Systems

Complex systems combining multiple DS + algorithms:

- [ ] LRU Cache (Hash Table + Doubly Linked List)
- [ ] Autocomplete (Trie + BFS)
- [ ] Task Scheduler (Priority Queue + Graph)
- [ ] File System (Tree + Hash Table)

---

## Testing & Quality

- [ ] Vitest unit tests for components
- [ ] Playwright E2E tests
- [ ] 95%+ coverage on Python algorithms
- [ ] Property-based testing (Hypothesis)
- [ ] CI/CD pipeline

---

## Infrastructure

- [ ] Docker Compose setup
- [ ] Railway deployment
- [ ] Supabase for suggestions
- [ ] Content templates for contributors
- [ ] Auto-discovery of new algorithms

---

## Documentation

- [ ] README with setup instructions
- [ ] Contributing guidelines
- [ ] Algorithm addition guide
- [ ] Architecture documentation
- [ ] API documentation

---

## Polish

- [ ] Obsidian-inspired dark theme
- [ ] Mobile-responsive design
- [ ] Touch controls for mobile
- [ ] Offline support (service worker)
- [ ] Share links with state
- [ ] Keyboard shortcuts help modal (?)

---

## Community Features

- [ ] Suggestions page
- [ ] Upvoting
- [ ] Status tracking (Submitted → In Progress → Complete)
- [ ] Email notifications for contributors
