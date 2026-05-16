"use client";

import { renderMarkdown } from "@/lib/content/markdown";
import type { LineAnnotation } from "@/lib/content/schemas";
import { ExplanationFooter } from "./explanation-footer";
import { ExplanationHeader } from "./explanation-header";
import { usePlayerStore, type ExplanationLevel } from "./use-player-store";

interface Props {
  annotations: LineAnnotation[];
  conceptTitles: Record<string, string>;
}

export function ExplanationPanel({ annotations, conceptTitles }: Props) {
  const currentLine = usePlayerStore((s) => s.currentLine);
  const level = usePlayerStore((s) => s.level);
  const setLevel = usePlayerStore((s) => s.setLevel);

  const annotation = annotations.find((a) => a.line === currentLine);

  if (!annotation) {
    return (
      <aside className="border border-dashed border-border/40 bg-muted/10 backdrop-blur-md p-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">
        Nenhuma explicação disponível para esta linha.
      </aside>
    );
  }

  const text = pickLevel(annotation, level);
  const html = renderMarkdown(text);

  return (
    <aside
      aria-live="polite"
      className="border border-border/50 bg-background/80 backdrop-blur-md overflow-hidden"
    >
      <ExplanationHeader
        line={annotation.line}
        level={level}
        setLevel={setLevel}
      />

      <div
        className="prose prose-sm dark:prose-invert max-w-none px-5 py-4
                   prose-pre:rounded-none prose-pre:bg-muted/30 prose-pre:border prose-pre:border-border/30
                   prose-code:text-primary dark:prose-code:text-primary
                   prose-code:before:content-none prose-code:after:content-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <ExplanationFooter
        warnings={annotation.warnings}
        concepts={annotation.concepts}
        conceptTitles={conceptTitles}
      />
    </aside>
  );
}

function pickLevel(a: LineAnnotation, level: ExplanationLevel): string {
  if (level === 3) return a.level3;
  if (level === 2) return a.level2;
  return a.level1;
}
