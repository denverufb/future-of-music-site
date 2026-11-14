-- Future of Music Program Administration: team titles
-- Run once after program-administration-setup.sql in the same Supabase project.

begin;

alter table public.program_members
  add column if not exists position text not null default 'Program Coach'
  check (length(trim(position)) between 1 and 120);

grant update(position) on public.program_members to authenticated;

commit;
