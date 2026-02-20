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

## Next Actions
<!-- Auto-populated by iteration loop -->

## Completed
- [x] 2026-02-20: a11y warnings fixed — 58 → 1 (goal 1: better UX)
