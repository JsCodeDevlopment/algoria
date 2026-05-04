'use client';

import { useEffect } from 'react';

import { analyticsCapture } from '@/components/analytics/posthog-provider';

export function ConceptVisitTracker({ slug }: { slug: string }) {
  useEffect(() => {
    analyticsCapture('concept_open', { concept_slug: slug });
  }, [slug]);

  return null;
}
