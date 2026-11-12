// Server-only. Never copy service-role credentials into website code.
import { createClient } from 'npm:@supabase/supabase-js@2.118.0';

const allowedOrigin = 'https://fomusic.org';
const cors = {'Access-Control-Allow-Origin':allowedOrigin,'Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info','Access-Control-Allow-Methods':'POST, OPTIONS','Vary':'Origin','Cache-Control':'no-store'};
const reply=(status:number,body:unknown)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json'}});

Deno.serve(async req=>{
  if(req.headers.get('origin') && req.headers.get('origin')!==allowedOrigin)return reply(403,{error:'Origin not allowed.'});
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
  if(req.method!=='POST')return reply(405,{error:'POST required.'});
  try {
    const authorization=req.headers.get('authorization')||'';
    if(!authorization.startsWith('Bearer '))return reply(401,{error:'Sign in first.'});
    const admin=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}});
    // Verify the live token; do not trust a decoded JWT, browser role, or user metadata.
    const {data:identity,error:authError}=await admin.auth.getUser(authorization.slice(7));
    if(authError||!identity.user)return reply(401,{error:'Sign in again.'});
    const {data:owner,error:ownerError}=await admin.from('grant_members').select('role').eq('user_id',identity.user.id).maybeSingle();
    if(ownerError||owner?.role!=='owner')return reply(403,{error:'Only the workspace owner can manage coach accounts.'});
    const raw=await req.text();
    if(raw.length>2000)return reply(400,{error:'Request is too large.'});
    const body=JSON.parse(raw),email=String(body.email||'').trim().toLowerCase(),name=String(body.name||'').trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>320||name.length<1||name.length>200)return reply(400,{error:'Enter a valid name and email.'});
    const {data:existing,error:lookupError}=await admin.from('program_members').select('user_id,active').eq('email',email).maybeSingle();
    if(lookupError)return reply(500,{error:'Program Administration setup is incomplete.'});
    if(existing&&!existing.active)return reply(409,{error:'Restore this coach’s access before creating a new setup link.'});
    if(existing){
      const {data:finance,error:checkError}=await admin.from('grant_members').select('role').eq('user_id',existing.user_id).maybeSingle();
      if(checkError||finance)return reply(409,{error:'Financial accounts cannot be managed through coach invitations.'});
    }
    const {data,error}=await admin.auth.admin.generateLink({type:existing?'recovery':'invite',email,options:{redirectTo:`${allowedOrigin}/administration-hub/?setup=1`}});
    if(error||!data?.user||!data.properties?.action_link)return reply(400,{error:'Could not generate an invitation. The email may already belong to a different account. Contact the owner to check Supabase Authentication.'});
    // Never turn a financial member into a coach or generate recovery links for financial accounts.
    const {data:financial,error:financeError}=await admin.from('grant_members').select('role').eq('user_id',data.user.id).maybeSingle();
    if(financeError||financial)return reply(409,{error:'This email belongs to a financial account. Use a separate coach account.'});
    if(existing&&existing.user_id!==data.user.id)return reply(409,{error:'Account identity does not match.'});
    if(!existing){
      const {error:saveError}=await admin.from('program_members').insert({user_id:data.user.id,display_name:name,email,active:true});
      if(saveError)return reply(500,{error:'The login was created but coach access could not be saved. No invitation was returned; ask the owner to check the account before retrying.'});
    }
    return reply(200,{invite_url:data.properties.action_link});
  }catch{return reply(500,{error:'Coach invitation could not be completed. No account details are included in this response.'});}
});
