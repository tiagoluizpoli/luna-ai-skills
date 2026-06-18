# Structural Clean Architecture Blueprint

This blueprint demonstrates the mandatory 4-layer folder organization for all backend projects.

## Directory Tree

```text
src/
├── presentation/              # LAYER 1: The Entrance
│   ├── api/                   # REST/GraphQL handlers
│   │   ├── controllers/
│   │   └── middleware/
│   ├── cli/                   # CLI command definitions
│   └── shared/                # DTOs and Response Envelopes
│
├── application/               # LAYER 2: Orchestration
│   ├── use-cases/             # Intent-based logic (e.g., CreateUser.ts)
│   ├── services/              # Domain-agnostic orchestration services
│   └── auth/                  # Application-level auth logic (ARBC)
│
├── domain/                    # LAYER 3: The Heart
│   ├── entities/              # Core business objects
│   ├── value-objects/         # Immutable domain values
│   ├── repository-interfaces/  # Storage abstractions
│   ├── service-interfaces/    # External service abstractions
│   └── rules/                 # Pure business logic/validators
│
└── infrastructure/            # LAYER 4: The Boundary
    ├── persistence/           # DB Implementations (Appwrite, SQL)
    │   └── repositories/
    ├── storage/               # File storage implementations
    ├── external-services/     # SDK wrappers (Payment, Email, etc.)
    └── shared/                # Infrastructure-specific utilities
```

## Layer-by-Layer Logic

### 1. Presentation
The only layer that knows about **Transport**. It converts a raw HTTP request into a Domain DTO.
- **Example**: `UserController` calling `CreateUser` use case.

### 2. Application
The layer that knows about **Workflow**. It coordinates the dance between the domain and infrastructure.
- **Example**: `CreateUser` use case calling `UserRepository.save()` and `EmailService.sendWelcome()`.

### 3. Domain
The layer that knows about **Business**. It is 100% pure TypeScript.
- **Example**: `UserEntity` ensuring a user has a valid email format and minimum age.

### 4. Infrastructure
The layer that knows about **Implementation**. It handles the messy details of `node-appwrite` or `stripe-sdk`.
- **Example**: `AppwriteUserRepository` executing the actual database mutation.
