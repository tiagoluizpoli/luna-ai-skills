// @ts-nocheck
"use client";

import { createAuthClient } from "better-auth/client";
import { twoFactorClient } from "better-auth/plugins/two-factor/client";
import { organizationClient } from "better-auth/plugins/organization/client";

// Initialize the client with plugins
const authClient = createAuthClient({
    plugins: [
        twoFactorClient(),
        organizationClient(),
    ],
});

/**
 * Example login component demonstrating social login and session state.
 */
export function AuthDemo() {
    const { data: session, isPending, error } = authClient.useSession();

    const handleGoogleSignIn = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/dashboard",
        });
    };

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    window.location.href = "/login";
                },
            },
        });
    };

    if (isPending) return <div>Loading...</div>;

    return (
        <div className="flex flex-col gap-4 p-8 border rounded-lg">
            {session ? (
                <>
                    <p className="text-lg">Welcome, <strong>{session.user.name}</strong></p>
                    <p className="text-sm text-muted-foreground">Email: {session.user.email}</p>
                    <button 
                        onClick={handleSignOut}
                        className="px-4 py-2 bg-destructive text-destructive-foreground rounded"
                    >
                        Sign Out
                    </button>
                </>
            ) : (
                <>
                    <p>Please sign in to continue.</p>
                    <button 
                        onClick={handleGoogleSignIn}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded"
                    >
                        Sign in with Google
                    </button>
                </>
            )}
            {error && <p className="text-red-500">{error.message}</p>}
        </div>
    );
}
