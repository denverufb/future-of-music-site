import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { emptyGrant, safeUrl, daysFrom, todayInChicago, remindersFor, validateGrant, grantsCsv, csvCell } from '../app/grant-tracker/model.ts';

const grant = (overrides = {}) => ({ ...emptyGrant(), id:'g1', title:'Youth music', funder:'Foundation', created_at:'', updated_at:'', archived_at:null, ...overrides });
test('validates required fields, money, date order and external links', () => {
  assert.ok(validateGrant(emptyGrant()));
  assert.equal(validateGrant(grant()), null);
  for (const amount of [-1, NaN, Infinity, 1.999, 10000000000]) assert.ok(validateGrant(grant({requested_amount:amount})));
  assert.equal(validateGrant(grant({requested_amount:0})), null);
  assert.ok(validateGrant(grant({website_url:'javascript:alert(1)'})));
  assert.ok(validateGrant(grant({project_starts_on:'2026-10-20', project_ends_on:'2026-10-19'})));
  assert.ok(validateGrant(grant({links:[{label:'',url:'https://example.org'}]})));
});
test('only opens safe http and https resource links', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,a', '//example.com', 'https://user:password@example.com']) assert.equal(safeUrl(value), null);
  assert.equal(safeUrl('https://example.com/file'), 'https://example.com/file');
});
test('calendar date calculations use Central Time and do not drift over DST', () => {
  assert.equal(todayInChicago(new Date('2026-10-20T02:00:00Z')), '2026-10-19');
  assert.equal(daysFrom('2026-11-02','2026-10-31'), 2);
  assert.equal(daysFrom('2026-10-20','2026-10-20'), 0);
});
test('reminders respect application stage, archived records, and completed tasks', () => {
  const gs = [grant({deadline:'2026-10-19'}), grant({id:'g2', status:'Submitted', deadline:'2026-10-01', decision_on:'2026-10-21'}), grant({id:'g3', status:'Awarded', reporting_on:'2026-10-20'}), grant({id:'g4', archived_at:'2026-10-20', deadline:'2026-10-20'}), grant({id:'g5', status:'Declined', deadline:'2026-10-20'})];
  const tasks = [{id:'t1',grant_id:'g1',title:'Budget',due_on:'2026-10-22',completed:false},{id:'t2',grant_id:'g1',title:'Done',due_on:'2026-10-10',completed:true}];
  const reminders = remindersFor(gs, tasks, '2026-10-20');
  assert.deepEqual(reminders.map(r=>r.kind), ['Application','Reporting','Decision','Task']);
  assert.deepEqual(reminders.map(r=>r.days), [-1,0,1,2]);
});
test('exports escape CSV, protect formulas, and preserve notes', () => {
  assert.equal(csvCell('=SUM(1,2)'), '"\'=SUM(1,2)"');
  assert.equal(csvCell('  +cmd'), '"\'  +cmd"');
  assert.equal(csvCell('a"b'), '"a""b"');
  const csv=grantsCsv([grant({notes:'line1\nline2', requested_amount:25.5})]);
  assert.match(csv, /"25.5"/); assert.match(csv, /line1\nline2/);
});
test('database denies anonymous grants, limits writes, and protects membership', async () => {
  const sql=await readFile(new URL('../supabase/grant-tracker-setup.sql',import.meta.url),'utf8');
  for(const table of ['grant_members','grants','grant_tasks','grant_activity']) assert.ok(sql.includes(`alter table public.${table} enable row level security`));
  assert.match(sql,/revoke all on public\.grant_members, public\.grants, public\.grant_tasks, public\.grant_activity from anon, authenticated/);
  assert.doesNotMatch(sql,/grant (?:insert|update|delete).*on public\.grant_members to authenticated/);
  assert.doesNotMatch(sql,/grant .*delete.*on public\.grants to authenticated/);
  assert.match(sql,/user_id = \(select auth.uid\(\)\) and role = 'owner'/);
  assert.match(sql,/email_confirmed_at is not null/);
});
test('tracker route is private by policy, noindexed, and linked in footer', async () => {
  const page = await readFile(new URL('../app/grant-tracker/page.tsx',import.meta.url),'utf8');
  const chrome = await readFile(new URL('../app/components/SiteChrome.tsx',import.meta.url),'utf8');
  const analytics = await readFile(new URL('../app/components/SiteAnalytics.tsx',import.meta.url),'utf8');
  const client = await readFile(new URL('../app/grant-tracker/client.ts',import.meta.url),'utf8');
  assert.match(page,/index: false, follow: false/);
  assert.match(chrome,/href="\/finance-hub\/"/);
  assert.match(analytics,/startsWith\("\/grant-tracker"\)/);
  assert.match(analytics,/startsWith\("\/finance-hub"\)/);
  assert.match(client,/storage: window.sessionStorage/);
  assert.doesNotMatch(client,/service_role|sb_secret_/);
});
