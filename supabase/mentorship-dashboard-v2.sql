-- Future of Music Mentorship Workspace: dashboard improvements
-- Run this once in Supabase > SQL Editor after mentorship-portal-setup.sql.
-- It keeps the existing portal and records intact. It adds precise meeting
-- timing, recurring-meeting labels, and a private mentor/admin notes area.

begin;

alter table public.mentorship_meetings
  add column if not exists duration_seconds integer check (duration_seconds is null or duration_seconds between 0 and 28800),
  add column if not exists recurrence_id uuid,
  add column if not exists recurrence_label text not null default '' check (length(recurrence_label) <= 160);

create table if not exists public.mentorship_private_notes (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null unique references public.mentorship_meetings(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  content text not null default '' check (length(content) <= 24000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.mentorship_private_notes enable row level security;
revoke all on public.mentorship_private_notes from anon;
grant select, insert, update, delete on public.mentorship_private_notes to authenticated;

drop policy if exists mentorship_private_notes_select on public.mentorship_private_notes;
drop policy if exists mentorship_private_notes_insert on public.mentorship_private_notes;
drop policy if exists mentorship_private_notes_update on public.mentorship_private_notes;
drop policy if exists mentorship_private_notes_delete on public.mentorship_private_notes;

create policy mentorship_private_notes_select on public.mentorship_private_notes for select to authenticated
  using (public.mentorship_can_manage_meeting(meeting_id));
create policy mentorship_private_notes_insert on public.mentorship_private_notes for insert to authenticated
  with check (author_id = auth.uid() and public.mentorship_can_manage_meeting(meeting_id));
create policy mentorship_private_notes_update on public.mentorship_private_notes for update to authenticated
  using (public.mentorship_can_manage_meeting(meeting_id))
  with check (author_id = auth.uid() and public.mentorship_can_manage_meeting(meeting_id));
create policy mentorship_private_notes_delete on public.mentorship_private_notes for delete to authenticated
  using (public.mentorship_can_manage_meeting(meeting_id));

drop trigger if exists mentorship_touch_updated_at on public.mentorship_private_notes;
create trigger mentorship_touch_updated_at before update on public.mentorship_private_notes
  for each row execute function public.mentorship_touch_updated_at();

create index if not exists mentorship_meeting_recurrence on public.mentorship_meetings(recurrence_id, meeting_at);

commit;
