"use client";

import { AlertTriangle, BookOpen } from "lucide-react";
import Link from "next/link";

interface ExplanationFooterProps {
  warnings?: string[];
  concepts?: string[];
  conceptTitles: Record<string, string>;
}

export function ExplanationFooter({
  warnings,
  concepts,
  conceptTitles,
}: ExplanationFooterProps) {
  return (
    <>
      {warnings && warnings.length > 0 && (
        <div className="mx-4 mb-4 border border-amber-500/20 bg-amber-500/5 p-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-mono text-[8px] font-bold uppercase tracking-[0.3em] mb-2">
            <AlertTriangle className="h-3 w-3" /> Atenção
          </div>
          <ul className="space-y-1 text-sm text-amber-900 dark:text-amber-100">
            {warnings.map((w, i) => (
              <li key={i} className="leading-snug">
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {concepts && concepts.length > 0 && (
        <div className="border-t border-border/30 px-4 py-3 flex items-center gap-2 flex-wrap bg-muted/10">
          <BookOpen className="h-3.5 w-3.5 text-muted-foreground/40" />
          <span className="font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">
            Conceitos:
          </span>
          {concepts.map((slug) => (
            <Link
              key={slug}
              href={`/concepts/${slug}`}
              className="font-mono text-[9px] font-semibold px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
            >
              {conceptTitles[slug] ?? slug}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
