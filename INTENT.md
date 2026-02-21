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
- [ ] `bun run lint` — minimal warnings
- [ ] `bun run typecheck` — 0 errors
- [ ] `bun run build` — succeeds
- [ ] Algorithm tests pass

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

## Backlog

### 🟢 Quick Wins (< 1hr, low risk)
- [ ] Complexity cheat sheet — O(1) to O(n!) with examples, always visible
- [ ] Mobile touch controls — tap sides to step forward/back
- [ ] Better loading states — skeleton UI while algorithms load
- [ ] Algorithm search — cmd+k to find algorithms quickly
- [ ] Copy code button — one-click copy for algorithm implementations

### 🟡 Medium (few hours, moderate)
- [ ] Code walkthrough sync — highlight current line as visualization steps
- [ ] Related problems links — "Practice this pattern" links to LeetCode/HackerRank
- [ ] Spaced repetition quiz — test understanding, schedule reviews
- [ ] Custom input support — let users input their own arrays/graphs
- [ ] Step explanations — detailed prose explaining each visualization step

### 🔴 High Value (day+, significant impact)
- [ ] Learning paths — structured progression (Arrays → Sorting → Trees → Graphs → DP)
- [ ] Progress tracking — mark algorithms as learned, track mastery
- [ ] Pattern recognition trainer — "What algorithm solves this?" practice
- [ ] Mock interview mode — timed problems with hints, scoring
- [ ] Community algorithm submissions — users can add algorithms (with review)

## Next Actions
<!-- Auto-populated by iteration loop -->

## Completed
- [x] 2026-02-20: a11y warnings fixed — 58 → 1 (goal 1: better UX)
