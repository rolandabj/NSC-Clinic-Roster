/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Standalone acknowledgment page opened from the "Confirm Receipt" link in a
 * roster email. Works without signing in: the token in the link is the proof.
 */

import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { RosterPublishService } from '../../services/publish/rosterPublishService';

interface AcknowledgePageProps {
  token: string;
  clinicName: string;
}

export const AcknowledgePage: React.FC<AcknowledgePageProps> = ({ token, clinicName }) => {
  const [state, setState] = useState<'working' | 'done' | 'failed'>('working');

  useEffect(() => {
    let cancelled = false;
    RosterPublishService.acknowledgeByToken(token).then((ok) => {
      if (!cancelled) setState(ok ? 'done' : 'failed');
    });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-lg p-6 shadow-xl space-y-4 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{clinicName}</p>
        {state === 'working' && (
          <>
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
            <p className="text-sm text-slate-700">Confirming receipt of your roster...</p>
          </>
        )}
        {state === 'done' && (
          <>
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h1 className="text-base font-bold text-slate-900">Roster receipt confirmed</h1>
            <p className="text-xs text-slate-600">Thank you. The clinic can now see that you received your schedule.</p>
          </>
        )}
        {state === 'failed' && (
          <>
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
            <h1 className="text-base font-bold text-slate-900">This confirmation link is not valid</h1>
            <p className="text-xs text-slate-600">
              It may belong to an older version of the roster. Please use the link in your most recent roster email,
              or contact the clinic office.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
