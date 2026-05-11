# Database Adapters

Better Auth supports a wide range of databases and ORMs.

## 1. Drizzle Adapter
```typescript
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // "pg" | "mysql" | "sqlite"
        schema: {
            // Optional: specify custom model names if they differ from defaults
            user: "users",
            session: "sessions",
            account: "accounts",
            verification: "verifications",
        }
    }),
});
```

## 2. Prisma Adapter
```typescript
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
});
```

## 3. Direct Drivers
Better Auth can connect directly to database drivers without an ORM.

- **PostgreSQL**: Pass `pg.Pool` or `postgres` instance.
- **MySQL**: Pass `mysql2` pool.
- **SQLite**: Pass `better-sqlite3` or `bun:sqlite` instance.

## 4. Critical Distinction: Model vs Table
Better Auth configuration uses **ORM Model names**, not the underlying database table names.

| Context | Reference |
|:---|:---|
| **Config** (`user.modelName`) | The name of the model in your ORM (e.g., `user`). |
| **Database** | The name of the table in SQL (e.g., `users_table`). |

If your Prisma model is `User` mapping to a table `users`, use `modelName: "user"`.

## 5. Custom Fields
To add custom fields to the `user` table:
1. Define them in `user.additionalFields`.
2. Generate the schema via CLI.
3. Apply migration.

```typescript
user: {
    additionalFields: {
        role: {
            type: "string",
            defaultValue: "user",
        },
    },
},
```
