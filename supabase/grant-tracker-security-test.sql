-- Run AFTER setup. Everything below is temporary and rolled back.
-- Any failed assertion stops this script. If stopped, run ROLLBACK before retrying.
begin;
insert into auth.users(id, email, email_confirmed_at) values
 ('11111111-1111-4111-8111-111111111111', 'fom-viewer-test@example.invalid', now()),
 ('22222222-2222-4222-8222-222222222222', 'fom-unlisted-test@example.invalid', now());
insert into public.grant_members(user_id, role) values ('11111111-1111-4111-8111-111111111111', 'viewer');
select set_config('request.jwt.claim.sub', (select user_id::text from public.grant_members where role = 'owner'), true);
set local role authenticated;
insert into public.grants(id,title,funder) values ('33333333-3333-4333-8333-333333333333','Security test - rolled back','FOM test');
update public.grants set status='Preparing' where id='33333333-3333-4333-8333-333333333333';
insert into public.grant_tasks(id,grant_id,title) values ('44444444-4444-4444-8444-444444444444','33333333-3333-4333-8333-333333333333','Test task');
update public.grant_tasks set completed=true where id='44444444-4444-4444-8444-444444444444';
do $$ begin
  if not exists (select 1 from public.grants where id='33333333-3333-4333-8333-333333333333' and status='Preparing') then raise exception 'Owner update failed'; end if;
  if not exists (select 1 from public.grant_tasks where id='44444444-4444-4444-8444-444444444444' and completed) then raise exception 'Owner task update failed'; end if;
  if (select count(*) from public.grant_activity where grant_id='33333333-3333-4333-8333-333333333333') <> 4 then raise exception 'Activity logging failed'; end if;
  begin
    update public.grant_members set role='owner' where user_id='11111111-1111-4111-8111-111111111111';
    raise exception 'Owner must not be able to modify membership through the API';
  exception when insufficient_privilege then null; end;
end $$;

-- Viewer can read, cannot write, cannot promote itself, cannot forge activity.
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111', true);
do $$ declare changed integer; begin
  if not exists (select 1 from public.grants where id='33333333-3333-4333-8333-333333333333') then raise exception 'Viewer read failed'; end if;
  if not exists (select 1 from public.grant_tasks where id='44444444-4444-4444-8444-444444444444') then raise exception 'Viewer task read failed'; end if;
  update public.grants set title='Unauthorized' where id='33333333-3333-4333-8333-333333333333';
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'Viewer edited a grant'; end if;
  update public.grant_tasks set completed=false where id='44444444-4444-4444-8444-444444444444';
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'Viewer edited a task'; end if;
  delete from public.grant_tasks where id='44444444-4444-4444-8444-444444444444';
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'Viewer deleted a task'; end if;
  begin
    insert into public.grants(title,funder) values ('Unauthorized','Test');
    raise exception 'Viewer created a grant';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.grant_tasks(grant_id,title) values ('33333333-3333-4333-8333-333333333333','Unauthorized');
    raise exception 'Viewer created a task';
  exception when insufficient_privilege then null; end;
  begin
    update public.grant_members set role='owner' where user_id=auth.uid();
    raise exception 'Viewer promoted itself';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.grant_activity(grant_id,action) values ('33333333-3333-4333-8333-333333333333','Forged');
    raise exception 'Viewer forged activity';
  exception when insufficient_privilege then null; end;
end $$;

-- Signing in is not sufficient: unlisted users see no records or memberships.
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222', true);
do $$ begin
  if exists (select 1 from public.grants) then raise exception 'Unlisted account read grants'; end if;
  if exists (select 1 from public.grant_tasks) then raise exception 'Unlisted account read tasks'; end if;
  if exists (select 1 from public.grant_activity) then raise exception 'Unlisted account read activity'; end if;
  if exists (select 1 from public.grant_members) then raise exception 'Unlisted account read memberships'; end if;
end $$;

set local role anon;
select set_config('request.jwt.claim.sub','', true);
do $$ begin
  begin
    perform 1 from public.grants;
    raise exception 'Anonymous account has table access';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
select 'PASS: owner, viewer, unlisted, anonymous and activity restrictions verified; all test changes rolled back.' as result;
