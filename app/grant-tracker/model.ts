export const statuses = ["Researching", "Preparing", "Submitted", "Awarded", "Declined", "Withdrawn"] as const;
export type Status = typeof statuses[number];
export type ResourceLink = { label: string; url: string };
export type Grant = {
  id: string; title: string; funder: string; status: Status; program: string;
  requested_amount: number | null; awarded_amount: number | null; received_amount: number | null;
  opens_on: string | null; deadline: string | null; deadline_details: string;
  submitted_on: string | null; decision_on: string | null; reporting_on: string | null;
  project_starts_on: string | null; project_ends_on: string | null;
  website_url: string; application_url: string; contact_name: string; contact_email: string;
  eligibility: string; restrictions: string; notes: string; links: ResourceLink[];
  archived_at: string | null; created_at: string; updated_at: string;
};
export type Task = { id: string; grant_id: string; title: string; due_on: string | null; completed: boolean; updated_at: string };
export type GrantDraft = Omit<Grant, "id" | "created_at" | "updated_at" | "archived_at">;
export type Reminder = { id: string; grantId: string; grantTitle: string; title: string; date: string; kind: string; days: number };

export function emptyGrant(): GrantDraft {
  return { title: "", funder: "", status: "Researching", program: "", requested_amount: null, awarded_amount: null, received_amount: null,
    opens_on: null, deadline: null, deadline_details: "", submitted_on: null, decision_on: null, reporting_on: null,
    project_starts_on: null, project_ends_on: null, website_url: "", application_url: "", contact_name: "", contact_email: "",
    eligibility: "", restrictions: "", notes: "", links: [] };
}
export function safeUrl(value: string): string | null {
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : null; }
  catch { return null; }
}
export function dateLabel(value: string | null) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value + "T12:00:00Z"));
}
export function todayInChicago(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const part = (type: string) => parts.find(p => p.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
export function daysFrom(date: string, today = todayInChicago()) {
  return Math.round((Date.parse(date + "T12:00:00Z") - Date.parse(today + "T12:00:00Z")) / 86400000);
}
export function money(value: number | null) {
  return value == null ? "Not set" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
}
export function remindersFor(grants: Grant[], tasks: Task[], today = todayInChicago()): Reminder[] {
  const result: Reminder[] = [];
  for (const grant of grants.filter(g => !g.archived_at && !["Declined", "Withdrawn"].includes(g.status))) {
    const add = (kind: string, title: string, date: string | null, id = kind) => {
      if (date) result.push({ id: `${grant.id}-${id}`, grantId: grant.id, grantTitle: grant.title, title, date, kind, days: daysFrom(date, today) });
    };
    if (["Researching", "Preparing"].includes(grant.status)) add("Application", "Application deadline", grant.deadline);
    if (grant.status === "Submitted") add("Decision", "Expected decision · follow up", grant.decision_on);
    if (grant.status === "Awarded") add("Reporting", "Report due", grant.reporting_on);
    for (const task of tasks.filter(t => t.grant_id === grant.id && !t.completed)) add("Task", task.title, task.due_on, task.id);
  }
  return result.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
}
export function validateGrant(grant: GrantDraft) {
  if (!grant.title.trim() || !grant.funder.trim()) return "Enter a grant name and funder.";
  if (!statuses.includes(grant.status)) return "Choose a valid status.";
  for (const value of [grant.requested_amount, grant.awarded_amount, grant.received_amount]) {
    if (value !== null && (!Number.isFinite(value) || value < 0 || value > 9999999999.99 || Math.abs(value * 100 - Math.round(value * 100)) > .001)) return "Amounts must be positive USD values (or zero) with no more than two decimal places.";
  }
  for (const link of [grant.website_url, grant.application_url, ...grant.links.map(l => l.url)]) {
    if (link && !safeUrl(link)) return "Links must begin with https:// or http:// and cannot contain passwords.";
  }
  if (grant.links.some(l => !l.label.trim() || !l.url.trim())) return "Give each document link a name and URL, or remove the empty row.";
  if (grant.project_starts_on && grant.project_ends_on && grant.project_starts_on > grant.project_ends_on) return "The project end date cannot be before its start date.";
  if (grant.opens_on && grant.deadline && grant.opens_on > grant.deadline) return "The application deadline cannot be before the opening date.";
  return null;
}
// Prevent a downloaded cell from being interpreted as a spreadsheet formula.
export function csvCell(value: unknown) {
  const raw = value == null ? "" : String(value);
  const safe = /^[\s]*[=+@-]/.test(raw) || /^[\t\r\n]/.test(raw) ? "'" + raw : raw;
  return '"' + safe.replaceAll('"', '""') + '"';
}
export function grantsCsv(grants: Grant[]) {
  const keys: (keyof Grant)[] = ["title", "funder", "status", "program", "requested_amount", "awarded_amount", "received_amount", "opens_on", "deadline", "deadline_details", "submitted_on", "decision_on", "reporting_on", "project_starts_on", "project_ends_on", "website_url", "application_url", "contact_name", "contact_email", "eligibility", "restrictions", "notes", "archived_at"];
  return [keys.map(csvCell).join(","), ...grants.map(g => keys.map(k => csvCell(g[k])).join(","))].join("\r\n");
}
