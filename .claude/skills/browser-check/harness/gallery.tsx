// Test page only (?view=gallery): every shared part in src/components/ui/ with the app's own
// styles, so they can be checked together in the browser and with axe. &open=dialog opens
// the dialog at once.
import React, { useState } from 'react';
import { Check, Download, Ellipsis, Plus, Send, Sparkles, Trash2, Users, X } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  DataTable,
  DateInput,
  Dialog,
  EmptyState,
  ErrorState,
  Field,
  IconButton,
  Input,
  LoadingState,
  Notice,
  PageHeader,
  ProblemBadge,
  Select,
  Switch,
  TabPanel,
  Tabs,
  Textarea,
  type Column,
} from '../src/components/ui';
import { formatDate, formatDateRange, formatDayDate } from '../src/utils/dateUtils';

interface Request {
  id: string;
  nurse: string;
  type: string;
  from: string;
  to?: string;
  status: 'Waiting' | 'Approved' | 'Declined';
  hours: number;
}

const REQUESTS: Request[] = [
  { id: 'r1', nurse: 'Mary', type: 'Annual leave', from: '2026-12-14', to: '2026-12-18', status: 'Waiting', hours: 40 },
  { id: 'r2', nurse: 'Amy', type: 'Day off', from: '2026-12-07', status: 'Waiting', hours: 0 },
  { id: 'r3', nurse: 'Sara', type: 'Day off', from: '2026-11-23', status: 'Approved', hours: 0 },
  { id: 'r4', nurse: 'Joy', type: 'Swap with Huda', from: '2026-11-26', status: 'Declined', hours: 8 },
];
const STATUS_TONE = { Waiting: 'warning', Approved: 'success', Declined: 'neutral' } as const;

export function Gallery() {
  const [tab, setTab] = useState('buttons');
  const [first, setFirst] = useState('2026-12-21');
  const [last, setLast] = useState('2026-12-18');
  const [copy, setCopy] = useState(true);
  const [emails, setEmails] = useState(false);
  const [open, setOpen] = useState(() => new URLSearchParams(location.search).get('open') === 'dialog');
  const columns: Column<Request>[] = [
    { key: 'nurse', header: 'Nurse', cell: (r) => r.nurse, sortValue: (r) => r.nurse },
    { key: 'type', header: 'Request', cell: (r) => r.type, sortValue: (r) => r.type },
    { key: 'dates', header: 'Dates', cell: (r) => <span className="whitespace-nowrap">{formatDateRange(r.from, r.to)}</span>, sortValue: (r) => r.from },
    { key: 'hours', header: 'Hours', cell: (r) => `${r.hours} h`, sortValue: (r) => r.hours, align: 'right' },
    { key: 'status', header: 'Status', cell: (r) => <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge> },
    {
      key: 'actions',
      header: 'Decision',
      hideHeader: true,
      phone: 'actions',
      cell: (r) =>
        r.status === 'Waiting' && (
          <span className="flex gap-2">
            <Button size="sm" icon={Check} aria-label={`Approve ${r.nurse}'s request`}>
              Approve
            </Button>
            <Button size="sm" icon={X} aria-label={`Decline ${r.nurse}'s request`}>
              Decline
            </Button>
          </span>
        ),
    },
  ];
  const lastError = first && last && last < first ? 'The last day is before the first day. Choose the first day or a later one.' : undefined;

  return (
    <main className="mx-auto max-w-6xl space-y-5 p-4 sm:p-6">
      <PageHeader
        breadcrumb={[{ label: 'Test page', onClick: () => {} }, { label: 'Gallery' }]}
        title="Shared parts"
        meta={
          <>
            <span>{formatDayDate('2026-11-16')}</span>
            <Badge icon={Sparkles}>Draft, version 1</Badge>
          </>
        }
        actions={
          <>
            <Button icon={Download}>Export</Button>
            <Button variant="primary" icon={Send} onClick={() => setOpen(true)}>
              Publish
            </Button>
            <IconButton label="More actions" icon={Ellipsis} variant="outline" />
          </>
        }
      />

      <section aria-label="Parts" className="rounded-lg border border-line bg-surface shadow-card">
        <Tabs
          label="Parts"
          idPrefix="g"
          value={tab}
          onChange={setTab}
          tabs={[
            { id: 'buttons', label: 'Buttons and badges' },
            { id: 'form', label: 'Form', count: lastError ? 1 : undefined, countTone: 'danger' },
            { id: 'states', label: 'States' },
          ]}
        />
        <TabPanel idPrefix="g" id="buttons" value={tab} className="space-y-4 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" icon={Send}>
              Primary
            </Button>
            <Button icon={Plus}>Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger" icon={Trash2}>
              Delete
            </Button>
            <Button busy>Saving</Button>
            <Button disabled>Not now</Button>
            <Button size="sm">Small</Button>
            <Button size="lg" variant="primary">
              Large
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Neutral</Badge>
            <Badge tone="brand">Brand</Badge>
            <Badge tone="success">Approved</Badge>
            <Badge tone="warning">Waiting</Badge>
            <Badge tone="danger">Declined</Badge>
            <Badge tone="info">Information</Badge>
            <ProblemBadge kind="must" />
            <ProblemBadge kind="check" />
            <ProblemBadge kind="note" />
          </div>
        </TabPanel>
        <TabPanel idPrefix="g" id="form" value={tab} className="p-4">
          <form noValidate onSubmit={(e) => e.preventDefault()} className="grid max-w-2xl gap-4 sm:grid-cols-2">
            <Field label="Name">{(p) => <Input {...p} defaultValue="Mary" />}</Field>
            <Field label="Kind of leave">
              {(p) => (
                <Select {...p} defaultValue="AL">
                  <option value="AL">Annual leave</option>
                  <option value="SL">Sick leave</option>
                </Select>
              )}
            </Field>
            <Field label="First day">{(p) => <DateInput {...p} value={first} onChange={setFirst} />}</Field>
            <Field label="Last day" error={lastError}>
              {(p) => <DateInput {...p} value={last} onChange={setLast} />}
            </Field>
            <Field label="Note" optional hint="The nurse sees this note in their email." className="sm:col-span-2">
              {(p) => <Textarea {...p} rows={2} />}
            </Field>
            <Checkbox label="Send me a copy" checked={copy} onChange={(e) => setCopy(e.target.checked)} />
            <Switch label="Email nurses when their request is decided" hint="Takes effect at once." checked={emails} onChange={setEmails} />
          </form>
        </TabPanel>
        <TabPanel idPrefix="g" id="states" value={tab} className="grid gap-4 p-4 md:grid-cols-3">
          <EmptyState icon={Users} title="No nurses yet" action={<Button icon={Plus}>Add a nurse</Button>}>
            Nurses you add appear here.
          </EmptyState>
          <LoadingState label="Loading the roster…" />
          <ErrorState onRetry={() => {}}>The database did not answer.</ErrorState>
        </TabPanel>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Notice tone="info" title="Sending stopped after 12 of 40 nurses" action={<Button size="sm">Resume</Button>}>
          Resume sends to the 28 nurses still waiting, from the same version.
        </Notice>
        <Notice tone="success" title="All changes saved" />
        <Notice tone="warning" title="2 things to check">
          Amy is 16 h short of the goal on {formatDate('2026-11-29')}.
        </Notice>
        <Notice tone="danger" title="2 problems must be fixed">
          No senior nurse on the evening shift on {formatDayDate('2026-11-18')}.
        </Notice>
      </div>

      <Card title="Requests" bodyClassName="" actions={<Button size="sm" variant="ghost">All requests</Button>}>
        <DataTable caption="Requests from nurses" columns={columns} rows={REQUESTS} rowKey={(r) => r.id} />
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Publish the November roster?"
        description="Each of the 6 nurses gets an email with their shifts."
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" icon={Send} onClick={() => setOpen(false)}>
              Publish and email nurses
            </Button>
          </>
        }
      >
        <Notice tone="danger" title="2 problems still need fixing">
          You can publish anyway, but the roster breaks the clinic's rules on {formatDayDate('2026-11-18')}.
        </Notice>
      </Dialog>
    </main>
  );
}
