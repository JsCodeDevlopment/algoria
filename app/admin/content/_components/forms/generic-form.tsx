"use client";

import { useEffect, useState } from "react";
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
  const [jsonText, setJsonText] = useState(JSON.stringify(meta, null, 2));

  // Sincronizar o slug com o título no modo de criação
  useEffect(() => {
    if (mode === "create" && title) {
      const generatedSlug = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[^a-z0-9-]/g, "-") // Troca tudo o que não é letra/número por hífen
        .replace(/-+/g, "-") // Remove hífens duplicados
        .replace(/^-|-$/g, ""); // Remove hífens no início/fim
      setSlug(generatedSlug);
    }
  }, [title, mode, setSlug]);

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
        hint="Campos específicos deste tipo de conteúdo. As alterações são validadas em tempo real."
      >
        <textarea
          value={jsonText}
          onChange={(e) => {
            const val = e.target.value;
            setJsonText(val);
            try {
              const parsed = JSON.parse(val);
              setMeta(parsed);
            } catch {
              // JSON inválido enquanto o utilizador digita, não atualiza o estado global ainda
            }
          }}
          rows={8}
          className="w-full rounded-lg border border-border bg-background p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground resize-y focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
      </FormField>
    </div>
  );
}
