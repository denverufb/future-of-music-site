# Activate the FOM Grant Tracker

The website code is not a security boundary. Do not use real grant data until the SQL has been applied and owner/viewer permissions have been checked.

## 1. Create your login

In the Supabase project, open Authentication. Disable **Allow new users to sign up** in the authentication settings. Open **Users → Add user → Create new user**, enter `aereon@fomusic.org`, set a strong private password, and enable **Auto Confirm User**. Do not send the password in chat or put it in the repository.

## 2. Create the private database

Open **SQL Editor → New query**. Paste the entire contents of `supabase/grant-tracker-setup.sql` and run it. It creates the tables, row-level security, and your owner membership. If your confirmed user is missing, the transaction rolls back without leaving partially secured tables. This script can be run again safely.

No anonymous table access is granted. A signed-in account without a membership sees no records. The owner can create/update/archive grants and manage tasks. Viewers can only read. No client can create/change memberships or write activity logs. Grant deletion is disabled; archive is reversible.

## 3. Optional read-only login

Create a second confirmed user under Authentication → Users, using an email address you control and a different strong password. Replace `VIEWER_EMAIL_HERE` in `supabase/grant-tracker-viewer.sql` with that email and run it. Share only the viewer credentials with intended recipients. A shared login does not identify individual readers. To revoke access, remove that user from `grant_members` using the Supabase Table Editor (not just the UI), then disable/delete the authentication account. Do not share your Supabase dashboard access.

## 4. Verify before storing real records

Sign in at `/grant-tracker/`. Create a temporary test grant and task, refresh, then sign out and back in to confirm persistence. In a private browser window, sign in with the viewer account and check that the same records display without editing controls. Direct viewer API writes must return a permissions error or affect zero rows; unlisted/anonymous requests must not return grant records. Run `supabase/grant-tracker-security-test.sql` in the SQL Editor for database-level checks using simulated roles; all test data is rolled back.

## Notes

- The project URL and `sb_publishable_…` key are public browser configuration. Secret/service-role keys are never required by the website.
- Sessions use sessionStorage for the tab. Sign out on shared devices. No grant records are stored as an offline browser database. Browser tabs opened as duplicates may inherit a copy of sessionStorage; sign out/close each tab on a shared device.
- Deadline reminders appear when the tracker is open, with overdue, today, and upcoming entries. They do not send emails or system notifications when the site is closed. Calendar dates use America/Chicago; record a funder's precise time zone/cutoff in Deadline details.
- Password changes are available after signing in. If you forget the password, reset it through Supabase's user management; no SMTP/email service is required for normal use. The tracker does not depend on email delivery.
- CSV exports contain grant fields; the JSON backup includes grants, tasks, and export metadata. Keep downloads private. A JSON backup is an export, not an automatic restore feature. CSV protects against spreadsheet formula injection.
- Document links point to externally hosted files; protect their sharing permissions separately. File uploads are not included.
- Free Supabase projects can pause after low activity. Restore through Supabase if needed. Export backups regularly. No paid services, unattended reminders, or automatic charges are configured.
- The route is marked noindex, but privacy comes from authentication and row-level security, not search-engine settings.
- Publication should wait until database setup and real access checks succeed. The local application can be previewed before activation.
