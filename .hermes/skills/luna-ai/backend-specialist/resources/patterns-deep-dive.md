# Backend Architectural Patterns: Deep Dive

This document restores and expands upon the core engineering patterns required for the Luna AI Skills Ecosystem.

---

## 1. The Repository Layer (Persistence Isolation)

Repositories are the only modules permitted to interact with the Infrastructure layer (Databases, SDKs).

### 1.1 Implementation Invariants
- **Atomic Responses**: Methods must return Domain Entities or DTOs, never raw database models.
- **Typed IDs**: Use Branded Types for IDs (e.g., `UserId`) to prevent ID-swapping bugs.
- **Internal Mapping**: Use a Mapper within the repository to translate persistence models to domain entities.

```typescript
// Repository interface in the Domain Layer
interface IUserRepository {
  findById(id: UserId): Promise<User | null>;
  save(user: User): Promise<void>;
}
```

---

## 2. The Service Layer (Logic Orchestration)

Services (or Use Cases) live in the Application Layer and coordinate multiple repositories or external services.

### 2.1 Implementation Invariants
- **Statelessness**: Services must not store session-specific state.
- **Transaction Boundaries**: Orchestrate database transactions or manual rollbacks across repositories.
- **ARBC Integration**: Every service call must begin with an authority check via the `AuthorityService`.

---

## 3. The Mapper Pattern (Cross-Layer Translation)

Mappers ensure that internal database changes do not leak into the Domain or Presentation layers.

### 3.1 Implementation Invariants
- **Zod Guardians**: Mappers must run Zod validation during translation to ensure data hasn't been corrupted.
- **Bidirectional**: Provide `toDomain()` and `toPersistence()` (or `toResponse()`) methods.

---

## 4. Error Handling Protocol

All errors must be caught at the Presentation boundary and converted into a semantic `DomainError`.

### 4.1 Semantic Mapping
| Exception | Technical Outcome | Domain Error |
| :--- | :--- | :--- |
| Database Connection Failed | 500 Server Error | `InternalError` |
| Zod Parsing Failed | 400 Bad Request | `ValidationError` |
| ARBC Policy Denied | 403 Forbidden | `ForbiddenError` |
| Document ID Missing | 404 Not Found | `NotFoundError` |
