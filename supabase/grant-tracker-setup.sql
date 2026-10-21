-- FOM Grant Tracker. Run once in Supabase SQL Editor as the project owner.
-- First create aereon@fomusic.org in Authentication > Users > Add user.
-- Keep public sign-ups disabled. No passwords belong in this file.
begin;

create table if not exists public.grant_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'viewer')),
  created_at timestamptz not null default now()
);
create unique index if not exists grant_single_owner on public.grant_members(role) where role = 'owner';

create table if not exists public.grants (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 200),
  funder text not null check (length(trim(funder)) between 1 and 200),
  status text not null default 'Researching' check (status in ('Researching','Preparing','Submitted','Awarded','Declined','Withdrawn')),
  program text not null default '' check (length(program) <= 200),
  requested_amount numeric(12,2) check (requested_amount >= 0),
  awarded_amount numeric(12,2) check (awarded_amount >= 0),
  received_amount numeric(12,2) check (received_amount >= 0),
  opens_on date, deadline date, submitted_on date, decision_on date, reporting_on date,
  project_starts_on date, project_ends_on date,
  deadline_details text not null default '' check (length(deadline_details) <= 500),
  website_url text not null default '' check (length(website_url) <= 2000),
  application_url text not null default '' check (length(application_url) <= 2000),
  contact_name text not null default '' check (length(contact_name) <= 200),
  contact_email text not null default '' check (length(contact_email) <= 320),
  eligibility text not null default '' check (length(eligibility) <= 10000),
  restrictions text not null default '' check (length(restrictions) <= 10000),
  notes text not null default '' check (length(notes) <= 20000),
  links jsonb not null default '[]'::jsonb check (jsonb_typeof(links) = 'array' and jsonb_array_length(links) <= 30),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (project_ends_on is null or project_starts_on is null or project_ends_on >= project_starts_on),
  check (deadline is null or opens_on is null or deadline >= opens_on)
);
create table if not exists public.grant_tasks (
  id uuid primary key default gen_random_uuid(),
  grant_id uuid not null references public.grants(id) on delete cascade,
  title text not null check (length(trim(title)) between 1 and 300),
  due_on date,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists grant_tasks_grant_id on public.grant_tasks(grant_id);
create table if not exists public.grant_activity (
  id uuid primary key default gen_random_uuid(),
  grant_id uuid not null references public.grants(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  created_at timestamptz not null default now()
);
create index if not exists grant_activity_grant_created on public.grant_activity(grant_id, created_at desc);

alter table public.grant_members enable row level security;
alter table public.grants enable row level security;
alter table public.grant_tasks enable row level security;
alter table public.grant_activity enable row level security;

-- Start with explicit privileges. Anonymous requests have no table access.
revoke all on public.grant_members, public.grants, public.grant_tasks, public.grant_activity from anon, authenticated;
grant select on public.grant_members, public.grants, public.grant_tasks, public.grant_activity to authenticated;
grant insert, update on public.grants to authenticated;
grant insert, update, delete on public.grant_tasks to authenticated;

drop policy if exists member_reads_own_role on public.grant_members;
create policy member_reads_own_role on public.grant_members for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists grants_member_read on public.grants;
create policy grants_member_read on public.grants for select to authenticated using (exists (select 1 from public.grant_members where user_id = (select auth.uid())));
drop policy if exists grants_owner_insert on public.grants;
create policy grants_owner_insert on public.grants for insert to authenticated with check (exists (select 1 from public.grant_members where user_id = (select auth.uid()) and role = 'owner'));
drop policy if exists grants_owner_update on public.grants;
create policy grants_owner_update on public.grants for update to authenticated using (exists (select 1 from public.grant_members where user_id = (select auth.uid()) and role = 'owner')) with check (exists (select 1 from public.grant_members where user_id = (select auth.uid()) and role = 'owner'));

drop policy if exists tasks_member_read on public.grant_tasks;
create policy tasks_member_read on public.grant_tasks for select to authenticated using (exists (select 1 from public.grant_members where user_id = (select auth.uid())));
drop policy if exists tasks_owner_write on public.grant_tasks;
create policy tasks_owner_write on public.grant_tasks for all to authenticated using (exists (select 1 from public.grant_members where user_id = (select auth.uid()) and role = 'owner')) with check (exists (select 1 from public.grant_members where user_id = (select auth.uid()) and role = 'owner'));

drop policy if exists activity_member_read on public.grant_activity;
create policy activity_member_read on public.grant_activity for select to authenticated using (exists (select 1 from public.grant_members where user_id = (select auth.uid())));

create or replace function public.grant_stamp_update() returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := clock_timestamp();
  new.created_at := old.created_at;
  new.id := old.id;
  return new;
end $$;
drop trigger if exists grants_stamp on public.grants;
create trigger grants_stamp before update on public.grants for each row execute function public.grant_stamp_update();
drop trigger if exists tasks_stamp on public.grant_tasks;
create trigger tasks_stamp before update on public.grant_tasks for each row execute function public.grant_stamp_update();

create or replace function public.grant_record_activity() returns trigger language plpgsql security definer set search_path = '' as $$
declare target uuid; description text;
begin
  if TG_TABLE_NAME = 'grants' then
    target := new.id;
    if TG_OP = 'INSERT' then description := 'Grant created';
    elsif new.archived_at is distinct from old.archived_at then
      description := case when new.archived_at is null then 'Grant restored' else 'Grant archived' end;
    elsif new.status is distinct from old.status then description := 'Status changed to ' || new.status;
    else description := 'Grant details updated'; end if;
  else
    if TG_OP = 'DELETE' then target := old.grant_id; description := 'Task removed';
    else target := new.grant_id;
      if TG_OP = 'INSERT' then description := 'Task added';
      elsif new.completed then description := 'Task completed';
      else description := 'Task reopened'; end if;
    end if;
  end if;
  insert into public.grant_activity(grant_id, actor_id, action) values (target, auth.uid(), description);
  return null;
end $$;
revoke all on function public.grant_stamp_update() from public, anon, authenticated;
revoke all on function public.grant_record_activity() from public, anon, authenticated;
drop trigger if exists grants_activity on public.grants;
create trigger grants_activity after insert or update on public.grants for each row execute function public.grant_record_activity();
drop trigger if exists tasks_activity on public.grant_tasks;
create trigger tasks_activity after insert or update or delete on public.grant_tasks for each row execute function public.grant_record_activity();

-- Membership is assigned by immutable user ID, not a browser flag or editable metadata.
do $$
declare owner_id uuid;
begin
  select id into owner_id from auth.users where lower(email) = 'aereon@fomusic.org' and email_confirmed_at is not null;
  if owner_id is null then
    raise exception 'Create and confirm aereon@fomusic.org in Authentication > Users first, then run this script again. No changes have been saved.';
  end if;
  insert into public.grant_members(user_id, role) values (owner_id, 'owner') on conflict (user_id) do update set role = 'owner';
end $$;
commit;
