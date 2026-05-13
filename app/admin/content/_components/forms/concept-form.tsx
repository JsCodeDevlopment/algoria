"use client";

import { FormProps, CATEGORIES, DIFFICULTIES, ACCESS_OPTIONS } from "../types";
import { FormField, TextInput, SelectInput, NumberInput } from "../form-elements";
import { MarkdownEditor } from "../markdown-editor";
import { MetadataPreview } from "../metadata-preview";
import { useState } from "react";
import { FileJson, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

  const [importJson, setImportJson] = useState("");
  const [isImportOpen, setIsImportOpen] = useState(false);

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(importJson);
      if (typeof parsed !== "object" || parsed === null) throw new Error();

      if (parsed.title) setTitle(parsed.title);
      if (parsed.slug) setSlug(parsed.slug);
      if (parsed.body) setBody(parsed.body);
      
      const importedMeta = parsed.meta || {};
      setMeta({
        ...meta,
        category: importedMeta.category || meta.category,
        difficulty: importedMeta.difficulty || meta.difficulty,
        access: importedMeta.access || meta.access,
        estimatedMinutes: importedMeta.estimatedMinutes || meta.estimatedMinutes,
        prerequisites: importedMeta.prerequisites || meta.prerequisites,
        summary: importedMeta.summary || meta.summary,
      });

      setIsImportOpen(false);
      setImportJson("");
    } catch (err) {
      alert("Erro ao importar JSON. Verifica se o formato é válido.");
      console.error(err);
    }
  };

  const handleExportJson = () => {
    const data = {
      title,
      slug,
      body,
      meta,
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${slug || "concept"}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="rounded-none border border-violet-500/20 bg-violet-500/5 p-4 text-xs font-bold text-violet-600 dark:text-violet-400 flex items-center gap-3 flex-1">
          <div className="h-2 w-2 rounded-none bg-violet-500 animate-pulse" />
          Modo de Edição de Conceito: Podes importar definições JSON para preenchimento rápido.
        </div>

        <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="rounded-none gap-2 text-xs font-black uppercase border-2 h-12"
            >
              <FileJson className="h-4 w-4" /> Importar JSON
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-background border-2 border-border rounded-none">
            <DialogHeader>
              <DialogTitle className="text-xl font-black uppercase tracking-tighter">
                Importar Conceito (JSON)
              </DialogTitle>
              <DialogDescription className="text-xs uppercase font-bold tracking-widest text-muted-foreground">
                Cola o JSON completo do conceito abaixo para preencher os campos automaticamente.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <textarea
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder='{"title": "Novo Conceito", "meta": {...}, "body": "..."}'
                rows={12}
                className="w-full bg-[#080808] text-violet-400 p-4 font-mono text-xs rounded-none border-2 border-border focus:border-violet-500 outline-none"
              />
            </div>
            <DialogFooter>
              <Button
                onClick={handleImportJson}
                className="rounded-none font-black uppercase tracking-widest w-full h-12 bg-violet-600 hover:bg-violet-700 text-white"
              >
                Confirmar Importação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          onClick={handleExportJson}
          className="rounded-none gap-2 text-xs font-black uppercase border-2 h-12"
        >
          <Download className="h-4 w-4" /> Exportar JSON
        </Button>
      </div>

      <div className="rounded-none border border-violet-500/20 bg-violet-500/5 p-4 text-sm text-violet-600 dark:text-violet-400">
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
            value={(meta.category as string) || "fundamentals"}
            onChange={(v) => setMeta({ ...meta, category: v })}
            options={conceptCategories}
          />
        </FormField>
        <FormField label="Dificuldade">
          <SelectInput
            value={(meta.difficulty as string) || "medium"}
            onChange={(v) => setMeta({ ...meta, difficulty: v })}
            options={DIFFICULTIES}
          />
        </FormField>
        <FormField label="Acesso">
          <SelectInput
            value={(meta.access as string) || "pro"}
            onChange={(v) => setMeta({ ...meta, access: v })}
            options={ACCESS_OPTIONS}
          />
        </FormField>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <FormField label="Tempo estimado (min)">
          <NumberInput
            value={(meta.estimatedMinutes as number) || 10}
            onChange={(v) => setMeta({ ...meta, estimatedMinutes: v })}
            min={1}
          />
        </FormField>
        <FormField label="Pré-requisitos" hint="Slugs separados por vírgula">
          <TextInput
            value={((meta.prerequisites as string[]) || []).join(", ")}
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
          value={(meta.summary as string) || ""}
          onChange={(v) => setMeta({ ...meta, summary: v })}
          placeholder="Explicação sobre..."
        />
      </FormField>

      <MarkdownEditor value={body} onChange={setBody} contentType="concept" />

      <MetadataPreview meta={meta} contentType="concept" />
    </div>
  );
}
