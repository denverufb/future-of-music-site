"use client";
import {useState} from 'react';

/** Unlike a datalist, this always exposes every category, even with a value selected. */
export default function CategoryPicker({value,options,label,onChange,disabled=false}:{value:string;options:string[];label:string;onChange:(value:string)=>void;disabled?:boolean}) {
  const [custom,setCustom]=useState(false);
  const isCustom=custom||!options.includes(value);
  return <div><label>{label}<select required disabled={disabled} value={isCustom?'__custom__':value} onChange={e=>{const next=e.target.value;setCustom(next==='__custom__');onChange(next==='__custom__'?'':next);}}>
    {options.map(option=><option key={option} value={option}>{option}</option>)}
    <option value="__custom__">+ Custom category…</option>
  </select></label>{isCustom&&<label>Custom category name<input required disabled={disabled} maxLength={200} value={value} onChange={e=>onChange(e.target.value)}/></label>}</div>;
}
