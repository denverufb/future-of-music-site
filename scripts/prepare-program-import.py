"""Read the supplied JSD workbook; write PRIVATE, ignored import artifacts only."""
import json
import pathlib
import uuid
import sys
from openpyxl import load_workbook

source = pathlib.Path(sys.argv[1])
destination = pathlib.Path('outputs/program-private')
destination.mkdir(parents=True, exist_ok=True)
workbook = load_workbook(source, data_only=False)
roster, evaluations, survey = [workbook[n] for n in ['Dashboard', 'Evaluations', 'Post Survey']]
def quote(v):
    if v is None: return 'null'
    if isinstance(v, bool): return 'true' if v else 'false'
    if isinstance(v, int): return str(v)
    return "'" + str(v).replace("'", "''") + "'"
def identity(key): return str(uuid.uuid5(uuid.NAMESPACE_URL, 'fom-jsd-import-2026/' + key))
def text(v): return '' if v is None else str(v).strip()
students, entries, warnings = [], [], []
sql = ['-- PRIVATE STUDENT DATA. Do not publish or commit this file.', 'begin;']
for r in range(25, 225):
    name = text(roster.cell(r, 1).value)
    if not name: continue
    school = text(roster.cell(r, 2).value)
    if school not in ['Fairview','Woodland','Northview','Hanrahan','Jennings Jr. High','Jennings High']:
        raise ValueError(f'Unrecognized school at roster row {r}')
    key = f'jsd-2026-row-{r}'
    student = {'id':identity(key), 'participant_code':f'JSD26-{r-24:03}', 'name':name, 'school':school, 'survey_completed':text(survey.cell(r-19,3).value)=='Yes', 'source_key':key}
    students.append(student)
    sql.append('insert into public.program_students(id,participant_code,name,site_id,survey_completed,source_key) select '+','.join(quote(student[k]) for k in ['id','participant_code','name'])+',id,'+','.join(quote(student[k]) for k in ['survey_completed','source_key'])+f' from public.program_sites where name={quote(school)} and program=\'JSD Youth DJ Program\' on conflict(source_key) do nothing;')
    for week in range(1,5):
        c = 3+(week-1)*4
        values = [text(evaluations.cell(r-18,c+i).value) for i in range(4)]
        if not any(values): continue
        engagement, role, initials, notes = values
        if engagement not in ['', 'Engaged','Slightly Engaged','Off Task'] or role not in ['', 'Program Coach','Executive Director (ED)']:
            raise ValueError(f'Unrecognized evaluation at row {r-18}, week {week}')
        e={'id':identity(key+f'-week-{week}'),'student_id':student['id'],'week':week,'engagement':engagement,'evaluator_role':role,'initials':initials,'notes':notes,'source_key':key+f'-week-{week}'}
        entries.append(e)
        # Import authors remain unknown: initials are preserved, not guessed as auth identities.
        sql.append('insert into public.program_evaluations('+','.join(e)+') values('+','.join(quote(v) for v in e.values())+') on conflict(source_key) do nothing;')
        if not all([engagement, role, initials]): warnings.append({'roster_row':r,'week':week,'reason':'Incomplete evaluation retained as draft'})
feedback=[]
for r in range(213,413):
    values=[survey.cell(r,c).value for c in range(1,7)]
    if any(v is not None for v in values):
        raise ValueError('Anonymous response rows require reviewed mapping before importing. No output written.')
sql += ['commit;', 'select count(*) as students_imported from public.program_students where source_key like \'jsd-2026-%\';', 'select count(*) as weekly_entries_imported from public.program_evaluations where source_key like \'jsd-2026-%\';']
destination.joinpath('import-jsd-private.sql').write_text('\n'.join(sql)+'\n')
destination.joinpath('activate-administration-private.sql').write_text(pathlib.Path('supabase/program-administration-setup.sql').read_text()+'\n'+'\n'.join(sql)+'\n')
destination.joinpath('jsd-import-private.json').write_text(json.dumps({'students':students,'evaluations':entries,'warnings':warnings},indent=2))
print(json.dumps({'students':len(students),'weekly_entries':len(entries),'drafts':len(warnings),'anonymous_responses':len(feedback),'private_output':str(destination)},indent=2))
