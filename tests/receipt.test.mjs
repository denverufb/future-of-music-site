import test from 'node:test';
import assert from 'node:assert/strict';
import {parseReceipt,validateReceiptFile,privateReceiptPath,receiptLocator} from '../app/grant-tracker/receipt-model.ts';
test('receipt suggests vendor, purchased items and total, not subtotal or cash tender',()=>{
  assert.deepEqual(parseReceipt('EXAMPLE SUPPLY\n123 Main St\nPencils 4.00\nPaper 10.00\nSubtotal 14.00\nTax 1.12\nTOTAL $15.12\nCash 20.00\nChange 4.88'),{vendor:'EXAMPLE SUPPLY',total:'15.12',items:'Pencils 4.00\nPaper 10.00'});
});
test('receipt leaves ambiguous or missing totals blank instead of guessing',()=>{
  assert.equal(parseReceipt('SHOP\nSUBTOTAL 40.00\nVISA 40.00').total,'');
  assert.equal(parseReceipt('SHOP\nTOTAL 10.00\nTOTAL 20.00').total,'');
  assert.equal(parseReceipt('SHOP\nTOTAL -10.00').total,'');
  assert.equal(parseReceipt('SHOP\nTOTAL\n$1,234.56').total,'1234.56');
  assert.equal(parseReceipt('').vendor,'');
});
test('receipt image allowlist, size limit and private locator checks',()=>{
  assert.equal(validateReceiptFile({type:'image/png',size:200}), '');
  for(const file of [{type:'image/svg+xml',size:20},{type:'application/pdf',size:20},{type:'image/png',size:0},{type:'image/jpeg',size:9*1024*1024}])assert.ok(validateReceiptFile(file));
  const base='https://example.supabase.co',path='receipts/aaaaaaaa-aaaa.jpg';
  assert.equal(privateReceiptPath(receiptLocator(base,path),base),path);
  for(const url of [receiptLocator('https://evil.example',path),`${receiptLocator(base,path)}?token=foo`,receiptLocator(base,'other/image.jpg'),'javascript:alert(1)'])assert.equal(privateReceiptPath(url,base),null);
});
