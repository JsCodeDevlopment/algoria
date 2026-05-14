'use client';

import { AlertTriangle, BookOpen } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LineAnnotation } from '@/lib/content/schemas';

import { usePlayerStore, type ExplanationLevel } from './use-player-store';
import { renderMarkdown } from '@/lib/content/markdown';

interface Props {
  annotations: LineAnnotation[];
  /** Map from concept slug -> human-readable title (for showing in the chip). */
  conceptTitles: Record<string, string>;
}

const LEVEL_LABEL: Record<ExplanationLevel, string> = {
  1: 'Resumo',
  2: 'Detalhado',
  3: 'Deep dive',
};

const LEVEL_DESCRIPTION: Record<ExplanationLevel, string> = {
  1: 'Uma frase que fixa a ideia antes de veres o código correr.',
  2: 'Passo a passo: o que muda no estado e porquê agora.',
  3: 'Riscos, invariantes, custo e onde isto reaparece na prática.',
};

export function ExplanationPanel({ annotations, conceptTitles }: Props) {
  const currentLine = usePlayerStore((s) => s.currentLine);
  const level = usePlayerStore((s) => s.level);
  const setLevel = usePlayerStore((s) => s.setLevel);

  const annotation = annotations.find((a) => a.line === currentLine);

  if (!annotation) {
    return (
      <aside className="border border-dashed border-zinc-200 dark:border-zinc-800 p-6 text-xs uppercase tracking-widest text-zinc-400">
        Nenhuma explicação disponível para esta linha.
      </aside>
    );
  }

  const text = pickLevel(annotation, level);
  const html = renderMarkdown(text);

  return (
    <aside
      aria-live="polite"
      className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
    >
      <header className="flex items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-900 px-5 py-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono rounded-none">
            line {annotation.line}
          </Badge>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{LEVEL_DESCRIPTION[level]}</span>
        </div>
        <LevelTabs level={level} setLevel={setLevel} availability={availability()} />
      </header>

      <div
        className="prose prose-zinc dark:prose-invert prose-sm max-w-none px-5 py-4
                   prose-pre:rounded-none prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-code:text-blue-600 dark:prose-code:text-blue-400
                   prose-code:before:content-none prose-code:after:content-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {annotation.warnings && annotation.warnings.length > 0 ? (
        <div className="mx-5 mb-4 border border-amber-500/20 bg-amber-500/5 p-3">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2">
            <AlertTriangle className="h-3 w-3" /> ATENÇÃO
          </div>
          <ul className="space-y-1 text-sm text-amber-900 dark:text-amber-100">
            {annotation.warnings.map((w, i) => (
              <li key={i} className="leading-snug">
                {w}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {annotation.concepts && annotation.concepts.length > 0 ? (
        <div className="border-t border-zinc-100 dark:border-zinc-900 px-5 py-3 flex items-center gap-2 flex-wrap">
          <BookOpen className="h-4 w-4 text-zinc-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Conceitos:</span>
          {annotation.concepts.map((slug) => (
            <Link
              key={slug}
              href={`/concepts/${slug}`}
              className="text-[10px] font-black uppercase px-2 py-0.5 bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-colors"
            >
              {conceptTitles[slug] ?? slug}
            </Link>
          ))}
        </div>
      ) : null}
    </aside>
  );
}

function pickLevel(a: LineAnnotation, level: ExplanationLevel): string {
  if (level === 3) return a.level3;
  if (level === 2) return a.level2;
  return a.level1;
}

function availability(): Record<ExplanationLevel, boolean> {
  return {
    1: true,
    2: true,
    3: true,
  };
}

function LevelTabs({
  level,
  setLevel,
  availability,
}: {
  level: ExplanationLevel;
  setLevel: (l: ExplanationLevel) => void;
  availability: Record<ExplanationLevel, boolean>;
}) {
  return (
    <div role="tablist" aria-label="Nível de explicação" className="inline-flex bg-zinc-100 dark:bg-zinc-900 p-0.5">
      {([1, 2, 3] as const).map((l) => {
        const active = level === l;
        const enabled = availability[l];
        return (
          <button
            key={l}
            role="tab"
            aria-selected={active}
            disabled={!enabled}
            onClick={() => enabled && setLevel(l)}
            className={cn(
              'px-2.5 py-1 text-[10px] font-black uppercase transition-colors',
              active
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : enabled
                ? 'text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                : 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed',
            )}
            title={`${LEVEL_LABEL[l]} (atalho ${l})`}
          >
            {LEVEL_LABEL[l]}
          </button>
        );
      })}
    </div>
  );
}
