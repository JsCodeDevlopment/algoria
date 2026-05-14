'use client';

import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';
import type { HighlightedLine } from '@/lib/content/shiki';

import { usePlayerStore } from './use-player-store';

interface Props {
  lines: HighlightedLine[];
  /** Lines that have at least one annotation (`level1`). */
  annotatedLineSet: Set<number>;
  /** When false, show plain readable code rows (modo leitura). */
  interactiveSteps?: boolean;
}

/**
 * Renders the source code line-by-line, with an active-line highlight
 * synced to the player store. Each line is a `<button>` so it's
 * keyboard-focusable and gets standard ARIA roles for screen readers.
 *
 * Non-annotated lines (closing braces, blank lines) are rendered but
 * dimmed and non-clickable — they exist to keep line numbers honest
 * with the source file.
 */
export function CodeView({ lines, annotatedLineSet, interactiveSteps = true }: Props) {
  const currentLine = usePlayerStore((s) => s.currentLine);
  const setCurrentLine = usePlayerStore((s) => s.setCurrentLine);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll automático desativado a pedido do utilizador para evitar saltos de tela.
  }, [currentLine, interactiveSteps]);

  return (
    <div
      ref={containerRef}
      className="relative font-mono text-[13px] leading-6 overflow-auto max-h-[70vh] border border-zinc-200 dark:border-zinc-800 bg-[var(--shiki-light-bg,#fff)] dark:bg-[var(--shiki-dark-bg,#0a0a0a)]"
      role="region"
      aria-label="Código com explicação por linha"
    >
      <div className="py-3">
        {lines.map((line) => {
          const isAnnotated = interactiveSteps ? annotatedLineSet.has(line.line) : true;
          const isActive = interactiveSteps && isAnnotated && line.line === currentLine;
          const rowClasses = cn(
            'group flex w-full items-start gap-4 px-4 py-0.5 text-left transition-colors',
            interactiveSteps && isAnnotated ? 'cursor-pointer' : 'cursor-default',
            interactiveSteps && !isAnnotated ? 'opacity-60' : '',
            isActive
              ? 'bg-blue-500/10 dark:bg-blue-400/10 ring-1 ring-inset ring-blue-500/40'
              : interactiveSteps ? 'hover:bg-zinc-500/5 dark:hover:bg-zinc-400/5' : '',
          );
          const innerRow = (
            <>
              <span
                className={cn(
                  'select-none w-8 shrink-0 text-right font-mono text-xs tabular-nums pt-px',
                  isActive ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-zinc-400',
                )}
              >
                {line.line}
              </span>
              <code
                className="flex-1 min-w-0 whitespace-pre"
                style={{
                  color: 'var(--shiki-light)',
                }}
                dangerouslySetInnerHTML={{ __html: line.innerHtml || '\u00A0' }}
              />
            </>
          );

          if (!interactiveSteps) {
            return (
              <div key={line.line} data-line={line.line} className={rowClasses}>
                {innerRow}
              </div>
            );
          }

          return (
            <button
              key={line.line}
              type="button"
              data-line={line.line}
              onClick={() => isAnnotated && setCurrentLine(line.line)}
              tabIndex={isAnnotated ? 0 : -1}
              aria-current={isActive ? 'step' : undefined}
              aria-label={`Linha ${line.line}${isAnnotated ? '' : ' (sem explicação)'}`}
              className={rowClasses}
            >
              {innerRow}
            </button>
          );
        })}
      </div>
    </div>
  );
}
