/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Shows email HTML inside a sandboxed frame. The frame has no script, form or
 * navigation rights and no access to the app, so HTML stored in the email
 * log can never run code in the signed in app, whatever it contains.
 */

import React from 'react';

export const EmailHtmlPreview: React.FC<{ html: string; title?: string; className?: string }> = ({
  html,
  title = 'Email preview',
  className = 'h-[480px]',
}) => (
  <iframe
    title={title}
    sandbox=""
    srcDoc={html}
    referrerPolicy="no-referrer"
    className={`block w-full max-w-xl mx-auto bg-white border border-slate-200 rounded shadow-xs ${className}`}
  />
);
