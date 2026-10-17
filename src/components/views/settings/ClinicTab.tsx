/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Settings, Clinic and opening hours: the clinic's name, time zone, opening hours, weekend days,
 * address and phone. A draft saved only by Save, with Cancel (Phase 8, slice 1b).
 */

import React from 'react';
import { ClinicProfile } from '../../../types';
import { getWeekendDays } from '../../../utils/weekend';
import { Field, Input, cx } from '../../ui';
import { SaveBar, WEEKDAY_NAMES } from './shared';

interface ClinicTabProps {
  draft: ClinicProfile;
  onChange: (updates: Partial<ClinicProfile>) => void;
  changed: boolean;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export const ClinicTab: React.FC<ClinicTabProps> = ({ draft, onChange, changed, saving, onSave, onCancel }) => {
  const weekend = draft.weekendDays || getWeekendDays();
  const hoursError = draft.openTime && draft.closeTime && draft.closeTime <= draft.openTime ? 'The clinic must close after it opens.' : undefined;
  return (
    <form
      className="space-y-5 text-sm"
      onSubmit={(e) => {
        e.preventDefault();
        if (!hoursError) onSave();
      }}
    >
      <div>
        <h2 className="text-lg font-semibold text-ink">Clinic and opening hours</h2>
        <p className="mt-1 text-ink-muted">The clinic's details and the hours the roster covers every day.</p>
      </div>

      <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Clinic name" className="sm:col-span-2">
          {(f) => <Input {...f} required value={draft.name} onChange={(e) => onChange({ name: e.target.value })} />}
        </Field>
        <Field label="Time zone" hint="Used for calendar downloads and the shared roster page, for example Asia/Dubai.">
          {(f) => <Input {...f} value={draft.timezone} onChange={(e) => onChange({ timezone: e.target.value })} />}
        </Field>
        <div className="hidden sm:block" />
        <Field label="Opens at">
          {(f) => <Input {...f} type="time" required value={draft.openTime} onChange={(e) => onChange({ openTime: e.target.value })} />}
        </Field>
        <Field label="Closes at" error={hoursError}>
          {(f) => <Input {...f} type="time" required value={draft.closeTime} onChange={(e) => onChange({ closeTime: e.target.value })} />}
        </Field>
        <fieldset className="sm:col-span-2">
          <legend className="text-sm font-semibold text-ink">Weekend days</legend>
          <p className="mb-2 text-xs text-ink-muted">Used for weekend shading, weekend fairness and the roster generator's weekend balance.</p>
          <div className="flex flex-wrap gap-2">
            {WEEKDAY_NAMES.map((name, idx) => {
              const isWeekend = weekend.includes(idx);
              return (
                <button
                  type="button"
                  key={name}
                  aria-pressed={isWeekend}
                  onClick={() => onChange({ weekendDays: isWeekend ? weekend.filter((d) => d !== idx) : [...weekend, idx] })}
                  className={cx(
                    'min-h-9 min-w-14 rounded-md border px-3 text-sm font-medium transition-colors pointer-coarse:min-h-11',
                    isWeekend ? 'border-brand bg-brand-soft text-brand-strong' : 'border-line-strong bg-surface text-ink hover:bg-sunken'
                  )}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </fieldset>
        <Field label="Address" optional>
          {(f) => <Input {...f} value={draft.address || ''} onChange={(e) => onChange({ address: e.target.value })} />}
        </Field>
        <Field label="Phone number" optional>
          {(f) => <Input {...f} type="tel" value={draft.phone || ''} onChange={(e) => onChange({ phone: e.target.value })} />}
        </Field>
      </div>

      <SaveBar changed={changed} saving={saving} onSave={() => !hoursError && onSave()} onCancel={onCancel} />
    </form>
  );
};
