"use client";

import { Badge } from "@/components/ui/badge";
import { LANGUAGES } from "@/lib/content/schemas";
import { useState } from "react";
import { FormField, SelectInput, TextInput } from "./form-elements";
import { EditorSolution } from "./types";

export function SolutionLanguagesEditor({
  codeByLanguage,
  onChange,
}: {
  codeByLanguage: Record<string, string>;
  onChange: (val: Record<string, string>) => void;
}) {
  const [activeLang, setActiveLang] = useState<string>(
    Object.keys(codeByLanguage)[0] || "typescript",
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => {
              if (!codeByLanguage[lang]) {
                onChange({ ...codeByLanguage, [lang]: "" });
              }
              setActiveLang(lang);
            }}
            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded border transition-colors ${
              activeLang === lang
                ? "bg-primary text-primary-foreground border-primary"
                : codeByLanguage[lang] !== undefined
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "bg-background text-muted-foreground border-border hover:border-primary/50"
            }`}
          >
            {lang} {codeByLanguage[lang] !== undefined && "✓"}
          </button>
        ))}
      </div>

      {activeLang && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Editor: {activeLang}
            </span>
            {codeByLanguage[activeLang] !== undefined && (
              <button
                type="button"
                onClick={() => {
                  const next = { ...codeByLanguage };
                  delete next[activeLang];
                  onChange(next);
                }}
                className="text-[10px] font-bold text-destructive hover:underline"
              >
                Remover Linguagem
              </button>
            )}
          </div>
          <textarea
            value={codeByLanguage[activeLang] || ""}
            onChange={(e) =>
              onChange({ ...codeByLanguage, [activeLang]: e.target.value })
            }
            placeholder={`Insira o código em ${activeLang}...`}
            rows={12}
            className="w-full rounded-lg border border-border bg-background p-4 font-mono text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>
      )}
    </div>
  );
}

export function SolutionsList({
  solutions,
  onChange,
}: {
  solutions: EditorSolution[];
  onChange: (sols: EditorSolution[]) => void;
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  function addSolution() {
    const newSol = {
      meta: {
        slug: `sol-${solutions.length + 1}`,
        name: "Nova Solução",
        kind: "optimal",
        language: "typescript",
        complexity: { time: "O(n)", space: "O(1)", rationale: "" },
      },
      codeByLanguage: { typescript: "" },
      introMd: "",
      annotations: [],
    };
    onChange([...solutions, newSol]);
    setExpandedIndex(solutions.length);
  }

  function updateSolution(index: number, data: EditorSolution) {
    const next = [...solutions];
    next[index] = data;
    onChange(next);
  }

  function removeSolution(index: number) {
    onChange(solutions.filter((_, i) => i !== index));
    if (expandedIndex === index) setExpandedIndex(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
          Soluções ({solutions.length})
        </h3>
        <button
          type="button"
          onClick={addSolution}
          className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary/20"
        >
          + Adicionar Solução
        </button>
      </div>

      {solutions.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Nenhuma solução adicionada ainda.
        </div>
      )}

      {solutions.map((sol, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-border bg-card overflow-hidden"
        >
          <div
            className="flex items-center justify-between px-4 py-3 bg-muted/30 cursor-pointer hover:bg-muted/50"
            onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
          >
            <div className="flex items-center gap-3">
              <Badge
                variant={sol.meta.kind === "optimal" ? "default" : "secondary"}
                className="text-[10px] uppercase"
              >
                {sol.meta.kind}
              </Badge>
              <span className="font-bold text-sm">
                {sol.meta.name || sol.meta.slug}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                /{sol.meta.slug}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSolution(idx);
                }}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
              <svg
                className={`h-4 w-4 text-muted-foreground transition-transform ${expandedIndex === idx ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {expandedIndex === idx && (
            <div className="p-6 space-y-6 border-t border-border">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Nome da Solução">
                  <TextInput
                    value={sol.meta.name}
                    onChange={(v) =>
                      updateSolution(idx, {
                        ...sol,
                        meta: { ...sol.meta, name: v },
                      })
                    }
                  />
                </FormField>
                <FormField label="Slug da Solução (URL)">
                  <TextInput
                    value={sol.meta.slug}
                    onChange={(v) =>
                      updateSolution(idx, {
                        ...sol,
                        meta: {
                          ...sol.meta,
                          slug: v.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                        },
                      })
                    }
                  />
                </FormField>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <FormField label="Tipo">
                  <SelectInput
                    value={sol.meta.kind}
                    onChange={(v) =>
                      updateSolution(idx, {
                        ...sol,
                        meta: { ...sol.meta, kind: v },
                      })
                    }
                    options={[
                      { value: "optimal", label: "Óptima" },
                      { value: "brute-force", label: "Brute-force" },
                      { value: "alternative", label: "Alternativa" },
                    ]}
                  />
                </FormField>
                <FormField label="Linguagem Canónica (para Sync)">
                  <SelectInput
                    value={sol.meta.language}
                    onChange={(v) =>
                      updateSolution(idx, {
                        ...sol,
                        meta: { ...sol.meta, language: v },
                      })
                    }
                    options={LANGUAGES.map((l) => ({ value: l, label: l }))}
                  />
                </FormField>
                <FormField label="Entry Function (Highlighter)">
                  <TextInput
                    value={sol.meta.entryFunction || ""}
                    onChange={(v) =>
                      updateSolution(idx, {
                        ...sol,
                        meta: { ...sol.meta, entryFunction: v },
                      })
                    }
                  />
                </FormField>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Complexidade Temporal">
                  <TextInput
                    value={sol.meta.complexity.time}
                    onChange={(v) =>
                      updateSolution(idx, {
                        ...sol,
                        meta: {
                          ...sol.meta,
                          complexity: { ...sol.meta.complexity, time: v },
                        },
                      })
                    }
                  />
                </FormField>
                <FormField label="Complexidade Espacial">
                  <TextInput
                    value={sol.meta.complexity.space}
                    onChange={(v) =>
                      updateSolution(idx, {
                        ...sol,
                        meta: {
                          ...sol.meta,
                          complexity: { ...sol.meta.complexity, space: v },
                        },
                      })
                    }
                  />
                </FormField>
              </div>

              <FormField label="Rationale (Justificativa complexidade)">
                <textarea
                  value={sol.meta.complexity.rationale || ""}
                  onChange={(e) =>
                    updateSolution(idx, {
                      ...sol,
                      meta: {
                        ...sol.meta,
                        complexity: {
                          ...sol.meta.complexity,
                          rationale: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full rounded-lg border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                  rows={2}
                />
              </FormField>

              <FormField label="Intro (Markdown)">
                <textarea
                  value={sol.introMd || ""}
                  onChange={(e) =>
                    updateSolution(idx, { ...sol, introMd: e.target.value })
                  }
                  className="w-full rounded-lg border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                  rows={3}
                />
              </FormField>

              <div className="space-y-4 pt-4 border-t border-border">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary">
                  Implementações (Multi-Language)
                </h4>
                <SolutionLanguagesEditor
                  codeByLanguage={sol.codeByLanguage || {}}
                  onChange={(val) =>
                    updateSolution(idx, { ...sol, codeByLanguage: val })
                  }
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
