/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Shown while a screen's code is being downloaded (screens load on demand).
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export const PageLoading: React.FC<{ label?: string }> = ({ label = 'Loading…' }) => (
  <div role="status" aria-live="polite" className="flex flex-1 items-center justify-center gap-2 py-16 text-sm text-slate-500">
    <Loader2 className="h-5 w-5 animate-spin text-indigo-500" aria-hidden="true" />
    <span>{label}</span>
  </div>
);
