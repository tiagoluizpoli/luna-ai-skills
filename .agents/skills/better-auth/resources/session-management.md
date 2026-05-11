# Session Management

Better Auth provides flexible session storage and caching strategies.

## 1. Storage Priority
Better Auth evaluates storage in the following order:

1. **Secondary Storage**: If `secondaryStorage` (Redis/KV) is defined, sessions are stored there by default.
2. **Database**: If no secondary storage, sessions are stored in the primary database.
3. **Stateless**: If no database is configured, sessions are stored purely in cookies (limited features).

## 2. Secondary Storage (Redis/Upstash)
Recommended for high-performance applications.

```typescript
import { upstashStore } from "@better-auth/upstash"; // hypothetical plugin example
// Or direct Redis implementation

export const auth = betterAuth({
    secondaryStorage: {
        get: async (key) => redis.get(key),
        set: async (key, value, ttl) => redis.set(key, value, { ex: ttl }),
        delete: async (key) => redis.del(key),
    },
    session: {
        storeSessionInDatabase: true, // Optional: sync with DB for persistence
    }
});
```

## 3. Cookie Cache Strategies
Optimize perceived performance by caching session data in the browser.

| Strategy | Description |
|:---|:---|
| `compact` | (Default) Base64url + HMAC. Smallest footprint. |
| `jwt` | Standard signed JWT. Readable client-side. |
| `jwe` | Fully encrypted JWT. Maximum security. |

```typescript
session: {
    cookieCache: {
        enabled: true,
        maxAge: 60 * 60 * 24, // 24 hours
    },
    expiresIn: 60 * 60 * 24 * 7, // 7 days
}
```

## 4. Key Limitations
- **Custom Fields**: By default, custom user fields are NOT cached in the cookie. They will be re-fetched from the source (DB/Redis) on every request unless manually added to the cache.
- **Invalidation**: To invalidate all active sessions (e.g., after a security breach), change the `session.cookieCache.version`.

## 5. Stateless Mode
When using Better Auth without a database, you must enable `cookieCache`. Note that features like `revokeSession` or `organization` management will be limited as there is no central authority to track sessions.
