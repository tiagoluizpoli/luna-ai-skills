# Security Best Practices

Security must be configured centrally to prevent bypasses.

## 1. Environment Enforcement
- **`useSecureCookies`**: In production, always set to `true` (forces HTTPS).
- **`trustedOrigins`**: Explicitly whitelist origins allowed to perform auth actions to prevent CSRF.

```typescript
advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    trustedOrigins: ["https://myapp.com"],
}
```

## 2. Rate Limiting
Protect your auth endpoints (Sign Up, Sign In, Reset Password) from brute-force attacks.

```typescript
rateLimit: {
    enabled: true,
    window: 60, // 60 seconds
    max: 10,    // 10 requests per window
    storage: "secondary-storage", // "memory" | "database" | "secondary-storage"
},
```

## 3. Endpoint Hooks
Use hooks to inject custom logic before or after auth actions.

```typescript
hooks: {
    before: [
        {
            matcher: (path) => path.startsWith("/signin"),
            handler: async (ctx) => {
                // Perform pre-authentication checks
            },
        },
    ],
    after: [
        {
            matcher: (path) => path.startsWith("/signup"),
            handler: async (ctx) => {
                // Post-registration actions (e.g., send welcome email)
            },
        },
    ],
},
```

## 4. Database Hooks
Ideal for data normalization or audit logging.

```typescript
databaseHooks: {
    user: {
        create: {
            before: async (user) => {
                user.email = user.email.toLowerCase();
                return user;
            },
        },
    },
},
```

## 5. Dangerous Options (Avoid)
- **`disableCSRFCheck`**: ⚠️ DANGEROUS. Only use for testing or non-web clients.
- **`disableOriginCheck`**: ⚠️ DANGEROUS. Allows auth actions from any origin.
- **`crossSubDomainCookies`**: Use with caution. Only enable if sharing sessions across subdomains (e.g., `app.acme.com` and `admin.acme.com`).
