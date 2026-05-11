// @ts-nocheck
'use client';

import { createAuthClient } from 'better-auth/client';
import { organizationClient } from 'better-auth/plugins/organization/client';
import { twoFactorClient } from 'better-auth/plugins/two-factor/client';

// Initialize the client with plugins
const authClient = createAuthClient({
  plugins: [twoFactorClient(), organizationClient()],
});

/**
 * Example login component demonstrating social login and session state.
 */
export function AuthDemo() {
  const { data: session, isPending, error } = authClient.useSession();

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/dashboard',
    });
  };

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = '/login';
        },
      },
    });
  };

  if (isPending) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-8">
      {session ? (
        <>
          <p className="text-lg">
            Welcome, <strong>{session.user.name}</strong>
          </p>
          <p className="text-muted-foreground text-sm">
            Email: {session.user.email}
          </p>
          <button
            onClick={handleSignOut}
            className="rounded bg-destructive px-4 py-2 text-destructive-foreground"
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          <p>Please sign in to continue.</p>
          <button
            onClick={handleGoogleSignIn}
            className="rounded bg-primary px-4 py-2 text-primary-foreground"
          >
            Sign in with Google
          </button>
        </>
      )}
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  );
}
