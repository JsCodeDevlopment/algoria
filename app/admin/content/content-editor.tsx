"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { createContent, updateContent } from "@/lib/actions/admin";
import { renderMarkdown } from "@/lib/content/markdown";
import { LANGUAGES } from "@/lib/content/schemas";
import {
  CONCEPT_BODY_EXAMPLE,
  CONCEPT_META_EXAMPLE,
  ENGINEERING_WORK_BODY_EXAMPLE,
  ENGINEERING_WORK_META_EXAMPLE,
  INTERVIEW_EN_BODY_EXAMPLE,
  INTERVIEW_EN_META_EXAMPLE,
  PROBLEM_BODY_EXAMPLE,
  PROBLEM_META_EXAMPLE,
} from "./content-examples";

/* ── Shared UI components ─────────────────────────────────────────── */

function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
        {label}
      </label>
      {children}
      {hint && (
        <p className="mt-1 text-[11px] text-muted-foreground/70">{hint}</p>
      )}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  disabled,
  mono,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  mono?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50 ${mono ? "font-mono" : ""}`}
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function NumberInput({
  value,
  onChange,
  placeholder,
  min,
}: {
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
  min?: number;
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value) || 0)}
      placeholder={placeholder}
      min={min}
      className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
    />
  );
}

const BODY_EXAMPLES: Record<string, string> = {
  "interview-en": INTERVIEW_EN_BODY_EXAMPLE,
  "engineering-work": ENGINEERING_WORK_BODY_EXAMPLE,
  problem: PROBLEM_BODY_EXAMPLE,
  concept: CONCEPT_BODY_EXAMPLE,
};

function MarkdownEditor({
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

function SaveActions({
  isPending,
  onSave,
  onCancel,
}: {
  isPending: boolean;
  onSave: (publish: boolean) => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-3 border-t border-border pt-6">
      <button
        onClick={() => onSave(false)}
        disabled={isPending}
        className="flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
      >
        {isPending && (
          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
        )}
        Salvar Rascunho
      </button>
      <button
        onClick={() => onSave(true)}
        disabled={isPending}
        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
      >
        {isPending && (
          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        )}
        Publicar
      </button>
      <button
        onClick={onCancel}
        className="ml-auto text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Cancelar
      </button>
    </div>
  );
}

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

function MetadataPreview({
  meta,
  contentType,
}: {
  meta: Record<string, any>;
  contentType?: string;
}) {
  // ... (previous code)
}

function SolutionLanguagesEditor({
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

function SolutionsList({
  solutions,
  onChange,
}: {
  solutions: any[];
  onChange: (sols: any[]) => void;
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

  function updateSolution(index: number, data: any) {
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

/* ── Type-specific form configs ───────────────────────────────────── */

const DIFFICULTIES = [
  { value: "easy", label: "Fácil" },
  { value: "medium", label: "Médio" },
  { value: "hard", label: "Difícil" },
];

const ACCESS_OPTIONS = [
  { value: "free", label: "Gratuito" },
  { value: "pro", label: "Pro (Assinantes)" },
];

const INTERVIEW_TRACKS = [
  { value: "vocabulary", label: "Vocabulary" },
  { value: "communication", label: "Communication" },
  { value: "behavioral", label: "Behavioral" },
  { value: "system-design", label: "System Design" },
];

const ENGINEERING_PILLARS = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "devops", label: "DevOps" },
];

const CATEGORIES = [
  { value: "arrays", label: "Arrays" },
  { value: "hash-tables", label: "Hash Tables" },
  { value: "two-pointers", label: "Two Pointers" },
  { value: "sliding-window", label: "Sliding Window" },
  { value: "binary-search", label: "Binary Search" },
  { value: "linked-list", label: "Linked List" },
  { value: "trees", label: "Trees" },
  { value: "graphs", label: "Graphs" },
  { value: "dynamic-programming", label: "Dynamic Programming" },
  { value: "greedy", label: "Greedy" },
  { value: "backtracking", label: "Backtracking" },
  { value: "bit-manipulation", label: "Bit Manipulation" },
  { value: "math", label: "Math" },
  { value: "strings", label: "Strings" },
  { value: "stacks", label: "Stacks" },
  { value: "queues", label: "Queues" },
  { value: "recursion", label: "Recursion" },
  { value: "sorting", label: "Sorting" },
];

/* ── Interview EN Form ────────────────────────────────────────────── */

function InterviewEnForm({
  slug,
  setSlug,
  title,
  setTitle,
  body,
  setBody,
  meta,
  setMeta,
  mode,
}: FormProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-blue-600 dark:text-blue-400">
        <strong>Interview EN</strong> — Conteúdo apresentado na página{" "}
        <code>Academy → Interview English</code>. Escreva vocabulário, frases e
        cenários de entrevista em <strong>inglês</strong>.
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <FormField label="Título *" hint="Ex: 'Explaining Time Complexity'">
          <TextInput
            value={title}
            onChange={setTitle}
            placeholder="Ex: Explaining Big-O Notation"
          />
        </FormField>
        <FormField
          label="Slug *"
          hint="Identificador único na URL (auto-gerado)"
        >
          <TextInput
            value={slug}
            onChange={(v) =>
              setSlug(v.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
            }
            placeholder="ex: explaining-big-o"
            disabled={mode === "edit"}
            mono
          />
        </FormField>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <FormField label="Track *">
          <SelectInput
            value={meta.track || "vocabulary"}
            onChange={(v) => setMeta({ ...meta, track: v })}
            options={INTERVIEW_TRACKS}
          />
        </FormField>
        <FormField label="Dificuldade">
          <SelectInput
            value={meta.difficulty || "easy"}
            onChange={(v) => setMeta({ ...meta, difficulty: v })}
            options={DIFFICULTIES}
          />
        </FormField>
        <FormField label="Tempo estimado (min)">
          <NumberInput
            value={meta.estimatedMinutes || 12}
            onChange={(v) => setMeta({ ...meta, estimatedMinutes: v })}
            min={1}
          />
        </FormField>
      </div>

      <FormField
        label="Resumo *"
        hint="Breve descrição do tópico (1-2 linhas, usado em listagens)"
      >
        <TextInput
          value={meta.summary || ""}
          onChange={(v) => setMeta({ ...meta, summary: v })}
          placeholder="High-frequency vocabulary for explaining data structures..."
        />
      </FormField>

      <MarkdownEditor
        value={body}
        onChange={setBody}
        contentType="interview-en"
      />

      <MetadataPreview meta={meta} contentType="interview-en" />
    </div>
  );
}

/* ── Engineering Work Form ────────────────────────────────────────── */

function EngineeringWorkForm({
  slug,
  setSlug,
  title,
  setTitle,
  body,
  setBody,
  meta,
  setMeta,
  mode,
}: FormProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-600 dark:text-amber-400">
        <strong>Engenharia</strong> — Conteúdo apresentado na página{" "}
        <code>Academy → Engineering Work</code>. Guias sobre processos, cultura
        e carreira em engenharia de software.
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <FormField label="Título *" hint="Ex: 'Como fazer Code Review eficaz'">
          <TextInput
            value={title}
            onChange={setTitle}
            placeholder="Ex: Code Review — boas práticas"
          />
        </FormField>
        <FormField label="Slug *" hint="Identificador único na URL">
          <TextInput
            value={slug}
            onChange={(v) =>
              setSlug(v.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
            }
            placeholder="ex: code-review-boas-praticas"
            disabled={mode === "edit"}
            mono
          />
        </FormField>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <FormField label="Pilar *">
          <SelectInput
            value={meta.pillar || "frontend"}
            onChange={(v) => setMeta({ ...meta, pillar: v })}
            options={ENGINEERING_PILLARS}
          />
        </FormField>
        <FormField label="Tempo estimado (min)">
          <NumberInput
            value={meta.estimatedMinutes || 15}
            onChange={(v) => setMeta({ ...meta, estimatedMinutes: v })}
            min={1}
          />
        </FormField>
        <FormField label="Imagem de capa (URL)" hint="Opcional">
          <TextInput
            value={meta.image || ""}
            onChange={(v) => setMeta({ ...meta, image: v })}
            placeholder="https://..."
          />
        </FormField>
      </div>

      <FormField label="Resumo *" hint="Descrição curta para listagens e SEO">
        <TextInput
          value={meta.summary || ""}
          onChange={(v) => setMeta({ ...meta, summary: v })}
          placeholder="Guia prático sobre..."
        />
      </FormField>

      <MarkdownEditor
        value={body}
        onChange={setBody}
        contentType="engineering-work"
      />

      <MetadataPreview meta={meta} contentType="engineering-work" />
    </div>
  );
}

/* ── Problem Form ─────────────────────────────────────────────────── */

function ProblemForm({
  slug,
  setSlug,
  title,
  setTitle,
  body,
  setBody,
  meta,
  setMeta,
  mode,
}: FormProps) {
  const selectedCategories: string[] = meta.categories || [];

  function toggleCategory(cat: string) {
    const cats = selectedCategories.includes(cat)
      ? selectedCategories.filter((c: string) => c !== cat)
      : [...selectedCategories, cat];
    setMeta({ ...meta, categories: cats });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-600 dark:text-emerald-400">
        <strong>Problema</strong> — Apresentado na página{" "}
        <code>Problemas (DSA Playground)</code>. Inclua descrição, exemplos e
        constraints. As soluções anotadas são adicionadas via ficheiros
        separados.
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <FormField label="Título *" hint="Nome do problema (ex: Two Sum)">
          <TextInput
            value={title}
            onChange={setTitle}
            placeholder="Ex: Two Sum"
          />
        </FormField>
        <FormField label="Slug *">
          <TextInput
            value={slug}
            onChange={(v) =>
              setSlug(v.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
            }
            placeholder="ex: two-sum"
            disabled={mode === "edit"}
            mono
          />
        </FormField>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <FormField label="Dificuldade *">
          <SelectInput
            value={meta.difficulty || "easy"}
            onChange={(v) => setMeta({ ...meta, difficulty: v })}
            options={DIFFICULTIES}
          />
        </FormField>
        <FormField label="Acesso">
          <SelectInput
            value={meta.access || "pro"}
            onChange={(v) => setMeta({ ...meta, access: v })}
            options={ACCESS_OPTIONS}
          />
        </FormField>
        <FormField label="Tempo estimado (min)">
          <NumberInput
            value={meta.estimatedMinutes || 15}
            onChange={(v) => setMeta({ ...meta, estimatedMinutes: v })}
            min={1}
          />
        </FormField>
      </div>

      <FormField
        label="Ordem recomendada"
        hint="Número para ordenação (menor = aparece primeiro)"
      >
        <NumberInput
          value={meta.recommendedOrder || 1}
          onChange={(v) => setMeta({ ...meta, recommendedOrder: v })}
          min={1}
        />
      </FormField>

      {/* Categories multi-select */}
      <FormField label="Categorias *" hint="Selecione pelo menos uma">
        <div className="flex flex-wrap gap-2 mt-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => toggleCategory(cat.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                selectedCategories.includes(cat.value)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </FormField>

      {/* Constraints */}
      <FormField label="Constraints" hint="Uma por linha">
        <textarea
          value={(meta.constraints || []).join("\n")}
          onChange={(e) =>
            setMeta({
              ...meta,
              constraints: e.target.value.split("\n").filter(Boolean),
            })
          }
          placeholder={"2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9"}
          rows={3}
          className="w-full rounded-lg border border-border bg-background p-3 font-mono text-sm text-foreground placeholder:text-muted-foreground resize-y focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
      </FormField>

      {/* Description body */}
      <MarkdownEditor value={body} onChange={setBody} contentType="problem" />

      {/* Solutions list */}
      <SolutionsList
        solutions={meta.solutions || []}
        onChange={(sols) => setMeta({ ...meta, solutions: sols })}
      />

      <MetadataPreview meta={meta} contentType="problem" />
    </div>
  );
}

/* ── Concept Form ─────────────────────────────────────────────────── */

function ConceptForm({
  slug,
  setSlug,
  title,
  setTitle,
  body,
  setBody,
  meta,
  setMeta,
  mode,
}: FormProps) {
  const conceptCategories = [
    ...CATEGORIES,
    { value: "fundamentals", label: "Fundamentos" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-4 text-sm text-violet-600 dark:text-violet-400">
        <strong>Conceito</strong> — Apresentado na{" "}
        <code>Sidebar de Conceitos e Academy</code>. Mini-guia teórico
        explicando um conceito de computação.
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <FormField label="Título *">
          <TextInput
            value={title}
            onChange={setTitle}
            placeholder="Ex: Hash Tables — fundamentos"
          />
        </FormField>
        <FormField label="Slug *">
          <TextInput
            value={slug}
            onChange={(v) =>
              setSlug(v.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
            }
            placeholder="ex: hash-tables"
            disabled={mode === "edit"}
            mono
          />
        </FormField>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <FormField label="Categoria *">
          <SelectInput
            value={meta.category || "fundamentals"}
            onChange={(v) => setMeta({ ...meta, category: v })}
            options={conceptCategories}
          />
        </FormField>
        <FormField label="Dificuldade">
          <SelectInput
            value={meta.difficulty || "medium"}
            onChange={(v) => setMeta({ ...meta, difficulty: v })}
            options={DIFFICULTIES}
          />
        </FormField>
        <FormField label="Acesso">
          <SelectInput
            value={meta.access || "pro"}
            onChange={(v) => setMeta({ ...meta, access: v })}
            options={ACCESS_OPTIONS}
          />
        </FormField>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <FormField label="Tempo estimado (min)">
          <NumberInput
            value={meta.estimatedMinutes || 10}
            onChange={(v) => setMeta({ ...meta, estimatedMinutes: v })}
            min={1}
          />
        </FormField>
        <FormField label="Pré-requisitos" hint="Slugs separados por vírgula">
          <TextInput
            value={(meta.prerequisites || []).join(", ")}
            onChange={(v) =>
              setMeta({
                ...meta,
                prerequisites: v
                  .split(",")
                  .map((s: string) => s.trim())
                  .filter(Boolean),
              })
            }
            placeholder="ex: arrays, linked-list"
          />
        </FormField>
      </div>

      <FormField label="Resumo *" hint="Descrição curta do conceito">
        <TextInput
          value={meta.summary || ""}
          onChange={(v) => setMeta({ ...meta, summary: v })}
          placeholder="Explicação sobre..."
        />
      </FormField>

      <MarkdownEditor value={body} onChange={setBody} contentType="concept" />

      <MetadataPreview meta={meta} contentType="concept" />
    </div>
  );
}

/* ── Generic Form (changelog, course, etc.) ───────────────────────── */

function GenericForm({
  slug,
  setSlug,
  title,
  setTitle,
  body,
  setBody,
  meta,
  setMeta,
  mode,
  contentType,
}: FormProps & { contentType: string }) {
  const TYPE_LABELS: Record<string, string> = {
    course: "Curso",
    "technical-test": "Simulado Técnico",
    changelog: "Changelog",
    track: "Trilha",
    "legal-page": "Página Legal",
    "landing-section": "Landing Section",
    "pricing-copy": "Pricing Copy",
    navigation: "Navegação",
    taxonomy: "Taxonomia",
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
        <strong>{TYPE_LABELS[contentType] || contentType}</strong> — Formulário
        genérico. Utilize os campos de metadados JSON para configuração
        específica deste tipo.
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <FormField label="Título *">
          <TextInput
            value={title}
            onChange={setTitle}
            placeholder="Título do conteúdo"
          />
        </FormField>
        <FormField label="Slug *">
          <TextInput
            value={slug}
            onChange={(v) =>
              setSlug(v.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
            }
            placeholder="ex: meu-conteudo"
            disabled={mode === "edit"}
            mono
          />
        </FormField>
      </div>

      <MarkdownEditor
        value={body}
        onChange={setBody}
        contentType={contentType}
      />

      {/* Raw metadata for types without dedicated forms */}
      <FormField
        label="Metadados (JSON)"
        hint="Campos específicos deste tipo de conteúdo"
      >
        <textarea
          value={JSON.stringify(meta, null, 2)}
          onChange={(e) => {
            try {
              setMeta(JSON.parse(e.target.value));
            } catch {
              /* invalid json, user still typing */
            }
          }}
          rows={8}
          className="w-full rounded-lg border border-border bg-background p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground resize-y focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
      </FormField>
    </div>
  );
}

/* ── Form props interface ─────────────────────────────────────────── */

interface FormProps {
  slug: string;
  setSlug: (v: string) => void;
  title: string;
  setTitle: (v: string) => void;
  body: string;
  setBody: (v: string) => void;
  meta: Record<string, any>;
  setMeta: (v: Record<string, any>) => void;
  mode: "create" | "edit";
}

/* ── Main ContentEditor ──────────────────────────────────────────── */

const DEFAULT_META: Record<string, Record<string, any>> = {
  "interview-en": {
    track: "vocabulary",
    difficulty: "easy",
    estimatedMinutes: 12,
    summary: "",
  },
  "engineering-work": { pillar: "frontend", estimatedMinutes: 15, summary: "" },
  problem: {
    difficulty: "easy",
    categories: [],
    estimatedMinutes: 15,
    access: "pro",
    recommendedOrder: 1,
    constraints: [],
  },
  concept: {
    category: "fundamentals",
    difficulty: "medium",
    estimatedMinutes: 10,
    access: "pro",
    summary: "",
    prerequisites: [],
  },
  course: { subtitle: "", moduleCount: 0, moduleIds: [] },
  changelog: {},
  "technical-test": {},
};

interface ContentEditorProps {
  mode: "create" | "edit";
  initialData?: {
    id?: string;
    slug?: string;
    type?: string;
    title?: string;
    body?: string;
    metadata?: Record<string, unknown>;
  };
}

export function ContentEditor({ mode, initialData }: ContentEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const contentType = initialData?.type ?? "problem";
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [body, setBody] = useState(initialData?.body ?? "");
  const [meta, setMeta] = useState<Record<string, any>>(
    initialData?.metadata && Object.keys(initialData.metadata).length > 0
      ? (initialData.metadata as Record<string, any>)
      : (DEFAULT_META[contentType] ?? {}),
  );

  function showFeedback(t: "success" | "error", msg: string) {
    setFeedback({ type: t, msg });
    setTimeout(() => setFeedback(null), 5000);
  }

  function handleSave(publish: boolean) {
    if (!slug.trim() || !title.trim()) {
      showFeedback("error", "Slug e título são obrigatórios");
      return;
    }

    startTransition(async () => {
      let result;
      if (mode === "edit" && initialData?.id) {
        result = await updateContent(initialData.id, {
          title: title.trim(),
          body,
          metadata: meta,
          publish,
        });
      } else {
        result = await createContent({
          slug: slug.trim(),
          type: contentType as never,
          title: title.trim(),
          body,
          metadata: meta,
          publish,
        });
      }

      if (result.error) {
        showFeedback("error", result.error);
      } else {
        showFeedback(
          "success",
          publish ? "Conteúdo publicado!" : "Rascunho salvo!",
        );
        if (mode === "create" && "id" in result && result.id) {
          router.push(`/admin/content/${result.id}/review`);
        } else {
          router.refresh();
        }
      }
    });
  }

  const formProps: FormProps = {
    slug,
    setSlug,
    title,
    setTitle,
    body,
    setBody,
    meta,
    setMeta,
    mode,
  };

  function renderForm() {
    switch (contentType) {
      case "interview-en":
        return <InterviewEnForm {...formProps} />;
      case "engineering-work":
        return <EngineeringWorkForm {...formProps} />;
      case "problem":
        return <ProblemForm {...formProps} />;
      case "concept":
        return <ConceptForm {...formProps} />;
      default:
        return <GenericForm {...formProps} contentType={contentType} />;
    }
  }

  return (
    <div className="space-y-6">
      {/* Feedback */}
      {feedback && (
        <div
          className={`rounded-lg px-4 py-3 text-sm font-medium ${
            feedback.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {feedback.msg}
        </div>
      )}

      {/* Type-specific form */}
      {renderForm()}

      {/* Actions */}
      <SaveActions
        isPending={isPending}
        onSave={handleSave}
        onCancel={() => router.push("/admin/content")}
      />
    </div>
  );
}
