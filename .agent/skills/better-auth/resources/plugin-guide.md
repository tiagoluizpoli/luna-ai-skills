# Plugin Guide

Better Auth's modular architecture allows you to add complex features via plugins.

## 1. Popular Plugins

| Plugin | Purpose | Path |
|:---|:---|:---|
| `twoFactor` | MFA (SMS, Authenticator, Email) | `better-auth/plugins/two-factor` |
| `organization` | RBAC, Teams, and Multi-tenancy | `better-auth/plugins/organization` |
| `passkey` | WebAuthn / Biometric login | `better-auth/plugins/passkey` |
| `magicLink` | Passwordless email login | `better-auth/plugins/magic-link` |
| `admin` | User management and dashboard actions | `better-auth/plugins/admin` |
| `apiKey` | Machine-to-machine authentication | `better-auth/plugins/api-key` |
| `jwt` | Issue custom JWTs for external services | `better-auth/plugins/jwt` |

## 2. Server Configuration
```typescript
import { twoFactor } from "better-auth/plugins/two-factor";

export const auth = betterAuth({
    plugins: [
        twoFactor({
            otpOptions: {
                sendOTP: async (user, otp) => {
                    // Integration with Twilio / Resend
                },
            },
        }),
    ],
});
```

## 3. Client Configuration
Plugins must also be registered on the client to enable typed methods.

```typescript
import { createAuthClient } from "better-auth/client";
import { twoFactorClient } from "better-auth/plugins/two-factor/client";

const authClient = createAuthClient({
    plugins: [
        twoFactorClient(),
    ],
});
```

## 4. Tree-Shaking Rule
ALWAYS import plugins from their specific sub-paths.

- ✅ **CORRECT**: `import { twoFactor } from "better-auth/plugins/two-factor"`
- ❌ **WRONG**: `import { twoFactor } from "better-auth/plugins"`

## 5. Plugin Schema Generation
When adding or changing a plugin, you MUST re-run the CLI to update your database schema.

```bash
npx @better-auth/cli generate
```
