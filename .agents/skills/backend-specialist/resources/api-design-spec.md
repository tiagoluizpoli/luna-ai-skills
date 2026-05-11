# API Design Specification

All technical interfaces (REST APIs, Server Functions, CLI commands) must adhere to these standards to ensure a premium developer and user experience.

## 1. Response Standards

We rely on **HTTP Status Codes** and atomic property presence to identify outcomes. The redundant `success: boolean` flag is explicitly forbidden.

### 1.1 Success Envelope (Single Resource)
```json
{
  "data": { ... },
  "metadata": {
    "timestamp": "ISO-8601",
    "version": "v1"
  }
}
```

### 1.2 Error Envelope
```json
{
  "error": {
    "code": "SEMANTIC_ERROR_CODE",
    "message": "Human-readable description",
    "details": { ... }
  }
}
```

### 1.3 Collection Envelope (Lists & Pagination)
Collection responses must include standardized pagination metadata.

```json
{
  "data": [ ... ],
  "pagination": {
    "total_items": 125,
    "items_per_page": 20,
    "current_page": 1,
    "total_pages": 7,
    "next_cursor": "base64_string_if_applicable",
    "has_next_page": true
  },
  "metadata": {
    "timestamp": "ISO-8601"
  }
}
```

## 2. HTTP Status Codes

| Code | Usage |
| :--- | :--- |
| **200 OK** | Standard success for GET/PATCH/PUT. |
| **201 Created** | Success for POST leading to resource creation. |
| **204 No Content** | Success for operations with no body (e.g., DELETE). |
| **400 Bad Request** | Validation failed or client sent malformed data. |
| **401 Unauthorized** | Session invalid or missing. |
| **403 Forbidden** | Authenticated but lacks permissions (ARBC denied). |
| **404 Not Found** | Resource does not exist. |
| **409 Conflict** | State conflict (e.g., duplicate unique field). |
| **429 Too Many Requests** | Rate limit exceeded. |
| **500 Server Error** | Unexpected failure. |

---

## 3. Interaction Patterns

### 3.1 Idempotent Operations
- **GET**: Must never have side effects.
- **PUT**: Replaces a resource. Repeating produces the same result.
- **DELETE**: Removes a resource. Repeating returns 204 or 404 but state remains "deleted".

### 3.2 Pagination Strategy
- **Offset-based**: For simple, small collections (using `page` and `limit`).
- **Cursor-based**: For high-density, large collections (using `cursorAfter` and `limit`). Mandatory for Appwrite integrations.
