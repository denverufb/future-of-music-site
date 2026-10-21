import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
const owner='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',viewer='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',other='cccccccc-cccc-4ccc-8ccc-cccccccccccc';
async function database(){const db=new PGlite();await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);create function auth.uid() returns uuid language sql stable as $fn$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $fn$;grant usage on schema public,auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;insert into auth.users values('${owner}','aereon@fomusic.org',now()),('${viewer}','viewer@example.invalid',now()),('${other}','other@example.invalid',now());`);await db.exec(await readFile(new URL('../supabase/grant-tracker-setup.sql',import.meta.url),'utf8'));await db.exec(`insert into public.grant_members(user_id,role) values('${viewer}','viewer')`);return db;}
async function as(db,id){await db.exec(`reset role;select set_config('request.jwt.claim.sub','${id}',false);set role authenticated;`);}
test('finance database enforces owner writes, viewer reads, private audit and reversible voids',async()=>{
  const db=await database();try{
    const schema=await readFile(new URL('../supabase/finance-hub-setup.sql',import.meta.url),'utf8');await db.exec(schema);await db.exec(schema);
    await as(db,owner);
    const record=(await db.query("insert into public.finance_transactions(kind,occurred_on,category,description,amount) values('revenue','2026-01-01','Grants','Demo',10) returning *")).rows[0];
    await db.exec("insert into public.finance_budgets(year,kind,category,amount) values(2026,'revenue','Grants',100)");
    await db.exec(`update public.finance_transactions set voided_at=now() where id='${record.id}'`);
    assert.equal((await db.query('select count(*)::int n from public.finance_activity')).rows[0].n,3);
    await db.exec(`update public.finance_transactions set voided_at=null where id='${record.id}'`);
    assert.equal((await db.query('select voided_at from public.finance_transactions')).rows[0].voided_at,null);
    await assert.rejects(db.exec('delete from public.finance_transactions'),/permission denied/);
    await assert.rejects(db.exec("insert into public.finance_transactions(kind,occurred_on,category,description,amount) values('expense','2026-01-01','Other','Bad','NaN')"));
    await as(db,viewer);
    assert.equal((await db.query('select count(*)::int n from public.finance_transactions')).rows[0].n,1);
    assert.equal((await db.query('select count(*)::int n from public.finance_budgets')).rows[0].n,1);
    assert.equal((await db.query('select count(*)::int n from public.finance_activity')).rows[0].n,4);
    assert.equal((await db.query('update public.finance_transactions set amount=99 returning id')).rows.length,0);
    assert.equal((await db.query('update public.finance_budgets set amount=99 returning id')).rows.length,0);
    await assert.rejects(db.exec("insert into public.finance_transactions(kind,occurred_on,category,description,amount) values('expense','2026-01-01','Other','Denied',10)"),/row-level security/);
    await assert.rejects(db.exec("insert into public.finance_budgets(year,kind,category,amount) values(2026,'expense','Other',100)"),/row-level security/);
    await assert.rejects(db.exec("update public.grant_members set role='owner'"),/permission denied/);
    await assert.rejects(db.exec('delete from public.finance_activity'),/permission denied/);
    await as(db,other);
    for(const table of ['finance_transactions','finance_budgets','finance_activity'])assert.equal((await db.query(`select count(*)::int n from public.${table}`)).rows[0].n,0);
    await db.exec('reset role;set role anon;');
    for(const table of ['finance_transactions','finance_budgets','finance_activity'])await assert.rejects(db.query(`select * from public.${table}`),/permission denied/);
    await db.exec('reset role;');assert.equal((await db.query('select amount::text from public.finance_transactions')).rows[0].amount,'10.00');
  }finally{await db.close();}
});
test('private workbook import reconciles and is safe to rerun',{skip:!process.env.PRIVATE_FINANCE_IMPORT},async()=>{
  const db=await database();try{
    const dir=process.env.PRIVATE_FINANCE_IMPORT;
    const sql=await readFile(`${dir}/activate-finance-hub.sql`,'utf8');
    const expected=JSON.parse(await readFile(`${dir}/workbook-import.json`,'utf8'));
    await db.exec(sql);await db.exec(sql);
    const actual=(await db.query('select *, occurred_on::text as occurred_on from public.finance_transactions')).rows;
    assert.equal(actual.length,expected.transactions.length);
    for(const row of expected.transactions){const saved=actual.find(t=>t.source_key===row.source_key);assert.ok(saved);for(const [key,value] of Object.entries(row)){if(key==='amount')assert.equal(Number(saved[key]),value);else if(key==='occurred_on')assert.equal(String(saved[key]).slice(0,10),value);else assert.deepEqual(saved[key],value);}}
    assert.equal((await db.query('select count(*)::int n from public.finance_budgets')).rows[0].n,expected.budgets.length);
    await db.exec("update public.finance_transactions set notes='Owner correction' where id=(select id from public.finance_transactions limit 1)");await db.exec(sql);
    assert.equal((await db.query("select count(*)::int n from public.finance_transactions where notes='Owner correction'")).rows[0].n,1);
  }finally{await db.close();}
});
