/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Bulk CSV Import for Nurses & Doctors (Phase 14.6)
 * Supports downloadable CSV templates, client-side parsing, validation preview, and bulk upsert.
 */

import React, { useEffect, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Nurse, Doctor, SeniorityLevel, Specialty, ClinicalRole } from '../../types';
import { getRepository } from '../../services/repository';
import { readDoctorRows, readNurseRows, type DoctorImportRow, type NurseImportRow } from '../../services/import/peopleImport';
import { localTodayIso } from '../../utils/dateUtils';
import { Badge, Button, DataTable, Dialog, Field, Notice, TabPanel, Tabs, Textarea, type Column } from '../ui';

interface BulkImportModalProps {
  seniorityLevels: SeniorityLevel[];
  specialties: Specialty[];
  roles: ClinicalRole[];
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
  /** Which import tab opens first (Doctors page opens the doctors tab). */
  initialTab?: 'NURSES' | 'DOCTORS';
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  seniorityLevels,
  specialties,
  roles,
  isOpen,
  onClose,
  onImportComplete,
  initialTab = 'NURSES',
}) => {
  const [activeTab, setActiveTab] = useState<'NURSES' | 'DOCTORS'>(initialTab);
  React.useEffect(() => {
    if (isOpen) setActiveTab(initialTab);
  }, [isOpen, initialTab]);
  const [csvText, setCsvText] = useState('');
  const [nurseRows, setNurseRows] = useState<NurseImportRow[]>([]);
  const [doctorRows, setDoctorRows] = useState<DoctorImportRow[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState('');
  // Who is already there, so an email or a code taken by someone else is named.
  const [existing, setExisting] = useState<{ nurses: Nurse[]; doctors: Doctor[] }>({ nurses: [], doctors: [] });
  useEffect(() => {
    if (!isOpen) return;
    const repo = getRepository();
    Promise.all([repo.list('nurses'), repo.list('doctors')])
      .then(([n, d]) => setExisting({ nurses: n, doctors: d }))
      .catch((err) => console.error('[BulkImportModal] load error:', err));
  }, [isOpen]);

  if (!isOpen) return null;

  const rows = activeTab === 'NURSES' ? nurseRows : doctorRows;
  const errorCount = rows.filter((r) => r.problems.length > 0).length;

  // --- SAMPLE CSV DOWNLOADERS ---
  const handleDownloadNurseTemplate = () => {
    const csvContent =
      'fullName,gmail,employeeCode,seniorityLevel,contractPercent,dateOfBirth,capabilities\n' +
      'Amina Mansoor,amina.mansoor@clinic.ae,N-109,Staff Nurse,100,14-05-1992,Clinic Nurse;Blood Collection & IV\n' +
      'Rashid Al Blooshi,rashid.blooshi@clinic.ae,N-110,Junior Nurse,100,22-08-1996,Clinic Nurse\n' +
      'Nour Al Huda,nour.alhuda@clinic.ae,N-111,Senior Nurse,50,03-11-1989,Clinic Nurse';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'nurses_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadDoctorTemplate = () => {
    const csvContent =
      'fullName,gmail,specialties,weeklyPattern\n' +
      'Dr Hamad Al Suwaidi,dr.hamad@clinic.ae,Cardiology,Sun 09:00-13:00 Room 1;Tue 09:00-13:00 Room 1\n' +
      'Dr Reem Al Kindi,dr.reem@clinic.ae,Pediatrics;Dermatology,Mon 09:00-14:00 Room 3;Wed 09:00-14:00 Room 3';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'doctors_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- READ THE CSV (services/import/peopleImport) ---
  const handleParseCsv = (text: string) => {
    setCsvText(text);
    setImportError('');
    if (activeTab === 'NURSES') setNurseRows(readNurseRows(text, { levels: seniorityLevels, roles, nurses: existing.nurses, today: localTodayIso() }));
    else setDoctorRows(readDoctorRows(text, { specialties, doctors: existing.doctors }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleParseCsv(content);
    };
    reader.readAsText(file);
  };

  // --- IMPORT EXECUTION ---
  const handleExecuteImport = async () => {
    if (rows.length === 0 || errorCount > 0) return;
    setIsImporting(true);

    try {
      const repo = getRepository();
      const nowIso = new Date().toISOString();

      if (activeTab === 'NURSES') {
        const nurseEntities: Nurse[] = nurseRows.map((r) => ({
          id: uuidv4(),
          ...r.nurse,
          isClinicNurse: true,
          preferences: [],
          active: true,
          createdAt: nowIso,
          updatedAt: nowIso,
        }));
        await repo.bulkUpsert('nurses', nurseEntities);
      } else {
        // The usual week comes from the file (it was always Sunday and Tuesday 09:00 to 13:00).
        const doctorEntities: Doctor[] = doctorRows.map((r) => ({ id: uuidv4(), ...r.doctor, active: true }));
        await repo.bulkUpsert('doctors', doctorEntities);
      }

      await repo.create('audit', {
        actor: 'Administrator',
        action: 'CREATE',
        entity: activeTab === 'NURSES' ? 'Nurse' : 'Doctor',
        entityId: 'bulk',
        note: `Imported ${rows.length} ${activeTab === 'NURSES' ? 'nurses' : 'doctors'} from a CSV file.`,
        timestamp: nowIso,
      });

      onImportComplete();
      onClose();
    } catch (err: any) {
      setImportError(`The import was not saved: ${err.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const switchTab = (id: string) => {
    setActiveTab(id as 'NURSES' | 'DOCTORS');
    setCsvText('');
    setNurseRows([]);
    setDoctorRows([]);
    setImportError('');
  };
  type Row = NurseImportRow | DoctorImportRow;
  const person = (r: Row) => ('nurse' in r ? r.nurse : r.doctor);
  const columns: Column<Row>[] = [
    { key: 'row', header: 'Row', cell: (r) => rows.indexOf(r as any) + 1, align: 'right' },
    { key: 'name', header: 'Name', cell: (r) => person(r).fullName || <span className="text-ink-muted">None</span>, phone: 'title' },
    { key: 'email', header: 'Email', cell: (r) => person(r).gmail || <span className="text-ink-muted">None</span> },
    {
      key: 'details',
      header: 'Details',
      cell: (r) =>
        'nurse' in r
          ? `${seniorityLevels.find((l) => l.id === r.nurse.seniorityLevelId)?.name || 'No level'}, ${r.nurse.contractPercent}%, code ${r.nurse.employeeCode}`
          : r.doctor.weeklyPattern.length
            ? `${r.doctor.weeklyPattern.length} ${r.doctor.weeklyPattern.length === 1 ? 'clinic' : 'clinics'} a week`
            : 'No usual week',
    },
    {
      key: 'status',
      header: 'Status',
      cell: (r) =>
        r.problems.length === 0 ? (
          <Badge tone="success">Ready</Badge>
        ) : (
          <span className="block">
            <Badge tone="danger">To fix</Badge>
            <span className="mt-0.5 block text-xs text-danger">{r.problems.map((m) => m.charAt(0).toUpperCase() + m.slice(1)).join('. ')}.</span>
          </span>
        ),
    },
  ];
  const sample = activeTab === 'NURSES' ? 'fullName,gmail,employeeCode,seniorityLevel,contractPercent,dateOfBirth,capabilities' : 'fullName,gmail,specialties,weeklyPattern';

  return (
    <Dialog
      open
      onClose={() => !isImporting && onClose()}
      size="xl"
      title="Import from a CSV file"
      description="Add many nurses or doctors at once. Every row is checked before anything is saved."
      footer={
        <>
          <Button disabled={isImporting} onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={Upload} busy={isImporting} disabled={rows.length === 0 || errorCount > 0} onClick={handleExecuteImport}>
            Import {rows.length} {activeTab === 'NURSES' ? (rows.length === 1 ? 'nurse' : 'nurses') : rows.length === 1 ? 'doctor' : 'doctors'}
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-sm">
        <Tabs
          label="What to import"
          idPrefix="bulk-import"
          value={activeTab}
          onChange={switchTab}
          tabs={[
            { id: 'NURSES', label: 'Nurses' },
            { id: 'DOCTORS', label: 'Doctors' },
          ]}
        />
        <TabPanel idPrefix="bulk-import" id={activeTab} value={activeTab}>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-ink-muted">
                The first line names the columns: <code className="font-mono text-ink">{sample}</code>
              </p>
              <Button size="sm" icon={Download} onClick={activeTab === 'NURSES' ? handleDownloadNurseTemplate : handleDownloadDoctorTemplate}>
                Download an example
              </Button>
            </div>
            <Field label="Choose a CSV file" optional>
              {(f) => (
                <input
                  {...f}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="block text-sm text-ink-muted file:mr-3 file:h-9 file:rounded-md file:border file:border-line-strong file:bg-surface file:px-3 file:text-sm file:font-semibold file:text-ink hover:file:bg-sunken"
                />
              )}
            </Field>
            <Field
              label="Or paste the rows"
              hint={activeTab === 'NURSES' ? 'Dates as DD-MM-YYYY. Several skills are separated by a semicolon.' : 'A usual week like Sun 09:00-13:00 Room 1;Tue 14:00-18:00. Several specialties are separated by a semicolon.'}
            >
              {(f) => <Textarea {...f} rows={4} value={csvText} onChange={(e) => handleParseCsv(e.target.value)} className="font-mono" />}
            </Field>
            {rows.length > 0 && (
              <>
                <Notice
                  live
                  tone={errorCount > 0 ? 'danger' : 'success'}
                  title={
                    errorCount > 0
                      ? `${errorCount} of ${rows.length} ${rows.length === 1 ? 'row needs' : 'rows need'} fixing. Nothing is imported until every row is ready.`
                      : `All ${rows.length} ${rows.length === 1 ? 'row is' : 'rows are'} ready.`
                  }
                />
                <div className="overflow-hidden rounded-lg border border-line">
                  <DataTable caption="Rows to import" rows={rows as Row[]} rowKey={(r) => String(rows.indexOf(r as any))} columns={columns} maxHeight="16rem" />
                </div>
              </>
            )}
            {importError && <Notice tone="danger" live title={importError} />}
          </div>
        </TabPanel>
      </div>
    </Dialog>
  );
};
