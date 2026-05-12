"use client";

import { FormProps, INTERVIEW_TRACKS, DIFFICULTIES } from "../types";
import { FormField, TextInput, SelectInput, NumberInput } from "../form-elements";
import { MarkdownEditor } from "../markdown-editor";
import { MetadataPreview } from "../metadata-preview";

export function InterviewEnForm({
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
            value={(meta.track as string) || "vocabulary"}
            onChange={(v) => setMeta({ ...meta, track: v })}
            options={INTERVIEW_TRACKS}
          />
        </FormField>
        <FormField label="Dificuldade">
          <SelectInput
            value={(meta.difficulty as string) || "easy"}
            onChange={(v) => setMeta({ ...meta, difficulty: v })}
            options={DIFFICULTIES}
          />
        </FormField>
        <FormField label="Tempo estimado (min)">
          <NumberInput
            value={(meta.estimatedMinutes as number) || 12}
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
          value={(meta.summary as string) || ""}
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
