# Pipeline Configuration

A well-defined pipeline ensures that tasks run in the correct order and only when necessary.

## 1. Task Dependency Patterns (`dependsOn`)

### Standard Build Dependency
Ensures dependencies are built before the package itself.
```json
"build": {
  "dependsOn": ["^build"],
  "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
}
```

### Self-Referential Dependency
Ensures a task in the SAME package runs first.
```json
"test": {
  "dependsOn": ["build"]
}
```

### Specific Package Dependency
Forces a specific package to be ready.
```json
"deploy": {
  "dependsOn": ["web#build"]
}
```

## 2. Transit Nodes (Parallelization Hack)
To run a task (like `lint`) in parallel across all packages without waiting for their dependencies, create a "transit" task.

```json
"lint": {
  "dependsOn": ["^transit"]
},
"transit": {
  "dependsOn": ["^transit"]
}
```

## 3. Persistent Tasks
For dev servers that never finish, set `persistent: true`. These tasks cannot have dependents.

```json
"dev": {
  "cache": false,
  "persistent": true
}
```
