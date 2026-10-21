import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Publishable identifiers, not administrative credentials. RLS is required.
export const projectUrl = "https://jfbxmmsidkljpecktusy.supabase.co";
const publishableKey = "sb_publishable_7faanD-Y_384Flwtj81gcg_zvHAUdpQ";
let client: SupabaseClient | undefined;

export function getClient() {
  if (typeof window === "undefined") throw new Error("Grant sign-in requires a browser.");
  client ??= createClient(projectUrl, publishableKey, {
    auth: {
      storage: window.sessionStorage,
      storageKey: "fom-grant-session",
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return client;
}
