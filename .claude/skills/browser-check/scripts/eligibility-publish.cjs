// Clinical eligibility and publication regressions with the fake browser repository.
// Run: NODE_PATH=$(npm root -g) node eligibility-publish.cjs [--base http://localhost:5180]
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const args = process.argv.slice(2);
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:5179';
(async()=>{
 const browser=await chromium.launch();
 const errors=[]; let checks=0;
 const check=(value,message)=>{assert.ok(value,message);checks++;console.log('PASS '+message)};
 async function pageFor(url){const p=await browser.newPage({viewport:{width:1366,height:900}});
  p.on('pageerror',e=>errors.push(String(e)));
  await p.route('https://fonts.googleapis.com/**',r=>r.fulfill({status:200,contentType:'text/css',body:''}));
  await p.route('**/favicon.ico',r=>r.fulfill({status:204}));
  await p.goto(base+'/'+url);return p;
 }
 // Profile eligibility is saved separately from preferences and requires confirmation.
 const p=await pageFor('?view=nurses');
 await p.getByRole('button',{name:'Edit Mary',exact:true}).waitFor();
 await p.getByRole('button',{name:'Edit Mary',exact:true}).click();
 const editor=p.getByRole('dialog',{name:'Edit Mary',exact:true});
 await editor.getByLabel('Use separate clinical eligibility').check();
 check(await editor.getByRole('checkbox',{name:/^Eligible doctor:/,checked:true}).count()===0,'legacy preferences do not silently become eligibility');
 await editor.getByLabel('Eligible doctor: Dr Ray').check();
 await editor.getByRole('button',{name:'Save changes',exact:true}).click();
 check(await editor.isVisible(),'eligibility changes cannot save without confirmation');
 await editor.getByLabel('I have checked these clinical eligibility choices').check();
 await editor.getByRole('button',{name:'Save changes',exact:true}).click();
 await editor.waitFor({state:'detached'});
 const saved=await p.evaluate(()=>window.__repo.col('nurses').get('mary'));
 check(saved.doctorEligibility.doctorIds.join(',')==='ray'&&!!saved.doctorEligibility.reviewedBy,'confirmed eligibility records the current account');
 check(saved.preferences[0].refId==='lee','preferences remain independent of eligibility');
 await p.getByRole('button',{name:'Edit Mary',exact:true}).click();
 check(await editor.getByLabel('Use separate clinical eligibility').isDisabled(),'reviewed profiles cannot accidentally revert to unrestricted legacy allocation');
 await p.setViewportSize({width:390,height:844});
 await editor.getByRole('group',{name:'Clinical eligibility',exact:true}).scrollIntoViewIfNeeded();
 check(await editor.evaluate(el=>el.scrollWidth<=el.clientWidth+2),'eligibility editor fits a phone');
 await p.close();
 async function fixture(kind){
  const page=await pageFor('?view=app&seed=clean#nurses');
  await page.getByRole('button',{name:'Edit Mary',exact:true}).waitFor();
  await page.evaluate(async kind=>{
   const r=window.__repo; const date='2026-11-18';
   await r.update('nurses','mary',{active:true,...(kind==='denied'?{doctorEligibility:{doctorIds:['lee'],specialtyIds:[],reviewedAt:'2026-11-15T10:00:00Z',reviewedBy:'lead'}}:{})});
   await r.create('doctorSessions',{id:'review-ray',doctorId:'ray',specialtyId:'ent',date,startTime:'09:00',endTime:kind==='gap'?'21:00':'17:00',source:'MANUAL',cancelled:false});
   await r.create('assignments',{id:'review-cell',scheduleId:'nov',nurseId:'mary',date,dutyWindowId:'d95',kind:'DOCTOR',doctorId:'ray',source:'GENERATED',locked:false,
    note:'Last resort: none of the nurses who list this doctor was free'});
   location.hash='schedules?roster=nov';
  },kind);
  await page.waitForSelector('[data-cell="mary|2026-11-18"]');
  await page.getByRole('button',{name:/^Publish/}).first().click();
  await page.getByRole('menuitem',{name:/^Publish the roster/}).click();
  const d=page.getByRole('dialog',{name:/^Publish November/});
  await d.waitFor();
  await page.waitForFunction(()=>!document.querySelector('[role="dialog"] button[aria-busy="true"]'));
  return {page,d};
 }
 async function approve(page,d){
  await d.getByLabel(/Reason for Mary's pairing exception/).fill('Clinic lead confirmed this one duty');
  await d.getByLabel(/Approve this pairing exception for Mary/).check();
  const ack=d.getByRole('checkbox',{name:/^I have checked/});if(await ack.count())await ack.check();
 }
 async function preview(page,d){
  await d.getByRole('button',{name:'Continue',exact:true}).click();
  await d.getByLabel('Note for this version').fill('Approved test roster');
  await d.getByRole('button',{name:'Preview the emails',exact:true}).click();
 }
 // A legacy exception needs an individual reason and confirmation, then its review is saved.
 const legacy=await fixture('legacy');
 check(await legacy.d.getByRole('button',{name:'Continue',exact:true}).isDisabled(),'unreviewed exception blocks publication');
 await approve(legacy.page,legacy.d);
 check(await legacy.d.getByRole('button',{name:'Continue',exact:true}).isEnabled(),'individual approval enables the next publication step');
 await preview(legacy.page,legacy.d);
 await legacy.d.getByRole('button',{name:/^Publish (and email|without emails)/}).click();
 try{await legacy.d.getByRole('button',{name:'Done',exact:true}).waitFor({timeout:20000});}catch(e){throw new Error((await legacy.d.innerText())+'\n'+e)}
 const result=await legacy.page.evaluate(()=>({a:window.__repo.col('assignments').get('review-cell'),versions:[...window.__repo.col('versions').values()].filter(v=>v.isPublished)}));
 check(!!result.a.allocationReview?.reviewedBy&&result.a.allocationReview.reason==='Clinic lead confirmed this one duty','published assignment keeps reviewer and reason');
 check(result.versions.some(v=>v.snapshot.assignments.some(a=>a.id==='review-cell'&&a.allocationReview?.reason==='Clinic lead confirmed this one duty')),'published snapshot keeps the exact pairing review');
 await legacy.page.close();
 const denied=await fixture('denied');
 check(await denied.d.getByRole('button',{name:'Continue',exact:true}).isDisabled(),'clinical eligibility violations block publication');
 check(await denied.d.getByRole('checkbox',{name:/Approve this pairing exception/}).count()===0,'clinical ineligibility has no exception approval bypass');
 await denied.page.close();
 const gap=await fixture('gap');await approve(gap.page,gap.d);
 check(await gap.d.getByRole('button',{name:'Continue',exact:true}).isDisabled(),'reviewing an exception cannot bypass missing doctor coverage');
 await gap.page.close();
 const stale=await fixture('legacy');await approve(stale.page,stale.d);await preview(stale.page,stale.d);
 const before=await stale.page.evaluate(()=>[...window.__repo.col('versions').values()].filter(v=>v.isPublished).length);
 await stale.page.evaluate(()=>{const r=window.__repo;const n=r.col('nurses').get('mary');r.col('nurses').set('mary',{...n,doctorEligibility:{doctorIds:[],specialtyIds:[],reviewedAt:'2026-11-15T10:00:00Z',reviewedBy:'other-lead'}})});
 await stale.d.getByRole('button',{name:/^Publish (and email|without emails)/}).click();
 await stale.page.getByText(/roster or clinic details changed/).first().waitFor({timeout:15000});
 const after=await stale.page.evaluate(()=>({versions:[...window.__repo.col('versions').values()].filter(v=>v.isPublished).length,review:window.__repo.col('assignments').get('review-cell').allocationReview}));
 check(after.versions===before&&!after.review,'a stale preview saves neither a version nor a pairing approval');
 await stale.page.close();
 check(errors.length===0,'no browser page errors');
 console.log('TOTAL '+checks+' checks');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
