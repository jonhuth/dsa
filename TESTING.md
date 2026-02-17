# Testing Roadmap - dsa (Data Structures & Algorithms Visualizer)

## ✅ Implemented
- [x] Basic unit tests (bun test)
- [ ] Basic smoke tests (page loads, visualization present)

## 🎯 Unit Tests - Algorithm Correctness (HIGH PRIORITY)
These are pure functions - test exhaustively!

### Sorting
- [ ] Bubble sort produces sorted output
- [ ] Quick sort produces sorted output
- [ ] Merge sort produces sorted output
- [ ] Heap sort produces sorted output
- [ ] Edge cases: empty, single element, already sorted, reverse sorted

### Trees
- [ ] BST insert maintains ordering
- [ ] BST delete maintains ordering
- [ ] BST search finds correct node
- [ ] Tree traversals (in/pre/post) produce correct order
- [ ] AVL rotations maintain balance

### Graphs
- [ ] BFS visits nodes in correct order
- [ ] DFS visits nodes in correct order
- [ ] Dijkstra finds shortest path
- [ ] Edge cases: disconnected graphs, cycles

### Data Structures
- [ ] Stack push/pop LIFO order
- [ ] Queue enqueue/dequeue FIFO order
- [ ] Linked list operations maintain integrity

## 🎯 E2E Tests (TODO)
- [ ] Select algorithm → visualization runs
- [ ] Play/pause controls work
- [ ] Step through animation
- [ ] Speed controls affect animation
- [ ] Input data can be customized

## Running Tests

```bash
# Unit tests
bun test

# E2E tests (from web/)
cd web && bunx playwright test

# Watch mode for unit tests
bun test --watch
```
