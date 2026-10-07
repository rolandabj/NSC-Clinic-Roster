import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, query, where } from 'firebase/firestore';
import fs from 'fs';

const env = await initializeTestEnvironment({
  projectId: 'demo-roster',
  firestore: { rules: fs.readFileSync(new URL('../../firestore.rules', import.meta.url), 'utf8'), host: '127.0.0.1', port: 8080 },
});
const tok = (email) => ({ email, email_verified: true });
const anon = env.unauthenticatedContext().firestore();
const owner = env.authenticatedContext('o', tok('rolandabj@gmail.com')).firestore();
const viewer = env.authenticatedContext('v', tok('viewer@x.com')).firestore();
const editor = env.authenticatedContext('e', tok('editor@x.com')).firestore();
const manager = env.authenticatedContext('m', tok('mgr@x.com')).firestore();
const stranger = env.authenticatedContext('s', tok('new@x.com')).firestore();
const unverified = env.authenticatedContext('u', { email: 'viewer@x.com', email_verified: false }).firestore();

await env.withSecurityRulesDisabled(async (ctx) => {
  const db = ctx.firestore();
  await setDoc(doc(db, 'userAccess/viewer@x.com'), { email: 'viewer@x.com', status: 'APPROVED', appRole: 'VIEWER', isManager: false, linkedNurseId: 'n1' });
  await setDoc(doc(db, 'userAccess/editor@x.com'), { email: 'editor@x.com', status: 'APPROVED', appRole: 'EDITOR', isManager: false });
  await setDoc(doc(db, 'userAccess/mgr@x.com'), { email: 'mgr@x.com', status: 'APPROVED', appRole: 'VIEWER', isManager: true });
  await setDoc(doc(db, 'nurses/n1'), { fullName: 'A' });
  await setDoc(doc(db, 'emailLog/e1'), { x: 1 });
  await setDoc(doc(db, 'acknowledgments/ack-t1'), { token: 'ack-t1', nurseId: 'n1' });
  await setDoc(doc(db, 'acknowledgments/legacy'), { token: 'other', nurseId: 'n1' });
  await setDoc(doc(db, 'publicRosters/sh_pub'), { isPublic: true, allowedEmails: [], revoked: false });
  await setDoc(doc(db, 'publicRosters/sh_priv'), { isPublic: false, allowedEmails: ['friend@x.com'], revoked: false });
  await setDoc(doc(db, 'publicRosters/sh_rev'), { isPublic: true, allowedEmails: [], revoked: true });
  await setDoc(doc(db, 'leaveEntries/l2'), { nurseId: 'n1', status: 'APPROVED', approved: true });
  await setDoc(doc(db, 'nurseRosters/nr_ok'), { token: 'nr_ok', nurseId: 'n1', revoked: false, shifts: [], leaveDays: [] });
  await setDoc(doc(db, 'nurseRosters/nr_rev'), { token: 'nr_rev', nurseId: 'n1', revoked: true, shifts: [], leaveDays: [] });
  await setDoc(doc(db, 'nurseLinks/n1'), { id: 'n1', nurseId: 'n1', token: 'nr_ok', revoked: false });
});

const results = [];
async function t(name, expectOk, p) {
  try { expectOk ? await assertSucceeds(p) : await assertFails(p); results.push(['PASS', name]); }
  catch (e) { results.push(['FAIL', name, e.message?.slice(0, 120)]); }
}

await t('anon cannot read nurses', false, getDoc(doc(anon, 'nurses/n1')));
await t('unverified email cannot read', false, getDoc(doc(unverified, 'nurses/n1')));
await t('stranger cannot read nurses', false, getDoc(doc(stranger, 'nurses/n1')));
await t('stranger files own pending request', true, setDoc(doc(stranger, 'userAccess/new@x.com'), { id: 'new@x.com', email: 'new@x.com', name: 'N', status: 'PENDING', appRole: 'VIEWER', isManager: false, approvedBy: '', createdAt: 'x' }));
await t('stranger cannot self approve on create', false, setDoc(doc(stranger, 'userAccess/new2@x.com'), { email: 'new@x.com', status: 'APPROVED', appRole: 'EDITOR', isManager: true }));
await t('stranger cannot update own request to approved', false, updateDoc(doc(stranger, 'userAccess/new@x.com'), { status: 'APPROVED' }));
await t('viewer reads nurses', true, getDoc(doc(viewer, 'nurses/n1')));
await t('viewer cannot write nurses', false, setDoc(doc(viewer, 'nurses/n2'), { fullName: 'B' }));
await t('viewer reads own access record', true, getDoc(doc(viewer, 'userAccess/viewer@x.com')));
await t('viewer cannot read others access', false, getDoc(doc(viewer, 'userAccess/editor@x.com')));
await t('viewer cannot list access', false, getDocs(collection(viewer, 'userAccess')));
await t('viewer cannot promote self', false, updateDoc(doc(viewer, 'userAccess/viewer@x.com'), { appRole: 'EDITOR' }));
await t('viewer cannot read emailLog', false, getDoc(doc(viewer, 'emailLog/e1')));
await t('editor reads emailLog', true, getDoc(doc(editor, 'emailLog/e1')));
await t('editor writes nurses', true, setDoc(doc(editor, 'nurses/n3'), { fullName: 'C' }));
await t('editor cannot write userAccess', false, setDoc(doc(editor, 'userAccess/z@x.com'), { status: 'APPROVED' }));
await t('manager cannot write schedules', false, setDoc(doc(manager, 'schedules/s1'), { name: 'S' }));
await t('manager cannot write nurses', false, setDoc(doc(manager, 'nurses/nx'), { fullName: 'X' }));
await t('manager writes day off locks', true, setDoc(doc(manager, 'locks/lk1'), { nurseId: 'n1', date: '2026-11-02', mode: 'OFF' }));
await t('manager writes audit entries', true, setDoc(doc(manager, 'audit/a1'), { action: 'APPROVE' }));
await t('manager cannot read audit', false, getDoc(doc(manager, 'audit/a1')));
await t('viewer cannot write locks', false, setDoc(doc(viewer, 'locks/lk2'), { nurseId: 'n1' }));
await t('editor writes locks', true, setDoc(doc(editor, 'locks/lk3'), { nurseId: 'n1' }));
await t('viewer reads locks', true, getDoc(doc(viewer, 'locks/lk3')));
await t('owner writes userAccess', true, setDoc(doc(owner, 'userAccess/z@x.com'), { status: 'APPROVED', appRole: 'EDITOR' }));
await t('owner lists userAccess', true, getDocs(collection(owner, 'userAccess')));
// self service
await t('viewer files own pending leave', true, setDoc(doc(viewer, 'leaveEntries/l1'), { nurseId: 'n1', status: 'PENDING', approved: false }));
await t('viewer cannot file leave for other nurse', false, setDoc(doc(viewer, 'leaveEntries/lx'), { nurseId: 'n2', status: 'PENDING', approved: false }));
await t('viewer cannot file approved leave', false, setDoc(doc(viewer, 'leaveEntries/ly'), { nurseId: 'n1', status: 'APPROVED', approved: true }));
await t('viewer cannot approve own leave', false, updateDoc(doc(viewer, 'leaveEntries/l1'), { status: 'APPROVED', approved: true }));
await t('viewer cancels own pending leave', true, deleteDoc(doc(viewer, 'leaveEntries/l1')));
await t('viewer cannot delete approved leave', false, deleteDoc(doc(viewer, 'leaveEntries/l2')));
await t('viewer files own availability', true, setDoc(doc(viewer, 'availabilityRequests/a1'), { nurseId: 'n1', status: 'PENDING' }));
// Deciding requests (the screens show Pending Approvals to planners and managers, 07-10-2026)
await t('viewer cannot decide own availability request', false, updateDoc(doc(viewer, 'availabilityRequests/a1'), { status: 'APPROVED' }));
await t('editor decides an availability request', true, updateDoc(doc(editor, 'availabilityRequests/a1'), { status: 'APPROVED', reviewedBy: 'editor@x.com' }));
await t('manager decides an availability request', true, updateDoc(doc(manager, 'availabilityRequests/a1'), { status: 'REJECTED', reviewedBy: 'mgr@x.com' }));
await t('editor writes audit entries', true, setDoc(doc(editor, 'audit/a2'), { action: 'APPROVE' }));
await t('editor cannot change an audit entry', false, updateDoc(doc(editor, 'audit/a2'), { action: 'CHANGED' }));
await t('editor without nurse link cannot be blocked: editor files any leave', true, setDoc(doc(editor, 'leaveEntries/l3'), { nurseId: 'n2', status: 'APPROVED', approved: true }));
await t('manager approves leave', true, updateDoc(doc(manager, 'leaveEntries/l2'), { reviewNotes: 'ok' }));
// acknowledgments
await t('anon gets ack by token id', true, getDoc(doc(anon, 'acknowledgments/ack-t1')));
await t('anon cannot get legacy ack', false, getDoc(doc(anon, 'acknowledgments/legacy')));
await t('anon cannot list acks', false, getDocs(collection(anon, 'acknowledgments')));
await t('anon cannot change other ack fields', false, updateDoc(doc(anon, 'acknowledgments/ack-t1'), { nurseId: 'n9' }));
await t('anon acknowledges once', true, updateDoc(doc(anon, 'acknowledgments/ack-t1'), { ackAt: '2026-10-01T00:00:00Z' }));
await t('anon cannot acknowledge twice', false, updateDoc(doc(anon, 'acknowledgments/ack-t1'), { ackAt: '2026-10-02T00:00:00Z' }));
await t('anon cannot acknowledge legacy ack', false, updateDoc(doc(anon, 'acknowledgments/legacy'), { ackAt: '2026-10-01T00:00:00Z' }));
await t('viewer acknowledges legacy ack once', true, updateDoc(doc(viewer, 'acknowledgments/legacy'), { ackAt: '2026-10-01T00:00:00Z' }));
await t('viewer cannot re-acknowledge legacy ack', false, updateDoc(doc(viewer, 'acknowledgments/legacy'), { ackAt: '2026-10-03T00:00:00Z' }));
await t('viewer cannot create ack', false, setDoc(doc(viewer, 'acknowledgments/ack-z'), { token: 'ack-z' }));
await t('viewer cannot list acks', false, getDocs(collection(viewer, 'acknowledgments')));
await t('viewer lists own acks', true, getDocs(query(collection(viewer, 'acknowledgments'), where('nurseId', '==', 'n1'))));
await t("viewer cannot list another nurse's acks", false, getDocs(query(collection(viewer, 'acknowledgments'), where('nurseId', '==', 'n2'))));
await t("manager cannot list another nurse's acks", false, getDocs(query(collection(manager, 'acknowledgments'), where('nurseId', '==', 'n1'))));
await t('editor lists acks', true, getDocs(collection(editor, 'acknowledgments')));
await t("manager cannot acknowledge another nurse's ack", false, updateDoc(doc(manager, 'acknowledgments/legacy'), { ackAt: '2026-10-05T00:00:00Z' }));
await t("manager cannot read another nurse's legacy ack", false, getDoc(doc(manager, 'acknowledgments/legacy')));
// public rosters
await t('anon reads public roster', true, getDoc(doc(anon, 'publicRosters/sh_pub')));
await t('anon cannot list public rosters', false, getDocs(collection(anon, 'publicRosters')));
await t('anon cannot read restricted roster', false, getDoc(doc(anon, 'publicRosters/sh_priv')));
await t('allowed email reads restricted roster', true, getDoc(doc(env.authenticatedContext('f', tok('friend@x.com')).firestore(), 'publicRosters/sh_priv')));
await t('other email cannot read restricted roster', false, getDoc(doc(stranger, 'publicRosters/sh_priv')));
await t('approved viewer not on list cannot read restricted roster', false, getDoc(doc(viewer, 'publicRosters/sh_priv')));
await t('editor reads restricted roster', true, getDoc(doc(editor, 'publicRosters/sh_priv')));
await t('editor reads revoked public roster', true, getDoc(doc(editor, 'publicRosters/sh_rev')));
await t('revoked roster unreadable', false, getDoc(doc(anon, 'publicRosters/sh_rev')));
await t('viewer cannot write public roster', false, setDoc(doc(viewer, 'publicRosters/sh_new'), { isPublic: true }));
await t('editor writes public roster', true, setDoc(doc(editor, 'publicRosters/sh_new'), { isPublic: true, allowedEmails: [], revoked: false }));
await t('anon cannot write public roster', false, setDoc(doc(anon, 'publicRosters/sh_x'), { isPublic: true }));
// private nurse pages
await t('anon gets nurse roster by token', true, getDoc(doc(anon, 'nurseRosters/nr_ok')));
await t('anon cannot list nurse rosters', false, getDocs(collection(anon, 'nurseRosters')));
await t('viewer cannot list nurse rosters', false, getDocs(collection(viewer, 'nurseRosters')));
await t('revoked nurse roster unreadable', false, getDoc(doc(anon, 'nurseRosters/nr_rev')));
await t('unknown nurse roster unreadable', false, getDoc(doc(anon, 'nurseRosters/nr_missing')));
await t('editor reads revoked nurse roster', true, getDoc(doc(editor, 'nurseRosters/nr_rev')));
await t('anon cannot write nurse roster', false, setDoc(doc(anon, 'nurseRosters/nr_x'), { revoked: false }));
await t('viewer cannot write nurse roster', false, setDoc(doc(viewer, 'nurseRosters/nr_ok'), { token: 'nr_ok', nurseId: 'n1', revoked: false, shifts: [{ date: '2026-12-01' }] }));
await t('editor writes nurse roster', true, setDoc(doc(editor, 'nurseRosters/nr_new'), { token: 'nr_new', nurseId: 'n1', revoked: false, shifts: [], leaveDays: [] }));
await t('editor deletes nurse roster', true, deleteDoc(doc(editor, 'nurseRosters/nr_new')));
await t('anon cannot read nurse links', false, getDoc(doc(anon, 'nurseLinks/n1')));
await t('viewer cannot read nurse links', false, getDoc(doc(viewer, 'nurseLinks/n1')));
await t('viewer cannot list nurse links', false, getDocs(collection(viewer, 'nurseLinks')));
await t('viewer cannot write nurse links', false, setDoc(doc(viewer, 'nurseLinks/n1'), { token: 'nr_mine' }));
await t('editor reads nurse links', true, getDoc(doc(editor, 'nurseLinks/n1')));
await t('editor lists nurse links', true, getDocs(collection(editor, 'nurseLinks')));
await t('editor writes nurse links', true, setDoc(doc(editor, 'nurseLinks/n2'), { id: 'n2', nurseId: 'n2', token: 'nr_new2', revoked: false }));

// presence: everyone approved reads, each user writes only their own records
const pres = (id, extra = {}) => ({ id, uid: 'v', name: 'V', email: 'viewer@x.com', scheduleId: 'sch1', at: Date.now(), ...extra });
await t('viewer writes own presence', true, setDoc(doc(viewer, 'presence/v_tab1'), pres('v_tab1')));
await t("viewer cannot write another user's presence", false, setDoc(doc(viewer, 'presence/e_tab1'), pres('e_tab1', { uid: 'e' })));
await t('viewer cannot claim another email', false, setDoc(doc(viewer, 'presence/v_tab2'), pres('v_tab2', { email: 'editor@x.com' })));
await t('viewer cannot set a time far from now', false, setDoc(doc(viewer, 'presence/v_tab3'), pres('v_tab3', { at: Date.now() + 3600000 })));
await t('viewer cannot add other fields to presence', false, setDoc(doc(viewer, 'presence/v_tab4'), pres('v_tab4', { role: 'OWNER' })));
await t('editor reads presence', true, getDocs(collection(editor, 'presence')));
await t('anon cannot read presence', false, getDocs(collection(anon, 'presence')));
await t('stranger cannot write presence', false, setDoc(doc(stranger, 'presence/s_tab1'), pres('s_tab1', { uid: 's', email: 'new@x.com' })));
await t("editor cannot delete another user's presence", false, deleteDoc(doc(editor, 'presence/v_tab1')));
await t('viewer deletes own presence', true, deleteDoc(doc(viewer, 'presence/v_tab1')));

for (const r of results) console.log(r.join('  '));
console.log(results.filter(r => r[0] === 'FAIL').length + ' failed of ' + results.length);
const failed = results.filter((r) => r[0] === 'FAIL').length;
await env.cleanup();
process.exit(failed > 0 ? 1 : 0);
