-- Future of Music Mentorship Portal
-- Run this once in Supabase > SQL Editor for the existing FOM project.
-- This creates a separate mentorship workspace. It does not alter finance,
-- grants, administration-hub, or existing DJ-program data.

begin;

create extension if not exists pgcrypto;

create table if not exists public.mentorship_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (length(trim(display_name)) between 1 and 200),
  email text not null check (length(trim(email)) between 3 and 320),
  role text not null check (role in ('admin','mentor','mentee','supervisor')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (email)
);

create table if not exists public.mentorship_cohorts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 160),
  starts_on date not null,
  ends_on date not null check (ends_on >= starts_on),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (title, starts_on)
);

create table if not exists public.mentorship_students (
  id uuid primary key default gen_random_uuid(),
  account_id uuid unique references auth.users(id) on delete set null,
  full_name text not null check (length(trim(full_name)) between 1 and 200),
  school text not null default '' check (length(school) <= 240),
  grade text not null default '' check (length(grade) <= 80),
  guardian_name text not null default '' check (length(guardian_name) <= 200),
  guardian_email text not null default '' check (length(guardian_email) <= 320),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mentorship_assignments (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references auth.users(id) on delete cascade,
  student_id uuid not null references public.mentorship_students(id) on delete cascade,
  cohort_id uuid references public.mentorship_cohorts(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (mentor_id, student_id, cohort_id)
);

create table if not exists public.mentorship_meetings (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references auth.users(id) on delete cascade,
  cohort_id uuid references public.mentorship_cohorts(id) on delete set null,
  meeting_at timestamptz not null,
  duration_minutes integer not null default 45 check (duration_minutes between 0 and 480),
  location text not null default 'virtual' check (location in ('virtual','in_person','phone')),
  shared_notes text not null default '' check (length(shared_notes) <= 20000),
  status text not null default 'complete' check (status in ('scheduled','complete','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mentorship_meeting_students (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.mentorship_meetings(id) on delete cascade,
  student_id uuid not null references public.mentorship_students(id) on delete cascade,
  attendance text not null default 'present' check (attendance in ('present','absent','rescheduled')),
  personal_notes text not null default '' check (length(personal_notes) <= 12000),
  goal text not null default '' check (length(goal) <= 3000),
  progress text not null default 'on_track' check (progress in ('on_track','needs_support','complete')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (meeting_id, student_id)
);

create table if not exists public.mentorship_grades (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.mentorship_students(id) on delete cascade,
  subject text not null check (length(trim(subject)) between 1 and 160),
  letter_grade text not null default '' check (length(letter_grade) <= 12),
  percentage numeric(5,2) check (percentage is null or percentage between 0 and 100),
  missing_assignments integer not null default 0 check (missing_assignments between 0 and 1000),
  reported_on date not null default current_date,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mentorship_goals (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.mentorship_students(id) on delete cascade,
  title text not null check (length(trim(title)) between 1 and 500),
  detail text not null default '' check (length(detail) <= 5000),
  status text not null default 'active' check (status in ('active','complete','paused')),
  target_date date,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mentorship_curriculum (
  id uuid primary key default gen_random_uuid(),
  track text not null check (length(trim(track)) between 1 and 160),
  meeting_number integer not null check (meeting_number between 1 and 99),
  title text not null check (length(trim(title)) between 1 and 500),
  start_prompt text not null default '' check (length(start_prompt) <= 5000),
  discussion_questions jsonb not null default '[]'::jsonb check (jsonb_typeof(discussion_questions) = 'array'),
  activity text not null default '' check (length(activity) <= 8000),
  resources jsonb not null default '[]'::jsonb check (jsonb_typeof(resources) = 'array'),
  action_item text not null default '' check (length(action_item) <= 5000),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (track, meeting_number)
);

create table if not exists public.mentorship_meeting_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.mentorship_students(id) on delete cascade,
  mentor_id uuid not null references auth.users(id) on delete cascade,
  requested_for timestamptz,
  note text not null default '' check (length(note) <= 3000),
  status text not null default 'pending' check (status in ('pending','approved','declined','rescheduled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists mentorship_assignment_mentor on public.mentorship_assignments(mentor_id);
create index if not exists mentorship_assignment_student on public.mentorship_assignments(student_id);
create index if not exists mentorship_meeting_mentor_date on public.mentorship_meetings(mentor_id, meeting_at desc);
create index if not exists mentorship_meeting_student_student on public.mentorship_meeting_students(student_id);
create index if not exists mentorship_grade_student_date on public.mentorship_grades(student_id, reported_on desc);
create index if not exists mentorship_goal_student_updated on public.mentorship_goals(student_id, updated_at desc);

create or replace function public.mentorship_touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := clock_timestamp();
  return new;
end;
$$;

create or replace function public.mentorship_role() returns text
language sql stable security definer set search_path = '' as $$
  select role from public.mentorship_profiles where user_id = auth.uid() and active limit 1;
$$;

create or replace function public.mentorship_is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(public.mentorship_role() = 'admin', false);
$$;

create or replace function public.mentorship_is_lead() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(public.mentorship_role() in ('admin','supervisor'), false);
$$;

-- Uses the existing Administration Hub owner record to activate the first
-- mentorship administrator without placing a personal email in this script.
create or replace function public.mentorship_bootstrap_owner() returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  if not exists(select 1 from public.grant_members where user_id = auth.uid() and role = 'owner') then
    return false;
  end if;

  insert into public.mentorship_profiles(user_id, display_name, email, role, active)
  select u.id,
         coalesce(nullif(pm.display_name, ''), split_part(u.email, '@', 1)),
         u.email,
         'admin',
         true
  from auth.users u
  left join public.program_members pm on pm.user_id = u.id
  where u.id = auth.uid()
  on conflict (user_id) do update set active = true;

  return true;
end;
$$;

create or replace function public.mentorship_can_access_student(student uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.mentorship_is_lead()
    or exists(select 1 from public.mentorship_students s where s.id = student and s.account_id = auth.uid())
    or exists(select 1 from public.mentorship_assignments a where a.student_id = student and a.mentor_id = auth.uid());
$$;

create or replace function public.mentorship_can_manage_student(student uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.mentorship_is_admin()
    or exists(select 1 from public.mentorship_assignments a where a.student_id = student and a.mentor_id = auth.uid());
$$;

create or replace function public.mentorship_can_access_meeting(meeting uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.mentorship_is_lead()
    or exists(select 1 from public.mentorship_meetings m where m.id = meeting and m.mentor_id = auth.uid())
    or exists(select 1 from public.mentorship_meeting_students ms where ms.meeting_id = meeting and public.mentorship_can_access_student(ms.student_id));
$$;

create or replace function public.mentorship_can_manage_meeting(meeting uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.mentorship_is_admin()
    or exists(select 1 from public.mentorship_meetings m where m.id = meeting and m.mentor_id = auth.uid());
$$;

revoke all on function public.mentorship_touch_updated_at(), public.mentorship_role(), public.mentorship_is_admin(), public.mentorship_is_lead(), public.mentorship_bootstrap_owner(), public.mentorship_can_access_student(uuid), public.mentorship_can_manage_student(uuid), public.mentorship_can_access_meeting(uuid), public.mentorship_can_manage_meeting(uuid) from public, anon;
grant execute on function public.mentorship_role(), public.mentorship_is_admin(), public.mentorship_is_lead(), public.mentorship_bootstrap_owner(), public.mentorship_can_access_student(uuid), public.mentorship_can_manage_student(uuid), public.mentorship_can_access_meeting(uuid), public.mentorship_can_manage_meeting(uuid) to authenticated;

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'mentorship_profiles','mentorship_cohorts','mentorship_students','mentorship_assignments',
    'mentorship_meetings','mentorship_meeting_students','mentorship_grades','mentorship_goals',
    'mentorship_curriculum','mentorship_meeting_requests'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on public.%I from anon', table_name);
    execute format('grant select, insert, update, delete on public.%I to authenticated', table_name);
  end loop;

  foreach table_name in array array[
    'mentorship_profiles','mentorship_cohorts','mentorship_students','mentorship_assignments',
    'mentorship_meetings','mentorship_meeting_students','mentorship_grades','mentorship_goals',
    'mentorship_curriculum','mentorship_meeting_requests'
  ] loop
    execute format('drop policy if exists mentorship_select on public.%I', table_name);
    execute format('drop policy if exists mentorship_admin_write on public.%I', table_name);
  end loop;
end;
$$;

create policy mentorship_select on public.mentorship_profiles for select to authenticated
  using (user_id = auth.uid() or public.mentorship_is_lead());
create policy mentorship_admin_write on public.mentorship_profiles for all to authenticated
  using (public.mentorship_is_admin()) with check (public.mentorship_is_admin());

create policy mentorship_select on public.mentorship_cohorts for select to authenticated
  using (public.mentorship_role() is not null);
create policy mentorship_admin_write on public.mentorship_cohorts for all to authenticated
  using (public.mentorship_is_admin()) with check (public.mentorship_is_admin());

create policy mentorship_select on public.mentorship_students for select to authenticated
  using (public.mentorship_can_access_student(id));
create policy mentorship_admin_write on public.mentorship_students for all to authenticated
  using (public.mentorship_is_admin()) with check (public.mentorship_is_admin());

create policy mentorship_select on public.mentorship_assignments for select to authenticated
  using (public.mentorship_is_lead() or mentor_id = auth.uid() or public.mentorship_can_access_student(student_id));
create policy mentorship_admin_write on public.mentorship_assignments for all to authenticated
  using (public.mentorship_is_admin()) with check (public.mentorship_is_admin());

create policy mentorship_select on public.mentorship_meetings for select to authenticated
  using (public.mentorship_can_access_meeting(id));
create policy mentorship_meeting_insert on public.mentorship_meetings for insert to authenticated
  with check (public.mentorship_is_admin() or mentor_id = auth.uid());
create policy mentorship_meeting_update on public.mentorship_meetings for update to authenticated
  using (public.mentorship_can_manage_meeting(id)) with check (public.mentorship_is_admin() or mentor_id = auth.uid());
create policy mentorship_meeting_delete on public.mentorship_meetings for delete to authenticated
  using (public.mentorship_can_manage_meeting(id));

create policy mentorship_select on public.mentorship_meeting_students for select to authenticated
  using (public.mentorship_can_access_meeting(meeting_id));
create policy mentorship_meeting_student_insert on public.mentorship_meeting_students for insert to authenticated
  with check (public.mentorship_can_manage_meeting(meeting_id));
create policy mentorship_meeting_student_update on public.mentorship_meeting_students for update to authenticated
  using (public.mentorship_can_manage_meeting(meeting_id)) with check (public.mentorship_can_manage_meeting(meeting_id));
create policy mentorship_meeting_student_delete on public.mentorship_meeting_students for delete to authenticated
  using (public.mentorship_can_manage_meeting(meeting_id));

create policy mentorship_select on public.mentorship_grades for select to authenticated
  using (public.mentorship_can_access_student(student_id));
create policy mentorship_grade_insert on public.mentorship_grades for insert to authenticated
  with check (public.mentorship_can_access_student(student_id));
create policy mentorship_grade_update on public.mentorship_grades for update to authenticated
  using (public.mentorship_can_access_student(student_id)) with check (public.mentorship_can_access_student(student_id));
create policy mentorship_grade_delete on public.mentorship_grades for delete to authenticated
  using (public.mentorship_can_manage_student(student_id));

create policy mentorship_select on public.mentorship_goals for select to authenticated
  using (public.mentorship_can_access_student(student_id));
create policy mentorship_goal_insert on public.mentorship_goals for insert to authenticated
  with check (public.mentorship_can_access_student(student_id));
create policy mentorship_goal_update on public.mentorship_goals for update to authenticated
  using (public.mentorship_can_access_student(student_id)) with check (public.mentorship_can_access_student(student_id));
create policy mentorship_goal_delete on public.mentorship_goals for delete to authenticated
  using (public.mentorship_can_manage_student(student_id));

create policy mentorship_select on public.mentorship_curriculum for select to authenticated
  using (published or public.mentorship_is_lead());
create policy mentorship_admin_write on public.mentorship_curriculum for all to authenticated
  using (public.mentorship_is_admin()) with check (public.mentorship_is_admin());

create policy mentorship_select on public.mentorship_meeting_requests for select to authenticated
  using (public.mentorship_is_lead() or mentor_id = auth.uid() or public.mentorship_can_access_student(student_id));
create policy mentorship_request_insert on public.mentorship_meeting_requests for insert to authenticated
  with check (public.mentorship_can_access_student(student_id));
create policy mentorship_request_update on public.mentorship_meeting_requests for update to authenticated
  using (public.mentorship_is_lead() or mentor_id = auth.uid() or public.mentorship_can_access_student(student_id))
  with check (public.mentorship_is_lead() or mentor_id = auth.uid() or public.mentorship_can_access_student(student_id));

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'mentorship_profiles','mentorship_cohorts','mentorship_students','mentorship_assignments',
    'mentorship_meetings','mentorship_meeting_students','mentorship_grades','mentorship_goals',
    'mentorship_curriculum','mentorship_meeting_requests'
  ] loop
    execute format('drop trigger if exists mentorship_touch_updated_at on public.%I', table_name);
    execute format('create trigger mentorship_touch_updated_at before update on public.%I for each row execute function public.mentorship_touch_updated_at()', table_name);
  end loop;
end;
$$;

-- Starter content demonstrates the structured curriculum format. Add or edit
-- the full 12-meeting paths in the Curriculum section after launch.
insert into public.mentorship_curriculum (track, meeting_number, title, start_prompt, discussion_questions, activity, resources, action_item, published)
values
  ('Academic readiness', 1, 'Check in, organize, and make a plan', 'What feels most important in school right now?', '["What is going well?","What needs attention this week?","What support would be useful?"]'::jsonb, 'Review current grades, missing work, and one realistic next step.', '["Grade tracker","School portal"]'::jsonb, 'Choose one action to complete before the next meeting.', true),
  ('Personal leadership', 1, 'Confidence, communication, and showing up', 'Where have you been proud of yourself lately?', '["What does confidence look like in practice?","How do you ask for help?","What is one new situation you can try?"]'::jsonb, 'Practice a short introduction and one way to communicate a need.', '["Reflection prompt","Goal planner"]'::jsonb, 'Try one communication habit this week and reflect on it.', true),
  ('Career & future planning', 1, 'Explore options and make a next-step plan', 'What are you curious to learn more about?', '["What strengths do you notice in yourself?","What careers connect to them?","What question do you want answered?"]'::jsonb, 'Map one interest to a role, skill, or experience worth exploring.', '["Career interest list","Opportunity search"]'::jsonb, 'Research one opportunity before the next meeting.', true),
  ('Entrepreneurship', 1, 'Turn an idea into a useful first step', 'What problem would you enjoy helping solve?', '["Who would your idea help?","What resources would it need?","What small test could you try first?"]'::jsonb, 'Sketch the audience, value, and first action for one idea.', '["Idea canvas","Simple budget worksheet"]'::jsonb, 'Share your idea with one trusted person and write down what you learn.', true)
on conflict (track, meeting_number) do nothing;

commit;
