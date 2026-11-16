// Timed doctor cover reading, manual editing and preservation, using fake clinic data only.
// Run: NODE_PATH=$(npm root -g) node timed-cover.cjs [--base http://localhost:5179] [--shots <folder>]
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');
const args=process.argv.slice(2);
const base=args.includes('--base')?args[args.indexOf('--base')+1]:'http://localhost:5179';
const shots=args.includes('--shots')?args[args.indexOf('--shots')+1]:null;
if(shots)fs.mkdirSync(shots,{recursive:true});
(async()=>{
 const browser=await chromium.launch();let checks=0;const errors=[];
 const check=(ok,text)=>{assert.ok(ok,text);console.log('PASS '+text);checks++};
 async function fixture(mode){
  const p=await browser.newPage({viewport:{width:1366,height:1000}});p.on('pageerror',e=>errors.push(String(e)));
  await p.route('https://fonts.googleapis.com/**',r=>r.fulfill({status:200,contentType:'text/css',body:''}));await p.route('**/favicon.ico',r=>r.fulfill({status:204}));
  await p.goto(base+'/?view=app&seed=clean#nurses');await p.getByRole('button',{name:'Edit Mary',exact:true}).waitFor();
  await p.evaluate(async mode=>{const r=window.__repo,date='2026-11-18';
   const e={doctorIds:['lee','ray'],specialtyIds:[],reviewedBy:'clinic-lead',reviewedAt:'2026-11-16T10:00:00Z'};
   await r.update('nurses','mary',{active:true,fullName:'Reader Nurse',preferences:[],doctorEligibility:e});
   await r.update('doctors','lee',{fullName:'Morgan Practitioner',lowAcuity:mode==='shared'});await r.update('doctors','ray',{fullName:'Taylor Clinician',lowAcuity:mode==='shared'});
   for(const doctorId of ['lee','ray'])await r.create('doctorSessions',{id:'timed-session-'+doctorId,doctorId,date,startTime:'09:00',endTime:'19:00',specialtyId:doctorId==='lee'?'ortho':'ent',source:'MANUAL',cancelled:false});
   await r.create('dutyWindows',{id:'timed-duty',name:'9 to 7',acronym:'9-7',startTime:'09:00',endTime:'19:00',color:'#0e7490',active:true});
   const doctorCoverage=mode==='shared'?[{doctorId:'lee',startTime:'09:00',endTime:'14:00'},{doctorId:'ray',startTime:'13:00',endTime:'17:00'}]
    :mode==='invalid'?[{doctorId:'lee',startTime:'17:00',endTime:'09:00'}]
    :[{doctorId:'lee',startTime:'09:00',endTime:'12:00'},{doctorId:'ray',startTime:'13:00',endTime:'17:00'}];
   await r.create('assignments',{id:'timed-cell',scheduleId:'nov',nurseId:'mary',date,dutyWindowId:'timed-duty',kind:'DOCTOR',doctorId:'lee',secondDoctorId:'ray',doctorCoverage,source:'MANUAL',locked:false});
   if(mode==='manual-overlap'){
    await r.update('nurses','nina',{active:true,fullName:'Handover Nurse',preferences:[],doctorEligibility:{doctorIds:['lee'],specialtyIds:[],reviewedBy:'clinic-lead',reviewedAt:'2026-11-16T10:00:00Z'}});
    await r.create('assignments',{id:'handover-peer',scheduleId:'nov',nurseId:'nina',date,dutyWindowId:'timed-duty',kind:'DOCTOR',doctorId:'lee',doctorCoverage:[{doctorId:'lee',startTime:'10:00',endTime:'11:00'}],source:'GENERATED',locked:false});
   }
   location.hash='schedules?roster=nov';
  },mode);
  const cell=p.locator('[data-cell="mary|2026-11-18"]');await cell.getByText(mode==='shared'?'2 doctors':mode==='invalid'?'Review cover':'In turn',{exact:true}).waitFor();
  return {p,cell};
 }
 const seq=await fixture('sequential');
 check(await seq.cell.getByText('Morgan',{exact:true}).isVisible()&&await seq.cell.getByText('Taylor',{exact:true}).isVisible(),'sequential doctor names are visible');
 check((await seq.cell.getAttribute('aria-label')).includes('Morgan Practitioner 09:00 to 12:00')&&(await seq.cell.getAttribute('aria-label')).includes('Taylor Clinician 13:00 to 17:00'),'accessible description names each doctor and their exact times');
 check(await seq.cell.getByText('Float',{exact:true}).count()===2,'Float gaps are visible inside the paid duty');
 check(await seq.cell.getByText('2 doctors',{exact:true}).count()===0,'sequential normal doctors are not labelled concurrent sharing');
 for(const zoom of ['75%','90%','100%','115%']){
  await seq.p.getByRole('group',{name:'Zoom',exact:true}).getByRole('button',{name:zoom,exact:true}).click();
  check(await seq.cell.evaluate(el=>{const box=el.querySelector('.grid');return el.scrollWidth<=el.clientWidth+2&&box&&box.scrollHeight<=box.clientHeight+2&&box.scrollWidth<=box.clientWidth+2}),'timed names and time lines fit horizontally and vertically at '+zoom);
 }
 if(shots)await seq.cell.screenshot({path:path.join(shots,'sequential-timed-cell.png')});
 await seq.cell.dblclick();const edit=seq.p.getByRole('dialog',{name:/Reader Nurse/});await edit.waitFor();
 check(await edit.getByRole('button',{name:'Shift',exact:true}).isEnabled()&&await edit.getByLabel('Doctor',{exact:true}).isEnabled(),'timed duties allow shift and doctor editing');
 check(await edit.getByLabel('Morgan Practitioner, period 1 starts',{exact:true}).inputValue()==='09:00'&&await edit.getByLabel('Taylor Clinician, period 1 starts',{exact:true}).inputValue()==='13:00','saved exact periods populate the editor');
 const beforeInvalid=await seq.p.evaluate(()=>JSON.stringify([...window.__repo.col('assignments').values()]));
 await edit.getByLabel('Taylor Clinician, period 1 starts',{exact:true}).fill('11:00');await edit.getByRole('button',{name:'Save',exact:true}).click();
 await edit.getByRole('alert').getByText(/not marked as low acuity/).waitFor();
 await seq.p.waitForFunction(()=>document.activeElement?.querySelector('[role="alert"]'));
 check(await seq.p.evaluate(()=>{const r=document.activeElement.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight}),'invalid cover moves focus to its visible error');
 check(beforeInvalid===await seq.p.evaluate(()=>JSON.stringify([...window.__repo.col('assignments').values()])),'normal acuity simultaneous cover is refused inline without saving');
 await edit.getByLabel('Taylor Clinician, period 1 starts',{exact:true}).fill('13:00');
 await edit.getByRole('button',{name:'Add another period for Morgan Practitioner',exact:true}).click();
 await edit.getByLabel('Morgan Practitioner, period 2 starts',{exact:true}).fill('18:00');await edit.getByLabel('Morgan Practitioner, period 2 ends',{exact:true}).fill('19:00');
 await edit.getByLabel('Note',{exact:false}).fill('Coverage reviewed');await edit.getByRole('checkbox',{name:/^Keep this when the roster is filled again/}).check();await edit.getByRole('button',{name:'Save',exact:true}).click();await edit.waitFor({state:'hidden'});
 const saved=await seq.p.evaluate(()=>({a:[...window.__repo.col('assignments').values()].find(a=>a.nurseId==='mary'&&a.date==='2026-11-18'),lock:[...window.__repo.col('locks').values()].find(a=>a.nurseId==='mary'&&a.date==='2026-11-18')}));
 check(saved.a.doctorCoverage.length===3&&saved.a.note==='Coverage reviewed'&&saved.a.secondDoctorId==='ray'&&saved.lock.doctorCoverage.length===3,'a normal second doctor and repeated visits save with the pin');
 await seq.p.getByRole('tab',{name:'Doctors',exact:true}).click();
 const first=seq.p.getByRole('button',{name:/Change clinic for Morgan Practitioner/});await first.waitFor();
 check((await first.getAttribute('aria-label')).includes('Reader Nurse: 09:00 to 12:00')&&(await first.getAttribute('aria-label')).includes('Reader Nurse: 18:00 to 19:00')&&(await first.getAttribute('aria-label')).includes('No nurse: 12:00 to 18:00'),'doctor sheet lists each repeated period and the exact remaining gap');
 await seq.p.getByRole('tab',{name:'Roster',exact:true}).click();
 await seq.p.getByRole('button',{name:/Fill roster/}).first().click();await seq.p.getByRole('menuitem',{name:/Fill the whole roster/}).click();
 const fill=seq.p.getByRole('dialog',{name:/Fill/});await fill.waitFor();await fill.getByRole('button',{name:/^Fill/}).last().click();await fill.waitFor({state:'hidden',timeout:60000});
 const afterFill=await seq.p.evaluate(()=>({a:[...window.__repo.col('assignments').values()].find(a=>a.nurseId==='mary'&&a.date==='2026-11-18'),lock:[...window.__repo.col('locks').values()].find(a=>a.nurseId==='mary'&&a.date==='2026-11-18')}));
 check(JSON.stringify(afterFill.a.doctorCoverage)===JSON.stringify(saved.a.doctorCoverage)&&JSON.stringify(afterFill.lock.doctorCoverage)===JSON.stringify(saved.lock.doctorCoverage),'Fill accepts timed records and preserves exact pinned cover');
 await seq.p.close();
 const overlap=await fixture('manual-overlap');
 await overlap.p.locator('[data-cell="nina|2026-11-18"]').waitFor();await overlap.cell.dblclick();
 const overlapEditor=overlap.p.getByRole('dialog',{name:/Reader Nurse/});await overlapEditor.waitFor();
 await overlapEditor.getByLabel('Note',{exact:false}).fill('Handover reviewed');await overlapEditor.getByRole('button',{name:'Save',exact:true}).click();await overlapEditor.waitFor({state:'hidden'});
 await overlap.p.waitForFunction(()=>[...window.__repo.col('assignments').values()].some(a=>a.nurseId==='mary'&&a.manualDoctorOverlaps?.length));
 const intention=await overlap.p.evaluate(()=>[...window.__repo.col('assignments').values()].find(a=>a.nurseId==='mary').manualDoctorOverlaps[0]);
 check(intention.doctorId==='lee'&&intention.startTime==='10:00'&&intention.endTime==='11:00','saving manual overlap records only the exact shared doctor time without extra approval');
 await overlap.p.waitForFunction(()=>[...window.__repo.col('audit').values()].some(a=>a.note?.startsWith('Manual doctor overlap saved')));
 check(await overlap.p.evaluate(()=>[...window.__repo.col('audit').values()].some(a=>a.entity==='Assignment'&&a.note?.includes('10:00 to 11:00'))),'manual overlap has a saved audit event');
 await overlap.p.evaluate(()=>location.hash='schedules?roster=nov&sheet=problems');
 await overlap.p.getByRole('combobox',{name:'Type of problem'}).selectOption('DOCTOR_COVER');await overlap.p.getByRole('combobox',{name:'How serious'}).selectOption('WARN');
 await overlap.p.getByText(/has more than one nurse from 10:00 to 11:00.*saved by a planner/).waitFor();
 check(await overlap.p.getByText(/has more than one nurse from 10:00 to 11:00.*saved by a planner/).isVisible(),'saved intentional overlap is a Check');
 if(shots)await overlap.p.screenshot({path:path.join(shots,'manual-doctor-overlap-check.png')});await overlap.p.close();
 const shared=await fixture('shared');
 check((await shared.cell.getAttribute('title')).includes('Shared cover: 13:00 to 14:00'),'shared cover states only the actual overlapping hour');await shared.p.close();
 const invalid=await fixture('invalid');
 check(await invalid.cell.getByText('Float',{exact:true}).count()===0&&(await invalid.cell.getAttribute('aria-label')).includes('needs review'),'invalid timing shows review without invented Float capacity');await invalid.p.close();
 const phone=await fixture('sequential');await phone.p.setViewportSize({width:390,height:844});
 const day=phone.p.getByRole('region',{name:'The roster, one day at a time'});await day.waitFor();
 check((await day.innerText()).includes('Morgan Practitioner 09:00 to 12:00')&&(await day.innerText()).includes('Float 12:00 to 13:00'),'phone roster includes exact cover and Float times');if(shots)await phone.p.screenshot({path:path.join(shots,'timed-phone-roster.png')});await phone.p.close();
 check(errors.length===0,'no page errors');console.log('TOTAL '+checks+' checks');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
