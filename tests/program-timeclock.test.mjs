import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';

const owner='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',coach='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',viewer='cccccccc-cccc-4ccc-8ccc-cccccccccccc';
async function as(db,id){await db.exec(`reset role;select set_config('request.jwt.claim.sub','${id}',false);set role authenticated;`);}
async function setup(){
  const db=new PGlite();
  await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema public,auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;insert into auth.users values('${owner}','aereon@fomusic.org',now()),('${coach}','coach@example.invalid',now()),('${viewer}','viewer@example.invalid',now());`);
  for(const file of ['grant-tracker-setup.sql','finance-hub-setup.sql','program-administration-setup.sql','program-timeclock-setup.sql'])await db.exec(await readFile(new URL(`../supabase/${file}`,import.meta.url),'utf8'));
  await db.exec(`insert into public.grant_members(user_id,role) values('${viewer}','viewer');insert into public.program_members(user_id,display_name,email,active) values('${coach}','Sample coach','coach@example.invalid',true);`);
  return db;
}

test('clock entries use the signed-in coach, cannot be backdated directly, and stay private to coaches',async()=>{
  const db=await setup();
  try{
    await as(db,coach);
    await db.exec(`select public.program_time_clock_in('After-school DJ session')`);
    const open=(await db.query('select * from public.program_time_entries')).rows[0];
    assert.equal(open.user_id,coach);
    assert.equal(open.note,'After-school DJ session');
    await assert.rejects(db.exec(`update public.program_time_entries set clock_in=clock_in - interval '1 hour'`));
    await db.exec(`select public.program_time_clock_out('${open.id}')`);
    const complete=(await db.query('select * from public.program_time_entries')).rows[0];
    assert.ok(complete.clock_out);
    await as(db,viewer);
    assert.equal((await db.query('select * from public.program_time_entries')).rows.length,0);
    await as(db,owner);
    assert.equal((await db.query('select * from public.program_time_entries')).rows.length,1);
    await db.exec(`update public.program_time_entries set rate_cents=2500,status='Approved',pay_period_start='2026-11-09'`);
    assert.equal((await db.query('select status,rate_cents from public.program_time_entries')).rows[0].status,'Approved');
  }finally{await db.close();}
});
