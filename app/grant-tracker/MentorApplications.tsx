"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getClient } from "./client";
import styles from "./mentor-applications.module.css";

type ApplicationStatus = "submitted" | "reviewing" | "accepted" | "declined";

type MentorApplication = {
  id: string;
  full_name: string;
  date_of_birth: string;
  phone: string;
  email: string;
  school: string;
  salutation: string;
  career_path: string;
  why_mentor: string;
  status: ApplicationStatus;
  submitted_at: string;
  updated_at: string;
};

const statusLabel: Record<ApplicationStatus, string> = {
  submitted: "New",
  reviewing: "Reviewing",
  accepted: "Accepted",
  declined: "Not selected",
};

function errorText(error: unknown) {
  const issue = error as { code?: string; message?: string };
  if (issue.code === "42P01" || issue.code === "PGRST205") {
    return "Mentor applications are ready on the website, but the private application inbox needs its one-time Supabase setup before it can receive records.";
  }
  if (issue.code === "42501") return "This account does not have permission to review mentor applications.";
  return issue.message || "Mentor applications could not be loaded. Please try again.";
}

function dateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function dateOnly(value: string) {
  if (!value) return "—";
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(year, month - 1, day));
}

function ageFrom(dateOfBirth: string) {
  if (!dateOfBirth) return "—";
  const born = new Date(`${dateOfBirth}T12:00:00`);
  const today = new Date();
  let age = today.getFullYear() - born.getFullYear();
  const monthDifference = today.getMonth() - born.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < born.getDate())) age -= 1;
  return `${age}`;
}

export default function MentorApplications() {
  const [applications, setApplications] = useState<MentorApplication[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("submitted");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: issue } = await getClient()
        .from("mentorship_mentor_applications")
        .select("id,full_name,date_of_birth,phone,email,school,salutation,career_path,why_mentor,status,submitted_at,updated_at")
        .order("submitted_at", { ascending: false });
      if (issue) throw issue;
      const records = (data || []) as MentorApplication[];
      setApplications(records);
      setSelectedId(current => current && records.some(record => record.id === current) ? current : records[0]?.id || null);
    } catch (issue) {
      setApplications([]);
      setSelectedId(null);
      setError(errorText(issue));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const visible = useMemo(
    () => filter === "all" ? applications : applications.filter(application => application.status === filter),
    [applications, filter],
  );
  const selected = applications.find(application => application.id === selectedId) || null;
  const counts = useMemo(() => ({
    submitted: applications.filter(application => application.status === "submitted").length,
    reviewing: applications.filter(application => application.status === "reviewing").length,
    accepted: applications.filter(application => application.status === "accepted").length,
  }), [applications]);

  async function updateStatus(application: MentorApplication, status: ApplicationStatus) {
    if (busy || status === application.status) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const { data, error: issue } = await getClient()
        .from("mentorship_mentor_applications")
        .update({ status })
        .eq("id", application.id)
        .eq("updated_at", application.updated_at)
        .select("id,full_name,date_of_birth,phone,email,school,salutation,career_path,why_mentor,status,submitted_at,updated_at")
        .maybeSingle();
      if (issue) throw issue;
      if (!data) throw new Error("This application changed in another session. Refresh it before making another update.");
      const saved = data as MentorApplication;
      setApplications(current => current.map(record => record.id === saved.id ? saved : record));
      setNotice(`${saved.full_name} is now marked ${statusLabel[status].toLowerCase()}.`);
    } catch (issue) {
      setError(errorText(issue));
    } finally {
      setBusy(false);
    }
  }

  async function remove(application: MentorApplication) {
    if (busy || !window.confirm(`Remove ${application.full_name}'s application permanently? This cannot be undone.`)) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const { error: issue } = await getClient()
        .from("mentorship_mentor_applications")
        .delete()
        .eq("id", application.id)
        .eq("updated_at", application.updated_at);
      if (issue) throw issue;
      setApplications(current => current.filter(record => record.id !== application.id));
      setSelectedId(current => current === application.id ? null : current);
      setNotice("Application removed.");
    } catch (issue) {
      setError(errorText(issue));
    } finally {
      setBusy(false);
    }
  }

  return <section className={styles.section} aria-labelledby="mentor-applications-title">
    <header className={styles.heading}>
      <div>
        <p>Mentorship hiring</p>
        <h2 id="mentor-applications-title">Youth Development Mentor applications</h2>
        <span>Private submissions from the public Future of Music team page.</span>
      </div>
      <button type="button" onClick={() => void load()} disabled={loading || busy}>{loading ? "Refreshing…" : "Refresh inbox"}</button>
    </header>

    {error && <p className={styles.error} role="alert">{error}</p>}
    {notice && <p className={styles.notice} role="status">{notice}</p>}

    <div className={styles.summary} aria-label="Mentor application summary">
      <button type="button" aria-pressed={filter === "submitted"} onClick={() => setFilter("submitted")}><strong>{counts.submitted}</strong><span>New</span></button>
      <button type="button" aria-pressed={filter === "reviewing"} onClick={() => setFilter("reviewing")}><strong>{counts.reviewing}</strong><span>Reviewing</span></button>
      <button type="button" aria-pressed={filter === "accepted"} onClick={() => setFilter("accepted")}><strong>{counts.accepted}</strong><span>Accepted</span></button>
      <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")}><strong>{applications.length}</strong><span>All records</span></button>
    </div>

    <div className={styles.inbox}>
      <div className={styles.list} aria-label="Mentor applications">
        <div className={styles.listTop}><h3>{filter === "all" ? "All applications" : statusLabel[filter]}</h3><span>{visible.length} {visible.length === 1 ? "record" : "records"}</span></div>
        {loading ? <p className={styles.empty}>Loading applications…</p> : visible.length ? <ul>{visible.map(application => <li key={application.id}>
          <button type="button" aria-current={selected?.id === application.id ? "true" : undefined} onClick={() => setSelectedId(application.id)}>
            <span><strong>{application.full_name}</strong><small>{application.school}</small></span>
            <span className={styles.status} data-status={application.status}>{statusLabel[application.status]}</span>
            <time dateTime={application.submitted_at}>{dateTime(application.submitted_at)}</time>
          </button>
        </li>)}</ul> : <p className={styles.empty}>No applications in this view yet.</p>}
      </div>

      <article className={styles.detail} aria-live="polite">
        {selected ? <>
          <header>
            <div><p>Applicant</p><h3>{selected.full_name}</h3><span>Submitted {dateTime(selected.submitted_at)}</span></div>
            <label>Review status<select value={selected.status} disabled={busy} onChange={event => void updateStatus(selected, event.target.value as ApplicationStatus)}>
              {Object.entries(statusLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select></label>
          </header>
          <dl className={styles.facts}>
            <div><dt>Email</dt><dd><a href={`mailto:${selected.email}`}>{selected.email}</a></dd></div>
            <div><dt>Phone</dt><dd><a href={`tel:${selected.phone.replace(/[^+\d]/g, "")}`}>{selected.phone}</a></dd></div>
            <div><dt>School</dt><dd>{selected.school}</dd></div>
            <div><dt>Date of birth</dt><dd>{dateOnly(selected.date_of_birth)} <small>Age {ageFrom(selected.date_of_birth)}</small></dd></div>
            <div><dt>Salutation</dt><dd>{selected.salutation || "Not provided"}</dd></div>
            <div><dt>Career path</dt><dd>{selected.career_path}</dd></div>
          </dl>
          <section className={styles.response}><h4>Why they want to mentor</h4><p>{selected.why_mentor}</p></section>
          <footer><button type="button" className={styles.remove} onClick={() => void remove(selected)} disabled={busy}>Remove application</button></footer>
        </> : <div className={styles.emptyDetail}><h3>Select an application</h3><p>Its full details will appear here without leaving Program Administration.</p></div>}
      </article>
    </div>
  </section>;
}
