export const schools = ['Fairview', 'Woodland', 'Northview', 'Hanrahan', 'Jennings Jr. High', 'Jennings High'] as const;
export const engagementLevels = ['Engaged', 'Slightly Engaged', 'Off Task'] as const;
export const surveyStatements = [
  'I can name the main parts of a DJ setup.', 'I can use DJ and music equipment safely.',
  'I can explain beat, tempo, or BPM.', 'I can cue a song before other people hear it.',
  'I can match beats or tempos.', 'I can make a smooth transition between songs.',
  'I can choose and organize songs for a DJ set.', 'I can make a beat or arrange music with digital tools.',
  'I can explain one creative choice I made.', 'I can work with others and use feedback.',
  'I can share my mix, beat, or music idea with confidence.', 'I can name a job or business opportunity in music.',
];
export const skillsStatements = [
  'Names basic DJ equipment and handles it safely.', 'Cues a track at an intentional starting point.',
  'Explains beat, tempo, or BPM.', 'Matches beats or tempos at an appropriate level.',
  'Creates a planned transition between two songs.', 'Selects and organizes music for an audience or purpose.',
  'Creates or edits a beat, rhythm, or arrangement.', 'Explains at least one creative choice.',
  'Works respectfully with others and uses feedback.', 'Shares a mix, beat, or creative idea.',
  'Names a music career or business opportunity.',
];
export const djStatements = [
  'Preparation: comes prepared with organized music, equipment needs, and a plan.',
  'Setup: uses safe and efficient setup, sound-check, and breakdown practices.',
  'DJ technique: uses cueing, phrasing, beat alignment, and transitions effectively.',
  'Sound: manages gain, EQ, levels, and monitoring for clean sound.',
  'Music selection: chooses music for the audience, setting, and program purpose.',
  'Set design: creates a clear flow and adjusts when conditions change.',
  'Performance: shows confidence, focus, and appropriate audience engagement.',
  'Artistic voice: makes creative choices and can explain the artistic intent.',
  'Professionalism: communicates clearly, meets commitments, and uses feedback.',
  'Teaching: explains skills clearly and checks that students understand.',
  'Youth engagement: creates a safe space for youth to experiment and ask questions.',
  'Mentorship: connects DJ and music skills to careers and entrepreneurship.',
];
export const feedbackStatements = [
  'The program helped me improve my leadership skills.',
  'I feel more confident using DJ equipment and music technology.',
  'I improved my ability to work and collaborate with others.',
  'I feel more confident sharing my ideas or performing.',
];
export const formNames = { pre: 'Student pre-program survey', post: 'Student post-program survey', skills: 'Student skills checklist', dj_review: 'Professional DJ development review', feedback: 'Anonymous program feedback' } as const;
export type FormKind = keyof typeof formNames;
export type Site = { id: string; name: string; program: string };
export type Student = { id: string; site_id: string; participant_code: string; name: string; active: boolean; survey_completed: boolean; updated_at: string };
export type Evaluation = { id: string; student_id: string; week: number; engagement: string; evaluator_role: string; initials: string; notes: string; created_by: string | null; updated_at: string };
export type AssessmentPayload = { phase: 'pre'|'post'; ratings: (number | null)[]; examples: string[]; next_step: string; strength: string; growth_area: string; artist: string; reviewer: string; setting: string; follow_up: string; reviewer_signature: string; artist_signature: string };
export type Assessment = { id: string; site_id: string; student_id: string | null; kind: Exclude<FormKind, 'feedback'>; assessed_on: string; payload: AssessmentPayload; created_by: string | null; updated_at: string };
export type Feedback = { id: string; site_id: string; ratings: number[]; comment: string };
export function questionsFor(kind: FormKind) { return kind === 'skills' ? skillsStatements : kind === 'dj_review' ? djStatements : kind === 'feedback' ? feedbackStatements : surveyStatements; }
export function optionsFor(kind: FormKind) { return kind === 'skills' ? ['Not yet', 'With help', 'Independently'] : kind === 'dj_review' ? ['Not observed', 'Starting', 'Growing', 'Consistent', 'Professional-ready'] : kind === 'feedback' ? ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] : ["I can’t yet", 'I kinda can', 'I can']; }
export function emptyAssessment(kind: FormKind): AssessmentPayload { return {phase:kind==='pre'?'pre':'post',ratings: questionsFor(kind).map(() => null), examples: questionsFor(kind).map(() => ''), next_step: '', strength: '', growth_area: '', artist: '', reviewer: '', setting: '', follow_up: '', reviewer_signature: '', artist_signature: ''}; }
export function evaluationComplete(e: Pick<Evaluation, 'engagement' | 'evaluator_role' | 'initials'>) { return engagementLevels.includes(e.engagement as typeof engagementLevels[number]) && ['Program Coach','Executive Director (ED)'].includes(e.evaluator_role) && Boolean(e.initials.trim()); }
export function validateAssessment(kind: FormKind, p: AssessmentPayload) {
  const max = optionsFor(kind).length - 1;
  if (p.ratings.length !== questionsFor(kind).length || p.ratings.some(r => r === null || !Number.isInteger(r) || r < 0 || r > max)) return 'Choose a response for every statement. For the DJ review, use Not observed where appropriate.';
  if (p.examples.length !== p.ratings.length || p.examples.some(s => s.length > 1000)) return 'Keep each observation under 1,000 characters.';
  if (kind === 'dj_review' && (!p.artist.trim() || !p.reviewer.trim())) return 'Enter the teaching artist and reviewer names.';
  if (kind === 'dj_review' && p.ratings.some((r,i) => r !== 0 && !p.examples[i].trim())) return 'Add a short example for each observed professional practice.';
  return '';
}
export function programSummary(students: Student[], evaluations: Evaluation[]) {
  const active = students.filter(s => s.active), ids = new Set(active.map(s=>s.id));
  const complete = evaluations.filter(e=>ids.has(e.student_id) && evaluationComplete(e));
  return { students: active.length, evaluations: complete.length, expected: active.length * 4, allFour: active.filter(s => new Set(complete.filter(e=>e.student_id===s.id).map(e=>e.week)).size===4).length, surveyCompleted: active.filter(s=>s.survey_completed).length, drafts: evaluations.filter(e=>ids.has(e.student_id) && !evaluationComplete(e)).length };
}
