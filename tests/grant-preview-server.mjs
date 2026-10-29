// LOCAL QA ONLY. Serves a rewritten COPY in memory, never changes production assets.
// All grants/accounts here are fictional; no requests go to Supabase.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { emptyGrant, todayInChicago } from '../app/grant-tracker/model.ts';
import { emptyTransaction } from '../app/grant-tracker/finance-model.ts';

const port = 3077;
const root = resolve('out');
let role = 'owner';
const ownerId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const today = todayInChicago();
const stamp = () => new Date().toISOString();
let records = [
  { ...emptyGrant(), id:'33333333-3333-4333-8333-333333333333', title:'DEMO · Youth music expansion', funder:'Sample Community Foundation', program:'Youth DJ Program', status:'Preparing', requested_amount:15000, deadline:today, contact_name:'Sample contact', notes:'Fictional record for testing only.', created_at:stamp(), updated_at:stamp(), archived_at:null },
  { ...emptyGrant(), id:'55555555-5555-4555-8555-555555555555', title:'DEMO · Creative leadership', funder:'Sample Arts Fund', program:'Leadership', status:'Awarded', requested_amount:10000, awarded_amount:8000, received_amount:4000, reporting_on:today, created_at:stamp(), updated_at:stamp(), archived_at:null },
  { ...emptyGrant(), id:'66666666-6666-4666-8666-666666666666', title:'DEMO · Mentorship access', funder:'Sample Youth Foundation', program:'Mentorship', status:'Submitted', requested_amount:5000, decision_on:today, created_at:stamp(), updated_at:stamp(), archived_at:null },
];
let tasks = [];
let activity = [];
let transactions = [
  {...emptyTransaction('revenue',today),id:'11111111-1111-4111-8111-111111111111',description:'DEMO · Community award payment',counterparty:'Example Arts Fund',category:'Grants',program:'Youth DJ Program',amount:4000,restricted:true,grant_id:'55555555-5555-4555-8555-555555555555',created_at:stamp(),updated_at:stamp(),voided_at:null,source_label:'',source_key:null},
  {...emptyTransaction('expense',today),id:'22222222-2222-4222-8222-222222222222',description:'DEMO · Workshop supplies',counterparty:'Example Store',category:'Program Supplies',program:'Youth DJ Program',amount:250,paid:true,created_at:stamp(),updated_at:stamp(),voided_at:null,source_label:'',source_key:null},
];
let budgets=[{id:'44444444-4444-4444-8444-444444444444',year:Number(today.slice(0,4)),kind:'expense',category:'Program Supplies',amount:1000,notes:'Fictional budget for local testing.',created_at:stamp(),updated_at:stamp()}];
let financeActivity=[];
const receiptFiles=new Map();
const json = (res, body, code=200) => { res.writeHead(code, {'content-type':'application/json'}); res.end(JSON.stringify(body)); };
const readBody = async req => { let text=''; for await (const chunk of req) text+=chunk; return text ? JSON.parse(text) : {}; };
createServer(async (req,res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  try {
    if(url.pathname.startsWith('/storage/v1/object/')){
      const prefix='/storage/v1/object/',signed=url.pathname.startsWith(prefix+'sign/');
      const name=url.pathname.slice((prefix+(signed?'sign/':'')).length);
      if(req.method==='POST'&&signed)return json(res,{signedURL:`/object/sign/${name}?token=fictional-local-only`});
      if(req.method==='POST'){
        if(role!=='owner')return json(res,{message:'Permission denied'},403);
        const chunks=[];for await(const chunk of req)chunks.push(chunk);
        const data=await new Response(Buffer.concat(chunks),{headers:{'content-type':req.headers['content-type']}}).formData();
        const file=[...data.values()].find(value=>typeof value!=='string');
        if(!file)return json(res,{message:'No image'},400);
        receiptFiles.set(name,{bytes:Buffer.from(await file.arrayBuffer()),type:file.type});
        return json(res,{Key:name});
      }
      const file=receiptFiles.get(name);if(file&&signed){res.writeHead(200,{'content-type':file.type});res.end(file.bytes);return;}
      return json(res,{message:'Private or missing receipt'},403);
    }
    if (url.pathname.startsWith('/auth/v1/')) {
      if (url.pathname.endsWith('/logout')) { res.writeHead(204); res.end(); return; }
      if (url.pathname.endsWith('/token')) {
        const body=await readBody(req);
        if (body.password !== 'test-only-not-a-real-password') return json(res,{message:'Invalid login credentials'},400);
        role = body.email.startsWith('viewer') ? 'viewer' : body.email.startsWith('unlisted') ? 'unlisted' : 'owner';
        const payload=Buffer.from(JSON.stringify({sub:ownerId,role:'authenticated',exp:Math.floor(Date.now()/1000)+3600})).toString('base64url');
        return json(res,{access_token:`eyJhbGciOiJIUzI1NiJ9.${payload}.test`,refresh_token:'local-test',token_type:'bearer',expires_in:3600,user:{id:ownerId,email:body.email,aud:'authenticated',role:'authenticated',app_metadata:{},user_metadata:{},created_at:stamp()}});
      }
      return json(res,{message:'Not implemented in preview'},400);
    }
    if(url.pathname.startsWith('/rest/v1/')) {
      const table=url.pathname.split('/').pop();
      if(table==='grant_members') return json(res,role==='unlisted' ? null : {role});
      let rows=table==='grants' ? records : table==='grant_tasks' ? tasks : table==='finance_transactions'?transactions:table==='finance_budgets'?budgets:table==='finance_activity'?financeActivity:activity;
      const matches=row=>['id','grant_id','record_id','updated_at'].every(key=>!url.searchParams.has(key)||row[key]===url.searchParams.get(key).replace(/^eq\./,''));
      if(req.method==='GET') return json(res, rows.filter(matches));
      if(role!=='owner') return json(res,{message:'Permission denied',code:'42501'},403);
      const body=await readBody(req); let changed;
      if(req.method==='POST') { changed={...body,id:randomUUID(),created_at:stamp(),updated_at:stamp(),...(table==='grants'?{archived_at:null}:table==='finance_transactions'?{voided_at:null,source_label:'',source_key:null}:{completed:false})}; rows.push(changed); }
      else { const index=rows.findIndex(matches); if(index<0) return json(res,null); changed={...rows[index],...body,updated_at:stamp()}; if(req.method==='DELETE') rows.splice(index,1); else rows[index]=changed; }
      if(table.startsWith('finance_'))financeActivity.push({id:randomUUID(),record_id:changed.id,record_type:table,action:'Demo change recorded',before_value:null,after_value:changed,created_at:stamp()});
      else activity.push({id:randomUUID(),grant_id:table==='grants'?changed.id:changed.grant_id,action:'Demo change recorded',created_at:stamp()});
      return json(res,changed);
    }
    const path=resolve(root,'.'+decodeURIComponent(url.pathname)+(url.pathname.endsWith('/')?'index.html':''));
    if(!path.startsWith(root+'/')) return json(res,{},403);
    let content=await readFile(path); const ext=extname(path);
    if(ext==='.js') content=Buffer.from(content.toString().replaceAll('https://jfbxmmsidkljpecktusy.supabase.co',`http://localhost:${port}`));
    res.writeHead(200,{'content-type':({'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml'})[ext]||'application/octet-stream'}); res.end(content);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(port,'127.0.0.1',()=>console.log(`Local fixture preview: http://localhost:${port}/grant-tracker/ (fictional data only)`));
