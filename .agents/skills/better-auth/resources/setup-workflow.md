# Better Auth Setup Workflow

Follow this sequence for every new Better Auth integration.

## 1. Installation
```bash
bun add better-auth
```

## 2. Environment Variables
Define these in your `.env` file. NEVER commit real secrets to version control.

| Variable | Description | Requirement |
|:---|:---|:---|
| `BETTER_AUTH_SECRET` | 32-char high-entropy string. | Mandatory |
| `BETTER_AUTH_URL` | Base URL (e.g., `http://localhost:3000`). | Mandatory |

**Generation**:
```bash
openssl rand -base64 32
```

## 3. The `auth.ts` Core
Create this file in your project root or `lib/` directory.

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db"; // Your database instance

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
    }),
    emailAndPassword: {
        enabled: true,
    },
    // Plugins and other config...
});
```

## 4. Framework Route Handler (Next.js Example)
Create `app/api/auth/[...all]/route.ts`:

```typescript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
```

## 5. Migration
Run the CLI to generate the required database schema based on your configuration and plugins.

```bash
npx @better-auth/cli@latest generate
```

Then apply the migration using your ORM's migration tool.

## 6. Verification
Call `GET /api/auth/ok` to verify the handler is working correctly. It should return:
```json
{ "status": "ok" }
```
