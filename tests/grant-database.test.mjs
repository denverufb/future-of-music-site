import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('real PostgreSQL RLS enforces owner/viewer/unlisted/anonymous access', async () => {
  const db = new PGlite();
  try {
    await db.exec(`
      create role anon; create role authenticated;
      create schema auth;
      create table auth.users (id uuid primary key, email text, email_confirmed_at timestamptz);
      create function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
      $fn$;
      grant usage on schema public, auth to anon, authenticated;
      grant execute on function auth.uid() to anon, authenticated;
      insert into auth.users values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','aereon@fomusic.org',now());
    `);
    const schema = await readFile(new URL('../supabase/grant-tracker-setup.sql',import.meta.url),'utf8');
    await db.exec(schema);
    await db.exec(schema); // Setup is repeatable and must not remove records/policies.
    const checks = await readFile(new URL('../supabase/grant-tracker-security-test.sql',import.meta.url),'utf8');
    const results = await db.exec(checks);
    assert.match(results.at(-1).rows[0].result, /^PASS:/);
    assert.equal((await db.query('select count(*)::int as count from public.grants')).rows[0].count,0);
    assert.equal((await db.query('select count(*)::int as count from auth.users')).rows[0].count,1);
  } finally { await db.close(); }
});

test('missing owner aborts setup without leaving partially configured tables', async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth;
      create table auth.users (id uuid primary key, email text, email_confirmed_at timestamptz);
      create function auth.uid() returns uuid language sql stable as $fn$ select null::uuid $fn$;`);
    const schema = await readFile(new URL('../supabase/grant-tracker-setup.sql',import.meta.url),'utf8');
    await assert.rejects(db.exec(schema), /Create and confirm/);
    await db.exec('rollback');
    assert.equal((await db.query("select to_regclass('public.grants') as name")).rows[0].name,null);
  } finally { await db.close(); }
});
