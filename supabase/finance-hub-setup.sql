-- Extend the existing private grant workspace. No workbook data belongs in this file.
begin;
do $$ begin
  if not exists (select 1 from public.grant_members where role = 'owner') then
    raise exception 'Complete the grant tracker setup first.';
  end if;
end $$;

create table if not exists public.finance_transactions (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('revenue','expense')),
  occurred_on date not null,
  category text not null check (length(trim(category)) between 1 and 200),
  counterparty text not null default '' check (length(counterparty) <= 300),
  description text not null check (length(trim(description)) between 1 and 1000),
  program text not null default '' check (length(program) <= 200),
  payment_method text not null default '' check (length(payment_method) <= 100),
  amount numeric(12,2) not null check (amount >= 0 and amount <> 'NaN'::numeric),
  restricted boolean not null default false,
  reimbursable boolean not null default false,
  paid boolean not null default false,
  in_kind boolean not null default false,
  status text not null default 'Received' check (status in ('Received','Pledged','Pending','Cancelled')),
  receipt_url text not null default '' check (length(receipt_url) <= 2000),
  notes text not null default '' check (length(notes) <= 20000),
  grant_id uuid references public.grants(id) on delete restrict,
  source_key text unique,
  source_label text not null default '',
  voided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists finance_transactions_date on public.finance_transactions(occurred_on);
create index if not exists finance_transactions_grant on public.finance_transactions(grant_id);
create table if not exists public.finance_budgets (
  id uuid primary key default gen_random_uuid(),
  year integer not null check (year between 2000 and 2200),
  kind text not null check (kind in ('revenue','expense')),
  category text not null check (length(trim(category)) between 1 and 200),
  amount numeric(12,2) not null check (amount >= 0 and amount <> 'NaN'::numeric),
  notes text not null default '' check (length(notes) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(year,kind,category)
);
create table if not exists public.finance_activity (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null,
  record_type text not null,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  before_value jsonb,
  after_value jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists finance_activity_record on public.finance_activity(record_id,created_at desc);

alter table public.finance_transactions enable row level security;
alter table public.finance_budgets enable row level security;
alter table public.finance_activity enable row level security;
revoke all on public.finance_transactions, public.finance_budgets, public.finance_activity from anon, authenticated;
grant select on public.finance_transactions, public.finance_budgets, public.finance_activity to authenticated;
grant insert,update on public.finance_transactions, public.finance_budgets to authenticated;

do $$ declare t text; begin
  foreach t in array array['finance_transactions','finance_budgets','finance_activity'] loop
    execute format('drop policy if exists finance_member_read on public.%I',t);
    execute format('create policy finance_member_read on public.%I for select to authenticated using (exists (select 1 from public.grant_members where user_id = (select auth.uid())))',t);
  end loop;
  foreach t in array array['finance_transactions','finance_budgets'] loop
    execute format('drop policy if exists finance_owner_insert on public.%I',t);
    execute format('create policy finance_owner_insert on public.%I for insert to authenticated with check (exists (select 1 from public.grant_members where user_id = (select auth.uid()) and role = ''owner''))',t);
    execute format('drop policy if exists finance_owner_update on public.%I',t);
    execute format('create policy finance_owner_update on public.%I for update to authenticated using (exists (select 1 from public.grant_members where user_id = (select auth.uid()) and role = ''owner'')) with check (exists (select 1 from public.grant_members where user_id = (select auth.uid()) and role = ''owner''))',t);
    execute format('drop trigger if exists finance_stamp on public.%I',t);
    execute format('create trigger finance_stamp before update on public.%I for each row execute function public.grant_stamp_update()',t);
  end loop;
end $$;

create or replace function public.finance_record_activity() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.finance_activity(record_id,record_type,actor_id,action,before_value,after_value)
  values(new.id,TG_TABLE_NAME,auth.uid(),case when TG_OP='INSERT' then 'Created' else 'Updated' end,
    case when TG_OP='UPDATE' then to_jsonb(old) else null end,to_jsonb(new));
  return null;
end $$;
revoke all on function public.finance_record_activity() from public,anon,authenticated;
drop trigger if exists finance_audit on public.finance_transactions;
create trigger finance_audit after insert or update on public.finance_transactions for each row execute function public.finance_record_activity();
drop trigger if exists finance_audit on public.finance_budgets;
create trigger finance_audit after insert or update on public.finance_budgets for each row execute function public.finance_record_activity();
commit;
