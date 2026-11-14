-- Future of Music Program Administration: Time Clock & Payroll
-- Run once in the SAME Supabase project as program-administration-setup.sql.
-- This adds private staff timesheets. It does not change financial records.

begin;

create table if not exists public.program_time_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  work_date date not null default (timezone('America/Chicago', clock_timestamp()))::date,
  clock_in timestamptz not null default clock_timestamp(),
  clock_out timestamptz,
  break_minutes integer not null default 0 check (break_minutes between 0 and 480),
  note text not null default '' check (length(note) <= 2000),
  status text not null default 'Open' check (status in ('Open','Submitted','Approved','Needs changes','Paid')),
  rate_cents integer check (rate_cents is null or rate_cents >= 0),
  pay_period_start date,
  admin_note text not null default '' check (length(admin_note) <= 2000),
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  created_at timestamptz not null default clock_timestamp(),
  updated_at timestamptz not null default clock_timestamp(),
  check (clock_out is null or clock_out >= clock_in)
);

create unique index if not exists one_open_program_time_entry_per_user
  on public.program_time_entries(user_id) where clock_out is null;
create index if not exists program_time_entries_user_date
  on public.program_time_entries(user_id, work_date desc);
create index if not exists program_time_entries_pay_period
  on public.program_time_entries(pay_period_start, user_id);

create or replace function public.program_time_entry_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' then
    new.id := old.id;
    new.created_at := old.created_at;
    new.updated_at := clock_timestamp();

    if not public.program_is_owner() then
      if new.user_id <> old.user_id
        or new.work_date <> old.work_date
        or new.clock_in <> old.clock_in
        or new.rate_cents is distinct from old.rate_cents
        or new.pay_period_start is distinct from old.pay_period_start
        or new.admin_note <> old.admin_note
        or new.approved_by is distinct from old.approved_by
        or new.approved_at is distinct from old.approved_at then
        raise exception 'Only an administrator can change payroll details or recorded time';
      end if;

      if new.clock_out is distinct from old.clock_out
        and current_setting('app.program_time_clocking', true) is distinct from 'on' then
        raise exception 'Use Clock out to record your finish time';
      end if;

      if old.status in ('Approved','Paid') then
        raise exception 'This approved timesheet can only be changed by an administrator';
      end if;

      if new.status not in ('Open','Submitted') then
        raise exception 'Only an administrator can change this timesheet status';
      end if;
    end if;
  end if;
  return new;
end;
$$;

create or replace function public.program_time_clock_in(entry_note text default '')
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare entry_id uuid;
begin
  if auth.uid() is null or not public.program_has_access() then
    raise exception 'Not authorized to use the program time clock';
  end if;
  if length(coalesce(entry_note,'')) > 2000 then
    raise exception 'Work note is too long';
  end if;
  if exists (select 1 from public.program_time_entries where user_id = auth.uid() and clock_out is null) then
    raise exception 'You already have an open time entry. Clock out before starting another one.';
  end if;

  insert into public.program_time_entries(user_id, work_date, clock_in, note)
  values (auth.uid(), (timezone('America/Chicago', clock_timestamp()))::date, clock_timestamp(), trim(coalesce(entry_note,'')))
  returning id into entry_id;
  return entry_id;
end;
$$;

create or replace function public.program_time_clock_out(entry_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not public.program_has_access() then
    raise exception 'Not authorized to use the program time clock';
  end if;
  perform set_config('app.program_time_clocking', 'on', true);
  update public.program_time_entries
     set clock_out = clock_timestamp()
   where id = entry_id
     and clock_out is null
     and (user_id = auth.uid() or public.program_is_owner());
  if not found then
    raise exception 'Open time entry not found';
  end if;
end;
$$;

revoke all on function public.program_time_entry_guard() from public, anon, authenticated;
revoke all on function public.program_time_clock_in(text), public.program_time_clock_out(uuid) from public, anon;
grant execute on function public.program_time_clock_in(text), public.program_time_clock_out(uuid) to authenticated;

drop trigger if exists program_time_entry_guard on public.program_time_entries;
create trigger program_time_entry_guard
  before update on public.program_time_entries
  for each row execute function public.program_time_entry_guard();

alter table public.program_time_entries enable row level security;
revoke all on public.program_time_entries from anon, authenticated;
grant select on public.program_time_entries to authenticated;
grant update (break_minutes, note, status, rate_cents, pay_period_start, admin_note, approved_by, approved_at) on public.program_time_entries to authenticated;

drop policy if exists program_time_owner_all on public.program_time_entries;
create policy program_time_owner_all on public.program_time_entries
  for all to authenticated
  using (public.program_is_owner())
  with check (public.program_is_owner());

drop policy if exists program_time_coach_read on public.program_time_entries;
create policy program_time_coach_read on public.program_time_entries
  for select to authenticated
  using (public.program_has_access() and user_id = auth.uid());

drop policy if exists program_time_coach_update on public.program_time_entries;
create policy program_time_coach_update on public.program_time_entries
  for update to authenticated
  using (public.program_has_access() and user_id = auth.uid())
  with check (public.program_has_access() and user_id = auth.uid());

commit;
