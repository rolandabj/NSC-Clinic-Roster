import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import { publicationReport } from '../../src/services/publish/publicationChecks';
import { cellLookupsOf, cellViewOf } from '../../src/components/workbook/grid/cellView';
import { makeNurse, makeSchedule, DAY_DUTY, SENIOR, hoursOnlyRules } from './fixtures';
import type { Assignment, Doctor, DoctorSession } from '../../src/types';
const date='2026-11-22';
const doctors=['one','two'].map(id=>({id,fullName:id==='one'?'Dr Morgan Clinician':'Dr Taylor Practitioner',specialtyIds:[],active:true,weeklyPattern:[],lowAcuity:true} as Doctor));
const sessions=doctors.map(d=>({id:d.id,doctorId:d.id,date,startTime:'09:00',endTime:'17:00',cancelled:false,source:'MANUAL'} as DoctorSession));
const nurses=[makeNurse('amy'),makeNurse('ben')];
const shift=(nurseId:string,dutyWindowId=DAY_DUTY.id):Assignment=>({id:nurseId,scheduleId:'sched-1',nurseId,date,dutyWindowId,kind:'DOCTOR',doctorId:'one',source:'GENERATED',locked:false});
const schedule=makeSchedule({startDate:date,endDate:date,hoursTargetFullTime:8});
const check=(assignments:Assignment[],duties=[DAY_DUTY],clinics=sessions,profiles=doctors,staff=nurses)=>ScheduleValidator.validate(schedule,assignments,staff,[SENIOR],duties,clinics,[],[],[],hoursOnlyRules(),[],[],profiles);

test('a valid paired duty has an informational note naming the nurse and both doctors',()=>{
 const pair={...shift('amy'),secondDoctorId:'two'};const report=check([pair]);
 const note=report.findings.find(f=>f.id.startsWith('low-acuity-cover-'));
 assert.equal(note?.severity,'INFO');assert.equal(note?.category,'DOCTOR_COVER');
 assert.match(note!.message,/Morgan Clinician/);assert.match(note!.message,/Taylor Practitioner/);
 assert.deepEqual(note?.cellRefs,[{nurseId:'amy',date}]);
 assert.equal(publicationReport(report,[pair],nurses,{doctors,sessions,specialties:[]}).errorCount,0);
});
test('a normal doctor in a paired duty remains an error and gets no reassuring pair note',()=>{
 const report=check([{...shift('amy'),secondDoctorId:'two'}],[DAY_DUTY],sessions,[doctors[0],{...doctors[1],lowAcuity:false}]);
 assert.ok(report.findings.some(f=>f.id.startsWith('low-acuity-pair-')&&f.severity==='ERROR'));
 assert.ok(!report.findings.some(f=>f.id.startsWith('low-acuity-cover-')));
});
test('paired cover note disappears when the second doctor is removed',()=>{
 assert.ok(!check([shift('amy')]).findings.some(f=>f.id.startsWith('low-acuity-cover-')));
});
test('an overlapping handover has a note but requires a saved manual edit to keep its overlap',()=>{
 const duties=[{...DAY_DUTY,id:'early',endTime:'15:00'},{...DAY_DUTY,id:'late',startTime:'13:00',endTime:'21:00'}];
 const report=check([shift('amy','early'),shift('ben','late')],duties,[{...sessions[0],endTime:'18:30'}]);
 const note=report.findings.find(f=>f.id.startsWith('session-handover-'));
 assert.equal(note?.severity,'INFO');assert.match(note!.message,/13:00 to 15:00/);
 assert.ok(report.findings.some(f=>f.id.startsWith('session-overlap-')&&f.severity==='ERROR'));
});
test('unrecorded second nurse cover is an error when one nurse already covers the whole session',()=>{
 const duties=[DAY_DUTY,{...DAY_DUTY,id:'late',startTime:'13:00'}];
 const report=check([shift('amy'),shift('ben','late')],duties,[sessions[0]]);
 assert.ok(report.findings.some(f=>f.id.startsWith('session-overlap-')&&f.severity==='ERROR'));
 assert.ok(!report.findings.some(f=>f.id.startsWith('session-handover-')));
});
test('a handover with a remaining gap stays a coverage problem',()=>{
 const duties=[{...DAY_DUTY,id:'early',endTime:'14:00'},{...DAY_DUTY,id:'late',startTime:'13:00',endTime:'16:00'}];
 const report=check([shift('amy','early'),shift('ben','late')],duties,[sessions[0]]);
 assert.ok(report.findings.some(f=>f.id.startsWith('session-partial-')));
 assert.ok(!report.findings.some(f=>f.id.startsWith('session-handover-')));
});
test('paired grid cells expose two separate names and an accessible two doctor label',()=>{
 const lookups=cellLookupsOf({dutyWindows:[DAY_DUTY],doctors,roles:[],specialties:[],leaveTypes:[]});
 const view=cellViewOf({nurse:nurses[0],day:{dateStr:date,isToday:false,isWeekend:true},assignment:{...shift('amy'),secondDoctorId:'two'},problems:[]},lookups);
 assert.equal(view.pairedDoctors,true);assert.equal(view.primaryDoctorLabel,'Morgan');assert.equal(view.secondaryDoctorLabel,'Taylor');
 assert.match(view.ariaLabel,/2 doctors/);assert.match(view.title,/low acuity/);
});
test('single doctor and leave cells do not acquire a paired badge',()=>{
 const lookups=cellLookupsOf({dutyWindows:[DAY_DUTY],doctors,roles:[],specialties:[],leaveTypes:[]});
 const view=cellViewOf({nurse:nurses[0],day:{dateStr:date,isToday:false,isWeekend:true},assignment:shift('amy'),problems:[]},lookups);
 assert.equal(view.pairedDoctors,false);
});

test('reviewed eligibility permits a nonpreferred paired duty without a red mismatch',()=>{
 const eligible=makeNurse('amy',{preferences:[{kind:'DOCTOR',refId:'other',rank:1}],doctorEligibility:{doctorIds:['one','two'],specialtyIds:[],reviewedAt:'2026-11-15T10:00:00Z',reviewedBy:'planner'}});
 const lookups=cellLookupsOf({dutyWindows:[DAY_DUTY],doctors,roles:[],specialties:[],leaveTypes:[]});
 const view=cellViewOf({nurse:eligible,day:{dateStr:date,isToday:false,isWeekend:true},assignment:{...shift('amy'),secondDoctorId:'two'},problems:[]},lookups);
 assert.equal(view.mismatch,false);assert.equal(view.rankBadge,null);
});
test('a preferred but clinically ineligible second doctor still gets a mismatch',()=>{
 const eligible=makeNurse('amy',{preferences:[{kind:'DOCTOR',refId:'one',rank:1},{kind:'DOCTOR',refId:'two',rank:2}],doctorEligibility:{doctorIds:['one'],specialtyIds:[],reviewedAt:'2026-11-15T10:00:00Z',reviewedBy:'planner'}});
 const lookups=cellLookupsOf({dutyWindows:[DAY_DUTY],doctors,roles:[],specialties:[],leaveTypes:[]});
 const view=cellViewOf({nurse:eligible,day:{dateStr:date,isToday:false,isWeekend:true},assignment:{...shift('amy'),secondDoctorId:'two'},problems:[]},lookups);
 assert.equal(view.mismatch,true);assert.equal(view.rankBadge,'!');assert.match(view.title,/not eligible/);
});
test('paired specialty eligibility in the grid follows the session rather than every specialty of a doctor',()=>{
 const profiles=doctors.map(d=>({...d,specialtyIds:['approved','other']}));
 const eligible=makeNurse('amy',{doctorEligibility:{doctorIds:[],specialtyIds:['approved'],reviewedAt:'2026-11-15T10:00:00Z',reviewedBy:'planner'}});
 const facts={nurse:eligible,day:{dateStr:date,isToday:false,isWeekend:true},assignment:{...shift('amy'),secondDoctorId:'two'},problems:[]};
 const lists={dutyWindows:[DAY_DUTY],doctors:profiles,roles:[],specialties:[],leaveTypes:[]};
 assert.equal(cellViewOf(facts,cellLookupsOf({...lists,sessions:sessions.map(s=>({...s,specialtyId:'approved'}))})).mismatch,false);
 assert.equal(cellViewOf(facts,cellLookupsOf({...lists,sessions:sessions.map(s=>({...s,specialtyId:s.doctorId==='two'?'other':'approved'}))})).mismatch,true);
});
test('a paired assignment with no duty overlap for the second clinic gets no cover note',()=>{
 const report=check([{...shift('amy'),secondDoctorId:'two'}],[DAY_DUTY],[sessions[0],{...sessions[1],startTime:'19:00',endTime:'21:00'}]);
 assert.ok(!report.findings.some(f=>f.id.startsWith('low-acuity-cover-')));
 assert.ok(report.findings.some(f=>f.id.startsWith('session-partial-')||f.id.startsWith('session-no-overlap-')));
});

test('a redundant third nurse is not hidden inside an otherwise valid handover note',()=>{
 const duties=[{...DAY_DUTY,id:'early',endTime:'15:00'},{...DAY_DUTY,id:'late',startTime:'13:00',endTime:'21:00'},{...DAY_DUTY,id:'extra',startTime:'11:00',endTime:'17:00'}];
 const report=check([shift('amy','early'),shift('ben','late'),shift('cara','extra')],duties,[{...sessions[0],endTime:'21:00'}],doctors,[...nurses,makeNurse('cara')]);
 assert.ok(report.findings.some(f=>f.id.startsWith('session-overlap-')&&f.severity==='ERROR'));
 assert.ok(!report.findings.some(f=>f.id.startsWith('session-handover-')));
});
