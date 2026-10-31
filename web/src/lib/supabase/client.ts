import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for use in browser components.
 *
 * Uses NEXT_PUBLIC_ environment variables (safe for the browser).
 * Call this in client components (files with "use client").
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. " +
        "Copy .env.example to .env.local and fill in your credentials."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
