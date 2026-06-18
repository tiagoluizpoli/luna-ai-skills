# Backend Security Checklist

This checklist is mandatory for all backend logic. Every Pull Request must be audited against these dimensions.

## 1. Input Integrity
- [ ] **Schema Validation**: Is every external input validated by a Zod schema before processing?
- [ ] **Type Safety**: Are we using Brand Types or strict interfaces for IDs and sensitive primitives?
- [ ] **Sanitization**: Are strings sanitized for HTML/SQL if they could be rendered or queried?
- [ ] **Length Enforcement**: Are maximum lengths enforced for all string inputs to prevent memory exhaustion or DB failures?

## 2. Authentication & Authorization
- [ ] **AuthN Verification**: Is the session valid and the user identity confirmed?
- [ ] **AuthZ Per-Resource**: Is the user authorized to perform *this specific action* on *this specific document*?
- [ ] **Team Scoping**: Does the operation respect team/org boundaries?
- [ ] **Admin Privilege**: Are privileged operations (e.g., using Admin Client) protected by an additional level of verification?

## 3. Data Protection
- [ ] **PII Redaction**: Is Personally Identifiable Information redacted from logs?
- [ ] **Secret Management**: Are there no hardcoded API keys or environment secrets?
- [ ] **Encryption**: Is sensitive data encrypted at rest and in transit (SSL/TLS)?
- [ ] **Least Privilege**: Does each service account have the minimum permissions needed to function?

## 4. Resilience & Operational Security
- [ ] **Rate Limiting**: Is there protection against Brute Force and DoS?
- [ ] **Error Exposure**: Are internal stack traces or database names leaked in error responses? (They MUST be caught and replaced with generic codes).
- [ ] **Dependency Audit**: Are all third-party libraries updated and free of known vulnerabilities (CVEs)?
- [ ] **Idempotency**: Can a failed request be safely retried without side effects?

## 5. Audit Logging
- [ ] **Intent Logging**: Do we log who changed what, when, and why?
- [ ] **Failure Investigation**: Are failed authorization attempts logged for security monitoring?
- [ ] **Traceability**: Is there a correlation ID that spans across the entire request lifecycle?
