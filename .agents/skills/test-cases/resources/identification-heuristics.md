# Test Case Identification Heuristics

Use these mental models to ensure no logic path, however obscure, remains untested.

## 1. The Actor's Perspective
Ask "Who is trying to do this, and what is their intent?"
- **The Ideal User**: Follows the rules, provides valid data. (Happy Path).
- **The Amateur**: Makes mistakes, misses fields, provides wrong formats. (Validation Paths).
- **The Attacker**: Tries to bypass auth, access others' data, or crash the system. (Security Paths).
- **The Ghost**: A user whose session just expired or whose account was just deleted. (Stale State Paths).

## 2. The Data Lifecycle Audit
Trace the path of every piece of data through the system.
- **Entry**: Validation rules (Zod, custom logic). What is the minimum/maximum allowed?
- **Transformation**: How is the data modified before storage? (Mappers, Services).
- **Persistence**: Unique constraints, foreign key relations, transactional integrity.
- **Retrieval**: What happens if the data is missing or corrupted?
- **Deletion**: Are side effects (cascading deletes, file cleanup) handled?

## 3. The Infrastructure Stress Test
Assume every external dependency is a "Bad Actor."
- **Latency**: What if the DB takes 10 seconds? Does the UI time out gracefully?
- **Partitioning**: What if the API is reachable but the DB is not?
- **Instability**: What if the network drops *between* two sequential API calls?
- **Quotas**: What happens when a user hits a rate limit or a storage cap?

## 4. The State Machine Audit
For complex flows (Checkouts, Multi-step forms, Subscriptions):
- **Illegal Transitions**: Can a user jump from step 1 to step 4 via URL manipulation?
- **Race Conditions**: What if two people click "Buy the last item" at the exact same millisecond?
- **Interruption**: What if the user refreshes the page during a critical transaction?
- **Resumption**: Does the system remember where they were?
