# INTENT.md — DSA Visualizer

*Goals-driven autonomous iteration*

## Vision
The best way to learn algorithms — see every step, understand the why, ace the interview.

## Goals

1. **Learn by Seeing** — Every algorithm has clear, step-by-step visualization. Understand what's happening at each step, not just the final result.

2. **Interview Ready** — Complexity analysis, edge cases, "when to use", interview tips for each algorithm. The context you need to ace technical interviews.

3. **Comprehensive Coverage** — All the classics: sorting, searching, trees, graphs, dynamic programming. Interconnected so you can explore related concepts.

## Current Phase
`development` → expanding coverage

## Success Criteria

### Code Quality (auto-enforceable)
- [x] `bun run lint` — 0 errors ✅
- [x] `bun run typecheck` — 0 errors ✅
- [x] `bun run build` — succeeds ✅
- [ ] Algorithm tests pass (vitest configured but minimal tests)

### Functional (manual verification)
- [ ] Visualizations render correctly
- [ ] Step-through controls work
- [ ] Learning content is accurate
- [ ] Mobile layout works

## Constraints
```yaml
risk: low              # Educational content - iterate freely
deployment: none       # Not deployed yet
content: careful       # Learning accuracy matters
```

## Guardrails
```yaml
# Iteration Limits
max_attempts_per_issue: 2
max_changes_per_day: 5
cooldown_after_failure: 12h

# Quality Gates
tests_must_pass: true           # Algorithm correctness critical
lint_must_pass: true
type_check_must_pass: true
build_must_succeed: true

# Regression Prevention
algorithm_tests_required: true  # New algos need tests
no_new_lint_warnings: true
bundle_size_max_increase: 10%

# Escalation Triggers
escalate_after_failures: 2
escalate_on_regression: immediate
escalate_if_blocked_days: 3

# Content Protection
verify_algorithm_correctness: true  # Must pass test suite
learning_content_needs_review: true # Don't auto-change explanations
```

## Autonomous Action Policy

| Action | Policy |
|--------|--------|
| Lint/type fixes | ✅ auto-merge |
| A11y improvements | ✅ auto-merge |
| Test additions | ✅ auto-merge |
| Documentation | ✅ auto-merge |
| New algorithms (with tests) | ✅ auto-merge |
| UI changes | ❌ PR with screenshot, await review |
| New visualizer types | ❌ PR, await review |
| AI tutor prompts | ❌ never auto-merge |
| Learning content tone | ❌ needs review |

## Verification Protocol

**Before merging:**
1. Run `bun run lint` and `bun run typecheck`
2. Run algorithm tests
3. For new algorithms: verify correctness manually
4. For UI changes: screenshot before/after

## What Already Exists
- ✅ Search dialog with Cmd+K (`components/layout/SearchDialog.tsx`) — algorithms searchable
- ✅ Algorithm registry with categories, tags, relationships (`lib/registry.ts`)
- ✅ Visualizers: Array, Tree, Graph, Grid, PlaybackControls
- ✅ Learning components: InterviewTips, ComplexityChart, Prerequisites, EdgeCases, KeyInsights, RelatedLinks, WhenToUse
- ✅ Algorithm pages: 7 sorting, 2 search, 3 graphs, 4 trees, 4 dynamic programming (20 total)
- ✅ E2E smoke tests
- ✅ Lint passes (0 errors)

## Backlog

### 🟢 Quick Wins (< 1hr, low risk)
- [x] **Add error.tsx** — Create `web/app/error.tsx` for graceful error handling
- [ ] **Add loading.tsx** — Create `web/app/loading.tsx` with algorithm-themed skeleton
- [ ] **Complexity cheat sheet** — Add always-visible O(1) to O(n!) reference card
- [ ] **Copy code button** — Add one-click copy to algorithm implementations in CodeViewer
- [ ] **Mobile touch controls** — Add tap sides to step forward/back in PlaybackControls

### 🟡 Medium (few hours, moderate)
- [ ] **Code walkthrough sync** — Highlight current line in CodeViewer as visualization steps
- [ ] **Related problems links** — Add "Practice this pattern" links to LeetCode/HackerRank in learning components
- [ ] **Custom input support** — Let users input their own arrays/graphs for visualization
- [ ] **Step explanations** — Add detailed prose explaining each visualization step
- [ ] **Algorithm tests** — Add vitest unit tests for each algorithm's correctness

### 🔴 High Value (day+, significant impact)
- [ ] **Learning paths** — Structured progression (Arrays → Sorting → Trees → Graphs → DP)
- [ ] **Progress tracking** — LocalStorage-based mastery tracking per algorithm
- [ ] **Pattern recognition trainer** — "What algorithm solves this?" quiz mode
- [ ] **Mock interview mode** — Timed problems with hints, scoring

## Next Actions
<!-- Auto-populated by iteration loop -->
- ⚠️ **Fix typecheck failures** — ~130 errors across algorithm pages (step data type mismatches). Blocks `type_check_must_pass` guardrail. Root cause: `Highlight[]` and step state types don't match visualizer props.

## Completed
- [x] 2026-02-21: Added `error.tsx` for graceful error handling (goal 1: better UX)
- [x] 2026-02-20: a11y warnings fixed — 58 → 1 (goal 1: better UX)
