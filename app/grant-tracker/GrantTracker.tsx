"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { getClient } from "./client";
import { dateLabel, emptyGrant, grantsCsv, money, remindersFor, safeUrl, statuses, todayInChicago, validateGrant, type Grant, type GrantDraft, type Task } from "./model";
import styles from "./tracker.module.css";
import FinanceWorkspace from './FinanceWorkspace';

type Activity = { id: string; action: string; created_at: string };
type Tab = "overview" | "grants" | "deadlines" | "finance";
type Role = "owner" | "viewer";

function errorText(error: unknown) {
  const e = error as { code?: string; message?: string };
  if (e.code === "42P01" || e.code === "PGRST205") return "The private database still needs its one-time setup. No records have been saved. Follow the supplied Supabase setup instructions.";
  if (e.code === "42501") return "Your account does not have permission for this action. Ask the owner to check your access.";
  if (e.message?.includes("Failed to fetch") || e.message?.includes("Network")) return "Could not reach the database. Check your connection or whether the Supabase project is paused. Your unsaved form is still here.";
  return e.message || "Something went wrong. Please try again.";
}
function download(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function fetchRows<T>(table: "grants" | "grant_tasks"): Promise<T[]> {
  const result: T[] = [];
  for (let from = 0; ; from += 500) {
    const { data, error } = await getClient().from(table).select("*").order("id").range(from, from + 499);
    if (error) throw error;
    result.push(...(data || []) as T[]);
    if (!data || data.length < 500) return result;
  }
}
function Resource({ href, children }: { href: string; children: React.ReactNode }) {
  const url = safeUrl(href);
  return url ? <a href={url} target="_blank" rel="noopener noreferrer">{children} ↗</a> : <span>{children} (invalid link)</span>;
}

export default function GrantTracker() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [tab, setTab] = useState<Tab>("finance");
  const [financeDirty, setFinanceDirty] = useState(false);
  const [financeBusy, setFinanceBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [showArchived, setShowArchived] = useState(false);
  const [sort, setSort] = useState("deadline");
  const [panel, setPanel] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<GrantDraft>(emptyGrant());
  const [baseVersion, setBaseVersion] = useState("");
  const [dirty, setDirty] = useState(false);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [activityError, setActivityError] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [passwordPanel, setPasswordPanel] = useState(false);
  const [today, setToday] = useState(todayInChicago());
  const generation = useRef(0);
  const activityFor = useRef<string | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const userId = session?.user.id;
  const isOwner = role === "owner";
  const selected = grants.find(g => g.id === panel);

  useEffect(() => {
    let mounted = true;
    try {
      const { data } = getClient().auth.onAuthStateChange((event, value) => {
        if (!mounted) return;
        setSession(value); setAuthReady(true);
        if (event === "PASSWORD_RECOVERY") setPasswordPanel(true);
        if (!value) {
          generation.current++; activityFor.current = null;
          setRole(null); setGrants([]); setTasks([]); setPanel(null); setDraft(emptyGrant()); setDirty(false); setActivity([]); setPasswordPanel(false);
          setSearch(""); setStatusFilter("All statuses"); setShowArchived(false); setSort("deadline"); setTab("finance"); setTaskName(""); setTaskDate(""); setNotice(""); setError("");
        }
      });
      return () => { mounted = false; data.subscription.unsubscribe(); };
    } catch (e) { setError(errorText(e)); setAuthReady(true); }
  }, []);

  const load = useCallback(async () => {
    if (!userId) return;
    const current = ++generation.current;
    setLoading(true); setError("");
    try {
      const member = await getClient().from("grant_members").select("role").eq("user_id", userId).maybeSingle();
      if (member.error) throw member.error;
      if (!member.data || !["owner", "viewer"].includes(member.data.role)) throw new Error("This login has not been given access to the FOM grant workspace. The owner must assign access in Supabase.");
      const [nextGrants, nextTasks] = await Promise.all([fetchRows<Grant>("grants"), fetchRows<Task>("grant_tasks")]);
      if (current !== generation.current) return;
      setRole(member.data.role as Role); setGrants(nextGrants); setTasks(nextTasks);
    } catch (e) {
      if (current === generation.current) { setError(errorText(e)); setRole(null); setGrants([]); setTasks([]); }
    } finally { if (current === generation.current) setLoading(false); }
  }, [userId]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const timer = setInterval(() => setToday(todayInChicago()), 60000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!dirty && !financeDirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, financeDirty]);
  useEffect(() => { if (panel) heading.current?.focus(); }, [panel]);
  useEffect(() => {
    if (selected && !editing) { setDraft(selected); setBaseVersion(selected.updated_at); }
  }, [selected, editing]);

  async function loadActivity(id: string) {
    const current = generation.current;
    activityFor.current = id;
    const { data, error: issue } = await getClient().from("grant_activity").select("id,action,created_at").eq("grant_id", id).order("created_at", { ascending: false }).limit(30);
    if (current !== generation.current || activityFor.current !== id) return;
    setActivityError(issue ? "Recent activity could not be loaded." : "");
    setActivity((data || []) as Activity[]);
  }
  function canLeave() { return !financeBusy && (!(dirty || financeDirty) || window.confirm("Discard your unsaved changes?")); }
  function openGrant(grant?: Grant) {
    if (!canLeave()) return;
    setDraft(grant ? { ...emptyGrant(), ...grant, links: grant.links.map(l => ({ ...l })) } : emptyGrant());
    setPanel(grant?.id || "new"); setBaseVersion(grant?.updated_at || ""); setEditing(!grant); setDirty(false);
    setError(""); setNotice(""); setTaskName(""); setTaskDate(""); setActivity([]); setActivityError("");
    if (grant) void loadActivity(grant.id);
  }
  function switchTab(next: Tab) {
    if (busy || !canLeave()) return;
    setPanel(null); setDirty(false); setEditing(false); setTab(next); setError(""); setNotice("");
  }
  function update<K extends keyof GrantDraft>(key: K, value: GrantDraft[K]) {
    setDraft(prev => ({ ...prev, [key]: value })); setDirty(true);
  }
  async function signOut() {
    if (!canLeave()) return;
    setBusy(true); setError("");
    try {
      const { error: issue } = await getClient().auth.signOut({ scope: "local" });
      if (issue) throw issue;
      setNotice("");
    } catch (e) { setError(errorText(e)); } finally { setBusy(false); }
  }
  async function saveGrant(event: FormEvent) {
    event.preventDefault();
    if (!isOwner || busy) return;
    const invalid = validateGrant(draft);
    if (invalid) { setError(invalid); return; }
    // Whitelist fields; never send metadata from a fetched record back to the database.
    const payload = Object.fromEntries(Object.keys(emptyGrant()).map(key => [key, draft[key as keyof GrantDraft]]));
    payload.title = draft.title.trim(); payload.funder = draft.funder.trim();
    setBusy(true); setError(""); setNotice("");
    const current = generation.current;
    try {
      const query = panel === "new" ? getClient().from("grants").insert(payload) : getClient().from("grants").update(payload).eq("id", panel!).eq("updated_at", baseVersion);
      const { data, error: issue } = await query.select().maybeSingle();
      if (current !== generation.current) return;
      if (issue) throw issue;
      if (!data) throw new Error("This grant changed in another session, or your editing access changed. Your draft is preserved. Copy your unsaved text, then reload the grant before saving again.");
      const saved = data as Grant;
      setGrants(prev => [...prev.filter(g => g.id !== saved.id), saved]);
      setPanel(saved.id); setDraft(saved); setBaseVersion(saved.updated_at); setDirty(false); setEditing(false); setNotice("Grant saved.");
      void loadActivity(saved.id);
    } catch (e) { setError(errorText(e)); } finally { setBusy(false); }
  }
  async function archive() {
    if (!selected || !isOwner || busy || !canLeave()) return;
    const action = selected.archived_at ? "Restore" : "Archive";
    if (!window.confirm(`${action} “${selected.title}”? Archived records stay available in the archive.`)) return;
    setBusy(true); setError("");
    try {
      const { data, error: issue } = await getClient().from("grants").update({ archived_at: selected.archived_at ? null : new Date().toISOString() }).eq("id", selected.id).eq("updated_at", selected.updated_at).select().maybeSingle();
      if (issue) throw issue;
      if (!data) throw new Error("This grant changed or access was removed. Refresh before trying again.");
      setGrants(prev => prev.map(g => g.id === data.id ? data as Grant : g));
      setPanel(null); setDirty(false); setNotice(`Grant ${action === "Restore" ? "restored" : "archived"}.`);
    } catch (e) { setError(errorText(e)); } finally { setBusy(false); }
  }
  async function taskAction(task?: Task, remove = false) {
    if (!isOwner || !selected || busy) return;
    if (!task && !taskName.trim()) return;
    if (remove && !window.confirm("Remove this task? This cannot be undone.")) return;
    setBusy(true); setError("");
    try {
      const query = !task ? getClient().from("grant_tasks").insert({ grant_id: selected.id, title: taskName.trim(), due_on: taskDate || null })
        : remove ? getClient().from("grant_tasks").delete().eq("id", task.id).eq("updated_at", task.updated_at)
          : getClient().from("grant_tasks").update({ completed: !task.completed }).eq("id", task.id).eq("updated_at", task.updated_at);
      const { data, error: issue } = await query.select().maybeSingle();
      if (issue) throw issue;
      if (!data) throw new Error("The task changed or your access changed. Refresh and try again.");
      setTasks(prev => remove ? prev.filter(t => t.id !== data.id) : [...prev.filter(t => t.id !== data.id), data as Task]);
      if (!task) { setTaskName(""); setTaskDate(""); }
      setNotice(remove ? "Task removed." : "Task saved."); void loadActivity(selected.id);
    } catch (e) { setError(errorText(e)); } finally { setBusy(false); }
  }

  const activeGrants = grants.filter(g => !g.archived_at);
  const reminders = remindersFor(grants, tasks, today);
  const overdue = reminders.filter(r => r.days < 0);
  const upcoming = reminders.filter(r => r.days >= 0 && r.days <= 30);
  const filtered = grants.filter(g => Boolean(g.archived_at) === showArchived && (statusFilter === "All statuses" || statusFilter === g.status) && [g.title, g.funder, g.program, g.contact_name, g.notes].join(" ").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "amount" ? (b.requested_amount || 0) - (a.requested_amount || 0) : sort === "name" ? a.title.localeCompare(b.title) : sort === "updated" ? b.updated_at.localeCompare(a.updated_at) : (a.deadline || "9999").localeCompare(b.deadline || "9999"));
  const sum = (key: "requested_amount" | "awarded_amount" | "received_amount", list = activeGrants) => list.reduce((n, g) => n + Number(g[key] || 0), 0);
  const alert = <>{error && <div className={styles.error} role="alert">{error}</div>}{notice && <div className={styles.notice} role="status">{notice}</div>}</>;
  const remindersList = (list: typeof reminders) => list.length ? <ul className={styles.reminders}>{list.map(r => <li key={r.id}><div><span className={r.days < 0 ? styles.overdue : styles.eyebrow}>{r.kind} · {r.days < 0 ? `${Math.abs(r.days)} days overdue` : r.days === 0 ? "Today" : `In ${r.days} day${r.days === 1 ? "" : "s"}`}</span><button className={styles.textButton} onClick={() => openGrant(grants.find(g => g.id === r.grantId))}>{r.grantTitle}</button><p>{r.title}</p></div><time dateTime={r.date}>{dateLabel(r.date)}</time></li>)}</ul> : <p className={styles.emptySmall}>Nothing due here. Add dates to your grants or tasks to see reminders.</p>;

  return <div className={styles.app}>
    <a className="skip-link" href="#main-content">Skip to finance workspace</a>
    <header className={styles.header}><a href="/" aria-label="Future of Music home"><img src="/images/logo.png" alt="Future of Music" /></a><span>FOM Finance Hub</span><a href="/">Back to website ↗</a></header>
    <main id="main-content" className={styles.main}>
      {!authReady ? <p role="status">Checking your session…</p> : !session ? <div className={styles.loginLayout}>
        <section className={styles.loginIntro}><p className={styles.eyebrow}>FUTURE OF MUSIC · PRIVATE WORKSPACE</p><h1>More room<br />for what’s next.</h1><p>A clear view of the funding that supports our music, mentorship, and youth programs.</p><div className={styles.loginFeatures}><span>01 / Revenue & purchases</span><span>02 / Budgets & reports</span><span>03 / Grants & deadlines</span></div><p className={styles.muted}>For authorized FOM users only.</p></section>
        <section className={styles.loginForm}><p className={styles.eyebrow}>SECURE ACCESS</p><h2>Sign in to Finance Hub.</h2><p>Your login determines whether you can edit or only view records.</p>{alert}<LoginForm onError={setError} busy={busy} setBusy={setBusy} /><p className={styles.small}>Need access or a password reset? Contact the workspace owner. There is no public registration.</p></section>
      </div> : <>
        <div className={styles.workspaceHeading}><div><p className={styles.eyebrow}>FUTURE OF MUSIC / GRANTS & FINANCES</p><h1>FOM Finance Hub</h1><p>{session.user.email} <span className={styles.badge}>{role === "owner" ? "Owner · can edit" : role === "viewer" ? "View only" : "Checking access"}</span></p></div><div className={styles.actions}><button onClick={() => { if (canLeave()) { setPanel(null); setDirty(false); setPasswordPanel(!passwordPanel); } }} disabled={busy || financeBusy}>Change password</button><button onClick={signOut} disabled={busy || financeBusy}>Sign out</button></div></div>
        {alert}
        {passwordPanel ? <PasswordForm onDone={() => { setPasswordPanel(false); setNotice("Password updated."); }} onCancel={() => setPasswordPanel(false)} onError={setError} /> : <>
          {!role ? <section className={styles.empty}><h2>{loading ? "Opening your workspace…" : "Access is not ready yet."}</h2><p>{loading ? "Loading your saved grants securely." : "Your account and private database must be set up before grant records can be opened."}</p><button onClick={() => void load()} disabled={loading}>Check again</button></section> : <>
            <nav className={styles.tabs} aria-label="Finance hub"><button aria-current={!panel && tab === "finance" ? "page" : undefined} onClick={() => switchTab("finance")}>Finances</button><button aria-current={!panel && tab === "overview" ? "page" : undefined} onClick={() => switchTab("overview")}>Grant overview</button><button aria-current={!panel && tab === "grants" ? "page" : undefined} onClick={() => switchTab("grants")}>All grants <span>{activeGrants.length}</span></button><button aria-current={!panel && tab === "deadlines" ? "page" : undefined} onClick={() => switchTab("deadlines")}>Deadlines {overdue.length > 0 && <span>{overdue.length} overdue</span>}</button><button disabled={busy || financeBusy || loading || dirty || financeDirty} onClick={() => void load()}>{loading ? "Refreshing…" : "Refresh grants"}</button></nav>
            {panel ? <section>
              <div className={styles.detailHeading}><div><button className={styles.textButton} onClick={() => switchTab("grants")}>← Back to grants</button><h2 ref={heading} tabIndex={-1}>{panel === "new" ? "New grant" : selected?.title || "Grant details"}</h2>{selected?.archived_at && <p className={styles.badge}>Archived</p>}</div><div className={styles.actions}>{isOwner && !editing && <button className={styles.primary} onClick={() => { if (selected) { setDraft(selected); setBaseVersion(selected.updated_at); } setEditing(true); }}>Edit grant</button>}{isOwner && selected && <button disabled={busy} onClick={archive}>{selected.archived_at ? "Restore grant" : "Archive grant"}</button>}</div></div>
              {!editing && selected && <div className={styles.resourceBar}>{selected.website_url && <Resource href={selected.website_url}>Funder website</Resource>}{selected.application_url && <Resource href={selected.application_url}>Application portal</Resource>}{selected.links.map((l, i) => <Resource href={l.url} key={i}>{l.label}</Resource>)}</div>}
              <form onSubmit={saveGrant} className={styles.grantForm}>
                <fieldset disabled={!editing || !isOwner || busy}>
                  <legend>Opportunity</legend><div className={styles.formGrid}>
                    <label>Grant name *<input required maxLength={200} value={draft.title} onChange={e => update("title", e.target.value)} /></label>
                    <label>Funder / foundation *<input required maxLength={200} value={draft.funder} onChange={e => update("funder", e.target.value)} /></label>
                    <label>Status<select value={draft.status} onChange={e => update("status", e.target.value as GrantDraft["status"])}>{statuses.map(s => <option key={s}>{s}</option>)}</select></label>
                    <label>FOM program / purpose<input maxLength={200} placeholder="e.g. Youth DJ Program" value={draft.program} onChange={e => update("program", e.target.value)} /></label>
                    <label>Funder website<input type="url" maxLength={2000} placeholder="https://" value={draft.website_url} onChange={e => update("website_url", e.target.value)} /></label>
                    <label>Application portal<input type="url" maxLength={2000} placeholder="https://" value={draft.application_url} onChange={e => update("application_url", e.target.value)} /></label>
                  </div>
                </fieldset>
                <fieldset disabled={!editing || !isOwner || busy}><legend>Funding <small>USD</small></legend><div className={styles.formGridThree}>{([['requested_amount', 'Amount requested'], ['awarded_amount', 'Amount awarded'], ['received_amount', 'Amount received']] as const).map(([key, label]) => <label key={key}>{label}<input type="number" min="0" max="9999999999.99" step="0.01" value={draft[key] ?? ""} placeholder="Not set" onChange={e => update(key, e.target.value === "" ? null : Number(e.target.value))} /></label>)}</div></fieldset>
                <fieldset disabled={!editing || !isOwner || busy}><legend>Dates & reporting</legend><div className={styles.formGridThree}>{([['opens_on', 'Applications open'], ['deadline', 'Application deadline'], ['submitted_on', 'Date submitted'], ['decision_on', 'Expected decision'], ['reporting_on', 'Next report due'], ['project_starts_on', 'Project starts'], ['project_ends_on', 'Project ends']] as const).map(([key, label]) => <label key={key}>{label}<input type="date" value={draft[key] || ""} onInput={e => update(key, e.currentTarget.value || null)} /></label>)}</div><label>Deadline details / time zone<input maxLength={500} placeholder="e.g. Due by 5 p.m. Eastern; invitation required" value={draft.deadline_details} onChange={e => update("deadline_details", e.target.value)} /></label></fieldset>
                <fieldset disabled={!editing || !isOwner || busy}><legend>Contact & requirements</legend><div className={styles.formGrid}><label>Contact name<input maxLength={200} value={draft.contact_name} onChange={e => update("contact_name", e.target.value)} /></label><label>Contact email<input type="email" maxLength={320} value={draft.contact_email} onChange={e => update("contact_email", e.target.value)} /></label><label>Eligibility & required materials<textarea rows={4} maxLength={10000} value={draft.eligibility} onChange={e => update("eligibility", e.target.value)} /></label><label>Funding restrictions & reporting requirements<textarea rows={4} maxLength={10000} value={draft.restrictions} onChange={e => update("restrictions", e.target.value)} /></label></div></fieldset>
                <fieldset disabled={!editing || !isOwner || busy}><legend>Notes & document links</legend><label>Working notes<textarea rows={6} maxLength={20000} placeholder="Application ideas, conversations, follow-up notes…" value={draft.notes} onChange={e => update("notes", e.target.value)} /></label><p className={styles.small}>Link to proposals, budgets, award letters, or shared folders. File permissions are managed where the file is stored.</p>{draft.links.map((link, i) => <div className={styles.linkRow} key={i}><label>Document name<input required maxLength={200} value={link.label} onChange={e => update("links", draft.links.map((l, j) => j === i ? { ...l, label: e.target.value } : l))} /></label><label>Document URL<input required type="url" maxLength={2000} value={link.url} onChange={e => update("links", draft.links.map((l, j) => j === i ? { ...l, url: e.target.value } : l))} /></label>{editing && <button type="button" onClick={() => update("links", draft.links.filter((_, j) => j !== i))}>Remove</button>}</div>)}{editing && draft.links.length < 30 && <button type="button" onClick={() => update("links", [...draft.links, { label: "", url: "" }])}>+ Add document link</button>}</fieldset>
                {editing && isOwner && <div className={styles.saveBar}><span>{dirty ? "Unsaved changes" : "Ready to edit"}</span><button type="button" disabled={busy} onClick={() => { if (canLeave()) { if (selected) { setDraft(selected); setEditing(false); setDirty(false); } else switchTab("grants"); } }}>Cancel</button><button className={styles.primary} disabled={busy} type="submit">{busy ? "Saving…" : "Save grant"}</button></div>}
              </form>
              {selected && <div className={styles.detailBottom}><section><h3>Tasks & follow-up</h3><p className={styles.small}>Add a task for each extra reporting date or follow-up.</p><ul className={styles.taskList}>{tasks.filter(t => t.grant_id === selected.id).sort((a, b) => Number(a.completed) - Number(b.completed) || (a.due_on || "9999").localeCompare(b.due_on || "9999")).map(task => <li key={task.id}><label><input type="checkbox" checked={task.completed} disabled={!isOwner || busy} onChange={() => void taskAction(task)} /><span className={task.completed ? styles.completed : undefined}>{task.title}<small>{task.due_on ? dateLabel(task.due_on) : "No due date"}</small></span></label>{isOwner && <button disabled={busy} onClick={() => void taskAction(task, true)} aria-label={`Remove task: ${task.title}`}>×</button>}</li>)}</ul>{!tasks.some(t => t.grant_id === selected.id) && <p className={styles.emptySmall}>No tasks added yet.</p>}{isOwner && <form className={styles.taskForm} onSubmit={e => { e.preventDefault(); void taskAction(); }}><label>New task<input required maxLength={300} value={taskName} onChange={e => setTaskName(e.target.value)} /></label><label>Due date<input type="date" value={taskDate} onInput={e => setTaskDate(e.currentTarget.value)} /></label><button className={styles.primary} disabled={busy}>Add task</button></form>}</section><section><h3>Recent activity</h3>{activityError && <p role="status">{activityError}</p>}<ul className={styles.activity}>{activity.map(a => <li key={a.id}>{a.action}<time>{new Date(a.created_at).toLocaleString("en-US", { timeZone: "America/Chicago", dateStyle: "medium", timeStyle: "short" })} CT</time></li>)}</ul><p className={styles.small}>Showing the latest 30 changes.</p></section></div>}
            </section> : tab === "finance" ? <FinanceWorkspace key={userId} isOwner={isOwner} grants={grants} tasks={tasks} onDirtyChange={setFinanceDirty} onBusyChange={setFinanceBusy} onOpenGrant={openGrant} /> : tab === "overview" ? <>
              <section className={styles.overviewIntro}><div><h2>Your funding, in focus.</h2><p>One place to follow opportunities from the first idea to the final report.</p></div>{isOwner && <button className={styles.primary} onClick={() => openGrant()}>+ Add a grant</button>}</section>
              <section className={styles.stats} aria-label="Funding summary"><div><span>Active opportunities</span><strong>{activeGrants.filter(g => ["Researching", "Preparing", "Submitted"].includes(g.status)).length}</strong><small>Researching, preparing & submitted</small></div><div><span>Requested · in progress</span><strong>{money(sum("requested_amount", activeGrants.filter(g => ["Preparing", "Submitted"].includes(g.status))))}</strong><small>Preparing & submitted applications</small></div><div><span>Awarded</span><strong>{money(sum("awarded_amount", activeGrants.filter(g => g.status === "Awarded")))}</strong><small>Active awarded grants</small></div><div><span>Received</span><strong>{money(sum("received_amount", activeGrants.filter(g => g.status === "Awarded")))}</strong><small>Recorded payments on awarded grants</small></div></section>
              {!activeGrants.length ? <section className={styles.empty}><span className={styles.eyebrow}>A CLEAR START</span><h2>Your next opportunity starts here.</h2><p>{isOwner ? "Add a grant you’re researching, an application underway, or an award you’re managing." : "The owner hasn’t added any active grants yet."}</p>{isOwner && <button className={styles.primary} onClick={() => openGrant()}>Add your first grant</button>}</section> : <div className={styles.overviewColumns}><section><div className={styles.sectionTitle}><h3>Needs attention</h3><span>{overdue.length} overdue</span></div>{remindersList(overdue.slice(0, 8))}{overdue.length > 8 && <button onClick={() => switchTab("deadlines")}>View all overdue items</button>}</section><section><div className={styles.sectionTitle}><h3>Next 30 days</h3><button className={styles.textButton} onClick={() => switchTab("deadlines")}>All dates →</button></div>{remindersList(upcoming.slice(0, 8))}</section></div>}
              <section className={styles.pipeline}><h3>Application progress</h3><div>{statuses.map(s => <button key={s} onClick={() => { setStatusFilter(s); setShowArchived(false); switchTab("grants"); }}><strong>{activeGrants.filter(g => g.status === s).length}</strong><span>{s}</span></button>)}</div></section>
            </> : tab === "grants" ? <>
              <div className={styles.overviewIntro}><div><h2>{showArchived ? "Archived grants" : "All grants"}</h2><p>{filtered.length} {filtered.length === 1 ? "record" : "records"} · Amounts in USD</p></div><div className={styles.actions}><button onClick={() => download(grantsCsv(filtered), `fom-grants-${today}.csv`, "text/csv;charset=utf-8")}>Export this list</button><button onClick={() => download(JSON.stringify({ version: 1, exported_at: new Date().toISOString(), organization: "Future of Music", grants, tasks }, null, 2), `fom-grant-backup-${today}.json`, "application/json")}>Download grant-only backup</button>{isOwner && <button className={styles.primary} onClick={() => openGrant()}>+ Add a grant</button>}</div></div>
              <div className={styles.filters}><label>Search<input type="search" placeholder="Grant, funder, program, notes…" value={search} onChange={e => setSearch(e.target.value)} /></label><label>Status<select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option>All statuses</option>{statuses.map(s => <option key={s}>{s}</option>)}</select></label><label>Sort by<select value={sort} onChange={e => setSort(e.target.value)}><option value="deadline">Application deadline</option><option value="name">Grant name</option><option value="amount">Requested amount</option><option value="updated">Last updated</option></select></label><label className={styles.checkLabel}><input type="checkbox" checked={showArchived} onChange={e => setShowArchived(e.target.checked)} />Archive</label></div>
              <div className={styles.tableWrap}><table><caption className={styles.srOnly}>Grant records. Select a grant name to open the full record.</caption><thead><tr><th scope="col">Grant / funder</th><th scope="col">Status</th><th scope="col">Requested</th><th scope="col">Awarded</th><th scope="col">Deadline</th></tr></thead><tbody>{filtered.map(g => <tr key={g.id}><td><button className={styles.textButton} onClick={() => openGrant(g)}>{g.title}</button><small>{g.funder}{g.program ? ` · ${g.program}` : ""}</small></td><td><span className={styles.status} data-status={g.status}>{g.status}</span></td><td>{money(g.requested_amount)}</td><td>{money(g.awarded_amount)}</td><td>{dateLabel(g.deadline)}</td></tr>)}</tbody></table></div>{!filtered.length && <div className={styles.empty}><h3>No grants to show.</h3><p>{search || statusFilter !== "All statuses" ? "Try another search or status filter." : showArchived ? "Archived grants will appear here." : "Add your first grant to get started."}</p></div>}
            </> : <><div className={styles.overviewIntro}><div><h2>Deadlines & reminders</h2><p>Application deadlines, expected decisions, reports, and unfinished tasks.</p></div></div><div className={styles.deadlineNote}>Reminders update while this page is open. No emails or background notifications are sent. Dates use Central Time; check the funder’s exact cutoff in the grant record.</div>{remindersList(reminders)}</>}
          </>}
        </>}
      </>}
    </main><footer className={styles.footer}><span>Future of Music · Private finance workspace</span><span>Keep exported files and login details private.</span></footer>
  </div>;
}

function LoginForm({ onError, busy, setBusy }: { onError: (s: string) => void; busy: boolean; setBusy: (b: boolean) => void }) {
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    setBusy(true); onError("");
    try {
      const { error } = await getClient().auth.signInWithPassword({ email: String(form.get("email")).trim(), password: String(form.get("password")) });
      if (error) throw error;
    } catch (e) { onError(errorText(e)); } finally { setBusy(false); }
  }
  return <form onSubmit={submit}><label>Email address<input name="email" type="email" autoComplete="username" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label><button type="submit" className={styles.primary} disabled={busy}>{busy ? "Signing in…" : "Sign in →"}</button></form>;
}

function PasswordForm({ onDone, onCancel, onError }: { onDone: () => void; onCancel: () => void; onError: (s: string) => void }) {
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    const password = String(data.get("password"));
    if (password !== data.get("confirm")) { onError("The passwords do not match."); return; }
    setBusy(true); onError("");
    try { const { error } = await getClient().auth.updateUser({ password }); if (error) throw error; onDone(); }
    catch (e) { onError(errorText(e)); } finally { setBusy(false); }
  }
  return <section className={styles.passwordForm}><h2>Change your password</h2><p>Use a unique password with at least 12 characters.</p><form onSubmit={submit}><label>New password<input type="password" name="password" required minLength={12} autoComplete="new-password" /></label><label>Confirm new password<input type="password" name="confirm" required minLength={12} autoComplete="new-password" /></label><div className={styles.actions}><button type="button" onClick={onCancel} disabled={busy}>Cancel</button><button className={styles.primary} disabled={busy}>{busy ? "Updating…" : "Update password"}</button></div></form></section>;
}
