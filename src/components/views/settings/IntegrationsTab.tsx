/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Settings > Integrations tab.
 */

import React from 'react';
import { Database } from 'lucide-react';
import { defaultFirebaseConfig } from '../../../services/firebase/firebaseConfig';

export const IntegrationsTab: React.FC = () => {

  return (
    <div className="space-y-4 max-w-2xl text-xs">
      <div className="pb-3 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-900">Database Storage</h2>
        <p className="text-slate-500 text-[11px] mt-0.5">
          All clinic data is stored in Cloud Firestore and protected by the Firestore security rules.
        </p>
      </div>

      <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold text-slate-800">Storage Backend:</span>
          <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-100 text-blue-800">
            CLOUD FIRESTORE
          </span>
        </div>
        <p className="text-slate-600 text-[11px] leading-relaxed">
          Project <span className="font-mono">{defaultFirebaseConfig.projectId}</span>, database{' '}
          <span className="font-mono">{defaultFirebaseConfig.firestoreDatabaseId || '(default)'}</span>. The
          connection is provisioned by Google AI Studio (firebase-applet-config.json) and is not changed from
          inside the app.
        </p>
      </div>
    </div>
  );
};
