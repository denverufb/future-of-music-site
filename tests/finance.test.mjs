import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {emptyTransaction,financeSummary,monthlyReport,categoryReport,financeCsv,validateTransaction} from '../app/grant-tracker/finance-model.ts';
const transaction=(patch={})=>({...emptyTransaction('revenue','2026-06-10'),id:'one',amount:100,description:'Sample',voided_at:null,...patch});
test('finance separates actuals, unpaid bills, noncash and cancelled entries',()=>{
  const rows=[transaction({restricted:true}),transaction({amount:20,status:'Pledged'}),transaction({amount:40,status:'Cancelled'}),transaction({amount:90,voided_at:'2026-10-20'}),transaction({kind:'expense',amount:30,paid:true,reimbursable:true}),transaction({kind:'expense',amount:10,paid:false}),transaction({amount:50,category:'In-Kind Value'})];
  assert.deepEqual(financeSummary(rows),{received:150,spent:40,surplus:110,pending:20,unpaid:10,reimbursable:30,restricted:100,inKindRevenue:50,cashMovement:70});
});
test('finance rounds cents and filters years and month boundaries',()=>{
  const rows=[transaction({amount:.1}),transaction({amount:.2}),transaction({amount:1,occurred_on:'2025-06-10'}),transaction({amount:9,occurred_on:'2026-07-01'})];
  assert.equal(monthlyReport(rows,2026)[5].received,.3);
  assert.equal(monthlyReport(rows,2026)[6].received,9);
});
test('budget distinguishes zero, unset, custom categories and reporting year',()=>{
  const rows=[transaction({category:'Custom',amount:25}),transaction({category:'Other',amount:15})];
  const plan=[{year:2026,kind:'revenue',category:'Custom',amount:0},{year:2025,kind:'revenue',category:'Other',amount:100}];
  const report=categoryReport(rows,plan,'revenue',2026);
  assert.deepEqual(report.find(r=>r.category==='Custom'),{category:'Custom',budget:0,actual:25,remaining:-25});
  assert.equal(report.find(r=>r.category==='Other').budget,null);
});
test('finance validates money, invalid dates, safe links and required fields',()=>{
  assert.equal(validateTransaction(transaction()),'');
  for(const patch of [{amount:-1},{amount:NaN},{amount:.001},{amount:null},{occurred_on:'2026-99-99'},{occurred_on:'2026-02-30'},{description:' '},{receipt_url:'javascript:alert(1)'},{receipt_url:'https://user:password@example.org'}]) assert.ok(validateTransaction(transaction(patch)));
});
test('CSV keeps full ledger details and escapes spreadsheet formulas',()=>{
  const csv=financeCsv([transaction({notes:'=CMD()',counterparty:'Name, "Other"'})]);
  assert.match(csv,/'=CMD/);assert.match(csv,/Name, ""Other""/);assert.match(csv,/reimbursable,paid,in_kind,status/);
});
test('public finance code contains no imported workbook records',async()=>{
  const source=await readFile(new URL('../app/grant-tracker/FinanceWorkspace.tsx',import.meta.url),'utf8');
  assert.doesNotMatch(source,/workbook-import|finance-private|activate-finance-hub/);
  assert.match(source,/finance_transactions/);assert.match(source,/finance_budgets/);
});
