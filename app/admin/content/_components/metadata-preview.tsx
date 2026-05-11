"use client";

import { useState } from "react";
import {
  CONCEPT_META_EXAMPLE,
  ENGINEERING_WORK_META_EXAMPLE,
  INTERVIEW_EN_META_EXAMPLE,
  PROBLEM_META_EXAMPLE,
} from "../content-examples";

const METADATA_EXAMPLES: Record<
  string,
  { label: string; example: Record<string, any> }
> = {
  "interview-en": { label: "Interview EN", example: INTERVIEW_EN_META_EXAMPLE },
  "engineering-work": {
    label: "Engenharia",
    example: ENGINEERING_WORK_META_EXAMPLE,
  },
  problem: { label: "Problema", example: PROBLEM_META_EXAMPLE },
  concept: { label: "Conceito", example: CONCEPT_META_EXAMPLE },
  course: {
    label: "Curso",
    example: {
      subtitle: "Aprenda arrays do zero ao avançado",
      moduleCount: 5,
      moduleIds: ["mod-1", "mod-2"],
    },
  },
  changelog: {
    label: "Changelog",
    example: { version: "1.2.0", date: "2026-05-11" },
  },
};

export function MetadataPreview({
  meta,
  contentType,
}: {
  meta: Record<string, any>;
  contentType?: string;
}) {
  const [open, setOpen] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const exampleData = contentType ? METADATA_EXAMPLES[contentType] : undefined;

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-xs font-medium text-muted-foreground hover:bg-secondary/50 transition-colors"
      >
        <span>📦 Metadados resultantes (JSON)</span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      {open && (
        <div className="border-t border-border">
          {exampleData && (
            <div className="flex items-center justify-between px-4 py-2 bg-secondary/30 border-b border-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Preenchimento actual
              </span>
              <button
                type="button"
                onClick={() => setShowExample(!showExample)}
                className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline"
              >
                {showExample ? "✕ Fechar exemplo" : "📋 Ver exemplo"}
              </button>
            </div>
          )}
          {showExample && exampleData && (
            <div className="px-4 py-3 bg-amber-500/5 border-b border-amber-500/20">
              <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
                Exemplo para {exampleData.label}
              </p>
              <pre className="text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre">
                {JSON.stringify(exampleData.example, null, 2)}
              </pre>
            </div>
          )}
          <pre className="px-4 py-3 text-xs font-mono text-foreground overflow-x-auto whitespace-pre bg-background">
            {JSON.stringify(meta, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
