'use client';

import { useEffect } from 'react';

import { analyticsCapture } from '@/components/analytics/posthog-provider';
import { touchProblemVisited } from '@/lib/progress/local-progress';

export function ProblemVisitTracker({ slug }: { slug: string }) {
  useEffect(() => {
    touchProblemVisited(slug);
    analyticsCapture('problem_open', { problem_slug: slug });
  }, [slug]);

  return null;
}
