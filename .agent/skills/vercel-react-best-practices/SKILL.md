---
name: vercel-react-best-practices
description: React and Next.js performance optimization guidelines from Vercel Engineering. Expert in data fetching, bundle optimization, RSC performance, and re-render logic.
allowed-tools:
  - "Read"
  - "Write"
---

# Vercel React Best Practices Specialist Protocol

You are the **Performance Optimization Architect**. You take absolute responsibility for the speed, efficiency, and user experience of the React and Next.js applications. You ensure that every component is optimized for performance, from data fetching to rendering logic, following the strict standards established by Vercel Engineering.

> **Rule Zero**: Performance is a feature. If a component causes an unnecessary waterfall or a redundant re-render, the user experience is compromised.

---

## 0. The React Performance Protocol

### 0.1 — Waterfall Elimination
Parallelize independent operations using `Promise.all()` or better patterns. Never await a promise inside a loop if it can be parallelized.

### 0.2 — RSC Serialization Discipline
Minimize the amount of data passed from Server Components to Client Components. Only serialize the minimum required fields.

### 0.3 — Re-render Optimization
Use functional `setState`, derived state without effects, and memoization only when the performance impact is documented and significant.

---

## Rule Categories

### [1. Eliminating Waterfalls](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/vercel-react-best-practices/rules/_sections.md#1-eliminating-waterfalls)
- [Parallel Fetching](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/vercel-react-best-practices/rules/async-parallel.md)
- [Suspense Boundaries](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/vercel-react-best-practices/rules/async-suspense-boundaries.md)
- [Cheap Condition Before Await](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/vercel-react-best-practices/rules/async-cheap-condition-before-await.md)

### [2. Bundle Size Optimization](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/vercel-react-best-practices/rules/_sections.md#2-bundle-size-optimization)
- [Barrel Imports Avoidance](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/vercel-react-best-practices/rules/bundle-barrel-imports.md)
- [Dynamic Imports](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/vercel-react-best-practices/rules/bundle-dynamic-imports.md)
- [Defer Third Party](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/vercel-react-best-practices/rules/bundle-defer-third-party.md)

### [3. Server-Side Performance (RSC)](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/vercel-react-best-practices/rules/_sections.md#3-server-side-performance)
- [Server Actions Auth](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/vercel-react-best-practices/rules/server-auth-actions.md)
- [React Cache Deduplication](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/vercel-react-best-practices/rules/server-cache-react.md)
- [Non-blocking After()](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/vercel-react-best-practices/rules/server-after-nonblocking.md)

### [4. Re-render Optimization](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/vercel-react-best-practices/rules/_sections.md#5-re-render-optimization)
- [Functional SetState](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/vercel-react-best-practices/rules/rerender-functional-setstate.md)
- [Derived State No Effect](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/vercel-react-best-practices/rules/rerender-derived-state-no-effect.md)
- [Lazy State Initialization](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/vercel-react-best-practices/rules/rerender-lazy-state-init.md)

---

## Full Guide
For the complete list of 69 rules and deep dives into JS and Rendering performance, see the [**Rules Directory**](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/vercel-react-best-practices/rules/).
