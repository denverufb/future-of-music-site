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
  guardian_phone: string;
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
  meeting_number?: number;
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
  duration_seconds?: number;
  location: "virtual" | "in_person" | "phone";
  shared_notes: string;
  status: "scheduled" | "complete" | "cancelled";
  recurrence_id?: string | null;
  recurrence_label?: string | null;
  created_at: string;
  updated_at: string;
  meeting_students?: MeetingStudent[];
};

export type PrivateMeetingNote = {
  id: string;
  meeting_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
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

export type ApplicationStatus = "submitted" | "reviewing" | "accepted" | "declined" | "invited";

export type MentorshipApplication = {
  id: string;
  full_name: string;
  student_phone: string;
  student_email: string;
  school: string;
  guardian_name: string;
  guardian_phone: string;
  why_participate: string;
  status: ApplicationStatus;
  submitted_at: string;
  updated_at: string;
};

export type WorkspaceData = {
  profile: Profile;
  team: Profile[];
  students: Student[];
  cohorts: Cohort[];
  assignments: Assignment[];
  meetings: Meeting[];
  grades: Grade[];
  goals: Goal[];
  curriculum: CurriculumItem[];
  applications: MentorshipApplication[];
  privateNotes: PrivateMeetingNote[];
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

export function meetingNumberForStudent(studentId: string, meetings: Meeting[]) {
  const completedEntries = meetings
    .filter((meeting) => meeting.status === "complete")
    .sort((left, right) => left.meeting_at.localeCompare(right.meeting_at))
    .flatMap((meeting) => (meeting.meeting_students || []).filter((entry) => entry.student_id === studentId));
  const recordedNumbers = completedEntries.map((entry) => entry.meeting_number || 0).filter(Boolean);
  return recordedNumbers.length ? Math.max(...recordedNumbers) + 1 : completedEntries.length + 1;
}

export function meetingNumberForRecord(studentId: string, meetingId: string, meetings: Meeting[]) {
  const matchingMeeting = meetings.find((meeting) => meeting.id === meetingId);
  const storedNumber = matchingMeeting?.meeting_students?.find((entry) => entry.student_id === studentId)?.meeting_number;
  if (storedNumber) return storedNumber;
  const completedIds = meetings
    .filter((meeting) => meeting.status === "complete" && meeting.meeting_students?.some((entry) => entry.student_id === studentId))
    .sort((left, right) => left.meeting_at.localeCompare(right.meeting_at))
    .map((meeting) => meeting.id);
  const position = completedIds.indexOf(meetingId);
  return position >= 0 ? position + 1 : meetingNumberForStudent(studentId, meetings);
}

export function gradeBandForStudent(student: Student) {
  const grade = Number.parseInt(student.grade, 10);
  if (!Number.isFinite(grade) || grade <= 7) return "5th–7th";
  if (grade <= 9) return "8th–9th";
  if (grade <= 11) return "10th–11th";
  return "12th";
}

export function curriculumForStudent(student: Student, meetingNumber: number, curriculum: CurriculumItem[]) {
  const gradeBand = gradeBandForStudent(student);
  return curriculum.filter((item) => item.meeting_number === meetingNumber && (!item.track.startsWith("College & Career Readiness") || item.track.includes(gradeBand)));
}
