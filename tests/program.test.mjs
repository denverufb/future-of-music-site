import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyAssessment,validateAssessment,programSummary,evaluationComplete,questionsFor,optionsFor} from '../app/grant-tracker/program-model.ts';
test('assessment templates preserve scales and distinguish missing from lowest response',()=>{
  for(const [kind,count] of [['pre',12],['post',12],['skills',11],['dj_review',12],['feedback',4]]){
    const p=emptyAssessment(kind);assert.equal(questionsFor(kind).length,count);assert.equal(p.ratings.length,count);assert.ok(validateAssessment(kind,p));
    p.ratings.fill(0);p.artist='Example';p.reviewer='Reviewer';assert.equal(validateAssessment(kind,p),'');
    p.ratings[0]=null;assert.ok(validateAssessment(kind,p));
  }
  assert.equal(optionsFor('dj_review')[0],'Not observed');
  const p=emptyAssessment('dj_review');p.ratings.fill(1);p.artist='Example';p.reviewer='Reviewer';assert.ok(validateAssessment('dj_review',p));p.examples.fill('Observed example');assert.equal(validateAssessment('dj_review',p),'');
});
test('only fully recorded weeks count; inactive students are excluded',()=>{
  const students=[{id:'a',active:true,survey_completed:true},{id:'b',active:true,survey_completed:false},{id:'c',active:false,survey_completed:true}];
  const valid={engagement:'Engaged',evaluator_role:'Program Coach',initials:'AB'};
  assert.equal(evaluationComplete({...valid,engagement:''}),false);
  const evaluations=[1,2,3,4].map(week=>({...valid,student_id:'a',week}));evaluations.push({...valid,student_id:'b',week:1,evaluator_role:''},{...valid,student_id:'c',week:1});
  assert.deepEqual(programSummary(students,evaluations),{students:2,evaluations:4,expected:8,allFour:1,surveyCompleted:1,drafts:1});
});
