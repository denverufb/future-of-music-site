-- Future of Music public Mentorship Program + applications
-- Run after mentorship-portal-setup.sql in Supabase > SQL Editor.
-- This safely adds a private application inbox and guardian phone field.

begin;

alter table public.mentorship_students
  add column if not exists guardian_phone text not null default '' check (length(guardian_phone) <= 40);

create table if not exists public.mentorship_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (length(trim(full_name)) between 2 and 200),
  student_phone text not null check (length(trim(student_phone)) between 7 and 40),
  student_email text not null check (length(trim(student_email)) between 5 and 320 and position('@' in student_email) > 1),
  school text not null check (length(trim(school)) between 2 and 240),
  guardian_name text not null check (length(trim(guardian_name)) between 2 and 200),
  guardian_phone text not null check (length(trim(guardian_phone)) between 7 and 40),
  why_participate text not null check (length(trim(why_participate)) between 10 and 5000),
  status text not null default 'submitted' check (status in ('submitted','reviewing','accepted','declined','invited')),
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists mentorship_application_status_date
  on public.mentorship_applications(status, submitted_at desc);

alter table public.mentorship_applications enable row level security;
revoke all on public.mentorship_applications from public;
grant insert on public.mentorship_applications to anon, authenticated;
grant select, update, delete on public.mentorship_applications to authenticated;

drop policy if exists mentorship_application_public_insert on public.mentorship_applications;
drop policy if exists mentorship_application_admin_manage on public.mentorship_applications;

-- Anyone may submit one complete application. Applications are never publicly readable.
create policy mentorship_application_public_insert
  on public.mentorship_applications
  for insert to anon, authenticated
  with check (
    status = 'submitted'
    and length(trim(full_name)) between 2 and 200
    and length(trim(student_phone)) between 7 and 40
    and length(trim(student_email)) between 5 and 320
    and length(trim(school)) between 2 and 240
    and length(trim(guardian_name)) between 2 and 200
    and length(trim(guardian_phone)) between 7 and 40
    and length(trim(why_participate)) between 10 and 5000
  );

-- Only an active mentorship administrator can view or manage submitted applications.
create policy mentorship_application_admin_manage
  on public.mentorship_applications
  for all to authenticated
  using (public.mentorship_is_admin())
  with check (public.mentorship_is_admin());

drop trigger if exists mentorship_application_touch_updated_at on public.mentorship_applications;
create trigger mentorship_application_touch_updated_at
  before update on public.mentorship_applications
  for each row execute function public.mentorship_touch_updated_at();

commit;
