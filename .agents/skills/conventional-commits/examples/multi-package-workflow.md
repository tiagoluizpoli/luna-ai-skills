# Multi-Package Workflow

When working on a feature that spans multiple packages, follow this "Baton-Passing" workflow to maintain clean history.

## Scenario
You modified `packages/ui` (added a Card), `apps/web` (used the Card), and `packages/auth` (fixed a typo in a hook).

## 1. Analyze Staged Changes
```bash
git status
# modified: packages/ui/src/card.tsx
# modified: apps/web/page.tsx
# modified: packages/auth/hooks/use-session.ts
```

## 2. Commit UI Package
```bash
git add packages/ui
git commit -m "feat(ui): add high-fidelity Card component with hover lift"
```

## 3. Commit Auth Fix
```bash
git add packages/auth
git commit -m "fix(auth): correct typo in useSession hook parameter"
```

## 4. Commit Web App
```bash
git add apps/web
git commit -m "feat(web): implement dashboard layout using new Card component"
```

## Resulting History
```text
* feat(web): implement dashboard layout using new Card component
* fix(auth): correct typo in useSession hook parameter
* feat(ui): add high-fidelity Card component with hover lift
```

Each commit is independent, descriptive, and scoped correctly.
