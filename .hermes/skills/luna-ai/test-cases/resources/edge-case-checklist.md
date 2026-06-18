# The Universal Edge Case Checklist

Apply this checklist to every feature specification to discover hidden failure paths.

## 1. Input Validation
- [ ] **Empty Strings**: `""`, `"   "` (whitespace only).
- [ ] **Extreme Lengths**: Very long strings (10k+ chars), very large numbers.
- [ ] **Special Characters**: SQL injection patterns, script tags, emojis, non-standard symbols.
- [ ] **Null/Undefined**: Missing optional fields vs missing mandatory fields.
- [ ] **Type Mismatches**: Strings where numbers are expected, and vice-versa.

## 2. Authentication & Authorization
- [ ] **Unauthenticated**: No session/token.
- [ ] **Expired Session**: Token exists but is no longer valid.
- [ ] **Insufficient Permissions**: User has the wrong role or is missing a specific flag.
- [ ] **Resource Ownership**: User A trying to edit/delete User B's data.

## 3. Data Integrity & State
- [ ] **Duplicates**: Trying to create a resource that already exists (unique constraints).
- [ ] **Non-Existent**: Trying to fetch/edit a resource that was deleted or never existed.
- [ ] **Race Conditions**: Two concurrent requests modifying the same resource.
- [ ] **Partial Data**: Updating only a subset of fields.

## 4. External Dependencies
- [ ] **API Timeouts**: Slow response from a downstream service.
- [ ] **API 500s**: Downstream service is crashing.
- [ ] **Database Down**: Connection refused or lost.
- [ ] **Rate Limiting**: Exceeding usage quotas.

## 5. UI/UX (Component Level)
- [ ] **Loading States**: Slower-than-average data fetching.
- [ ] **Network Errors**: Handling `fetch` failures gracefully in the UI.
- [ ] **Zero States**: What does the list look like when empty?
- [ ] **Responsive Breakpoints**: Layout behavior on mobile vs desktop.
