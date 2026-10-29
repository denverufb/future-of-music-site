"use client";
import {useEffect,useRef,useState} from 'react';
import type {Worker} from 'tesseract.js';
import {parseReceipt,validateReceiptFile,type ReceiptSuggestion} from './receipt-model';
import s from './tracker.module.css';

export default function ReceiptScanner({onApply,onBusyChange,onDirtyChange,disabled=false}:{onApply:(result:ReceiptSuggestion,file:File|null)=>void;onBusyChange:(busy:boolean)=>void;onDirtyChange:()=>void;disabled?:boolean}) {
  const [file,setFile]=useState<File|null>(null),[preview,setPreview]=useState(''),[result,setResult]=useState<ReceiptSuggestion|null>(null);
  const [text,setText]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false),[progress,setProgress]=useState('');
  const [attach,setAttach]=useState(true);
  const worker=useRef<Worker|null>(null),generation=useRef(0);
  useEffect(()=>()=>{generation.current++;void worker.current?.terminate();},[]);
  useEffect(()=>{if(!file){setPreview('');return;}const url=URL.createObjectURL(file);setPreview(url);return()=>URL.revokeObjectURL(url);},[file]);
  function cancel(){generation.current++;void worker.current?.terminate();worker.current=null;setBusy(false);onBusyChange(false);setProgress('Scan cancelled. You can try again or enter the details manually.');}
  async function scan(){if(!file||busy)return;const id=++generation.current;setBusy(true);onBusyChange(true);setError('');setProgress('Loading the receipt reader…');let w:Worker|null=null;let bitmap:ImageBitmap|null=null;
    try{
      bitmap=await createImageBitmap(file);
      if(bitmap.width*bitmap.height>40000000)throw new Error('This image is too large to scan safely. Please choose a smaller photo.');
      const scale=Math.min(1,2400/Math.max(bitmap.width,bitmap.height));
      const canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);
      const context=canvas.getContext('2d');if(!context)throw new Error('Your browser could not open this receipt.');
      context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();bitmap=null;
      const {createWorker}=await import('tesseract.js');
      if(id!==generation.current)return;
      w=await createWorker('eng',1,{logger:m=>{if(id===generation.current)setProgress(m.status==='recognizing text'?`Reading receipt… ${Math.round(m.progress*100)}%`:'Preparing receipt reader…');},errorHandler:()=>{}});
      if(id!==generation.current)return;worker.current=w;
      const {data}=await w.recognize(canvas);
      if(id!==generation.current)return;
      setText(data.text);setResult(parseReceipt(data.text));setProgress('Review the suggestions below. Nothing has been saved.');
      if(!data.text.trim())setError('No readable text found. Try a brighter, sharper photo, or enter the details below.');
    }catch(e){if(id===generation.current)setError(e instanceof Error?e.message:'Could not read this receipt. Try a clearer image or enter details manually.');}
    finally{bitmap?.close();if(w)await w.terminate();if(id===generation.current){worker.current=null;setBusy(false);onBusyChange(false);}}
  }
  return <section className={s.receiptScanner} aria-label="Receipt reader"><fieldset disabled={disabled&&!busy}>
    <h4>Upload & read a receipt</h4><p className={s.small}>Choose a clear JPG, PNG, or WebP photo (up to 8 MB). Text recognition runs on your device; only approved details and an optional original image are saved to your private workspace. The reader downloads its language tools on first use.</p>
    <label>Receipt photo<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={e=>{const f=e.target.files?.[0];if(!f)return;const issue=validateReceiptFile(f);setError(issue);if(issue){e.target.value='';return;}setFile(f);setResult(null);setText('');setProgress('');onDirtyChange();}}/></label>
    {preview&&<img className={s.receiptPreview} src={preview} alt="Selected receipt for review"/>}
    {file&&<div className={s.actions}><button type="button" disabled={busy} onClick={()=>void scan()}>{busy?'Reading…':'Read receipt'}</button>{busy?<button type="button" onClick={cancel}>Cancel scan</button>:<button type="button" onClick={()=>{setResult({vendor:'',total:'',items:''});setProgress('Enter the receipt details below.');}}>Enter details manually</button>}</div>}
    {progress&&<p role="status" className={s.small}>{progress}</p>}{error&&<p role="alert" className={s.error}>{error}</p>}
    {result&&!busy&&<div className={s.receiptReview}><h4>Review before using</h4><p className={s.small}>Check every value against the photo, especially the total including tax. Missing or conflicting totals are left blank. Category, date, and paid status stay under your control.</p>
      <div className={s.formGrid}><label>Scanned vendor<input maxLength={300} value={result.vendor} onChange={e=>setResult({...result,vendor:e.target.value})}/></label><label>Scanned total (USD)<input type="number" min="0" max="9999999999.99" step="0.01" value={result.total} onChange={e=>setResult({...result,total:e.target.value})}/></label></div>
      <label>Scanned items<textarea rows={5} maxLength={1000} value={result.items} onChange={e=>setResult({...result,items:e.target.value})}/></label>
      {text&&<details><summary>View recognized text</summary><pre className={s.receiptText}>{text}</pre></details>}
      <label className={s.checkLabel}><input type="checkbox" checked={attach} onChange={e=>setAttach(e.target.checked)}/>Keep the original receipt privately with this transaction</label>
      <p className={s.small}>Using these details replaces the vendor, amount, and item fields only where a suggestion is filled in. The original is uploaded only when you save the transaction. Receipt storage must be activated once in Supabase.</p>
      <button type="button" onClick={()=>{if(result.total&&(!Number.isFinite(Number(result.total))||Number(result.total)<0||Number(result.total)>9999999999.99||Math.abs(Number(result.total)*100-Math.round(Number(result.total)*100))>.0001)){setError('Enter a valid total with at most two decimals.');return;}onApply(result,attach?file:null);setResult(null);setFile(null);setProgress('Details added to your form. Review the purchase, choose its category, then save.');}}>Use reviewed details</button>
    </div>}
  </fieldset></section>;
}
