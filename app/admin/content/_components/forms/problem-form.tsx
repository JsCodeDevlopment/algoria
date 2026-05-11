"use client";

import { FormProps, DIFFICULTIES, ACCESS_OPTIONS, CATEGORIES } from "../types";
import { FormField, TextInput, SelectInput, NumberInput } from "../form-elements";
import { MarkdownEditor } from "../markdown-editor";
import { MetadataPreview } from "../metadata-preview";
import { SolutionsList } from "../solutions-editor";

export function ProblemForm({
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
