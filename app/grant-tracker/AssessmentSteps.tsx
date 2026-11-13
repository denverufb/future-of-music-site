"use client";
import {useRef,useState} from 'react';
import {optionsFor,questionsFor,type AssessmentPayload,type FormKind} from './program-model';
import s from './tracker.module.css';

export default function AssessmentSteps({kind,payload,onChange,busy,editing}:{kind:FormKind;payload:AssessmentPayload;onChange:<K extends keyof AssessmentPayload>(key:K,value:AssessmentPayload[K])=>void;busy:boolean;editing:boolean}) {
  const [step,setStep]=useState(0);
  const title=useRef<HTMLHeadingElement>(null);
  const questions=questionsFor(kind),perPage=['pre','post','feedback'].includes(kind)?4:3,pages=Math.ceil(questions.length/perPage),hasFinishStep=['skills','dj_review'].includes(kind),notes=hasFinishStep&&step===pages;
  const answered=payload.ratings.filter(v=>v!==null).length;
  const ready=questions.slice(step*perPage,step*perPage+perPage).every((_,offset)=>{
    const i=step*perPage+offset,rating=payload.ratings[i];
    return rating!==null&&(kind!=='dj_review'||rating===0||payload.examples[i].trim().length>0);
  });
  function move(next:number){setStep(next);requestAnimationFrame(()=>title.current?.focus());}
  return <fieldset disabled={busy} className={s.guidedAssessment}>
    <legend className={s.srOnly}>Assessment responses</legend>
    <div className={s.stepHeading}><div><span className={s.eyebrow}>Step {step+1} of {pages+(hasFinishStep?1:0)}</span><h3 ref={title} tabIndex={-1}>{notes?'Notes & finish':`Questions ${step*perPage+1}–${Math.min(step*perPage+perPage,questions.length)}`}</h3></div><span>{answered} / {questions.length} answered</span></div>
    <progress className={s.progressTrack} value={answered} max={questions.length} aria-label="Questions answered"/>
    {!notes?questions.slice(step*perPage,step*perPage+perPage).map((question,offset)=>{
      const i=step*perPage+offset;
      return <div key={`${kind}-${i}`} className={s.questionBlock}>
        <fieldset className={s.responseGroup}><legend><span>{i+1 < 10?'0':''}{i+1}</span>{question}</legend><div className={s.responseOptions}>
          {optionsFor(kind).map((option,n)=><label key={option} data-selected={payload.ratings[i]===n}><input type="radio" name={`rating-${i}`} value={n} checked={payload.ratings[i]===n} onChange={()=>onChange('ratings',payload.ratings.map((r,j)=>j===i?n:r))}/><span>{option}</span></label>)}
        </div></fieldset>
        {['skills','dj_review'].includes(kind)&&<label>Note or example{kind==='dj_review'&&payload.ratings[i]!==null&&(payload.ratings[i]??0)>0?' (required for an observed practice)':''}<input maxLength={1000} value={payload.examples[i]} onChange={e=>onChange('examples',payload.examples.map((v,j)=>j===i?e.target.value:v))}/></label>}
      </div>;
    }):hasFinishStep?<div className={s.finishFields}>
      <p>All {questions.length} responses are ready. Add any final notes, then save.</p>
      {['skills','dj_review'].includes(kind)&&<label>Strength observed<textarea rows={3} maxLength={5000} value={payload.strength} onChange={e=>onChange('strength',e.target.value)}/></label>}
      {kind==='dj_review'&&<label>Main growth area<textarea rows={3} maxLength={5000} value={payload.growth_area} onChange={e=>onChange('growth_area',e.target.value)}/></label>}
      <label>{kind==='feedback'?'What is one thing you gained from the program or would improve?':kind==='dj_review'?'Next action step':'What is one thing to learn or practice next?'}<textarea rows={3} maxLength={5000} value={payload.next_step} onChange={e=>onChange('next_step',e.target.value)}/></label>
      {kind==='dj_review'&&<div className={s.formGrid}><label>Follow-up date<input type="date" value={payload.follow_up} onChange={e=>onChange('follow_up',e.target.value)}/></label><label>Reviewer acknowledgment (typed name)<input maxLength={200} value={payload.reviewer_signature} onChange={e=>onChange('reviewer_signature',e.target.value)}/></label><label>Teaching artist acknowledgment (typed name)<input maxLength={200} value={payload.artist_signature} onChange={e=>onChange('artist_signature',e.target.value)}/></label></div>}
    </div>:kind==='feedback'?<label className={s.feedbackComment}>Anything you want the DJ teacher to know? <span>(optional)</span><textarea rows={3} maxLength={5000} value={payload.next_step} onChange={e=>onChange('next_step',e.target.value)}/></label>:null}
    <div className={s.stepActions}><button type="button" disabled={busy||step===0} onClick={()=>move(step-1)}>← Back</button><span>{notes?'Your responses are not saved until you press Save.':ready?'Ready for the next step':'Choose a response for each question.'}</span>{notes||(!hasFinishStep&&step===pages-1)?<button type="submit" disabled={busy||!ready} className={s.primary}>{busy?'Saving…':editing?'Save changes':'Save assessment'}</button>:<button type="button" className={s.primary} disabled={!ready||busy} onClick={()=>move(step+1)}>{step===pages-1?'Final notes →':'Continue →'}</button>}</div>
  </fieldset>;
}
