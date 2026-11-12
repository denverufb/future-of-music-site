import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const source=await readFile(new URL('../supabase/functions/create-program-coach/index.ts',import.meta.url),'utf8');
test('website invokes the confirmed deployed function slug',async()=>{
  const workspace=await readFile(new URL('../app/grant-tracker/ProgramWorkspace.tsx',import.meta.url),'utf8');
  assert.ok(workspace.includes("functions.invoke('dynamic-processor'"));
  assert.ok(!workspace.includes("functions.invoke('create-program-coach'"));
});
const compiled=ts.transpileModule(source.replace(/^import .*\n/m,''),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
async function invoke({role='owner',verified=true,existing=null,financial=false,method='POST',token='valid',origin='https://fomusic.org'}={}) {
  let handler,generated=0,inserted=0;
  const admin={auth:{getUser:async()=>({data:{user:verified?{id:'owner'}:null},error:null}),admin:{generateLink:async()=>{generated++;return {data:{user:{id:'coach'},properties:{action_link:'https://example.invalid/private-invitation'}}};}}},from(table){const filters={};return {select(){return this;},eq(k,v){filters[k]=v;return this;},async maybeSingle(){if(table==='program_members')return {data:existing};return {data:filters.user_id==='owner'?{role}:financial?{role:'viewer'}:null};},async insert(){inserted++;return {error:null};}};}};
  vm.runInNewContext(compiled,{Response,createClient:()=>admin,Deno:{env:{get:()=> 'server-only'},serve:f=>{handler=f;}}});
  const response=await handler(new Request('https://example.invalid/function',{method,headers:{Origin:origin,...(token?{Authorization:`Bearer ${token}`}:{})},...(method==='POST'?{body:JSON.stringify({name:'Sample Coach',email:'coach@example.invalid'})}:{})}));
  return {status:response.status,generated,inserted,...(response.status!==204?{body:await response.json()}:{})};
}
test('coach invitation refuses unverified, non-owner, missing token and foreign-origin requests',async()=>{
  for(const options of [{verified:false},{role:'viewer'},{role:'coach'},{token:''},{origin:'https://untrusted.invalid'}]){const r=await invoke(options);assert.ok([401,403].includes(r.status));assert.equal(r.generated,0);assert.equal(r.inserted,0);}
});
test('coach invitations reject disabled coaches and financial accounts before generating recovery links',async()=>{
  for(const options of [{existing:{user_id:'coach',active:false}},{existing:{user_id:'coach',active:true},financial:true}]){const r=await invoke(options);assert.equal(r.status,409);assert.equal(r.generated,0);}
});
test('owner can create a private coach invitation or recover an active coach account',async()=>{
  const fresh=await invoke();assert.equal(fresh.status,200);assert.equal(fresh.inserted,1);assert.equal(fresh.generated,1);assert.ok(fresh.body.invite_url);
  const recovery=await invoke({existing:{user_id:'coach',active:true}});assert.equal(recovery.status,200);assert.equal(recovery.inserted,0);assert.equal(recovery.generated,1);
});
