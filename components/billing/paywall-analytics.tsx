'use client';

import { useEffect } from 'react';

import { analyticsCapture } from '@/components/analytics/posthog-provider';

export function PaywallAnalytics({ problemSlug }: { problemSlug: string }) {
  useEffect(() => {
    analyticsCapture('paywall_hit', { problem_slug: problemSlug });
  }, [problemSlug]);
  return null;
}
