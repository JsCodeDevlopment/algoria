"use client";

import { useState } from "react";
import { renderMarkdown } from "@/lib/content/markdown";
import {
  CONCEPT_BODY_EXAMPLE,
  ENGINEERING_WORK_BODY_EXAMPLE,
  INTERVIEW_EN_BODY_EXAMPLE,
  PROBLEM_BODY_EXAMPLE,
} from "../content-examples";

const BODY_EXAMPLES: Record<string, string> = {
  "interview-en": INTERVIEW_EN_BODY_EXAMPLE,
  "engineering-work": ENGINEERING_WORK_BODY_EXAMPLE,
  problem: PROBLEM_BODY_EXAMPLE,
  concept: CONCEPT_BODY_EXAMPLE,
};

export function MarkdownEditor({
  value,
  onChange,
  contentType,
}: {
  value: string;
  onChange: (v: string) => void;
  contentType?: string;
}) {
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [showExample, setShowExample] = useState(false);
  const example = contentType ? BODY_EXAMPLES[contentType] : undefined;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="block text-xs font-medium text-muted-foreground">
          Corpo (Markdown)
        </label>
        <div className="flex items-center gap-2">
          {example && (
            <button
              type="button"
              onClick={() => setShowExample(!showExample)}
              className={`px-3 py-1 text-xs font-medium rounded-md border transition-colors ${
                showExample
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                  : "text-muted-foreground border-border hover:text-foreground hover:border-primary/50"
              }`}
            >
              {showExample ? "✕ Fechar Exemplo" : "📋 Ver Exemplo"}
            </button>
          )}
          <div className="flex rounded-lg border border-border p-0.5 bg-background">
            <button
              onClick={() => setViewMode("edit")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === "edit" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Editor
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === "preview" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Example panel */}
      {showExample && example && (
        <div className="rounded-lg border-2 border-dashed border-amber-500/30 bg-amber-500/5 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-amber-500/10 border-b border-amber-500/20">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Exemplo de Preenchimento
            </span>
            <button
              type="button"
              onClick={() => {
                onChange(example);
                setShowExample(false);
              }}
              className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline"
            >
              Usar como base →
            </button>
          </div>
          <div className="max-h-[400px] overflow-y-auto p-4 prose prose-sm dark:prose-invert max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: renderMarkdown(example) }}
            />
          </div>
        </div>
      )}

      {viewMode === "edit" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escreva o conteúdo em Markdown..."
          rows={18}
          className="w-full rounded-lg border border-border bg-background p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground resize-y focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
      ) : (
        <div className="min-h-[400px] rounded-lg border border-border bg-background p-8 prose prose-sm dark:prose-invert max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(
                value || "*Nenhum conteúdo para visualizar*",
              ),
            }}
          />
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        {value.length} caracteres · {value.split("\n").length} linhas
      </p>
    </div>
  );
}
