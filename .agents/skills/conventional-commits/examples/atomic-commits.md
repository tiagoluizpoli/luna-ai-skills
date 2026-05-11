# Atomic Commits Comparison

## ❌ Bad (Vague)
- `update ui`
- `fix bugs`
- `refactor auth logic and fix nextjs config` (Multiple concerns)
- `added new button` (Past tense)

## ✅ Gold Standard (Semantic & Atomic)
- `feat(ui): add primary button with spring micro-animations`
- `fix(api): resolve race condition in registration service`
- `refactor(auth): simplify session validation logic`
- `build(repo): upgrade turborepo to v2.0`
- `docs(web): update deployment instructions for Vercel`

## Why it matters
1. **Automated Changelogs**: `feat` and `fix` automatically appear in release notes.
2. **Searchability**: `git log --grep="feat(auth)"` allows instant discovery of feature additions.
3. **Rollbacks**: Reverting an atomic commit is much safer than reverting a "mega-commit" that touched 10 packages.
