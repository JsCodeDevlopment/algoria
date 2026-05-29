'use client';

import { useEffect } from 'react';

export function DailyChallengeTabVisit({ tab }: { tab: string }) {
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('algoria-daily-tab-visit', { detail: tab }),
    );
  }, [tab]);

  return null;
}
