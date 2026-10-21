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
