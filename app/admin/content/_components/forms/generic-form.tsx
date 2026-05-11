"use client";

import { FormProps } from "../types";
import { FormField, TextInput } from "../form-elements";
import { MarkdownEditor } from "../markdown-editor";

export function GenericForm({
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
