# ARBC: Attribute Role-Based Control Framework

The system uses a centralized **ARBC (Attribute Role-Based Control)** model to manage authority. This system moves beyond static roles by incorporating dynamic attributes from the User, the Resource, and the Environment.

---

## 1. The ARBC Equation

Authority is determined by evaluating the intersection of identities and context:

**`Access = Policies(User[Roles + Attributes] + Resource[Attributes] + Environment[Attributes])`**

---

## 2. Core Components

### 2.1 — Roles (The Baseline)
Roles define a standard set of capabilities (e.g., `ADMIN`, `DEVELOPER`, `GUEST`). They provide the broad-strokes authorization.

### 2.2 — Attributes (The Nuance)
Attributes provide the fine-grained control:
- **User Attributes**: Department, Clearance Level, Subscription Tier, User ID.
- **Resource Attributes**: Owner ID, Privacy Status, Sensitivity Level, Creation Date.
- **Environment Attributes**: Current Time, Network IP, Geographic Location, Request Origin.

---

## 3. Enforcement Strategy

### 3.1 — Public-First Defaults
By default, the system remains open for discovery. Authentication and Authorization are **explicitly opted-into** at the Presentation or Application layer for specific routes and use cases.

### 3.2 — Centralized Evaluation
Policies are evaluated in a centralized `AuthorityService` to prevent fragmented security logic.

```typescript
// Conceptual Evaluation
const isAuthorized = authorityService.evaluate({
  action: 'document.update',
  subject: currentUser,        // User[Roles + Attributes]
  resource: targetDocument,    // Resource[Attributes]
  context: currentEnvironment,  // Environment[Attributes]
});
```

### 3.3 — Policy Examples
- **Role-Based**: "If user is `ADMIN`, allow `*`."
- **Attribute-Based**: "If `user.id` matches `resource.ownerId`, allow `WRITE`."
- **Hybrid (ARBC)**: "If user is `DEVELOPER` AND `resource.environment` matches `user.assignedProject`, allow `DEBUG_ACCESS`."
