# FOM Finance Hub

The private workspace at `/finance-hub/` combines grants with operating finances. The previous `/grant-tracker/` address remains usable. Both use the same Supabase membership and sign-in. There is no public registration UI or tracking/advertising script on either route.

## Activate

Run `finance-hub-setup.sql` after the grant setup. It adds private transactions, annual category budgets, and an append-only finance audit trail. Existing owner/viewer memberships apply to both grants and finances. Keep Supabase public signups disabled.

For the supplied workbook, the local `scripts/prepare-finance-import.py` creates one activation SQL file in the ignored `outputs/finance-private/` directory. That private file includes the schema and source records. Run it in Supabase SQL Editor. It must never be committed, uploaded into public assets, or shared publicly. The source workbook is not changed. Re-running the same import skips its existing records and preserves subsequent edits. Different-workbook migrations require a new reviewed mapping; do not reuse this one-time import identity for another dataset.

No service-role key or owner password is needed in the website source. The signed-in owner enters data through the site; row-level security enforces access at the database.

## Workbook mapping

- Revenue: date, source, donor/funder, description, program/purpose, amount, restricted flag, status, notes.
- Purchases: date, category, vendor, item/service, program/purpose, payment method, amount, reimbursable flag, paid flag, receipt/notes.
- Budget Setup: calendar-year revenue and expense budgets by category. The supplied workbook does not specify a fiscal year; its budget import uses the single calendar year present in the transaction dates and records that assumption in the budget notes.
- Lists: source/category/payment choices appear as suggestions. Custom categories and payment methods are supported.
- Dashboard: revenue, expenses, surplus/deficit, budget remaining, category comparisons, monthly results, pending receipts, unpaid bills, and noncash amounts.

The Revenue sheet's A1 cell contained a number where the Date header would normally be. It was not imported as a transaction. The private reconciliation file records it for owner review. Source spelling and transaction amounts are preserved. The original workbook remains available unchanged.

## Calculation definitions

- Actual revenue counts only Received entries; Pledged and Pending are separate. Cancelled and voided entries are excluded.
- Expenses count all non-voided purchase/bill entries, paid or unpaid. This matches the workbook's purchase totals.
- Recorded surplus is received revenue minus all expenses. This is an operational report, not an audited financial statement or a full double-entry accounting system.
- Net recorded cash movement excludes in-kind items and unpaid expenses. It is not a bank balance; there is no opening balance, bank feed, or reconciliation service.
- In-kind means the explicit noncash flag, the In-Kind payment method, or the In-Kind Value revenue category.
- Category budget remaining is budget minus actual. Zero is an entered budget; missing budget rows display Not set. Expected-revenue variance uses the same direction, labeled Still to target.
- Monthly and annual reports use the transaction's recorded date and calendar year, as in the source workbook. A payment settled on a different date is not separately dated in this version.
- Restricted receipts are a summary of flagged revenue, not an automatically reconciled remaining restricted-fund balance.
- Linking a finance entry to a grant does not create another transaction or change the grant's manually recorded amounts. Award and received fields in the grant tracker are not added to finance revenue.

## Corrections and exports

Transactions can be edited, voided, and restored. Hard deletion is not granted. Every transaction/budget insert and edit creates a protected audit snapshot. The record view shows its latest 30 changes; a finance backup includes the complete finance audit.

CSV exports include the fields needed for receipts, restrictions, reimbursements, payment status and grant references. The full finance backup includes all finance records (including voided), budgets, finance audit, grants and tasks. Backups are private downloads, not an automatic restore/import mechanism. Document links retain their source service's sharing permissions; the tracker does not upload documents.

Grant reminders remain in-app only. No paid service, background email sender, payroll processor, tax filing, or banking integration is configured.
# Receipt scanning and private originals

Run `supabase/finance-receipts-setup.sql` once in the same Supabase project's SQL Editor. It creates a private 8 MB/image bucket and enforces owner uploads and owner/viewer reads. It is safe to rerun. No new login, paid AI account, or service-role credential is needed. Existing Supabase storage/bandwidth limits still apply.

In Purchases & bills → Add purchase / bill, choose a photo, select Read receipt, review vendor/total/items, and choose Use reviewed details. Select a category and check the date and paid status before Save transaction. JPG, PNG, and WebP are supported; export PDF/HEIC to an image first. OCR is English text recognition plus conservative field parsing, not a general-purpose vision chatbot; handwritten, blurry, or complex receipts need manual correction. It never posts entries automatically.

Tesseract.js runs locally in the browser and downloads its worker/language tools from its default CDN. Receipt pixels are not sent to an OCR provider. If Keep original is selected, Save uploads the original to private Supabase Storage. Uncheck it to scan without storing an image. The database holds a stable private locator; the app creates a 60-second signed link only after an authorized user requests it. Treat that short-lived link as private.

Originals are immutable through the app; replacing a receipt preserves the previous file for history. If upload succeeds but saving the transaction fails, the locator stays in the form for retry without a second upload. Discarding then can leave an unattached private file; administrators can review these in Storage. No automatic deletion occurs. JSON/CSV exports include locators, not image bytes; retain/download originals separately.
