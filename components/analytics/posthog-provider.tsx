'use client';

import { useEffect, useRef } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host =
  process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() ||
  process.env.POSTHOG_HOST?.trim() ||
  'https://eu.i.posthog.com';

/** Fase 1: eventos declarativos; sem `NEXT_PUBLIC_POSTHOG_KEY` não faz nada. */
export function AlgoriaPostHogProvider({ children }: { children: React.ReactNode }) {
  const didInit = useRef(false);

  useEffect(() => {
    if (!key || typeof window === 'undefined' || didInit.current) return;
    didInit.current = true;
    posthog.init(key, {
      api_host: host,
      persistence: 'localStorage',
      autocapture: false,
      capture_pageview: false,
    });
  }, []);

  if (!key) {
    return <>{children}</>;
  }
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

export function analyticsCapture(event: string, props?: Record<string, unknown>): void {
  if (!key || typeof window === 'undefined') return;
  try {
    posthog.capture(event, props);
  } catch {
    /* ignorar */
  }
}
