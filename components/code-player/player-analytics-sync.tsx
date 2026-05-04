'use client';

import { useEffect, useRef } from 'react';

import { analyticsCapture } from '@/components/analytics/posthog-provider';

import { usePlayerStore } from './use-player-store';

/** Eventos opcionais Fase 1 (PostHog): linha vista e nível de explicação. */
export function PlayerAnalyticsSync({ enabled }: { enabled: boolean }) {
  const line = usePlayerStore((s) => s.currentLine);
  const level = usePlayerStore((s) => s.level);
  const prevLine = useRef<number | null>(null);
  const prevLevel = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (prevLine.current !== line) {
      analyticsCapture('line_view', { line, level });
      prevLine.current = line;
    }
  }, [enabled, line, level]);

  useEffect(() => {
    if (!enabled) return;
    if (prevLevel.current !== level) {
      if (prevLevel.current !== null) {
        analyticsCapture('level_change', { level });
      }
      prevLevel.current = level;
    }
  }, [enabled, level]);

  return null;
}
