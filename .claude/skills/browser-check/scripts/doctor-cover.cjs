// Paired doctor cards, clinical eligibility, note status and removal, with fake clinic data.
// Run: NODE_PATH=$(npm root -g) node doctor-cover.cjs [--base http://localhost:5180] [--shots <folder>]
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const args=process.argv.slice(2);
const base=args.includes('--base')?args[args.indexOf('--base')+1]:'http://localhost:5179';
const shots=args.includes('--shots')?args[args.indexOf('--shots')+1]:null;
if(shots)fs.mkdirSync(shots,{recursive:true});
const{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch();const errors=[];let checks=0;
 const check=(ok,msg)=>{assert.ok(ok,msg);checks++;console.log('PASS '+msg)};
 async function fixture(kind){const p=await browser.newPage({viewport:{width:1366,height:1000}});p.on('pageerror',e=>errors.push(String(e)));
  await p.route('https://fonts.googleapis.com/**',r=>r.fulfill({status:200,contentType:'text/css',body:''}));await p.route('**/favicon.ico',r=>r.fulfill({status:204}));
  await p.goto(base+'/?view=app&seed=clean#nurses');await p.getByRole('button',{name:'Edit Mary',exact:true}).waitFor();
  await p.evaluate(async kind=>{const r=window.__repo,date='2026-11-18';
   await r.update('nurses','mary',{active:true,fullName:'Nurse Example',preferences:kind==='ranked'?[{kind:'DOCTOR',refId:'lee',rank:1},{kind:'DOCTOR',refId:'ray',rank:3}]:[{kind:'DOCTOR',refId:'other',rank:1}],doctorEligibility:kind==='ranked'?null:{doctorIds:kind==='denied'?['lee']:['lee','ray'],specialtyIds:[],reviewedAt:'2026-11-15T10:00:00Z',reviewedBy:'clinic-lead'}});
   await r.update('doctors','lee',{fullName:'Morgan Clinician',lowAcuity:true});await r.update('doctors','ray',{fullName:'Taylor Practitioner',lowAcuity:kind!=='invalid'});
   await r.create('dutyWindows',{id:'pair-duty',name:'9 to 7',acronym:'9-7',startTime:'09:00',endTime:'19:00',color:'#0e7490',active:true,isPriority:true});
   await r.create('doctorSessions',{id:'pair-one',doctorId:'lee',date,startTime:'09:00',endTime:'18:30',specialtyId:'ortho',source:'MANUAL',cancelled:false});
   if(kind==='valid'||kind==='ranked'||kind==='invalid'||kind==='denied'||kind==='available')await r.create('doctorSessions',{id:'pair-two',doctorId:'ray',date,startTime:'09:00',endTime:'18:30',specialtyId:'ent',source:'MANUAL',cancelled:false});
   if(kind==='available'){
    await r.update('nurses','nina',{active:true,fullName:'Float Nurse',preferences:[],doctorEligibility:{doctorIds:['lee','ray'],specialtyIds:[],reviewedAt:'2026-11-15T10:00:00Z',reviewedBy:'clinic-lead'}});
    await r.create('assignments',{id:'available-float',scheduleId:'nov',nurseId:'nina',date,dutyWindowId:'pair-duty',kind:'CLINICAL_ROLE',clinicalRoleId:'role-float',source:'GENERATED',locked:false});
   }
   if(kind==='handover'){
    await r.update('nurses','nina',{active:true,preferences:[]});
    await r.create('dutyWindows',{id:'handover-early',name:'Early',acronym:'Early',startTime:'09:00',endTime:'15:00',color:'#0e7490',active:true});
    await r.create('dutyWindows',{id:'handover-late',name:'Late',acronym:'Late',startTime:'13:00',endTime:'21:00',color:'#0e7490',active:true});
    await r.create('assignments',{id:'handover-helper',scheduleId:'nov',nurseId:'nina',date,dutyWindowId:'handover-late',kind:'DOCTOR',doctorId:'lee',locked:false,source:'GENERATED'});
   }
   await r.create('assignments',{id:'pair-cell',scheduleId:'nov',nurseId:'mary',date,dutyWindowId:kind==='handover'?'handover-early':'pair-duty',kind:'DOCTOR',doctorId:'lee',secondDoctorId:kind==='handover'?null:'ray',source:'GENERATED',locked:false});
   location.hash='schedules?roster=nov';
  },kind);const cell=p.locator('[data-cell="mary|2026-11-18"]');await cell.getByText(kind==='handover'?'15:00':'2 doctors',{exact:true}).waitFor();return{p,cell};
 }
 const valid=await fixture('valid');
 check(await valid.cell.getByText('Morgan',{exact:true}).isVisible()&&await valid.cell.getByText('Taylor',{exact:true}).isVisible(),'both doctor names have their own visible line');
 check((await valid.cell.getAttribute('aria-label')).includes('2 doctors')&&(await valid.cell.getAttribute('aria-label')).includes('Morgan Clinician')&&(await valid.cell.getAttribute('aria-label')).includes('Taylor Practitioner'),'paired duty has a full accessible description');
 check(await valid.cell.locator('[class*="ring-danger"]').count()===0,'eligible nonpreferred pair has no red mismatch');
 if(shots)await valid.cell.screenshot({path:path.join(shots,'paired-duty-cell.png')});
 if(shots)await valid.p.screenshot({path:path.join(shots,'paired-duty-roster.png')});
 for(const z of ['75%','90%','100%','115%']){
  await valid.p.getByRole('group',{name:'Zoom',exact:true}).getByRole('button',{name:z,exact:true}).click();
  check(await valid.cell.evaluate(el=>el.scrollWidth<=el.clientWidth+2),'paired card fits at '+z);
 }
 await valid.p.evaluate(()=>location.hash='schedules?roster=nov&sheet=problems');
 await valid.p.getByRole('combobox',{name:'Type of problem'}).selectOption('DOCTOR_COVER');
 await valid.p.getByRole('combobox',{name:'How serious'}).selectOption('INFO');
 await valid.p.getByText(/Nurse Example is assigned to Morgan Clinician and Taylor Practitioner/).waitFor();
 check((await valid.p.locator('body').innerText()).includes('One nurse covers two low acuity doctors'),'last resort paired cover is listed as an informational note');
 if(shots)await valid.p.screenshot({path:path.join(shots,'paired-duty-note.png')});
 await valid.p.evaluate(async()=>{await window.__repo.update('assignments','pair-cell',{secondDoctorId:null})});
 await valid.p.getByText(/Nurse Example is assigned to Morgan Clinician and Taylor Practitioner/).waitFor({state:'hidden'});
 await valid.p.evaluate(()=>location.hash='schedules?roster=nov');await valid.cell.waitFor();
 check(await valid.cell.getByText('2 doctors',{exact:true}).count()===0,'badge and note clear when the second doctor is removed');await valid.p.close();
 const available=await fixture('available');
 await available.p.evaluate(()=>location.hash='schedules?roster=nov&sheet=problems');
 await available.p.getByRole('combobox',{name:'Type of problem'}).selectOption('DOCTOR_COVER');
 await available.p.getByText(/but Float Nurse can provide separate cover/).waitFor();
 check(await available.p.getByText(/No complete eligible Float replacement/).count()===0,'avoidable sharing gets a must fix instead of a last resort note');
 if(shots)await available.p.screenshot({path:path.join(shots,'avoidable-shared-cover.png')});
 await available.p.getByRole('button',{name:/^Publish/}).first().click();
 await available.p.getByRole('menuitem',{name:/^Publish the roster/}).click();
 const publish=available.p.getByRole('dialog',{name:/^Publish November/});await publish.waitFor();
 await publish.getByText(/but Float Nurse can provide separate cover/).waitFor();
 check(await publish.getByRole('button',{name:'Continue',exact:true}).isDisabled(),'available eligible Float cover blocks publication');
 check(await publish.getByRole('checkbox',{name:/Approve this pairing exception/}).count()===0,'avoidable sharing has no pairing exception override');
 await publish.getByRole('button',{name:'Cancel',exact:true}).click();
 await available.p.evaluate(async()=>{await window.__repo.remove('assignments','available-float')});
 await available.p.getByText(/No complete eligible Float replacement/).waitFor();
 check(await available.p.getByText(/but Float Nurse can provide separate cover/).count()===0,'removing the Float clears the derived availability problem');
 await available.p.getByRole('button',{name:/^Publish/}).first().click();await available.p.getByRole('menuitem',{name:/^Publish the roster/}).click();await publish.waitFor();
 await publish.getByRole('button',{name:'Continue',exact:true}).waitFor();
 const acknowledge=publish.getByRole('checkbox',{name:/^I have checked/});if(await acknowledge.count())await acknowledge.check();
 check(await publish.getByRole('button',{name:'Continue',exact:true}).isEnabled(),'a necessary pair can continue publication when separate Float cover is unavailable');
 await available.p.close();
 const ranked=await fixture('ranked');
 check(await ranked.cell.getByText('Morgan',{exact:true}).evaluate(el=>el.scrollWidth<=el.clientWidth+1)&&await ranked.cell.getByText('Taylor',{exact:true}).evaluate(el=>el.scrollWidth<=el.clientWidth+1),'both names remain readable beside a ranked preference');
 check(await ranked.cell.getByText('#3',{exact:true}).isVisible(),'paired duty retains its preference rank');
 if(shots)await ranked.cell.screenshot({path:path.join(shots,'paired-duty-ranked-cell.png')});await ranked.p.close();
 const denied=await fixture('denied');
 check((await denied.cell.getAttribute('title')).includes('not eligible'),'ineligible second doctor still gets a clear warning');
 await denied.p.evaluate(()=>location.hash='schedules?roster=nov&sheet=problems');
 await denied.p.getByRole('combobox',{name:'Type of problem'}).selectOption('DOCTOR_COVER');
 check(await denied.p.getByText(/One nurse covers two low acuity doctors/).count()===0,'ineligible pair has no reassuring cover note');await denied.p.close();
 const invalid=await fixture('invalid');await invalid.p.evaluate(()=>location.hash='schedules?roster=nov&sheet=problems');
 await invalid.p.getByText(/is not marked as low acuity/).waitFor();
 check(await invalid.p.getByText(/One nurse covers two low acuity doctors/).count()===0,'normal acuity doctor pair remains a must fix');await invalid.p.close();
 const handover=await fixture('handover');
 check(await handover.cell.getByText('2 doctors',{exact:true}).count()===0,'two nurses on one doctor do not get a two doctor badge');
 await handover.p.evaluate(()=>location.hash='schedules?roster=nov&sheet=problems');
 await handover.p.getByRole('combobox',{name:'Type of problem'}).selectOption('DOCTOR_COVER');
 await handover.p.getByRole('combobox',{name:'How serious'}).selectOption('INFO');
 await handover.p.getByText(/has handover cover:/).waitFor();
 check((await handover.p.locator('body').innerText()).includes('Overlap: 13:00 to 15:00.'),'a complete overlapping handover is an informational note');await handover.p.close();
 check(errors.length===0,'no page errors');console.log('TOTAL '+checks+' checks');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
