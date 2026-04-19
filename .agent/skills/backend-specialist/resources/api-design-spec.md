# API Design Specification

All technical interfaces (REST APIs, Server Functions, CLI commands) must adhere to these standards to ensure a premium developer and user experience.

## 1. Response Standards

### 1.1 Success Envelope
Every successful response must follow this structure:
```json
{
  "success": true,
  "data": { ... },
  "metadata": {
    "timestamp": "ISO-8601",
    "version": "v1"
  }
}
```

### 1.2 Error Envelope
Every error response must follow this structure:
```json
{
  "success": false,
  "error": {
    "code": "SEMANTIC_ERROR_CODE",
    "message": "Human-readable description",
    "details": { ... }
  }
}
```

## 2. HTTP Status Codes

We use semantic status codes to provide immediate context without parsing the body.

| Code | Usage |
| :--- | :--- |
| **200 OK** | Standard success for GET/PATCH/PUT. |
| **201 Created** | Success for POST leading to resource creation. |
| **204 No Content** | Success for operations with no body (e.g., DELETE). |
| **400 Bad Request** | Validation failed or client sent malformed data. |
| **401 Unauthorized** | Session invalid or missing. |
| **403 Forbidden** | Authenticated but lacks permissions for this resource. |
| **404 Not Found** | Resource does not exist. |
| **409 Conflict** | State conflict (e.g., duplicate unique field). |
| **429 Too Many Requests** | Rate limit exceeded. |
| **500 Server Error** | Unexpected failure (catch-all). |

## 3. Interaction Patterns

### 3.1 Idempotent Operations
- **GET**: Must never have side effects.
- **PUT**: Replaces a resource. Repeating produces the same result.
- **DELETE**: Removes a resource. Repeating returns 204 or 404 but state remains "deleted".
- **PATCH**: Partial update. Should be designed for idempotency where possible.

### 3.2 Non-Idempotent Operations
- **POST**: Creating resources or triggering complex state transitions. Use an `Idempotency-Key` header for safe retries.

### 3.3 Pagination
We prefer **Cursor-based pagination** for performance and consistency with Appwrite.
```text
GET /api/resources?limit=10&cursorAfter=XYZ
```

## 4. Resource Naming
- Use plural nouns for collections: `/users`, `/posts`.
- Use specific IDs for resource instances: `/users/123`.
- Use sub-collections for nested resources: `/users/123/comments`.
- Use snake_case for field names in request/response bodies.
