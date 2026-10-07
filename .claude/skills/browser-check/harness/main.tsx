// Test page only: shows one screen of the app, chosen with ?view= (schedules by default),
// with the dialogs host mounted (confirmations, notices). ?as= picks who is signed in
// (owner, planner, manager, nurse or none, see fakeAuth.ts).
//   Single screens: schedules, doctors, availability, history, nurses, reports, dashboard.
//   app: the whole app with its sidebar and top bar; the address after # picks the screen
//        (for example ?view=app&as=nurse#availability).
//   me, published, ack: the nurse's private page, the shared roster page and the receipt
//        page, made from the November roster published on the spot.
//   sample, sample-nurse: the proposed new look (Phase 2) with made up data, its own styles
//        and font; &open=publish opens its publish dialog (see sample/index.tsx).
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../src/App';
import { SchedulesView } from '../src/components/views/SchedulesView';
import { DoctorsView } from '../src/components/views/DoctorsView';
import { AvailabilityView } from '../src/components/views/AvailabilityView';
import { HistoryView } from '../src/components/views/HistoryView';
import { NursesView } from '../src/components/views/NursesView';
import { ReportsView } from '../src/components/views/ReportsView';
import { DashboardView } from '../src/components/views/DashboardView';
import { DialogHost } from '../src/components/common/dialogs';
import { authService } from '../src/services/auth/authService';
import { getRepository } from '../src/services/repository';
import { ensureNurseLink, syncNurseRosters } from '../src/services/publish/nurseRosterService';
import { syncPublicRoster } from '../src/services/publish/publicRosterService';

const user = authService.getCurrentUser();
const context: any = {
  clinicName: 'Test Clinic',
  timezone: 'Asia/Dubai',
  activeScheduleName: '',
  activeSchedulePeriod: '',
  activeScheduleId: 'nov',
  warningCount: 0,
  isLocalMode: false,
  currentUser: user,
};

/** Publishes the November roster in the in memory database and makes the nurse and shared pages. */
async function publishNovember(): Promise<{ meToken: string; shareToken: string }> {
  const repo = getRepository();
  const version = await repo.get('versions', 'v-nov-1');
  await repo.update('versions', 'v-nov-1', { isPublished: true, publishedAt: '2026-10-05T08:00:00Z' });
  await repo.update('schedules', 'nov', { status: 'PUBLISHED' });
  const mary = await ensureNurseLink(repo, 'mary');
  await syncNurseRosters(repo, ['mary'], [{ ...version, isPublished: true, publishedAt: '2026-10-05T08:00:00Z' }]);
  const link = {
    id: 'share-nov', scheduleId: 'nov', token: 'sh_test', role: 'VIEWER', public: true, allowedEmails: [],
    createdAt: '2026-10-05T08:00:00Z', revoked: false, pointsToVersionId: 'v-nov-1',
  };
  await repo.create('shareLinks', link);
  await syncPublicRoster(link as any);
  await repo.create('acknowledgments', { id: 'ack-test', token: 'ack-test', nurseId: 'mary', scheduleId: 'nov', ackAt: null });
  return { meToken: mary.token, shareToken: link.token };
}

function Single({ view }: { view: string }) {
  const screens: Record<string, React.ReactNode> = {
    schedules: <SchedulesView context={context} />,
    doctors: <DoctorsView context={context} />,
    availability: <AvailabilityView context={context} />,
    history: <HistoryView context={context} />,
    nurses: <NursesView context={context} />,
    reports: <ReportsView context={context} />,
    dashboard: <DashboardView context={context} onNavigate={(route) => console.log('navigate', route)} />,
  };
  return (
    <>
      {screens[view] || <p>Unknown view: {view}</p>}
      <DialogHost />
    </>
  );
}

async function start() {
  const view = new URLSearchParams(location.search).get('view') || 'schedules';
  const root = createRoot(document.getElementById('root')!);
  if (view === 'sample' || view === 'sample-nurse') {
    const { renderSample } = await import('./sample');
    renderSample(root, view);
    return;
  }
  // The app's styles, loaded here so the sample pages above do not get them.
  await import('./preview.css');
  if (view === 'me' || view === 'published' || view === 'ack') {
    const { meToken, shareToken } = await publishNovember();
    const hash = { me: `#me?t=${meToken}`, published: `#published?token=${shareToken}`, ack: '#ack?token=ack-test' }[view];
    history.replaceState(null, '', `${location.pathname}${location.search}${hash}`);
  }
  if (view === 'app' || view === 'me' || view === 'published' || view === 'ack') {
    root.render(<App />);
    return;
  }
  root.render(<Single view={view} />);
}

start();
