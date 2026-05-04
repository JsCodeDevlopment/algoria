'use client';

import { useEffect } from 'react';

import { analyticsCapture } from '@/components/analytics/posthog-provider';
import { touchSolutionVisited } from '@/lib/progress/local-progress';

export function SolutionVisitTracker({
  problemSlug,
  solutionSlug,
}: {
  problemSlug: string;
  solutionSlug: string;
}) {
  useEffect(() => {
    touchSolutionVisited(problemSlug, solutionSlug);
    analyticsCapture('solution_open', { problem_slug: problemSlug, solution_slug: solutionSlug });
  }, [problemSlug, solutionSlug]);

  return null;
}
