// Server-only. Keep SUPABASE_SERVICE_ROLE_KEY in Supabase Edge Function secrets.
import { createClient } from "npm:@supabase/supabase-js@2.118.0";

const allowedOrigin = "https://fomusic.org";
const cors = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
  Vary: "Origin",
};
const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

Deno.serve(async (request) => {
  if (request.headers.get("origin") && request.headers.get("origin") !== allowedOrigin) return reply(403, { error: "Origin not allowed." });
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (request.method !== "POST") return reply(405, { error: "POST required." });

  try {
    const authorization = request.headers.get("authorization") || "";
    if (!authorization.startsWith("Bearer ")) return reply(401, { error: "Sign in first." });
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: identity, error: authError } = await admin.auth.getUser(authorization.slice(7));
    if (authError || !identity.user) return reply(401, { error: "Sign in again." });

    const { data: actor, error: actorError } = await admin.from("mentorship_profiles").select("role,active").eq("user_id", identity.user.id).maybeSingle();
    if (actorError || actor?.role !== "admin" || !actor.active) return reply(403, { error: "Only a mentorship administrator can send invitations." });

    const raw = await request.text();
    if (raw.length > 2_000) return reply(400, { error: "Request is too large." });
    const body = JSON.parse(raw) as { name?: unknown; email?: unknown; role?: unknown; student_id?: unknown };
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const role = String(body.role || "");
    const studentId = body.student_id ? String(body.student_id) : null;
    if (!emailPattern.test(email) || email.length > 320 || name.length < 1 || name.length > 200) return reply(400, { error: "Enter a valid name and email." });
    if (!["mentor", "mentee", "supervisor"].includes(role)) return reply(400, { error: "Choose mentor, mentee, or supervisor access." });
    if (role === "mentee" && (!studentId || !uuidPattern.test(studentId))) return reply(400, { error: "Choose the participant record for this mentee." });
    if (role !== "mentee" && studentId) return reply(400, { error: "Only mentee accounts can be linked to a participant record." });

    const { data: existingProfile, error: profileError } = await admin.from("mentorship_profiles").select("user_id").eq("email", email).maybeSingle();
    if (profileError) return reply(500, { error: "Could not check existing mentorship access." });
    if (existingProfile) return reply(409, { error: "This email already has mentorship access." });

    if (studentId) {
      const { data: student, error: studentError } = await admin.from("mentorship_students").select("id,account_id").eq("id", studentId).maybeSingle();
      if (studentError || !student) return reply(404, { error: "That participant record no longer exists." });
      if (student.account_id) return reply(409, { error: "That participant already has a portal account." });
    }

    const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, { data: { display_name: name }, redirectTo: `${allowedOrigin}/mentorship/` });
    if (inviteError || !invited.user) return reply(400, { error: "Could not send an invitation. Check the email and try again." });

    const { error: saveProfileError } = await admin.from("mentorship_profiles").insert({ user_id: invited.user.id, display_name: name, email, role, active: true });
    if (saveProfileError) return reply(500, { error: "The invitation was created, but program access could not be saved. Contact Future of Music before sending another invite." });

    if (studentId) {
      const { data: linked, error: linkError } = await admin.from("mentorship_students").update({ account_id: invited.user.id }).eq("id", studentId).is("account_id", null).select("id");
      if (linkError || !linked?.length) return reply(500, { error: "The invitation was created, but the participant could not be linked. Contact Future of Music before retrying." });
    }

    return reply(200, { ok: true });
  } catch {
    return reply(500, { error: "The invitation could not be completed. No account details were shared." });
  }
});
