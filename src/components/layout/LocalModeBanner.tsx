import React, { useState } from 'react';
import { Database, ArrowRight, X } from 'lucide-react';
import { Button, IconButton } from '../ui';

interface LocalModeBannerProps {
  onNavigateToSettings: () => void;
}

export const LocalModeBanner: React.FC<LocalModeBannerProps> = ({ onNavigateToSettings }) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    return localStorage.getItem('clinic_roster_dismiss_local_banner') === 'true';
  });

  if (isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('clinic_roster_dismiss_local_banner', 'true');
  };

  return (
    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line bg-sunken px-4 py-2 text-sm">
      <p className="flex min-w-0 items-center gap-2.5 text-ink-muted">
        <Database className="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
        <span>
          <strong className="font-semibold text-ink">Saved in this browser only.</strong> Add the Firebase details in Settings to sign in with
          Google, share rosters and send email. Building rosters works without them.
        </span>
      </p>
      <div className="flex shrink-0 items-center gap-1">
        <Button size="sm" variant="ghost" icon={ArrowRight} onClick={onNavigateToSettings}>
          Open Settings
        </Button>
        <IconButton label="Close this notice" icon={X} onClick={handleDismiss} />
      </div>
    </div>
  );
};
