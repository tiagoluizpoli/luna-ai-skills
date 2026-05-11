# Structural Clean Architecture: The 4-Layer Blueprint

All backend systems must adhere to this 4-layer structural blueprint to ensure absolute isolation of concerns and maintainability.

---

## 1. Presentation Layer (`api/`, `cli/`, `presentation/`)
The **Systematic Entrance** of the project. 

### Responsibility:
- Manages transport-specific protocols (HTTP, GRPc, CLI stdin/stdout).
- Handles input parsing and initial schema validation (via Zod).
- Formats final outgoing responses for the consumer (Success/Error envelopes).
- **Rule**: This layer must never contain business logic. It only translates inputs into Application Layer calls.

---

## 2. Application Layer (`application/`)
The **Orchestration Core**.

### Responsibility:
- Contains **Use Cases** (also known as Interactos or Services).
- Coordinates the flow of data between Domain entities and Infrastructure services.
- Manages application-specific rules (e.g., "When a user signs up, send a welcome email and check a referral code").
- Handles cross-cutting concerns like Transaction orchestration and Logging of intent.
- **Rule**: This layer depends on the Domain layer, but remains agnostic of specific infrastructure details (using Dependency Inversion).

---

## 3. Domain Layer (`domain/`)
The **Heart of the Project**.

### Responsibility:
- Contains core **Business Entities** (Classes or Types representing objects like `User`, `Skill`, `Transaction`).
- Defines central **Business Rules** that are true regardless of the application (e.g., "A skill level must be between 1 and 10").
- Defines interfaces for external dependencies (Repositories, Services) to be implemented in the Infrastructure layer.
- **Rule**: This layer is the most stable and MUST NOT depend on any other layer.

---

## 4. Infrastructure Layer (`infrastructure/`)
The **Boundary Layer**.

### Responsibility:
- Implements the interfaces defined in the Domain layer.
- Handles **all** external interactions:
    - **Persistence**: Database Repositories (Appwrite, SQL, etc.).
    - **Storage**: File system or cloud storage interactions.
    - **Third-Party Services**: Payment gateways, Email providers, external APIs.
- Manages the technical details of connectivity (retry logic, connection pooling).
- **Rule**: This layer knows about external libraries and SDKs, keeping them isolated from the core logic.
