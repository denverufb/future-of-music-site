import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
const owner='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',coach='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',viewer='cccccccc-cccc-4ccc-8ccc-cccccccccccc',outsider='dddddddd-dddd-4ddd-8ddd-dddddddddddd';
async function as(db,id){await db.exec(`reset role;select set_config('request.jwt.claim.sub','${id}',false);set role authenticated;`);}
async function setup(){const db=new PGlite();await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema public,auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;insert into auth.users values('${owner}','aereon@fomusic.org',now()),('${coach}','coach@example.invalid',now()),('${viewer}','viewer@example.invalid',now()),('${outsider}','outsider@example.invalid',now());`);for(const f of ['grant-tracker-setup.sql','finance-hub-setup.sql','program-administration-setup.sql','program-administration-setup.sql'])await db.exec(await readFile(new URL('../supabase/'+f,import.meta.url),'utf8'));await db.exec(`insert into public.program_members values('${coach}','Sample coach','coach@example.invalid',true);insert into public.grant_members(user_id,role) values('${viewer}','viewer');`);return db;}
test('program RLS separates coaches, finance viewers, owner and outsiders',async()=>{const db=await setup();try{
  await as(db,owner);const site=(await db.query('select id from public.program_sites limit 1')).rows[0].id;
  const student=(await db.query(`insert into public.program_students(name,participant_code,site_id) values('Sample Student','TEST-1','${site}') returning id`)).rows[0].id;
  await db.exec("insert into public.finance_transactions(kind,occurred_on,category,description,amount) values('expense','2026-01-01','Other','Test',50)");
  await as(db,coach);
  assert.equal((await db.query('select * from public.program_students')).rows.length,1);
  for(const t of ['grants','grant_tasks','grant_activity','finance_transactions','finance_budgets','finance_activity'])assert.equal((await db.query(`select * from public.${t}`)).rows.length,0,t);
  await assert.rejects(db.exec("insert into public.finance_transactions(kind,occurred_on,category,description,amount) values('expense','2026-01-01','Other','Bad',50)"));
  await assert.rejects(db.exec(`update public.grant_members set role='owner'`));
  assert.equal((await db.query(`update public.program_members set active=false returning *`)).rows.length,0);
  await assert.rejects(db.exec(`insert into public.program_members values('${outsider}','Bad','bad@example.invalid',true)`));
  await assert.rejects(db.exec(`insert into public.program_students(name,participant_code,site_id) values('Bad','BAD','${site}')`));
  const evaluation=(await db.query(`insert into public.program_evaluations(student_id,week,engagement,evaluator_role,initials,created_by) values('${student}',1,'Engaged','Program Coach','AB','${owner}') returning *`)).rows[0];
  assert.equal(evaluation.created_by,coach,'actor must come from verified session');
  await db.exec(`update public.program_evaluations set notes='Observation' where id='${evaluation.id}'`);
  await assert.rejects(db.exec(`update public.program_evaluations set week=2 where id='${evaluation.id}'`));
  await db.exec(`select public.program_mark_survey('${student}',true)`);
  assert.equal((await db.query('select survey_completed from public.program_students')).rows[0].survey_completed,true);
  await db.exec(`insert into public.program_feedback(site_id,ratings,comment) values('${site}',array[0,1,3,4],'A useful session')`);
  await assert.rejects(db.exec(`insert into public.program_feedback(site_id,ratings) values('${site}',array[null,null,null,null]::int[])`));
  await assert.rejects(db.exec('delete from public.program_feedback'));
  const columns=(await db.query("select column_name from information_schema.columns where table_name='program_feedback'")).rows.map(x=>x.column_name);
  for(const forbidden of ['student_id','created_by','created_at'])assert.ok(!columns.includes(forbidden));
  await assert.rejects(db.exec(`insert into public.program_assessments(site_id,student_id,kind,assessed_on,payload) values('${site}','${student}','pre','2026-11-11','{"ratings":[],"examples":[]}')`));
  const payload=JSON.stringify({ratings:Array(12).fill(0),examples:Array(12).fill('')});
  await db.query(`insert into public.program_assessments(site_id,student_id,kind,assessed_on,payload) values($1,$2,'pre','2026-11-11',$3)`,[site,student,payload]);
  for(const id of [viewer,outsider]){await as(db,id);for(const t of ['program_students','program_evaluations','program_assessments','program_feedback','program_sites','program_activity'])assert.equal((await db.query(`select * from public.${t}`)).rows.length,0);await assert.rejects(db.exec(`select public.program_mark_survey('${student}',false)`));}
  await as(db,owner);assert.ok((await db.query('select * from public.program_activity')).rows.length>0);await db.exec(`update public.program_members set active=false where user_id='${coach}'`);
  await as(db,coach);assert.equal((await db.query('select * from public.program_students')).rows.length,0);assert.equal((await db.query(`update public.program_evaluations set notes='Denied' returning *`)).rows.length,0);await assert.rejects(db.exec(`insert into public.program_feedback(site_id,ratings) values('${site}',array[0,0,0,0])`));
  await db.exec('reset role;set role anon;');for(const t of ['program_students','program_evaluations','program_assessments','program_feedback','program_members'])await assert.rejects(db.query(`select * from public.${t}`));
}finally{await db.close();}});
test('private JSD import preserves entries and reruns without overwriting edits',{skip:!process.env.PRIVATE_PROGRAM_IMPORT},async()=>{const db=await setup();try{
  const dir=process.env.PRIVATE_PROGRAM_IMPORT,sql=await readFile(`${dir}/import-jsd-private.sql`,'utf8'),expected=JSON.parse(await readFile(`${dir}/jsd-import-private.json`,'utf8'));await db.exec(sql);await db.exec(sql);
  const students=(await db.query('select * from public.program_students')).rows,entries=(await db.query('select * from public.program_evaluations')).rows;
  assert.equal(students.length,expected.students.length);assert.equal(entries.length,expected.evaluations.length);
  for(const e of expected.evaluations){const saved=entries.find(x=>x.id===e.id);for(const [k,v] of Object.entries(e))assert.equal(saved[k],v);}
  for(const e of expected.students){const saved=students.find(x=>x.id===e.id);for(const k of ['name','participant_code','source_key','survey_completed'])assert.equal(saved[k],e[k]);}
  await db.exec("update public.program_evaluations set notes='Owner correction' where id=(select id from public.program_evaluations limit 1)");await db.exec(sql);assert.equal((await db.query("select count(*)::int n from public.program_evaluations where notes='Owner correction'")).rows[0].n,1);
}finally{await db.close();}});
