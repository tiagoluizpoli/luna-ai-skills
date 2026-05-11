# Caching Best Practices

Turborepo caching relies on a cryptographic hash of all task inputs. If the hash matches, the output is restored from cache.

## 1. Defining Inputs
Avoid overly broad inputs. Use `$TURBO_DEFAULT$` for standard source files.

```json
"inputs": [
  "$TURBO_DEFAULT$",
  ".env",
  "tsconfig.json"
]
```

## 2. Environment Variable Hashing
If your build uses environment variables, you MUST declare them in the `env` array.

```json
"build": {
  "env": ["API_URL", "DATABASE_URL", "NEXT_PUBLIC_*"]
}
```

## 3. Debugging Cache Misses
If a task runs when you expected a cache hit:

1. **Summarize**: Run `turbo run <task> --summarize`. Check the `.turbo/turbo-build.json` to see the hash inputs.
2. **Dry Run**: Use `turbo run <task> --dry` to see what would run without executing.
3. **Compare**: Compare the `inputs` section in the summary of two different runs to find the differing file or environment variable.

## 4. Skip Cache Entirely
For tasks that should always run (e.g., end-to-end tests or deployments):
```json
"deploy": {
  "cache": false
}
```
Or use `--force` flag in the terminal.
