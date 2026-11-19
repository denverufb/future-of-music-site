-- Future of Music Youth Development Mentor applications
-- Run once in Supabase > SQL Editor. This creates a private application inbox.

begin;

create table if not exists public.mentorship_mentor_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (length(trim(full_name)) between 2 and 200),
  date_of_birth date not null,
  phone text not null check (length(trim(phone)) between 7 and 40),
  email text not null check (length(trim(email)) between 5 and 320 and position('@' in email) > 1),
  school text not null check (length(trim(school)) between 2 and 240),
  salutation text not null default '' check (length(trim(salutation)) <= 50),
  career_path text not null check (length(trim(career_path)) between 2 and 500),
  why_mentor text not null check (length(trim(why_mentor)) between 20 and 2000),
  status text not null default 'submitted' check (status in ('submitted', 'reviewing', 'accepted', 'declined')),
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists mentorship_mentor_application_status_date
  on public.mentorship_mentor_applications(status, submitted_at desc);

alter table public.mentorship_mentor_applications enable row level security;
revoke all on public.mentorship_mentor_applications from public;
grant insert on public.mentorship_mentor_applications to anon, authenticated;
grant select, update, delete on public.mentorship_mentor_applications to authenticated;

drop policy if exists mentorship_mentor_application_public_insert on public.mentorship_mentor_applications;
drop policy if exists mentorship_mentor_application_admin_manage on public.mentorship_mentor_applications;

-- Applicants may submit complete applications but cannot read any applications.
create policy mentorship_mentor_application_public_insert
  on public.mentorship_mentor_applications
  for insert to anon, authenticated
  with check (
    status = 'submitted'
    and length(trim(full_name)) between 2 and 200
    and length(trim(phone)) between 7 and 40
    and length(trim(email)) between 5 and 320
    and length(trim(school)) between 2 and 240
    and length(trim(career_path)) between 2 and 500
    and length(trim(why_mentor)) between 20 and 2000
  );

-- Only the active Future of Music mentorship administrator can review or manage them.
create policy mentorship_mentor_application_admin_manage
  on public.mentorship_mentor_applications
  for all to authenticated
  using (public.mentorship_is_admin())
  with check (public.mentorship_is_admin());

drop trigger if exists mentorship_mentor_application_touch_updated_at on public.mentorship_mentor_applications;
create trigger mentorship_mentor_application_touch_updated_at
  before update on public.mentorship_mentor_applications
  for each row execute function public.mentorship_touch_updated_at();

commit;
