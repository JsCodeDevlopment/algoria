'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

import { analyticsCapture } from '@/components/analytics/posthog-provider';

function Inner() {
  const sp = useSearchParams();
  useEffect(() => {
    if (sp.get('checkout') === 'success') {
      analyticsCapture('subscription_active');
    }
  }, [sp]);
  return null;
}

export function CheckoutSuccessAnalytics() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
