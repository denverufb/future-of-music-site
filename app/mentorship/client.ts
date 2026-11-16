import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// This is a public browser key. Database access is protected by the RLS
// policies in supabase/mentorship-portal-setup.sql.
const projectUrl = "https://jfbxmmsidkljpecktusy.supabase.co";
const publishableKey = "sb_publishable_7faanD-Y_384Flwtj81gcg_zvHAUdpQ";

let client: SupabaseClient | undefined;

export function getMentorshipClient() {
  if (typeof window === "undefined") {
    throw new Error("Mentorship sign-in needs a browser.");
  }

  client ??= createClient(projectUrl, publishableKey, {
    auth: {
      storage: window.localStorage,
      storageKey: "fom-mentorship-session",
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return client;
}
