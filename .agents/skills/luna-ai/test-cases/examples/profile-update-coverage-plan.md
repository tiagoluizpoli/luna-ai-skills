# Example: User Profile Update Coverage Plan

This plan demonstrates the systematic identification of all test cases for a profile update feature.

## 1. Happy Paths
- [ ] **Valid Update**: User updates their name and bio. Expect 200 OK and data persisted. → **Integration (DB)**
- [ ] **UI Feedback**: Success toast appears after save. → **Component (RTL)**

## 2. Permission Matrix
- [ ] **Unauthenticated**: Guest tries to access update endpoint. Expect 401 Unauthorized. → **Unit (Auth Middleware)**
- [ ] **Ownership Check**: User A tries to update User B's profile ID. Expect 403 Forbidden. → **Integration (Service Layer)**
- [ ] **Expired JWT**: Request with stale token. Expect 401 and redirect to login. → **E2E (Playwright)**

## 3. Edge Cases & Validation
- [ ] **Empty Name**: Submit name as `""`. Expect 400 Bad Request / Zod Error. → **Unit (Validator)**
- [ ] **Avatar Too Large**: Upload 20MB image. Expect 413 Payload Too Large. → **Integration (API Boundary)**
- [ ] **Duplicate Email**: Change email to one already in use. Expect 409 Conflict. → **Integration (DB Unique Constraint)**

## 4. Catastrophic Failures
- [ ] **DB Timeout**: Database takes > 5s to respond. Expect 504 Gateway Timeout and retry logic. → **Integration (Failure Simulation)**
- [ ] **S3 Upload Fail**: Avatar storage is down. Expect 500 but profile text updates should ROLLBACK. (Transactional Integrity). → **Integration (Transactional)**
- [ ] **Offline Mode**: User loses internet mid-submission. Expect UI to show "Connection lost, retrying..." → **Component (Service Worker/Mock Network)**
