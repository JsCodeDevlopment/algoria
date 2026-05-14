'use client';

import { Fragment, useMemo } from 'react';

import type { ExecutionTraceStep } from '@/lib/content/schemas';
import { resolveExecutionSnapshot } from '@/lib/content/resolve-execution-snapshot';

import { usePlayerStore } from './use-player-store';

interface Props {
  steps: ExecutionTraceStep[];
}

export function ExecutionTracePanel({ steps }: Props) {
  const currentLine = usePlayerStore((s) => s.currentLine);
  const currentStepIndex = usePlayerStore((s) => s.currentStepIndex);

  const snapshot = useMemo(() => {
    if (currentStepIndex !== -1 && steps[currentStepIndex]) {
      return steps[currentStepIndex].snapshot;
    }
    return resolveExecutionSnapshot(currentLine, steps);
  }, [currentLine, currentStepIndex, steps]);

  if (!snapshot) {
    return (
      <section
        className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/80 p-4 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950/40 dark:text-zinc-400"
        aria-label="Estado da execução (demonstração)"
      >
        Sem modelo visual para esta linha — avance no player para ver arrays e mapas quando definidos no{' '}
        <code className="text-xs">trace.json</code>.
      </section>
    );
  }

  const hasBody =
    (snapshot.arrays?.length ?? 0) > 0 ||
    (snapshot.mapEntries?.length ?? 0) > 0 ||
    (snapshot.scalars && Object.keys(snapshot.scalars).length > 0);

  return (
    <section
      className="rounded-xl border border-zinc-200 bg-gradient-to-br from-emerald-500/5 to-transparent p-4 shadow-sm dark:border-zinc-800 dark:from-emerald-400/10"
      aria-label="Estado da execução (demonstração)"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
          Estado da execução (MVP)
        </h3>
        <span className="font-mono text-[10px] tabular-nums text-zinc-400">linha {currentLine}</span>
      </div>

      {snapshot.caption ? <p className="mb-3 text-sm text-zinc-700 dark:text-zinc-300">{snapshot.caption}</p> : null}

      {!hasBody && !snapshot.caption ? (
        <p className="text-sm text-zinc-500">Snapshot vazio para esta linha.</p>
      ) : null}

      {snapshot.arrays?.map((arr) => (
        <div key={arr.label} className="mb-4 last:mb-0">
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">{arr.label}</div>
          <div className="flex flex-wrap gap-1 font-mono text-xs">
            {arr.values.map((v, idx) => {
              const hi = arr.highlightIndices.includes(idx);
              return (
                <span
                  key={`${arr.label}-${idx}`}
                  className={
                    hi
                      ? 'rounded-md bg-emerald-500/25 px-2 py-1 font-semibold text-emerald-900 ring-1 ring-emerald-600/40 dark:text-emerald-100'
                      : 'rounded-md bg-zinc-100 px-2 py-1 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200'
                  }
                >
                  {v === null ? 'null' : String(v)}
                </span>
              );
            })}
          </div>
        </div>
      ))}

      {snapshot.mapEntries && snapshot.mapEntries.length > 0 ? (
        <div className="mb-4">
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Map (seen)</div>
          <ul className="space-y-1 font-mono text-xs">
            {snapshot.mapEntries.map((row) => (
              <li key={`${row.key}-${row.value}`} className="flex gap-2 rounded-md bg-zinc-100 px-2 py-1 dark:bg-zinc-900">
                <span className="text-emerald-700 dark:text-emerald-400">{row.key}</span>
                <span className="text-zinc-400">→</span>
                <span>{row.value}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {snapshot.scalars && Object.keys(snapshot.scalars).length > 0 ? (
        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 font-mono text-xs">
          {Object.entries(snapshot.scalars).map(([k, v]) => (
            <Fragment key={k}>
              <dt className="text-zinc-500">{k}</dt>
              <dd className="text-zinc-900 dark:text-zinc-100">{v}</dd>
            </Fragment>
          ))}
        </dl>
      ) : null}
    </section>
  );
}
