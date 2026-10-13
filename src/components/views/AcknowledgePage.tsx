/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Standalone acknowledgment page opened from the "I have my roster" link in a
 * roster email. Works without signing in: the token in the link is the proof.
 * Made for phones in UI overhaul Phase 5, slice 3.
 */

import React, { useState } from 'react';
import { CalendarCheck, CircleCheck, Loader2, TriangleAlert } from 'lucide-react';
import { RosterPublishService } from '../../services/publish/rosterPublishService';
import { Button } from '../ui';
import { PublicMessage, PublicPageFrame } from '../common/PublicPageFrame';

interface AcknowledgePageProps {
  token: string;
  clinicName: string;
}

export const AcknowledgePage: React.FC<AcknowledgePageProps> = ({ token, clinicName }) => {
  // Nothing is confirmed until the nurse presses the button: email apps that open links
  // to scan them must not confirm on their behalf.
  const [state, setState] = useState<'ask' | 'working' | 'done' | 'failed'>('ask');

  const confirm = async () => {
    setState('working');
    const ok = await RosterPublishService.acknowledgeByToken(token);
    setState(ok ? 'done' : 'failed');
  };

  return (
    <PublicPageFrame clinicName={clinicName}>
      <div className="pt-6">
        {(state === 'ask' || state === 'working') && (
          <PublicMessage
            icon={<CalendarCheck className="size-10 text-brand" aria-hidden="true" />}
            title="Please confirm you have your roster"
            action={
              <Button variant="primary" size="lg" busy={state === 'working'} onClick={confirm} className="w-full sm:w-auto">
                I have my roster
              </Button>
            }
          >
            The clinic then knows you have seen your shifts.
          </PublicMessage>
        )}
        {state === 'done' && (
          <PublicMessage live icon={<CircleCheck className="size-10 text-success" aria-hidden="true" />} title="Thank you">
            The clinic can now see that you have your roster.
          </PublicMessage>
        )}
        {state === 'failed' && (
          <PublicMessage live icon={<TriangleAlert className="size-10 text-warning" aria-hidden="true" />} title="This link no longer works">
            It may belong to an older roster. Use the link in your most recent roster email, or ask the clinic office.
          </PublicMessage>
        )}
        {state === 'working' && (
          <p className="sr-only" role="status">
            <Loader2 aria-hidden="true" />
            Sending your confirmation…
          </p>
        )}
      </div>
    </PublicPageFrame>
  );
};
