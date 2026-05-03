# Example: Authentication & Recovery Coverage Plan

Auditing the most sensitive part of the system: entry and recovery.

## 1. Happy Paths
- [ ] **Clean Registration**: Valid email/password/name. Expect verification email sent and redirect to onboarding. → **E2E**
- [ ] **Standard Login**: Correct credentials. Expect JWT set in HTTP-only cookie and redirect to dashboard. → **Integration (Auth)**
- [ ] **Password Recovery**: Valid email entered. Expect reset link sent. → **Integration (SMTP)**

## 2. Permission Matrix
- [ ] **Banned User**: Attempt to login with a disabled account. Expect 403 Forbidden with "Account Banned" message. → **Unit (Policy)**
- [ ] **Unverified Email**: Attempt to access protected dashboard before clicking verification link. Expect redirect to "Verify Email" page. → **Integration (Middleware)**
- [ ] **Concurrent Sessions**: Login from a 3rd device. (If limited) Expect oldest session to be revoked. → **Integration (Redis/Session)**

## 3. Edge Cases & Security
- [ ] **Brute Force**: 10 failed login attempts in 1 minute. Expect IP rate limiting or CAPTCHA trigger. → **Integration (Rate Limit)**
- [ ] **Weak Password**: Submit "123456". Expect 400 Bad Request with complexity requirements. → **Unit (Validator)**
- [ ] **Stale Reset Link**: Click password reset link after 24h. Expect "Link Expired" and option to resend. → **Integration (Token Expiry)**
- [ ] **Case Sensitivity**: Login with `User@Example.com` vs `user@example.com`. Expect case-insensitive match for email. → **Unit (Logic)**

## 4. Catastrophic Failures
- [ ] **OIDC Provider Down**: Google/GitHub login is failing. Expect fallback to email/password or graceful "Social Login Unavailable" message. → **Integration (Third-party)**
- [ ] **Database Read-Only**: DB is in maintenance mode. Login should fail gracefully with "Service Unavailable" rather than 500. → **Integration (Circuit Breaker)**
- [ ] **Token Secret Leak**: Rotating JWT secrets. Expect all old sessions to be invalidated immediately. → **Infrastructure (Security)**
