# Monorepo Boundaries

Prevent "Spaghetti Monorepo" by enforcing strict architectural boundaries.

## 1. Package Tagging
Assign tags to your packages in their `package.json` or via `turbo.json`.

```json
// packages/ui/package.json
{
  "name": "@repo/ui",
  "turbo": {
    "tags": ["type:ui"]
  }
}
```

## 2. Boundary Rules
Define which tags are allowed to import from others.

```json
// turbo.json
"boundaries": {
  "tags": {
    "type:app": {
      "canDependOn": ["type:ui", "type:internal", "type:shared"]
    },
    "type:ui": {
      "canDependOn": ["type:shared"]
    },
    "type:internal": {
      "canDependOn": ["type:shared"]
    }
  }
}
```

## 3. Enforcement
Run `turbo boundaries` in CI to catch illegal imports. 

**Pro-Tip**: Combine this with ESLint `import/no-relative-parent-imports` to ensure packages only communicate via their public `exports` and never via reaching into `../../packages/`.
