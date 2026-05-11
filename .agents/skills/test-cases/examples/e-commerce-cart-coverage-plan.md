# Example: E-commerce Cart & Checkout Coverage Plan

This plan audits a high-stakes state machine involving inventory, payments, and real-time updates.

## 1. Happy Paths
- [ ] **Standard Purchase**: User adds items, applies valid coupon, and completes payment. → **E2E**
- [ ] **Inventory Sync**: Item count decreases immediately after successful checkout. → **Integration (Transactional)**
- [ ] **Cart Persistence**: User logs out and back in; cart items are still there. → **Integration (DB)**

## 2. Permission Matrix
- [ ] **Guest Checkout**: User purchases without an account. Expect restricted post-purchase features. → **Integration (Auth)**
- [ ] **Coupon Hijack**: User B tries to use a one-time coupon already redeemed by User A. Expect 403 Forbidden. → **Unit (Business Logic)**
- [ ] **Admin Overrides**: Admin manually adjusts cart prices. Expect audit logs to be created. → **Integration (Auditing)**

## 3. Edge Cases & State Transitions
- [ ] **Inventory Race**: User A and B both have the last item in cart. User A pays first. User B should get "Out of Stock" error at final step. → **Integration (Race Condition)**
- [ ] **Zero Quantity**: Attempt to add `-1` or `0` items to cart. Expect 400 Bad Request. → **Unit (Validator)**
- [ ] **Coupon Expiry**: User enters checkout with valid coupon, waits 2 hours (expiry), then clicks "Pay". Expect price recalculation. → **Integration (Time-based)**
- [ ] **Currency Mismatch**: User changes region mid-checkout. Expect cart to clear or prices to convert. → **Component (State)**

## 4. Catastrophic Failures
- [ ] **Payment Provider Down**: Stripe API returns 500. Expect order to remain in "Pending" and user to see "Retry Payment" option. → **Integration (Failure Simulation)**
- [ ] **Email Service Down**: Checkout succeeds but receipt email fails. Order should still be confirmed, but marked as "Email Pending". → **Integration (Queue handling)**
- [ ] **Double Charge Prevention**: User double-clicks "Pay". Expect idempotency key to prevent multiple charges. → **Integration (Idempotency)**
