"use client";

import { useEffect, useRef } from "react";

import type { HighlightedLine } from "@/lib/content/shiki";
import { cn } from "@/lib/utils";

import { usePlayerStore } from "./use-player-store";

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
export function CodeView({
  lines,
  annotatedLineSet,
  interactiveSteps = true,
}: Props) {
  const currentLine = usePlayerStore((s) => s.currentLine);
  const setCurrentLine = usePlayerStore((s) => s.setCurrentLine);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!interactiveSteps || !currentLine || !containerRef.current) return;
    const activeEl = containerRef.current.querySelector(`[data-line="${currentLine}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [currentLine, interactiveSteps]);

  return (
    <div
      ref={containerRef}
      className="relative font-mono text-[13px] leading-6 overflow-auto max-h-[70vh] border border-border/50 bg-background/80 backdrop-blur-md"
      role="region"
      aria-label="Código com explicação por linha"
    >
      <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-2.5 border-b border-border/30 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-red-400/60" />
          <div className="h-2 w-2 rounded-full bg-yellow-400/60" />
          <div className="h-2 w-2 rounded-full bg-green-400/60" />
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">
          Source Code
        </span>
      </div>

      <div className="py-3">
        {lines.map((line) => {
          const isAnnotated = interactiveSteps
            ? annotatedLineSet.has(line.line)
            : true;
          const isActive =
            interactiveSteps && isAnnotated && line.line === currentLine;
          const rowClasses = cn(
            "group relative flex w-full items-start gap-4 px-4 py-0.5 text-left transition-colors duration-200",
            interactiveSteps && isAnnotated
              ? "cursor-pointer"
              : "cursor-default",
            interactiveSteps && !isAnnotated ? "opacity-40" : "",
            isActive
              ? "bg-primary/[0.08]"
              : interactiveSteps
                ? "hover:bg-muted/30"
                : "",
          );
          const innerRow = (
            <>
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary transition-all" />
              )}
              <span
                className={cn(
                  "select-none w-8 shrink-0 text-right font-mono text-xs tabular-nums pt-px transition-colors duration-200",
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground/25",
                )}
              >
                {line.line}
              </span>
              <code
                className={cn(
                  "flex-1 min-w-0 whitespace-pre transition-colors duration-200",
                  isActive ? "" : interactiveSteps && !isAnnotated ? "" : "",
                )}
                style={{
                  color: "var(--shiki-light)",
                }}
                dangerouslySetInnerHTML={{ __html: line.innerHtml || "\u00A0" }}
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
              aria-current={isActive ? "step" : undefined}
              aria-label={`Linha ${line.line}${isAnnotated ? "" : " (sem explicação)"}`}
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
