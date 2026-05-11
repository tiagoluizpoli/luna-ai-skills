# Monorepo Scopes

In a monorepo, the `scope` is critical for identifying which part of the system was modified.

## Standard Scopes

| Scope | Directory | Description |
|:---|:---|:---|
| `web` | `apps/web` | The primary frontend application. |
| `api` | `apps/api` | The backend server/API. |
| `ui` | `packages/ui` | The shared component library. |
| `db` | `packages/database` | Database schemas and migrations. |
| `auth` | `packages/auth` | Authentication logic (e.g., Better Auth). |
| `repo` | `/` | Root-level changes (configs, scripts). |
| `deps` | `package.json` | Dependency updates. |

## Guidance
- If a change affects multiple packages but is dominated by one, use that package as the scope.
- If it is a global refactor, omit the scope or use `repo`.
- Use lowercase for all scopes.
