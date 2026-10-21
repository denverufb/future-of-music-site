-- Optional: create a separate confirmed user in Authentication > Users first.
-- Replace VIEWER_EMAIL_HERE with that account's email. Do not use your owner email.
do $$
declare viewer_id uuid;
begin
  select id into viewer_id from auth.users where lower(email) = lower('VIEWER_EMAIL_HERE') and email_confirmed_at is not null;
  if viewer_id is null then raise exception 'Create the confirmed viewer user first and replace VIEWER_EMAIL_HERE.'; end if;
  if exists (select 1 from public.grant_members where user_id = viewer_id and role = 'owner') then
    raise exception 'The owner cannot be changed to a viewer.';
  end if;
  insert into public.grant_members(user_id, role) values (viewer_id, 'viewer') on conflict (user_id) do nothing;
end $$;
