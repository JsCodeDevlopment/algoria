"use client";

import { FormProps, ENGINEERING_PILLARS } from "../types";
import { FormField, TextInput, SelectInput, NumberInput } from "../form-elements";
import { MarkdownEditor } from "../markdown-editor";
import { MetadataPreview } from "../metadata-preview";

export function EngineeringWorkForm({
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
