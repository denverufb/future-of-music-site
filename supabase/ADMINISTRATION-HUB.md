# Administration Hub activation

The app keeps Finance Hub URLs working and adds `/administration-hub/`.
The database stays in the existing Supabase project. Do not create a second project.

The deployed coach-invitation function has the display name `create-program-coach` but the URL slug `dynamic-processor`. The website calls that confirmed URL slug. Its source remains in `functions/create-program-coach/index.ts`; redeploy updates to the existing `dynamic-processor` endpoint.

## One-time activation

1. Run the separately supplied **private** `outputs/program-private/activate-administration-private.sql` in Supabase SQL Editor. It combines the program table setup and JSD import, leaving financial permissions unchanged.
2. Check that its result reports 12 imported students and 16 weekly entries. Five incomplete entries remain drafts. Never upload this file, workbook, student roster, or database exports to Neocities, GitHub, or a public assets folder. The non-private schema alone is `program-administration-setup.sql`.
3. In Supabase Edge Functions, create a function named `create-program-coach` using `functions/create-program-coach/index.ts`. Leave “Verify JWT” enabled, as recommended for signed-in user calls. The handler also independently verifies the bearer token with `auth.getUser()` and checks owner membership on every request. If the gateway reports an authentication error, diagnose the signing-key configuration rather than disabling verification as a first step. The default `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` secrets are supplied by Supabase; do not put them in the browser.
4. In Authentication → URL Configuration, allow the exact redirect URL `https://fomusic.org/administration-hub/?setup=1`. Keep public sign-ups disabled. Retain any existing authorized redirects.
5. Publish the website build only after database setup. Open Administration Hub → Program Administration → Coach accounts. Enter the coach name/email and choose Create coach invitation. Privately share the returned one-time setup link. The coach chooses a password through Change password. For an existing active coach, entering that coach's email again generates a recovery link. Invitations do not require outbound email configuration.

## Access boundaries

- Owner: both areas, rosters/sites, all assessments, private backup, coach access.
- Existing finance viewer: financials only, read-only, no student data.
- Active coach: all program records and feedback results; creates assessments and weekly evaluations; edits only records they created. Owner edits imported evaluations and other coaches' records. Coaches can mark feedback completion but cannot rename/delete roster records or access financials.
- Disabled coach: database read/write access removed immediately on subsequent requests. Previously downloaded records or a page already rendered cannot be remotely erased.
- No public registration, student login, public survey endpoint, or anonymous database access.

Anonymous feedback has no student ID, submitter ID, submission timestamp, or audit link. Named completion tracking is separate. Free-text responses can still identify someone if names or personal details are entered. Staff should omit identifying details. Administrative service logs may record request metadata; do not promise absolute anonymity.

## Source interpretation

JSD roster and four weekly engagement slots are imported without inventing missing dates, ratings, roles, or authors. The workbook counts initials alone as a completed evaluation; the hub requires engagement, role, and initials. Incomplete source entries remain visible as drafts. There are no actual daily attendance marks in the workbook, so none are inferred.

The PDF's 12-question pre/post survey, 11-item skills checklist, and 12-item professional DJ review retain their response scales. Professional “Not observed” is distinct from “Starting.” Reviewer/artist typed names are acknowledgments, not verified digital signatures. The spreadsheet's anonymous post-survey is separate from the PDF's participant-linked post survey.

Use separate site/program entries for a new cohort so four-week histories remain distinct. The hub compares the latest pre/post forms per participant, not a standardized or validated test score. Professional reviews are coaching tools, not disciplinary or employment decisions.

## Verification before rollout

Run the program model/database tests and existing financial tests. With test accounts, verify owner access, coach inability to access financial tables/receipts, finance viewer inability to read program tables, account disabling, and a real invitation/password setup. Do not use real student data in screenshots or public previews.
