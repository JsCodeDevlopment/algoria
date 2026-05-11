"use client";

import { FormProps, CATEGORIES, DIFFICULTIES, ACCESS_OPTIONS } from "../types";
import { FormField, TextInput, SelectInput, NumberInput } from "../form-elements";
import { MarkdownEditor } from "../markdown-editor";
import { MetadataPreview } from "../metadata-preview";

export function ConceptForm({
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
