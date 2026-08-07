import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * The allowlist of accounts the studio accepts — comma-separated in
 * NEXT_PUBLIC_OWNER_EMAILS. Keep it in sync with the email list in
 * supabase/setup.sql — the database policies are the real enforcement;
 * this only gates the UI.
 */
export const OWNER_EMAILS = (
  process.env.NEXT_PUBLIC_OWNER_EMAILS ??
  process.env.NEXT_PUBLIC_OWNER_EMAIL ??
  ""
)
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isOwnerEmail(email: string | null | undefined): boolean {
  return Boolean(email && OWNER_EMAILS.includes(email.toLowerCase()));
}

export function supabaseEnabled(): boolean {
  return Boolean(url && anonKey);
}

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(url!, anonKey!);
  }
  return client;
}
