"use client";

import { useState } from "react";
import { FileJson, Download } from "lucide-react";
import { FormProps, ENGINEERING_PILLARS, ACCESS_OPTIONS } from "../types";
import { FormField, TextInput, SelectInput, NumberInput } from "../form-elements";
import { MarkdownEditor } from "../markdown-editor";
import { MetadataPreview } from "../metadata-preview";
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
  const [importJson, setImportJson] = useState("");
  const [isImportOpen, setIsImportOpen] = useState(false);

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(importJson);
      if (typeof parsed !== "object" || parsed === null) throw new Error();

      if (parsed.title) setTitle(parsed.title);
      if (parsed.slug) setSlug(parsed.slug);
      if (parsed.body) setBody(parsed.body);
      
      if (parsed.meta || parsed.metadata) {
        setMeta({
          ...meta,
          ...(parsed.meta || parsed.metadata),
        });
      }

      setIsImportOpen(false);
      setImportJson("");
    } catch (err) {
      alert("Erro ao importar JSON. Verifica se o formato é válido.");
      console.error(err);
    }
  };

  const handleExportJson = () => {
    const dataToExport = {
      title,
      slug,
      body,
      meta,
    };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `${slug || "engineering-work"}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-600 dark:text-amber-400">
          <strong>Engenharia</strong> — Conteúdo apresentado na página{" "}
          <code>Academy → Engineering Work</code>. Guias sobre processos, cultura
          e carreira em engenharia de software.
        </div>

        <div className="flex shrink-0 gap-2">
          {/* Import Dialog */}
          <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 text-xs font-bold uppercase border-2 h-10"
              >
                <FileJson className="h-4 w-4" /> Importar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-background border-2 border-border">
              <DialogHeader>
                <DialogTitle className="text-xl font-black uppercase tracking-tighter">
                  Importar Definição JSON
                </DialogTitle>
                <DialogDescription className="text-xs uppercase font-bold tracking-widest text-muted-foreground">
                  Cola o JSON completo do guia abaixo para preencher os campos
                  automaticamente.
                </DialogDescription>
              </DialogHeader>

              {/* Creator Kit Helper */}
              <div className="rounded-lg border border-border bg-secondary/20 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">📦</span>
                  <p className="text-sm font-semibold text-foreground">Kit do Criador de Conteúdo</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Novo por aqui? Use o kit abaixo para escrever seu artigo em Markdown e gerar o JSON automaticamente.
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <a
                    href="/creator-support/README.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-accent hover:border-primary/40 transition-colors"
                  >
                    <span>📖</span>
                    <span>Guia Rápido<br /><span className="font-normal text-muted-foreground">README.md</span></span>
                  </a>
                  <a
                    href="/creator-support/exemplo-conteudo.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-accent hover:border-primary/40 transition-colors"
                  >
                    <span>📝</span>
                    <span>Exemplos<br /><span className="font-normal text-muted-foreground">exemplo-conteudo.md</span></span>
                  </a>
                  <a
                    href="/creator-support/compilar-json.js"
                    download
                    className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-accent hover:border-primary/40 transition-colors"
                  >
                    <span>⬇️</span>
                    <span>Script<br /><span className="font-normal text-muted-foreground">compilar-json.js</span></span>
                  </a>
                </div>
                <ol className="text-[11px] text-muted-foreground space-y-1 pl-4 list-decimal">
                  <li>Baixe o <strong className="text-foreground">script</strong> e escreva seu artigo em <code className="bg-muted px-1 rounded">conteudo.md</code></li>
                  <li>Configure os metadados no script e execute: <code className="bg-muted px-1 rounded">node compilar-json.js</code></li>
                  <li>Copie o conteúdo do <code className="bg-muted px-1 rounded">importar.json</code> gerado e cole abaixo</li>
                </ol>
              </div>

              <div className="py-2">
                <textarea
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  placeholder='{"title": "Novo Guia", "body": "...", "meta": { ... }}'
                  rows={10}
                  className="w-full bg-[#080808] text-emerald-400 p-4 font-mono text-xs rounded-none border-2 border-border focus:border-primary outline-none"
                />
              </div>
              <DialogFooter>
                <Button
                  onClick={handleImportJson}
                  className="rounded-none font-black uppercase tracking-widest w-full h-12"
                >
                  Confirmar Importação
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            onClick={handleExportJson}
            className="gap-2 text-xs font-bold uppercase border-2 h-10"
          >
            <Download className="h-4 w-4" /> Exportar
          </Button>
        </div>
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

      <div className="grid gap-4 lg:grid-cols-4">
        <FormField label="Pilar *">
          <SelectInput
            value={(meta.pillar as string) || "frontend"}
            onChange={(v) => setMeta({ ...meta, pillar: v })}
            options={ENGINEERING_PILLARS}
          />
        </FormField>
        <FormField label="Tempo estimado (min)">
          <NumberInput
            value={(meta.estimatedMinutes as number) || 15}
            onChange={(v) => setMeta({ ...meta, estimatedMinutes: v })}
            min={1}
          />
        </FormField>
        <FormField label="Acesso">
          <SelectInput
            value={(meta.access as string) || "pro"}
            onChange={(v) => setMeta({ ...meta, access: v })}
            options={ACCESS_OPTIONS}
          />
        </FormField>
        <FormField label="Imagem de capa (URL)" hint="Opcional">
          <TextInput
            value={(meta.image as string) || ""}
            onChange={(v) => setMeta({ ...meta, image: v })}
            placeholder="https://..."
          />
        </FormField>
      </div>

      <FormField label="Resumo *" hint="Descrição curta para listagens e SEO">
        <TextInput
          value={(meta.summary as string) || ""}
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

