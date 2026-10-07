// Test page only: shows one screen of the app, chosen with ?view= (schedules by default),
// signed in as the owner, with the dialogs host mounted (confirmations, notices).
import React from 'react';
import { createRoot } from 'react-dom/client';
import './preview.css';
import { SchedulesView } from '../src/components/views/SchedulesView';
import { DoctorsView } from '../src/components/views/DoctorsView';
import { AvailabilityView } from '../src/components/views/AvailabilityView';
import { HistoryView } from '../src/components/views/HistoryView';
import { NursesView } from '../src/components/views/NursesView';
import { ReportsView } from '../src/components/views/ReportsView';
import { DashboardView } from '../src/components/views/DashboardView';
import { DialogHost } from '../src/components/common/dialogs';

const context: any = {
  clinicName: 'Test Clinic',
  timezone: 'Asia/Dubai',
  activeScheduleName: '',
  activeSchedulePeriod: '',
  activeScheduleId: 'nov',
  warningCount: 0,
  isLocalMode: false,
  currentUser: { uid: 'u1', name: 'Owner', email: 'rolandabj@gmail.com', role: 'OWNER', isLocal: false },
};

function App() {
  const view = new URLSearchParams(location.search).get('view') || 'schedules';
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

createRoot(document.getElementById('root')!).render(<App />);
