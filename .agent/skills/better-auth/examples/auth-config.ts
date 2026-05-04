// @ts-nocheck
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { organization } from 'better-auth/plugins/organization';
import { passkey } from 'better-auth/plugins/passkey';
import { twoFactor } from 'better-auth/plugins/two-factor';
import { db } from './db';

/**
 * Gold-standard Better Auth configuration.
 * - Uses Drizzle adapter with PostgreSQL.
 * - Implements 2FA, Organizations, and Passkeys.
 * - Secure cookie and origin defaults.
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24, // 24 hours
    },
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
  },
  plugins: [twoFactor(), organization(), passkey()],
  // High-fidelity logging for auth events
  hooks: {
    after: [
      {
        matcher: (path) => path.startsWith('/signin'),
        handler: async (ctx) => {
          console.log(
            `[AUTH] User signed in: ${ctx.context.session.user.email}`,
          );
        },
      },
    ],
  },
});

// Type helpers for the rest of the application
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
