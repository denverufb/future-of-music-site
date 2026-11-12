-- Run in the existing Finance Hub Supabase project. No financial permissions change.
begin;
create table if not exists public.program_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check(length(trim(display_name)) between 1 and 200),
  email text not null check(length(email) <= 320),
  active boolean not null default true
);
create unique index if not exists program_member_email_unique on public.program_members(lower(email));
create or replace function public.program_is_owner() returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.grant_members where user_id=auth.uid() and role='owner');
$$;
create or replace function public.program_has_access() returns boolean language sql stable security definer set search_path='' as $$
  select public.program_is_owner() or exists(select 1 from public.program_members where user_id=auth.uid() and active);
$$;
revoke all on function public.program_is_owner(), public.program_has_access() from public, anon;
grant execute on function public.program_is_owner(), public.program_has_access() to authenticated;

create table if not exists public.program_sites (
  id uuid primary key default gen_random_uuid(),
  name text not null check(length(trim(name)) between 1 and 200),
  program text not null check(length(trim(program)) between 1 and 200),
  unique(name,program)
);
create table if not exists public.program_students (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.program_sites(id),
  participant_code text not null unique check(length(trim(participant_code)) between 1 and 80),
  name text not null check(length(trim(name)) between 1 and 200),
  active boolean not null default true,
  survey_completed boolean not null default false,
  source_key text unique,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(id,site_id)
);
create table if not exists public.program_evaluations (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.program_students(id),
  week integer not null check(week between 1 and 4),
  engagement text not null default '' check(engagement in ('','Engaged','Slightly Engaged','Off Task')),
  evaluator_role text not null default '' check(evaluator_role in ('','Program Coach','Executive Director (ED)')),
  initials text not null default '' check(length(initials)<=30),
  notes text not null default '' check(length(notes)<=5000),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  source_key text unique, unique(student_id,week)
);
create table if not exists public.program_assessments (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.program_sites(id),
  student_id uuid,
  kind text not null check(kind in ('pre','post','skills','dj_review')),
  assessed_on date not null,
  payload jsonb not null check(jsonb_typeof(payload)='object' and octet_length(payload::text)<=40000),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  foreign key(student_id,site_id) references public.program_students(id,site_id),
  check((kind='dj_review' and student_id is null) or (kind<>'dj_review' and student_id is not null))
);
-- Feedback deliberately has no student, submitter, timestamp, or audit link.
create table if not exists public.program_feedback (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.program_sites(id),
  ratings integer[] not null check(cardinality(ratings)=4 and array_ndims(ratings)=1 and array_position(ratings,null) is null and ratings <@ array[0,1,2,3,4]),
  comment text not null default '' check(length(comment)<=5000)
);
create table if not exists public.program_activity (
  id uuid primary key default gen_random_uuid(), record_id uuid not null, record_type text not null,
  actor_id uuid references auth.users(id), action text not null, created_at timestamptz not null default now()
);
create index if not exists program_students_site on public.program_students(site_id);
create index if not exists program_assessments_student on public.program_assessments(student_id,kind);

create or replace function public.program_validate_assessment() returns trigger language plpgsql set search_path='' as $$
declare count_expected integer; max_rating integer; value jsonb; idx integer:=0;
begin
  count_expected:=case when new.kind='skills' then 11 else 12 end;
  max_rating:=case when new.kind='dj_review' then 4 else 2 end;
  if jsonb_typeof(new.payload->'ratings') is distinct from 'array' or jsonb_typeof(new.payload->'examples') is distinct from 'array' then raise exception 'Ratings and examples are required'; end if;
  if jsonb_array_length(new.payload->'ratings')<>count_expected or jsonb_array_length(new.payload->'examples')<>count_expected then raise exception 'Incorrect assessment length'; end if;
  for value in select * from jsonb_array_elements(new.payload->'ratings') loop
    if jsonb_typeof(value)<>'number' or value::text !~ '^[0-4]$' or (value::text)::int>max_rating then raise exception 'Invalid rating'; end if;
    if jsonb_typeof(new.payload->'examples'->idx) is distinct from 'string' or length(new.payload->'examples'->>idx)>1000 then raise exception 'Invalid observation'; end if;
    if new.kind='dj_review' and (value::text)::int>0 and length(trim(new.payload->'examples'->>idx))=0 then raise exception 'Observed practices need examples'; end if;
    idx:=idx+1;
  end loop;
  if new.kind='dj_review' and (coalesce(length(trim(new.payload->>'artist')),0)=0 or coalesce(length(trim(new.payload->>'reviewer')),0)=0) then raise exception 'Artist and reviewer required'; end if;
  if new.kind='skills' and coalesce(new.payload->>'phase','') not in ('pre','post') then raise exception 'Checklist timing required'; end if;
  return new;
end $$;
drop trigger if exists program_assessment_valid on public.program_assessments;
create trigger program_assessment_valid before insert or update on public.program_assessments for each row execute function public.program_validate_assessment();

create or replace function public.program_stamp() returns trigger language plpgsql set search_path='' as $$
begin
  if TG_OP='UPDATE' then new.id:=old.id; new.created_at:=old.created_at; new.updated_at:=clock_timestamp();
    if TG_TABLE_NAME<>'program_students' then new.created_by:=old.created_by; end if;
    if TG_TABLE_NAME='program_evaluations' then
      if new.student_id<>old.student_id or new.week<>old.week then raise exception 'Evaluation identity cannot change'; end if;
    elsif TG_TABLE_NAME='program_assessments' then
      if new.student_id is distinct from old.student_id or new.kind<>old.kind or new.site_id<>old.site_id then raise exception 'Assessment identity cannot change'; end if;
    end if;
  elsif TG_TABLE_NAME<>'program_students' then new.created_by:=auth.uid(); end if;
  return new;
end $$;
create or replace function public.program_audit() returns trigger language plpgsql security definer set search_path='' as $$
begin
  insert into public.program_activity(record_id,record_type,actor_id,action) values(new.id,TG_TABLE_NAME,auth.uid(),lower(TG_OP)); return null;
end $$;
revoke all on function public.program_stamp(), public.program_audit(), public.program_validate_assessment() from public,anon,authenticated;

do $$ declare t text; begin
  foreach t in array array['program_members','program_sites','program_students','program_evaluations','program_assessments','program_feedback','program_activity'] loop
    execute format('alter table public.%I enable row level security',t);
    execute format('revoke all on public.%I from anon,authenticated',t);
    execute format('grant select on public.%I to authenticated',t);
  end loop;
  foreach t in array array['program_students','program_evaluations','program_assessments'] loop
    execute format('drop trigger if exists program_stamp on public.%I',t);
    execute format('create trigger program_stamp before insert or update on public.%I for each row execute function public.program_stamp()',t);
    execute format('drop trigger if exists program_audit on public.%I',t);
    execute format('create trigger program_audit after insert or update on public.%I for each row execute function public.program_audit()',t);
  end loop;
  foreach t in array array['program_sites','program_students','program_evaluations','program_assessments','program_feedback'] loop
    execute format('drop policy if exists program_read on public.%I',t);
    execute format('create policy program_read on public.%I for select to authenticated using (public.program_has_access())',t);
  end loop;
  foreach t in array array['program_sites','program_students'] loop
    execute format('grant insert,update on public.%I to authenticated',t);
    execute format('drop policy if exists program_owner_write on public.%I',t);
    execute format('create policy program_owner_write on public.%I for all to authenticated using(public.program_is_owner()) with check(public.program_is_owner())',t);
  end loop;
  foreach t in array array['program_evaluations','program_assessments'] loop
    execute format('grant insert,update on public.%I to authenticated',t);
    execute format('drop policy if exists program_insert on public.%I',t);
    execute format('create policy program_insert on public.%I for insert to authenticated with check(public.program_has_access() and created_by=auth.uid())',t);
    execute format('drop policy if exists program_update on public.%I',t);
    execute format('create policy program_update on public.%I for update to authenticated using(public.program_is_owner() or (public.program_has_access() and created_by=auth.uid())) with check(public.program_is_owner() or (public.program_has_access() and created_by=auth.uid()))',t);
  end loop;
end $$;
grant insert on public.program_feedback to authenticated;
drop policy if exists feedback_insert on public.program_feedback;
create policy feedback_insert on public.program_feedback for insert to authenticated with check(public.program_has_access());
drop policy if exists members_read on public.program_members;
create policy members_read on public.program_members for select to authenticated using(user_id=auth.uid() or public.program_is_owner());
grant update(active,display_name) on public.program_members to authenticated;
drop policy if exists members_owner_update on public.program_members;
create policy members_owner_update on public.program_members for update to authenticated using(public.program_is_owner()) with check(public.program_is_owner());
drop policy if exists program_activity_owner on public.program_activity;
create policy program_activity_owner on public.program_activity for select to authenticated using(public.program_is_owner());

-- Coaches can mark completion, without receiving permission to edit student names/rosters.
create or replace function public.program_mark_survey(student uuid, completed boolean) returns void language plpgsql security definer set search_path='' as $$
begin
  if not public.program_has_access() then raise exception 'Not authorized'; end if;
  update public.program_students set survey_completed=completed where id=student;
  if not found then raise exception 'Student not found'; end if;
end $$;
revoke all on function public.program_mark_survey(uuid,boolean) from public,anon;
grant execute on function public.program_mark_survey(uuid,boolean) to authenticated;
insert into public.program_sites(name,program) select name,'JSD Youth DJ Program' from unnest(array['Fairview','Woodland','Northview','Hanrahan','Jennings Jr. High','Jennings High']) as name on conflict(name,program) do nothing;
commit;
