'use client';

import { useEffect } from 'react';

import { analyticsCapture } from '@/components/analytics/posthog-provider';

export function PricingPageAnalytics() {
  useEffect(() => {
    analyticsCapture('pricing_view');
  }, []);
  return null;
}
