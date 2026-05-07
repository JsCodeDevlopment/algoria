"use client";

import { useEffect } from "react";

import { analyticsCapture } from "@/components/analytics/posthog-provider";

export function PaywallAnalytics({
  problemSlug,
  conceptSlug,
}: {
  problemSlug?: string;
  conceptSlug?: string;
}) {
  useEffect(() => {
    analyticsCapture("paywall_hit", {
      problem_slug: problemSlug,
      concept_slug: conceptSlug,
    });
  }, [problemSlug, conceptSlug]);
  return null;
}
