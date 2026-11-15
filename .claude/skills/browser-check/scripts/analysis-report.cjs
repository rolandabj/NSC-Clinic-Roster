// Full report preview and JSON and text downloads with fake clinic data.
// Run: NODE_PATH=$(npm root -g) node analysis-report.cjs [--base http://localhost:5180] [--shots <folder>]
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright');
const path=require('node:path');
const os=require('node:os');
const args=process.argv.slice(2);
const base=args.includes('--base')?args[args.indexOf('--base')+1]:'http://localhost:5179';
const downloads=fs.mkdtempSync(path.join(os.tmpdir(),'nsc-report-check-'));
const shots=args.includes('--shots')?args[args.indexOf('--shots')+1]:null;
if(shots)fs.mkdirSync(shots,{recursive:true});
(async()=>{
 const browser=await chromium.launch();
 const errors=[];let checks=0;
 const check=(ok,message)=>{assert.ok(ok,message);checks++;console.log('PASS '+message)};
 async function page(kind){
  const p=await browser.newPage({viewport:{width:1366,height:900}});p.on('pageerror',e=>errors.push(String(e)));
  await p.route('https://fonts.googleapis.com/**',r=>r.fulfill({status:200,contentType:'text/css',body:''}));
  await p.route('**/favicon.ico',r=>r.fulfill({status:204}));
  await p.goto(base+'/?view=app&seed=clean#nurses');
  await p.getByRole('button',{name:'Edit Mary',exact:true}).waitFor();
  await p.evaluate(async kind=>{
   const r=window.__repo, date='2026-11-18';
   if(kind==='holiday'){
    await r.create('holidays',{id:'test-holiday',date,name:'Test holiday'});
    for(const id of [...r.col('assignments').keys()])await r.remove('assignments',id);
    location.hash='schedules?roster=nov';return;
   }
   if(kind!=='clean'){
    await r.update('nurses','mary',{active:true,...(kind==='partial'?{doctorEligibility:{doctorIds:['ray'],specialtyIds:[],reviewedAt:'2026-11-15T10:00:00Z',reviewedBy:'private-clinical-reviewer'}}:{})});
    await r.create('doctorSessions',{id:'report-ray',doctorId:'ray',date,startTime:'09:00',endTime:kind==='partial'?'19:00':'17:00',specialtyId:'ent',source:'MANUAL',cancelled:false});
    if(kind==='pair'){
     await r.update('doctors','lee',{lowAcuity:true});await r.update('doctors','ray',{lowAcuity:true});
     await r.create('doctorSessions',{id:'report-lee',doctorId:'lee',date,startTime:'09:00',endTime:'17:00',specialtyId:'ortho',source:'MANUAL',cancelled:false});
    }
    await r.create('assignments',{id:'report-cell',scheduleId:'nov',nurseId:'mary',date,dutyWindowId:'d95',kind:'DOCTOR',doctorId:kind==='pair'?'lee':'ray',...(kind==='pair'?{secondDoctorId:'ray'}:{}),locked:false,source:'GENERATED',note:'Last resort: none of the nurses who list this doctor was free'});
   }
   location.hash='schedules?roster=nov';
  },kind);
  await p.waitForSelector('[data-cell="amy|2026-11-18"]');
  const before=await p.evaluate(()=>JSON.stringify([...window.__repo.col('assignments').values()]));
  await p.getByRole('button',{name:'More actions',exact:true}).click();await p.getByRole('menuitem',{name:/^Export or print/}).click();
  const d=p.getByRole('dialog',{name:'Export or print',exact:true});await d.getByRole('tab',{name:'Full report',exact:true}).click();
  await d.getByRole('region',{name:'Roster review',exact:true}).waitFor();return {p,d,before};
 }
 async function download(p,d,name,path){const pending=p.waitForEvent('download');await d.getByRole('button',{name,exact:true}).click();const file=await pending;await file.saveAs(path);return fs.readFileSync(path,'utf8')}
 const clean=await page('clean');
 check(await clean.d.getByText('No problems block publication',{exact:true}).isVisible(),'clean roster shows publication check result');
 const cleanJSON=JSON.parse(await download(clean.p,clean.d,'Download the full report',path.join(downloads,'clean.json')));
 check(cleanJSON.review.publication.canProceed&&cleanJSON.review.publication.blockerCount===0,'downloaded JSON agrees with clean preview');
 const cleanText=await download(clean.p,clean.d,'Download action list',path.join(downloads,'clean-actions.txt'));
 check(cleanText.includes('18-11-2026')&&cleanText.includes('No problems block publication.'),'readable action list keeps dates and publication result');
 check((await clean.p.evaluate(()=>JSON.stringify([...window.__repo.col('assignments').values()])))===clean.before,'exporting does not change roster assignments');await clean.p.close();
 const partial=await page('partial');
 check(await partial.d.getByText('Fix before publishing',{exact:true}).isVisible(),'partial doctor coverage blocks report readiness');
 check(await partial.d.locator('dl').innerText().then(t=>t.includes('2h')),'summary shows missing doctor time');
 await partial.d.locator('summary',{hasText:'Exact coverage gaps'}).click();
 check(await partial.d.getByText(/Dr Ray, 17:00 to 19:00/).isVisible(),'exact doctor gap can be expanded');
 const data=JSON.parse(await download(partial.p,partial.d,'Download the full report',path.join(downloads,'partial.json')));
 check(data.summary.problems.ERROR===0&&!data.review.publication.canProceed,'draft check and publication blockers stay distinct');
 const shift=data.shifts.find(s=>s.id==='report-cell');
 check(shift.preferenceRank===null&&shift.allocation.allowedByProfile&&data.summary.doctorSessions.pairedOutsideList===0,'eligible nonpreferred work is not called outside the profile');
 check(!JSON.stringify(data).includes('private-clinical-reviewer')&&!JSON.stringify(data).includes('@example.com'),'downloads exclude reviewer accounts and email addresses');
 const text=await download(partial.p,partial.d,'Download action list',path.join(downloads,'partial-actions.txt'));
 check(text.includes('Missing doctor cover: 2h')&&text.includes('17:00 to 19:00'),'readable action list agrees with JSON gaps');
 await partial.p.setViewportSize({width:390,height:844});await partial.p.waitForTimeout(300);
 check(await partial.d.evaluate(el=>el.scrollWidth<=el.clientWidth+2),'full report fits a phone');
 if(shots)await partial.p.screenshot({path:path.join(shots,'report-phone.png')});
 await partial.p.close();
 const paired=await page('pair');
 const pairData=JSON.parse(await download(paired.p,paired.d,'Download the full report',path.join(downloads,'pair.json')));
 check(pairData.review.coverage.uncoveredDoctorMinutes===0,'paired shift reports both doctor sessions as covered');
 check(pairData.review.pairingExceptions.pending===1&&!pairData.review.publication.canProceed,'unreviewed paired exception remains a publication blocker');
 await paired.d.locator('summary',{hasText:'Actions before publication'}).click();
 check(await paired.d.getByText(/Mary with Dr Lee and Dr Ray/).isVisible(),'action list names both doctors');
 await paired.p.close();
 const holiday=await page('holiday');
 const holidayData=JSON.parse(await download(holiday.p,holiday.d,'Download the full report',path.join(downloads,'holiday.json')));
 check(holidayData.review.coverage.missingHolidayCoverMinutes===720&&holidayData.review.coverage.missingNurseClinicMinutes===0,'holiday gaps are separate from Nurse Clinic qualification');
 check(await holiday.d.getByText('Missing holiday cover',{exact:true}).isVisible(),'holiday cover has its own screen total');
 check(holidayData.review.userActions.some(a=>a.instruction.includes('holiday opening hours')),'holiday action asks for ordinary nurse cover');
 await holiday.p.close();check(errors.length===0,'no browser page errors');console.log('TOTAL '+checks+' checks');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
