"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { getMentorshipClient } from "./client";
import {
  displayDate,
  displayTime,
  gradePoint,
  toDateTimeLocal,
  type Assignment,
  type Cohort,
  type CurriculumItem,
  type Goal,
  type Grade,
  type Meeting,
  type MeetingStudent,
  type PortalRole,
  type Profile,
  type Student,
  type WorkspaceData,
} from "./model";
import styles from "./mentorship.module.css";

type View = "today" | "meetings" | "students" | "curriculum" | "reports" | "setup";
type MeetingDraft = {
  id?: string;
  meeting_at: string;
  duration_minutes: number;
  location: "virtual" | "in_person" | "phone";
  shared_notes: string;
  status: "scheduled" | "complete" | "cancelled";
  studentIds: string[];
  individual: Record<string, Pick<MeetingStudent, "attendance" | "personal_notes" | "goal" | "progress">>;
};

const defaultCurriculum: CurriculumItem[] = [
  {
    id: "preview-academic",
    track: "Academic readiness",
    meeting_number: 1,
    title: "Check in, organize, and make a plan",
    start_prompt: "What feels most important in school right now?",
    discussion_questions: ["What is going well?", "What needs attention this week?", "What support would be useful?"],
    activity: "Review current grades, missing work, and one realistic next step.",
    resources: ["Grade tracker", "School portal"],
    action_item: "Choose one action to complete before the next meeting.",
    published: true,
  },
  {
    id: "preview-personal",
    track: "Personal leadership",
    meeting_number: 1,
    title: "Confidence, communication, and showing up",
    start_prompt: "Where have you been proud of yourself lately?",
    discussion_questions: ["What does confidence look like in practice?", "How do you ask for help?", "What is one new situation you can try?"],
    activity: "Practice a short introduction and one way to communicate a need.",
    resources: ["Reflection prompt", "Goal planner"],
    action_item: "Try one communication habit this week and reflect on it.",
    published: true,
  },
  {
    id: "preview-career",
    track: "Career & future planning",
    meeting_number: 1,
    title: "Explore options and make a next-step plan",
    start_prompt: "What are you curious to learn more about?",
    discussion_questions: ["What strengths do you notice in yourself?", "What careers or opportunities connect to them?", "What is one question you want answered?"],
    activity: "Map one interest to a role, skill, or experience worth exploring.",
    resources: ["Career interest list", "Local opportunity search"],
    action_item: "Research one role, program, or person before the next meeting.",
    published: true,
  },
  {
    id: "preview-enterprise",
    track: "Entrepreneurship",
    meeting_number: 1,
    title: "Turn an idea into a useful first step",
    start_prompt: "What problem would you enjoy helping solve?",
    discussion_questions: ["Who would your idea help?", "What resources would it need?", "What small test could you try first?"],
    activity: "Sketch the audience, value, and first action for one idea.",
    resources: ["Idea canvas", "Simple budget worksheet"],
    action_item: "Share your idea with one trusted person and write down what you learn.",
    published: true,
  },
];

function blankIndividual(): MeetingDraft["individual"][string] {
  return { attendance: "present", personal_notes: "", goal: "", progress: "on_track" };
}

function freshDraft(students: Student[], meeting?: Meeting): MeetingDraft {
  const current = meeting?.meeting_students || [];
  const studentIds = current.length ? current.map((item) => item.student_id) : students.slice(0, 1).map((student) => student.id);
  const individual: MeetingDraft["individual"] = {};
  studentIds.forEach((studentId) => {
    const saved = current.find((item) => item.student_id === studentId);
    individual[studentId] = saved
      ? { attendance: saved.attendance, personal_notes: saved.personal_notes, goal: saved.goal, progress: saved.progress }
      : blankIndividual();
  });
  return {
    id: meeting?.id,
    meeting_at: toDateTimeLocal(meeting?.meeting_at || new Date().toISOString()),
    duration_minutes: meeting?.duration_minutes || 45,
    location: meeting?.location || "virtual",
    shared_notes: meeting?.shared_notes || "",
    status: meeting?.status || "complete",
    studentIds,
    individual,
  };
}

function relationshipRows(rows: unknown[] | null | undefined): Assignment[] {
  return (rows || []).map((row) => row as Assignment);
}

function meetingRows(rows: unknown[] | null | undefined): Meeting[] {
  return (rows || []).map((row) => ({
    ...(row as Meeting),
    meeting_students: ((row as Meeting).meeting_students || []).map((item) => item as MeetingStudent),
  }));
}

function errorText(issue: unknown) {
  const error = issue as { code?: string; message?: string };
  if (error.code === "42P01" || error.code === "PGRST205") {
    return "The mentorship workspace needs its one-time private setup before it can open records.";
  }
  if (error.code === "42501") return "This account does not have permission for that action.";
  if (error.message?.includes("Invalid login")) return "That email and password do not match a mentor account.";
  if (error.message?.includes("Failed to fetch")) return "The workspace could not reach its secure records. Check your connection and try again.";
  return error.message || "Something went wrong. Please try again.";
}

function csvCell(value: string | number | null | undefined) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function downloadCsv(filename: string, columns: string[], rows: (string | number | null | undefined)[][]) {
  const output = [columns.map(csvCell).join(","), ...rows.map((row) => row.map(csvCell).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([output], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export default function MentorshipPortal() {
  const [session, setSession] = useState<Session | null>(null);
  // Show the sign-in screen immediately. A restored session replaces it as
  // soon as Supabase responds, rather than ever leaving a fresh browser blank.
  const [ready, setReady] = useState(true);
  const [data, setData] = useState<WorkspaceData | null>(null);
  const [view, setView] = useState<View>("today");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [meetingDraft, setMeetingDraft] = useState<MeetingDraft | null>(null);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showLoginHelp, setShowLoginHelp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const client = getMentorshipClient();
    let mounted = true;
    // A fresh browser has no session to restore. Never leave that person on a
    // loading state while the auth SDK finishes its background check.
    const readyFallback = window.setTimeout(() => {
      if (mounted) setReady(true);
    }, 600);
    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setReady(true);
      if (!nextSession) {
        setData(null);
        setView("today");
        setMeetingDraft(null);
        setSelectedStudentId(null);
      }
    });
    void client.auth.getSession().then(({ data: result }) => {
      if (!mounted) return;
      setSession(result.session);
      setReady(true);
    }).catch(() => {
      if (mounted) setReady(true);
    });
    return () => {
      mounted = false;
      window.clearTimeout(readyFallback);
      listener.subscription.unsubscribe();
    };
  }, []);

  const load = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError("");
    try {
      const client = getMentorshipClient();
      // The existing Finance/Administration owner becomes the first
      // mentorship administrator automatically. Other accounts simply get
      // false back until an administrator adds their profile.
      const { error: bootstrapError } = await client.rpc("mentorship_bootstrap_owner");
      if (bootstrapError && bootstrapError.code !== "PGRST202") throw bootstrapError;
      const { data: profileData, error: profileError } = await client
        .from("mentorship_profiles")
        .select("user_id,display_name,email,role,active")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (profileError) throw profileError;
      if (!profileData?.active) throw new Error("Your mentorship account is not active yet. Contact Future of Music for access.");
      const profile = profileData as Profile;

      const curriculumRequest = client
        .from("mentorship_curriculum")
        .select("id,track,meeting_number,title,start_prompt,discussion_questions,activity,resources,action_item,published")
        .eq("published", true)
        .order("track")
        .order("meeting_number");
      const cohortsRequest = client
        .from("mentorship_cohorts")
        .select("id,title,starts_on,ends_on,active")
        .order("starts_on", { ascending: false });

      let students: Student[] = [];
      let assignments: Assignment[] = [];
      let meetings: Meeting[] = [];
      let grades: Grade[] = [];
      let goals: Goal[] = [];
      const isProgramLead = profile.role === "admin" || profile.role === "supervisor";

      if (isProgramLead) {
        const [studentsResult, assignmentsResult, meetingsResult, gradesResult, goalsResult] = await Promise.all([
          client.from("mentorship_students").select("id,account_id,full_name,school,grade,guardian_name,guardian_email,active,created_at").order("full_name"),
          client.from("mentorship_assignments").select("id,mentor_id,student_id,cohort_id,student:mentorship_students(id,account_id,full_name,school,grade,guardian_name,guardian_email,active,created_at),cohort:mentorship_cohorts(id,title,starts_on,ends_on,active)"),
          client.from("mentorship_meetings").select("id,mentor_id,cohort_id,meeting_at,duration_minutes,location,shared_notes,status,created_at,updated_at,meeting_students:mentorship_meeting_students(id,student_id,attendance,personal_notes,goal,progress,student:mentorship_students(id,account_id,full_name,school,grade,guardian_name,guardian_email,active,created_at))").order("meeting_at", { ascending: false }),
          client.from("mentorship_grades").select("id,student_id,subject,letter_grade,percentage,missing_assignments,reported_on").order("reported_on", { ascending: false }),
          client.from("mentorship_goals").select("id,student_id,title,detail,status,target_date,updated_at").order("updated_at", { ascending: false }),
        ]);
        for (const result of [studentsResult, assignmentsResult, meetingsResult, gradesResult, goalsResult]) if (result.error) throw result.error;
        students = (studentsResult.data || []) as Student[];
        assignments = relationshipRows(assignmentsResult.data);
        meetings = meetingRows(meetingsResult.data);
        grades = (gradesResult.data || []) as Grade[];
        goals = (goalsResult.data || []) as Goal[];
      } else if (profile.role === "mentor") {
        const { data: assignmentData, error: assignmentError } = await client
          .from("mentorship_assignments")
          .select("id,mentor_id,student_id,cohort_id,student:mentorship_students(id,account_id,full_name,school,grade,guardian_name,guardian_email,active,created_at),cohort:mentorship_cohorts(id,title,starts_on,ends_on,active)")
          .eq("mentor_id", session.user.id);
        if (assignmentError) throw assignmentError;
        assignments = relationshipRows(assignmentData);
        students = assignments.map((assignment) => assignment.student).filter((student): student is Student => Boolean(student));
        const studentIds = students.map((student) => student.id);
        const [meetingsResult, gradesResult, goalsResult] = await Promise.all([
          client.from("mentorship_meetings").select("id,mentor_id,cohort_id,meeting_at,duration_minutes,location,shared_notes,status,created_at,updated_at,meeting_students:mentorship_meeting_students(id,student_id,attendance,personal_notes,goal,progress,student:mentorship_students(id,account_id,full_name,school,grade,guardian_name,guardian_email,active,created_at))").eq("mentor_id", session.user.id).order("meeting_at", { ascending: false }),
          studentIds.length ? client.from("mentorship_grades").select("id,student_id,subject,letter_grade,percentage,missing_assignments,reported_on").in("student_id", studentIds).order("reported_on", { ascending: false }) : Promise.resolve({ data: [], error: null }),
          studentIds.length ? client.from("mentorship_goals").select("id,student_id,title,detail,status,target_date,updated_at").in("student_id", studentIds).order("updated_at", { ascending: false }) : Promise.resolve({ data: [], error: null }),
        ]);
        for (const result of [meetingsResult, gradesResult, goalsResult]) if (result.error) throw result.error;
        meetings = meetingRows(meetingsResult.data);
        grades = (gradesResult.data || []) as Grade[];
        goals = (goalsResult.data || []) as Goal[];
      } else {
        const { data: studentData, error: studentError } = await client
          .from("mentorship_students")
          .select("id,account_id,full_name,school,grade,guardian_name,guardian_email,active,created_at")
          .eq("account_id", session.user.id)
          .maybeSingle();
        if (studentError) throw studentError;
        students = studentData ? [studentData as Student] : [];
        const studentId = studentData?.id;
        if (studentId) {
          const [meetingsResult, gradesResult, goalsResult, assignmentResult] = await Promise.all([
            client.from("mentorship_meetings").select("id,mentor_id,cohort_id,meeting_at,duration_minutes,location,shared_notes,status,created_at,updated_at,meeting_students:mentorship_meeting_students(id,student_id,attendance,personal_notes,goal,progress,student:mentorship_students(id,account_id,full_name,school,grade,guardian_name,guardian_email,active,created_at))").order("meeting_at", { ascending: false }),
            client.from("mentorship_grades").select("id,student_id,subject,letter_grade,percentage,missing_assignments,reported_on").eq("student_id", studentId).order("reported_on", { ascending: false }),
            client.from("mentorship_goals").select("id,student_id,title,detail,status,target_date,updated_at").eq("student_id", studentId).order("updated_at", { ascending: false }),
            client.from("mentorship_assignments").select("id,mentor_id,student_id,cohort_id,cohort:mentorship_cohorts(id,title,starts_on,ends_on,active)").eq("student_id", studentId),
          ]);
          for (const result of [meetingsResult, gradesResult, goalsResult, assignmentResult]) if (result.error) throw result.error;
          meetings = meetingRows(meetingsResult.data);
          grades = (gradesResult.data || []) as Grade[];
          goals = (goalsResult.data || []) as Goal[];
          assignments = relationshipRows(assignmentResult.data);
        }
      }

      const [curriculumResult, cohortsResult] = await Promise.all([curriculumRequest, cohortsRequest]);
      if (curriculumResult.error) throw curriculumResult.error;
      if (cohortsResult.error) throw cohortsResult.error;
      setData({
        profile,
        students,
        cohorts: (cohortsResult.data || []) as Cohort[],
        assignments,
        meetings,
        grades,
        goals,
        curriculum: (curriculumResult.data?.length ? curriculumResult.data : defaultCurriculum) as CurriculumItem[],
      });
    } catch (issue) {
      setData(null);
      setError(errorText(issue));
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => { void load(); }, [load]);

  const canManage = data?.profile.role === "admin" || data?.profile.role === "mentor";
  const isAdmin = data?.profile.role === "admin";
  const selectedStudent = data?.students.find((student) => student.id === selectedStudentId) || null;
  const upcoming = useMemo(() => (data?.meetings || []).filter((meeting) => new Date(meeting.meeting_at) >= new Date() && meeting.status !== "cancelled").sort((a, b) => a.meeting_at.localeCompare(b.meeting_at)), [data?.meetings]);

  function openMeeting(meeting?: Meeting) {
    if (!data) return;
    setMeetingDraft(freshDraft(data.students, meeting));
    setView("meetings");
    setError("");
    setNotice("");
  }

  function changeView(next: View) {
    setMeetingDraft(null);
    setView(next);
    setError("");
    setNotice("");
  }

  async function signOut() {
    await getMentorshipClient().auth.signOut({ scope: "local" });
  }

  async function saveMeeting(event: FormEvent) {
    event.preventDefault();
    if (!data || !meetingDraft || !session || !canManage || meetingDraft.studentIds.length === 0) {
      setError("Choose at least one student before saving the meeting.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const client = getMentorshipClient();
      const cohortId = data.assignments.find((assignment) => assignment.student_id === meetingDraft.studentIds[0])?.cohort_id || null;
      const payload = {
        mentor_id: session.user.id,
        cohort_id: cohortId,
        meeting_at: new Date(meetingDraft.meeting_at).toISOString(),
        duration_minutes: Number(meetingDraft.duration_minutes) || 0,
        location: meetingDraft.location,
        shared_notes: meetingDraft.shared_notes.trim(),
        status: meetingDraft.status,
      };
      const query = meetingDraft.id
        ? client.from("mentorship_meetings").update(payload).eq("id", meetingDraft.id).select().single()
        : client.from("mentorship_meetings").insert(payload).select().single();
      const { data: savedMeeting, error: saveError } = await query;
      if (saveError) throw saveError;
      const { error: clearError } = await client.from("mentorship_meeting_students").delete().eq("meeting_id", savedMeeting.id);
      if (clearError) throw clearError;
      const attendanceRows = meetingDraft.studentIds.map((studentId) => ({
        meeting_id: savedMeeting.id,
        student_id: studentId,
        ...(meetingDraft.individual[studentId] || blankIndividual()),
      }));
      const { error: attendeeError } = await client.from("mentorship_meeting_students").insert(attendanceRows);
      if (attendeeError) throw attendeeError;
      setMeetingDraft(null);
      setNotice("Meeting saved. You can reopen it any time to update the notes.");
      await load();
    } catch (issue) {
      setError(errorText(issue));
    } finally {
      setSaving(false);
    }
  }

  async function createStudent(event: FormEvent) {
    event.preventDefault();
    if (!isAdmin) return;
    const form = new FormData(event.currentTarget as HTMLFormElement);
    setSaving(true);
    setError("");
    try {
      const { error: saveError } = await getMentorshipClient().from("mentorship_students").insert({
        full_name: String(form.get("full_name") || "").trim(),
        school: String(form.get("school") || "").trim(),
        grade: String(form.get("grade") || "").trim(),
        guardian_name: String(form.get("guardian_name") || "").trim(),
        guardian_email: String(form.get("guardian_email") || "").trim(),
      });
      if (saveError) throw saveError;
      setShowStudentForm(false);
      setNotice("Student added.");
      await load();
    } catch (issue) {
      setError(errorText(issue));
    } finally {
      setSaving(false);
    }
  }

  async function saveGrade(event: FormEvent) {
    event.preventDefault();
    if (!selectedStudent || !canManage) return;
    const form = new FormData(event.currentTarget as HTMLFormElement);
    setSaving(true);
    setError("");
    try {
      const { error: saveError } = await getMentorshipClient().from("mentorship_grades").insert({
        student_id: selectedStudent.id,
        subject: String(form.get("subject") || "").trim(),
        letter_grade: String(form.get("letter_grade") || "").trim(),
        percentage: form.get("percentage") ? Number(form.get("percentage")) : null,
        missing_assignments: Number(form.get("missing_assignments") || 0),
        reported_on: new Date().toISOString().slice(0, 10),
      });
      if (saveError) throw saveError;
      setNotice("Grade update saved.");
      await load();
    } catch (issue) {
      setError(errorText(issue));
    } finally {
      setSaving(false);
    }
  }

  if (!ready) return <main className={styles.loading}><p>Opening mentorship workspace…</p></main>;
  if (!session) return <SignInPanel error={error} onError={setError} onHelp={showLoginHelp} setHelp={setShowLoginHelp} />;
  if (loading && !data) return <main className={styles.loading}><p>Loading your workspace…</p></main>;
  if (!data) return <SetupState error={error} onRetry={() => void load()} onSignOut={() => void signOut()} />;

  const role = data.profile.role;
  const profileName = data.profile.display_name.split(" ")[0] || "there";
  const navItems: { id: View; label: string; visible: boolean }[] = [
    { id: "today", label: "Today", visible: true },
    { id: "meetings", label: "Meetings", visible: true },
    { id: "students", label: role !== "mentee" ? "Students" : "My profile", visible: true },
    { id: "curriculum", label: "Curriculum", visible: true },
    { id: "reports", label: "Reports", visible: role === "admin" || role === "supervisor" },
    { id: "setup", label: "Program setup", visible: role === "admin" },
  ];

  return <div className={styles.portal}>
    <a className={styles.skip} href="#workspace">Skip to workspace</a>
    <header className={styles.header}>
      <a href="/" className={styles.brand} aria-label="Future of Music home"><img src="/images/logo-square.png" alt="" /><span>Future of Music<small>Mentorship</small></span></a>
      <div className={styles.profile}><span className={styles.avatar}>{data.profile.display_name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><span><strong>{data.profile.display_name}</strong><small>{role === "admin" ? "Program administration" : role}</small></span><button type="button" onClick={() => void signOut()}>Sign out</button></div>
    </header>
    <div className={styles.shell}>
      <aside className={styles.sidebar} aria-label="Mentorship navigation">
        <p>WORKSPACE</p>
        <nav>{navItems.filter((item) => item.visible).map((item) => <button key={item.id} type="button" aria-current={view === item.id ? "page" : undefined} onClick={() => changeView(item.id)}>{item.label}</button>)}</nav>
        <a href="/programs" className={styles.backLink}>← Future of Music programs</a>
      </aside>
      <main id="workspace" className={styles.workspace}>
        {error && <div className={styles.error} role="alert">{error}</div>}
        {notice && <div className={styles.notice} role="status">{notice}</div>}
        {view === "today" && <TodayView name={profileName} role={role} students={data.students} meetings={data.meetings} goals={data.goals} onNewMeeting={() => openMeeting()} onOpenMeeting={openMeeting} onStudents={() => changeView("students")} />}
        {view === "meetings" && (meetingDraft ? <MeetingEditor data={data} draft={meetingDraft} setDraft={setMeetingDraft} saving={saving} onSave={saveMeeting} onClose={() => setMeetingDraft(null)} /> : <MeetingsView meetings={data.meetings} students={data.students} canManage={Boolean(canManage)} onNew={() => openMeeting()} onOpen={openMeeting} />)}
        {view === "students" && <StudentsView students={data.students} assignments={data.assignments} grades={data.grades} goals={data.goals} canManage={Boolean(canManage)} isAdmin={Boolean(isAdmin)} selected={selectedStudent} setSelected={setSelectedStudentId} onNew={() => setShowStudentForm(true)} onSaveGrade={saveGrade} saving={saving} />}
        {view === "curriculum" && <CurriculumView items={data.curriculum} role={role} />}
        {view === "reports" && <ReportsView data={data} />}
        {view === "setup" && <SetupView data={data} />}
      </main>
    </div>
    {showStudentForm && <Modal title="Add a student" onClose={() => setShowStudentForm(false)}><form className={styles.form} onSubmit={createStudent}><label>Student name<input required name="full_name" autoComplete="name" /></label><label>School<input required name="school" /></label><label>Grade<input required name="grade" placeholder="Example: 8th grade" /></label><label>Guardian name<input name="guardian_name" /></label><label>Guardian email<input name="guardian_email" type="email" /></label><button className={styles.primaryButton} disabled={saving}>{saving ? "Saving…" : "Add student"}</button></form></Modal>}
  </div>;
}

function SignInPanel({ error, onError, onHelp, setHelp }: { error: string; onError: (message: string) => void; onHelp: boolean; setHelp: (value: boolean) => void }) {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);
    setBusy(true); setNotice(""); onError("");
    const { error: issue } = await getMentorshipClient().auth.signInWithPassword({ email: String(form.get("email") || "").trim(), password: String(form.get("password") || "") });
    if (issue) onError(errorText(issue));
    setBusy(false);
  }
  async function reset(event: FormEvent) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget as HTMLFormElement).get("email") || "").trim();
    setBusy(true); setNotice(""); onError("");
    const { error: issue } = await getMentorshipClient().auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/mentorship/` });
    if (issue) onError(errorText(issue)); else setNotice("If that email has a mentorship account, a password reset link is on its way.");
    setBusy(false);
  }
  return <main className={styles.loginPage}><a href="/" className={styles.loginBrand}><img src="/images/logo-square.png" alt="Future of Music" />Future of Music <span>Mentorship</span></a><section className={styles.loginCard}><p>MENTORSHIP ACCESS</p><h1>{onHelp ? "Reset your password" : "Sign in"}</h1><span>Mentors, mentees, and staff use their own secure account.</span>{error && <div className={styles.error} role="alert">{error}</div>}{notice && <div className={styles.notice} role="status">{notice}</div>}{onHelp ? <form className={styles.form} onSubmit={reset}><label>Email<input required name="email" type="email" autoComplete="email" /></label><button className={styles.primaryButton} disabled={busy}>{busy ? "Sending…" : "Send reset link"}</button></form> : <form className={styles.form} onSubmit={submit}><label>Email<input required name="email" type="email" autoComplete="email" /></label><label>Password<input required name="password" type="password" autoComplete="current-password" /></label><button className={styles.primaryButton} disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button></form>}<button className={styles.textButton} type="button" onClick={() => { setHelp(!onHelp); onError(""); setNotice(""); }}>{onHelp ? "Back to sign in" : "Forgot your password?"}</button><small>Need an account? Contact Future of Music. There is no public registration.</small></section></main>;
}

function SetupState({ error, onRetry, onSignOut }: { error: string; onRetry: () => void; onSignOut: () => void }) {
  return <main className={styles.loginPage}><section className={styles.loginCard}><p>MENTORSHIP ACCESS</p><h1>Account setup is not finished.</h1><span>{error || "Your secure workspace is being prepared."}</span><div className={styles.actions}><button className={styles.primaryButton} onClick={onRetry}>Try again</button><button className={styles.textButton} onClick={onSignOut}>Sign out</button></div></section></main>;
}

function TodayView({ name, role, students, meetings, goals, onNewMeeting, onOpenMeeting, onStudents }: { name: string; role: PortalRole; students: Student[]; meetings: Meeting[]; goals: Goal[]; onNewMeeting: () => void; onOpenMeeting: (meeting: Meeting) => void; onStudents: () => void }) {
  const nextMeeting = meetings.filter((meeting) => new Date(meeting.meeting_at) >= new Date() && meeting.status !== "cancelled").sort((a, b) => a.meeting_at.localeCompare(b.meeting_at))[0];
  const activeGoals = goals.filter((goal) => goal.status === "active");
  return <><section className={styles.heading}><div><p>TODAY</p><h1>{role === "mentee" ? `Welcome back, ${name}.` : `Good to see you, ${name}.`}</h1><span>{role === "mentor" ? "Start a meeting, review students, or pick up where you left off." : "Your mentorship space, in one place."}</span></div>{role !== "mentee" && <button className={styles.primaryButton} onClick={onNewMeeting}>Start a meeting <b>→</b></button>}</section><section className={styles.focusGrid}><article className={styles.focus}><p>NEXT MEETING</p>{nextMeeting ? <><strong>{displayDate(nextMeeting.meeting_at)}</strong><h2>{nextMeeting.meeting_students?.map((item) => item.student?.full_name || "Student").join(" + ") || "Mentorship meeting"}</h2><span>{displayTime(nextMeeting.meeting_at)} · {nextMeeting.duration_minutes} minutes</span><button className={styles.textButton} onClick={() => onOpenMeeting(nextMeeting)}>Open meeting →</button></> : <><h2>No meeting scheduled.</h2><span>When one is scheduled, it will appear here.</span></>}</article><article className={styles.summary}><p>{role === "mentor" ? "YOUR STUDENTS" : "YOUR PROGRESS"}</p><strong>{role === "mentor" ? students.length : meetings.filter((meeting) => meeting.status === "complete").length}</strong><span>{role === "mentor" ? "students currently assigned" : "meetings completed"}</span><button className={styles.textButton} onClick={onStudents}>{role === "mentor" ? "Open students →" : "View my profile →"}</button></article><article className={styles.summary}><p>ACTIVE GOALS</p><strong>{activeGoals.length}</strong><span>{activeGoals[0]?.title || "No goal needs attention right now."}</span></article></section><section className={styles.listSection}><div className={styles.sectionTitle}><div><p>MEETINGS</p><h2>Recent and upcoming</h2></div></div><MeetingRows meetings={meetings.slice(0, 6)} onOpen={onOpenMeeting} /></section></>;
}

function MeetingsView({ meetings, students, canManage, onNew, onOpen }: { meetings: Meeting[]; students: Student[]; canManage: boolean; onNew: () => void; onOpen: (meeting: Meeting) => void }) {
  return <><section className={styles.heading}><div><p>MEETINGS</p><h1>Student meetings.</h1><span>Every meeting holds shared notes plus the individual follow-up for each student.</span></div>{canManage && <button className={styles.primaryButton} onClick={onNew}>Start a meeting <b>→</b></button>}</section><section className={styles.listSection}><MeetingRows meetings={meetings} students={students} onOpen={onOpen} /></section></>;
}

function MeetingRows({ meetings, students, onOpen }: { meetings: Meeting[]; students?: Student[]; onOpen: (meeting: Meeting) => void }) {
  if (!meetings.length) return <p className={styles.empty}>No meetings are here yet.</p>;
  return <div className={styles.meetingRows}>{meetings.map((meeting) => <button key={meeting.id} type="button" onClick={() => onOpen(meeting)}><time>{displayDate(meeting.meeting_at)}<small>{displayTime(meeting.meeting_at)}</small></time><span><strong>{meeting.meeting_students?.map((item) => item.student?.full_name || students?.find((student) => student.id === item.student_id)?.full_name || "Student").join(" + ") || "Mentorship meeting"}</strong><small>{meeting.duration_minutes} minutes · {meeting.location.replaceAll("_", " ")}</small></span><em>{meeting.status}</em><b>→</b></button>)}</div>;
}

function MeetingEditor({ data, draft, setDraft, saving, onSave, onClose }: { data: WorkspaceData; draft: MeetingDraft; setDraft: (next: MeetingDraft) => void; saving: boolean; onSave: (event: FormEvent) => void; onClose: () => void }) {
  function toggleStudent(studentId: string) {
    const selected = draft.studentIds.includes(studentId);
    const studentIds = selected ? draft.studentIds.filter((id) => id !== studentId) : [...draft.studentIds, studentId];
    const individual = { ...draft.individual };
    if (!selected) individual[studentId] = blankIndividual();
    setDraft({ ...draft, studentIds, individual });
  }
  function updateIndividual(studentId: string, key: keyof MeetingDraft["individual"][string], value: string) {
    setDraft({ ...draft, individual: { ...draft.individual, [studentId]: { ...(draft.individual[studentId] || blankIndividual()), [key]: value } } });
  }
  const selectedStudents = data.students.filter((student) => draft.studentIds.includes(student.id));
  const curriculum = data.curriculum.length ? data.curriculum : defaultCurriculum;
  return <><section className={styles.editorHeading}><div><button className={styles.textButton} type="button" onClick={onClose}>← Back to meetings</button><p>MEETING</p><h1>{draft.id ? "Update meeting" : "Start a meeting"}</h1><span>Keep the meeting centered on the student. All curriculum tracks stay available on the right.</span></div></section><form className={styles.meetingLayout} onSubmit={onSave}><section className={styles.editor}><div className={styles.editorTop}><label>Date & time<input required type="datetime-local" value={draft.meeting_at} onChange={(event) => setDraft({ ...draft, meeting_at: event.target.value })} /></label><label>Length<select value={draft.duration_minutes} onChange={(event) => setDraft({ ...draft, duration_minutes: Number(event.target.value) })}><option value={30}>30 minutes</option><option value={45}>45 minutes</option><option value={60}>1 hour</option><option value={90}>1½ hours</option></select></label><label>Location<select value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value as MeetingDraft["location"] })}><option value="virtual">Virtual</option><option value="in_person">In person</option><option value="phone">Phone</option></select></label></div><fieldset className={styles.studentPicker}><legend>STUDENTS</legend>{data.students.map((student) => <label key={student.id}><input type="checkbox" checked={draft.studentIds.includes(student.id)} onChange={() => toggleStudent(student.id)} />{student.full_name}<small>{student.grade} · {student.school}</small></label>)}</fieldset><label className={styles.fullField}>Shared meeting notes<textarea value={draft.shared_notes} onChange={(event) => setDraft({ ...draft, shared_notes: event.target.value })} placeholder="What did you talk about, decide, or plan together?" /></label><div className={styles.individualRecords}><div className={styles.sectionTitle}><div><p>INDIVIDUAL FOLLOW-UP</p><h2>Each student’s record</h2></div></div>{selectedStudents.map((student) => { const individual = draft.individual[student.id] || blankIndividual(); return <details key={student.id} open><summary><strong>{student.full_name}</strong><span>{student.grade} · {student.school}</span></summary><div className={styles.individualFields}><label>Attendance<select value={individual.attendance} onChange={(event) => updateIndividual(student.id, "attendance", event.target.value)}><option value="present">Present</option><option value="absent">Absent</option><option value="rescheduled">Rescheduled</option></select></label><label>Progress<select value={individual.progress} onChange={(event) => updateIndividual(student.id, "progress", event.target.value)}><option value="on_track">On track</option><option value="needs_support">Needs support</option><option value="complete">Goal complete</option></select></label><label>Private note<textarea value={individual.personal_notes} onChange={(event) => updateIndividual(student.id, "personal_notes", event.target.value)} placeholder="Notes only this student should carry forward." /></label><label>Next goal<input value={individual.goal} onChange={(event) => updateIndividual(student.id, "goal", event.target.value)} placeholder="A clear, student-created next step" /></label></div></details>; })}</div><div className={styles.saveRow}><label>Status<select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as MeetingDraft["status"] })}><option value="complete">Complete</option><option value="scheduled">Scheduled</option><option value="cancelled">Cancelled</option></select></label><button type="button" className={styles.secondaryButton} onClick={onClose}>Cancel</button><button className={styles.primaryButton} disabled={saving}>{saving ? "Saving…" : "Save meeting"}</button></div></section><aside className={styles.curriculumRail}><p>CURRICULUM</p><h2>Use what fits the conversation.</h2><span>There is no required single track for a meeting.</span>{curriculum.map((item) => <details key={item.id}><summary><strong>{item.track}</strong><span>{item.title}</span></summary><div><p><b>Start</b>{item.start_prompt}</p><p><b>Questions</b>{item.discussion_questions.map((question) => `• ${question}`).join("\n")}</p><p><b>Activity</b>{item.activity}</p><p><b>Action item</b>{item.action_item}</p>{item.resources.length > 0 && <p><b>Resources</b>{item.resources.join(" · ")}</p>}</div></details>)}</aside></form></>;
}

function StudentsView({ students, assignments, grades, goals, canManage, isAdmin, selected, setSelected, onNew, onSaveGrade, saving }: { students: Student[]; assignments: Assignment[]; grades: Grade[]; goals: Goal[]; canManage: boolean; isAdmin: boolean; selected: Student | null; setSelected: (id: string | null) => void; onNew: () => void; onSaveGrade: (event: FormEvent) => void; saving: boolean }) {
  const studentGrades = selected ? grades.filter((grade) => grade.student_id === selected.id) : [];
  const studentGoals = selected ? goals.filter((goal) => goal.student_id === selected.id) : [];
  const gpa = studentGrades.length ? (studentGrades.reduce((total, grade) => total + gradePoint(grade.letter_grade), 0) / studentGrades.length).toFixed(2) : "—";
  return <><section className={styles.heading}><div><p>{selected ? "STUDENT PROFILE" : "STUDENTS"}</p><h1>{selected ? selected.full_name : "Students."}</h1><span>{selected ? `${selected.grade} · ${selected.school}` : "Profiles, current goals, grades, and meeting follow-up."}</span></div>{isAdmin && <button className={styles.primaryButton} onClick={onNew}>Add student <b>+</b></button>}</section>{selected ? <section className={styles.studentProfile}><button className={styles.textButton} onClick={() => setSelected(null)}>← All students</button><div className={styles.studentStats}><div><span>GPA</span><strong>{gpa}</strong></div><div><span>ACTIVE GOALS</span><strong>{studentGoals.filter((goal) => goal.status === "active").length}</strong></div><div><span>MENTOR</span><strong>{assignments.find((assignment) => assignment.student_id === selected.id)?.mentor_id ? "Assigned" : "Not assigned"}</strong></div></div><div className={styles.profileGrid}><section><h2>Grades</h2>{studentGrades.length ? <div className={styles.gradeRows}>{studentGrades.map((grade) => <div key={grade.id}><strong>{grade.subject}</strong><span>{grade.letter_grade}{grade.percentage ? ` · ${grade.percentage}%` : ""}</span><small>{grade.missing_assignments} missing · {displayDate(grade.reported_on)}</small></div>)}</div> : <p className={styles.empty}>No grades have been added yet.</p>}{canManage && <form className={styles.inlineForm} onSubmit={onSaveGrade}><input required name="subject" placeholder="Subject" /><input required name="letter_grade" placeholder="Grade" /><input name="percentage" type="number" min="0" max="100" placeholder="%" /><input name="missing_assignments" type="number" min="0" placeholder="Missing" /><button disabled={saving}>Add grade</button></form>}</section><section><h2>Goals</h2>{studentGoals.length ? <div className={styles.gradeRows}>{studentGoals.map((goal) => <div key={goal.id}><strong>{goal.title}</strong><span>{goal.status.replaceAll("_", " ")}</span><small>{goal.detail || "No details added."}</small></div>)}</div> : <p className={styles.empty}>No goals have been added yet.</p>}</section></div></section> : <section className={styles.studentList}>{students.map((student) => <button key={student.id} type="button" onClick={() => setSelected(student.id)}><span className={styles.studentInitials}>{student.full_name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><span><strong>{student.full_name}</strong><small>{student.grade} · {student.school}</small></span><b>→</b></button>)}{!students.length && <p className={styles.empty}>No students are assigned to this account yet.</p>}</section>}</>;
}

function CurriculumView({ items, role }: { items: CurriculumItem[]; role: PortalRole }) {
  const grouped = items.reduce<Record<string, CurriculumItem[]>>((groups, item) => { (groups[item.track] ||= []).push(item); return groups; }, {});
  return <><section className={styles.heading}><div><p>CURRICULUM</p><h1>Ready when the conversation needs it.</h1><span>Open the parts that fit. Mentors are not locked to a single track in a meeting.</span></div>{role === "admin" && <span className={styles.quietNote}>Curriculum edits are managed in the private setup area.</span>}</section><div className={styles.curriculumGrid}>{Object.entries(grouped).map(([track, trackItems]) => <section key={track}><p>{track}</p>{trackItems.map((item) => <details key={item.id}><summary><strong>{String(item.meeting_number).padStart(2, "0")}</strong><span>{item.title}</span></summary><div><h2>Start</h2><p>{item.start_prompt}</p><h2>Discussion questions</h2><ul>{item.discussion_questions.map((question) => <li key={question}>{question}</li>)}</ul><h2>Activity</h2><p>{item.activity}</p><h2>Resources</h2><p>{item.resources.join(" · ") || "None added"}</p><h2>Action item</h2><p>{item.action_item}</p></div></details>)}</section>)}</div></>;
}

function ReportsView({ data }: { data: WorkspaceData }) {
  const completed = data.meetings.filter((meeting) => meeting.status === "complete");
  const hours = completed.reduce((total, meeting) => total + meeting.duration_minutes, 0) / 60;
  function exportStudents() { downloadCsv("fom-mentorship-students.csv", ["Student", "School", "Grade", "Active"], data.students.map((student) => [student.full_name, student.school, student.grade, student.active ? "Yes" : "No"])); }
  function exportMeetings() { downloadCsv("fom-mentorship-meetings.csv", ["Date", "Students", "Minutes", "Status", "Notes"], data.meetings.map((meeting) => [meeting.meeting_at, meeting.meeting_students?.map((item) => item.student?.full_name || "Student").join(" + "), meeting.duration_minutes, meeting.status, meeting.shared_notes])); }
  return <><section className={styles.heading}><div><p>REPORTS</p><h1>Program snapshot.</h1><span>Current enrollment, meeting activity, and exportable records.</span></div></section><section className={styles.metrics}><div><span>STUDENTS</span><strong>{data.students.length}</strong></div><div><span>MENTORS</span><strong>{new Set(data.assignments.map((assignment) => assignment.mentor_id)).size}</strong></div><div><span>MEETINGS</span><strong>{completed.length}</strong></div><div><span>HOURS</span><strong>{hours.toFixed(1)}</strong></div></section><section className={styles.reportActions}><article><p>STUDENT PROFILES</p><h2>Enrollment & profile records</h2><span>Names, schools, grades, and active status.</span><button className={styles.secondaryButton} onClick={exportStudents}>Export CSV</button></article><article><p>MEETING RECORDS</p><h2>Meeting notes & follow-up</h2><span>Participants, length, status, and shared notes.</span><button className={styles.secondaryButton} onClick={exportMeetings}>Export CSV</button></article></section></>;
}

function SetupView({ data }: { data: WorkspaceData }) {
  return <><section className={styles.heading}><div><p>PROGRAM SETUP</p><h1>People and cohorts.</h1><span>Add mentor accounts in Supabase first, then connect them to student records here.</span></div></section><section className={styles.listSection}><p>COHORTS</p>{data.cohorts.map((cohort) => <div className={styles.setupRow} key={cohort.id}><strong>{cohort.title}</strong><span>{displayDate(cohort.starts_on)} — {displayDate(cohort.ends_on)}</span><em>{cohort.active ? "Active" : "Closed"}</em></div>)}{!data.cohorts.length && <p className={styles.empty}>Create your first cohort in Supabase to begin matching students.</p>}</section></>;
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}><section className={styles.modal} role="dialog" aria-modal="true" aria-label={title}><header><h2>{title}</h2><button onClick={onClose} aria-label="Close">×</button></header>{children}</section></div>;
}
