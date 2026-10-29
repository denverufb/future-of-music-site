-- Run once in the existing project's SQL Editor. Safe to run again.
-- Originals are private; no service-role key is used in the website.
begin;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('finance-receipts','finance-receipts',false,8388608,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=false,file_size_limit=8388608,allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists fom_receipt_member_read on storage.objects;
create policy fom_receipt_member_read on storage.objects for select to authenticated
using(bucket_id='finance-receipts' and exists(select 1 from public.grant_members where user_id=(select auth.uid())));
drop policy if exists fom_receipt_owner_insert on storage.objects;
create policy fom_receipt_owner_insert on storage.objects for insert to authenticated
with check(bucket_id='finance-receipts' and name ~ '^receipts/[a-f0-9-]+\.(jpg|png|webp)$'
  and exists(select 1 from public.grant_members where user_id=(select auth.uid()) and role='owner'));
-- No overwrite or delete policy: replacing a receipt preserves the old original for audit history.
-- Defense against a pre-existing broad policy: these restrictions apply to this bucket only.
drop policy if exists fom_receipt_read_guard on storage.objects;
create policy fom_receipt_read_guard on storage.objects as restrictive for select to public
using(bucket_id<>'finance-receipts' or exists(select 1 from public.grant_members where user_id=(select auth.uid())));
drop policy if exists fom_receipt_insert_guard on storage.objects;
create policy fom_receipt_insert_guard on storage.objects as restrictive for insert to public
with check(bucket_id<>'finance-receipts' or (name ~ '^receipts/[a-f0-9-]+\.(jpg|png|webp)$'
  and exists(select 1 from public.grant_members where user_id=(select auth.uid()) and role='owner')));
drop policy if exists fom_receipt_update_guard on storage.objects;
create policy fom_receipt_update_guard on storage.objects as restrictive for update to public
using(bucket_id<>'finance-receipts') with check(bucket_id<>'finance-receipts');
drop policy if exists fom_receipt_delete_guard on storage.objects;
create policy fom_receipt_delete_guard on storage.objects as restrictive for delete to public
using(bucket_id<>'finance-receipts');
commit;
select id,public,file_size_limit from storage.buckets where id='finance-receipts';
