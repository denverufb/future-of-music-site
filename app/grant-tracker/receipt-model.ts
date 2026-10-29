export type ReceiptSuggestion={vendor:string;total:string;items:string};
export const RECEIPT_BUCKET='finance-receipts';
export const RECEIPT_MAX_BYTES=8*1024*1024;
export const receiptTypes:Record<string,string>={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'};
export function validateReceiptFile(file:{type:string;size:number}) {
  if(!receiptTypes[file.type])return 'Choose a JPG, PNG, or WebP receipt photo. For PDF or HEIC, export a page as a JPG or PNG first.';
  if(file.size===0||file.size>RECEIPT_MAX_BYTES)return 'Choose a receipt image smaller than 8 MB.';
  return '';
}
const endingAmount=/(?:\$\s*)?(-?(?:\d{1,3}(?:,\d{3})+|\d+)\.\d{2})\s*[A-Z]?\s*$/i;
/** Conservative suggestions, never an automatic financial posting. */
export function parseReceipt(text:string):ReceiptSuggestion {
  const lines=text.split(/\r?\n/).map(l=>l.trim().replace(/\s+/g,' ')).filter(Boolean);
  const totalLabel=/^(?:grand\s+total|total(?:\s+(?:due|sale|amount))?|amount\s+due|balance\s+due)\b/i;
  const summary=/\b(sub\s*total|total|tax|change|tender|cash|credit|debit|visa|mastercard|balance|amount due|payment|savings|discount|tip|gratuity|refund)\b/i;
  const candidates=lines.flatMap((line,i)=>{
    if(!totalLabel.test(line))return [];
    const match=line.match(endingAmount)||lines[i+1]?.match(/^\$?\s*(\d[\d,]*\.\d{2})$/);
    if(!match||Number(match[1].replaceAll(',',''))<0)return [];
    return [Number(match[1].replaceAll(',','')).toFixed(2)];
  });
  const totals=[...new Set(candidates)];
  const vendor=lines.slice(0,6).find(line=>/[a-z]{2}/i.test(line)&&!endingAmount.test(line)&&!/^\d|\b(receipt|invoice|welcome|thank|www\.|https?:|tel|phone|date|cashier|store #)\b/i.test(line))||'';
  const items=lines.filter(line=>endingAmount.test(line)&&/[a-z]{2}/i.test(line)&&!summary.test(line)&&!/^\d{1,2}[/-]\d|\b(approval|auth|terminal|transaction|account|order|receipt|invoice)\b/i.test(line));
  return {vendor:vendor.slice(0,300),total:totals.length===1?totals[0]:'',items:items.join('\n').slice(0,1000)};
}

/** Store a stable private locator, not an expiring signed URL, in the existing receipt field. */
export function receiptLocator(origin:string,path:string){return `${origin}/storage/v1/object/${RECEIPT_BUCKET}/${path}`;}
export function privateReceiptPath(value:string,origin:string){
  try{const u=new URL(value),base=new URL(origin),prefix=`/storage/v1/object/${RECEIPT_BUCKET}/`;
    if(u.origin!==base.origin||!u.pathname.startsWith(prefix)||u.search||u.hash)return null;
    const path=u.pathname.slice(prefix.length);
    return /^receipts\/[a-f0-9-]+\.(jpg|png|webp)$/.test(path)?path:null;
  }catch{return null;}
}
