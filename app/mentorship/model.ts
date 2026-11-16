export type PortalRole = "admin" | "mentor" | "mentee" | "supervisor";

export type Profile = {
  user_id: string;
  display_name: string;
  email: string;
  role: PortalRole;
  active: boolean;
};

export type Student = {
  id: string;
  account_id: string | null;
  full_name: string;
  school: string;
  grade: string;
  guardian_name: string;
  guardian_email: string;
  active: boolean;
  created_at: string;
};

export type Cohort = {
  id: string;
  title: string;
  starts_on: string;
  ends_on: string;
  active: boolean;
};

export type Assignment = {
  id: string;
  mentor_id: string;
  student_id: string;
  cohort_id: string | null;
  student?: Student;
  cohort?: Cohort | null;
};

export type MeetingStudent = {
  id?: string;
  student_id: string;
  attendance: "present" | "absent" | "rescheduled";
  personal_notes: string;
  goal: string;
  progress: "on_track" | "needs_support" | "complete";
  student?: Student;
};

export type Meeting = {
  id: string;
  mentor_id: string;
  cohort_id: string | null;
  meeting_at: string;
  duration_minutes: number;
  location: "virtual" | "in_person" | "phone";
  shared_notes: string;
  status: "scheduled" | "complete" | "cancelled";
  created_at: string;
  updated_at: string;
  meeting_students?: MeetingStudent[];
};

export type Grade = {
  id: string;
  student_id: string;
  subject: string;
  letter_grade: string;
  percentage: number | null;
  missing_assignments: number;
  reported_on: string;
};

export type Goal = {
  id: string;
  student_id: string;
  title: string;
  detail: string;
  status: "active" | "complete" | "paused";
  target_date: string | null;
  updated_at: string;
};

export type CurriculumItem = {
  id: string;
  track: string;
  meeting_number: number;
  title: string;
  start_prompt: string;
  discussion_questions: string[];
  activity: string;
  resources: string[];
  action_item: string;
  published: boolean;
};

export type WorkspaceData = {
  profile: Profile;
  students: Student[];
  cohorts: Cohort[];
  assignments: Assignment[];
  meetings: Meeting[];
  grades: Grade[];
  goals: Goal[];
  curriculum: CurriculumItem[];
};

export function displayDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export function displayTime(value: string) {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

export function toDateTimeLocal(value: string) {
  const date = new Date(value);
  const zoneOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - zoneOffset).toISOString().slice(0, 16);
}

export function gradePoint(letter: string) {
  const first = letter.trim().toUpperCase().slice(0, 1);
  return first === "A" ? 4 : first === "B" ? 3 : first === "C" ? 2 : first === "D" ? 1 : 0;
}
