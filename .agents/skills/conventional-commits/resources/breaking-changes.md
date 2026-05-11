# Breaking Changes

Breaking changes MUST be explicitly flagged to trigger a MAJOR version bump in automated release tools.

## 1. The `!` Indicator
Add a `!` after the type/scope to signal a breaking change.

```text
feat(api)!: remove support for v1 endpoints
```

## 2. The `BREAKING CHANGE:` Footer
Include a detailed description of the breaking change in the commit footer.

```text
refactor(auth)!: change session storage schema

BREAKING CHANGE: The session storage now uses Redis instead of memory. 
You must set the REDIS_URL environment variable or the app will fail to start.
```

## Rules
- The footer MUST be at the very bottom of the commit message.
- Use a blank line before the footer.
- Provide clear migration instructions if possible.
