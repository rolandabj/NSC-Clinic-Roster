/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Screens load on demand. If one can't be downloaded (most often because a
 * new version was published while the app was open, so the old file is
 * gone) or crashes while rendering, this shows a message with a Reload button
 * instead of a blank page.
 */

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  /** Changing this (e.g. the current route) clears the error. */
  resetKey?: string;
}

interface State {
  error: Error | null;
}

export class LoadErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('[ClinicRoster] Screen failed to load or render:', error);
  }

  componentDidUpdate(prev: Props) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" className="mx-auto my-16 max-w-md rounded-xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-900">
        <AlertTriangle className="mx-auto h-6 w-6 text-amber-600" aria-hidden="true" />
        <h2 className="mt-2 text-base font-semibold">This screen couldn't be opened</h2>
        <p className="mt-1 text-sm">
          A newer version of the app may have been published. Reload to get it; your saved data is not affected.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reload
        </button>
      </div>
    );
  }
}
