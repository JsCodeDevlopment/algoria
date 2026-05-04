'use client';

import { useEffect, useMemo } from 'react';

import type { ExecutionTraceStep, LineAnnotation } from '@/lib/content/schemas';
import type { HighlightedLine } from '@/lib/content/shiki';

import { renderMarkdown } from '@/lib/content/markdown';
import { getSolutionResumeLine, touchSolutionLastLine } from '@/lib/progress/local-progress';

import { CodeView } from './code-view';
import { ExecutionTracePanel } from './execution-trace-panel';
import { ExplanationPanel } from './explanation-panel';
import { KeyboardShortcuts } from './keyboard-shortcuts';
import { PlayerAnalyticsSync } from './player-analytics-sync';
import { PlayerControls } from './player-controls';
import { usePlayerStore } from './use-player-store';

interface Props {
  lines: HighlightedLine[];
  annotations: LineAnnotation[];
  conceptTitles: Record<string, string>;
  /** Quando definido, painel mostra aviso de modo leitura em vez do player. */
  readOnlyExplanationMd?: string;
  executionTrace?: ExecutionTraceStep[];
  problemSlug?: string;
  solutionSlug?: string;
}

/**
 * Top-level orchestrator: hydrates the Zustand store with this
 * solution's annotated lines, then lays out the code view, the
 * explanation panel and the controls.
 *
 * The 3 children read state from the store directly — we don't pass
 * props down. This keeps re-renders surgical (only the panel
 * re-renders when the line changes; the code view re-renders only
 * its highlight; the controls re-render their progress bar).
 */
export function CodePlayer({
  lines,
  annotations,
  conceptTitles,
  readOnlyExplanationMd,
  executionTrace,
  problemSlug,
  solutionSlug,
}: Props) {
  const initialize = usePlayerStore((s) => s.initialize);

  const tutorialMode = annotations.length > 0 && !readOnlyExplanationMd;
  const annotatedLineSet = useMemo(() => new Set(annotations.map((a) => a.line)), [annotations]);
  const annotatedLines = useMemo(
    () => annotations.map((a) => a.line).sort((a, b) => a - b),
    [annotations],
  );

  useEffect(() => {
    if (tutorialMode) {
      const resume =
        problemSlug && solutionSlug ? getSolutionResumeLine(problemSlug, solutionSlug, annotatedLines) : undefined;
      initialize(annotatedLines, resume);
    } else {
      initialize([], 1);
    }
  }, [annotatedLines, initialize, tutorialMode, problemSlug, solutionSlug]);

  useEffect(() => {
    if (!tutorialMode || !problemSlug || !solutionSlug) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let lastLine = usePlayerStore.getState().currentLine;
    const unsub = usePlayerStore.subscribe((state) => {
      const line = state.currentLine;
      if (line === lastLine) return;
      lastLine = line;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => touchSolutionLastLine(problemSlug, solutionSlug, line), 400);
    });
    return () => {
      if (timer) clearTimeout(timer);
      unsub();
    };
  }, [tutorialMode, problemSlug, solutionSlug]);

  const showTrace = tutorialMode && executionTrace && executionTrace.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        {tutorialMode ? <KeyboardShortcuts /> : null}
        {tutorialMode ? <PlayerAnalyticsSync enabled /> : null}
        <div className="flex flex-col gap-3 min-w-0">
          <CodeView
            lines={lines}
            annotatedLineSet={annotatedLineSet}
            interactiveSteps={tutorialMode}
          />
          {tutorialMode ? <PlayerControls /> : null}
          {tutorialMode ? (
            <p className="text-[11px] text-zinc-500 px-1">
              Atalhos: <kbd className="kbd">←</kbd>/<kbd className="kbd">→</kbd> mudar de linha,{' '}
              <kbd className="kbd">espaço</kbd> play/pause, <kbd className="kbd">1</kbd>/<kbd className="kbd">2</kbd>/
              <kbd className="kbd">3</kbd> mudar nível.
            </p>
          ) : null}
        </div>
        {readOnlyExplanationMd ? (
          <aside
            className="rounded-xl border border-amber-200/80 dark:border-amber-500/30 bg-amber-50/80 dark:bg-amber-500/5 p-5 text-sm shadow-sm"
            aria-live="polite"
          >
            <div
              className="prose prose-zinc dark:prose-invert prose-sm max-w-none
                         prose-code:text-blue-600 dark:prose-code:text-blue-400
                         prose-code:before:content-none prose-code:after:content-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(readOnlyExplanationMd) }}
            />
          </aside>
        ) : (
          <ExplanationPanel annotations={annotations} conceptTitles={conceptTitles} />
        )}
      </div>
      {showTrace ? <ExecutionTracePanel steps={executionTrace} /> : null}
    </div>
  );
}
