import { safeUrl } from './model.ts';
export const revenueSources = ['Fundraising','Grants','Corporate Donations','Individual Donations','Membership Fees','Program Fees','Sponsorships','In-Kind Value','Other'];
export const expenseCategories = ['Program Supplies','Administrative','Insurance','Community Giving','Rentals','Staff/Contractors','Marketing','Food & Refreshments','Transportation','Technology','Printing','Equipment','Fees','Other'];
export const paymentMethods = ['Cash','Check','Card','ACH/Transfer','Online Platform','In-Kind','Other'];
export const revenueStatuses = ['Pledged','Received','Pending','Cancelled'] as const;
export type Kind = 'revenue'|'expense';
export type TransactionDraft = {
  kind:Kind; occurred_on:string; category:string; counterparty:string; description:string; program:string;
  payment_method:string; amount:number|null; restricted:boolean; reimbursable:boolean; paid:boolean; in_kind:boolean;
  status:typeof revenueStatuses[number]; receipt_url:string; notes:string; grant_id:string|null;
};
export type Transaction = Omit<TransactionDraft,'amount'> & {amount:number;id:string;updated_at:string;created_at:string;voided_at:string|null;source_label:string;source_key:string|null};
export type Budget = {id:string;year:number;kind:Kind;category:string;amount:number;notes:string;updated_at:string};
export const emptyTransaction = (kind:Kind,date:string):TransactionDraft => ({kind,occurred_on:date,category:kind==='revenue'?'Fundraising':'Program Supplies',counterparty:'',description:'',program:'',payment_method:'',amount:null,restricted:false,reimbursable:false,paid:false,in_kind:false,status:'Received',receipt_url:'',notes:'',grant_id:null});
export const cents = (n:number) => Math.round(Number(n)*100);
export const sumAmounts = (rows:{amount:number}[]) => rows.reduce((sum,r)=>sum+cents(r.amount),0)/100;
export function validateTransaction(t:TransactionDraft) {
  if(!['revenue','expense'].includes(t.kind)) return 'Choose revenue or expense.';
  const date = new Date(`${t.occurred_on}T00:00:00Z`);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(t.occurred_on) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0,10)!==t.occurred_on) return 'Enter a valid transaction date.';
  if(!t.category.trim() || !t.description.trim()) return 'Category and description are required.';
  if(t.amount===null || !Number.isFinite(t.amount) || t.amount<0 || t.amount>9999999999.99 || Math.abs(t.amount*100-cents(t.amount))>0.0001) return 'Enter a nonnegative amount with no more than two decimal places.';
  if(!revenueStatuses.includes(t.status)) return 'Choose a valid revenue status.';
  if(t.receipt_url && !safeUrl(t.receipt_url)) return 'Receipt links must use http or https without embedded credentials.';
  return '';
}
export function financeSummary(rows:Transaction[]) {
  const active=rows.filter(t=>!t.voided_at);
  const revenue=active.filter(t=>t.kind==='revenue' && t.status==='Received');
  const expenses=active.filter(t=>t.kind==='expense');
  const received=sumAmounts(revenue), spent=sumAmounts(expenses);
  return {received,spent,surplus:(cents(received)-cents(spent))/100,
    pending:sumAmounts(active.filter(t=>t.kind==='revenue' && ['Pledged','Pending'].includes(t.status))),
    unpaid:sumAmounts(expenses.filter(t=>!t.paid)),
    reimbursable:sumAmounts(expenses.filter(t=>t.reimbursable)),
    restricted:sumAmounts(revenue.filter(t=>t.restricted)),
    inKindRevenue:sumAmounts(revenue.filter(isNoncash)),
    cashMovement:(cents(sumAmounts(revenue.filter(t=>!isNoncash(t))))-cents(sumAmounts(expenses.filter(t=>t.paid&&!isNoncash(t)))))/100};
}
export function isNoncash(t:TransactionDraft){return t.in_kind||t.payment_method==='In-Kind'||(t.kind==='revenue'&&t.category==='In-Kind Value');}
export function categoryReport(rows:Transaction[],budgets:Budget[],kind:Kind,year:number) {
  const actual=rows.filter(t=>!t.voided_at && t.kind===kind && t.occurred_on.startsWith(`${year}-`) && (kind==='expense'||t.status==='Received'));
  const plan=budgets.filter(b=>b.year===year&&b.kind===kind);
  const names=[...new Set([...(kind==='revenue'?revenueSources:expenseCategories),...actual.map(t=>t.category),...plan.map(b=>b.category)])];
  return names.map(category=>{const b=plan.find(p=>p.category===category);const amount=sumAmounts(actual.filter(t=>t.category===category));return {category,budget:b?.amount??null,actual:amount,remaining:b?(cents(b.amount)-cents(amount))/100:null};});
}
export function monthlyReport(rows:Transaction[],year:number) {
  return Array.from({length:12},(_,i)=>({month:new Date(Date.UTC(year,i,1)).toLocaleDateString('en-US',{month:'short',timeZone:'UTC'}),...financeSummary(rows.filter(t=>t.occurred_on.startsWith(`${year}-${String(i+1).padStart(2,'0')}`)))}));
}
export function financeCsv(rows:Transaction[]) {
  const columns:(keyof Transaction)[]=['id','kind','occurred_on','category','counterparty','description','program','payment_method','amount','restricted','reimbursable','paid','in_kind','status','receipt_url','notes','grant_id','voided_at','source_label'];
  const cell=(v:unknown)=>{let s=v==null?'':String(v);if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};
  return '\uFEFF'+[columns.join(','),...rows.map(t=>columns.map(k=>cell(t[k])).join(','))].join('\r\n');
}
