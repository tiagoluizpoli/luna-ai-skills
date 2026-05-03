// @ts-nocheck
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Standard Next.js Route Handler for Better Auth.
 * Handles all authentication endpoints (Sign Up, Sign In, Social, Plugins).
 * File path: app/api/auth/[...all]/route.ts
 */
export const { POST, GET } = toNextJsHandler(auth);
