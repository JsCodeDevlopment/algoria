"use client";

import {
  FormProps,
  DIFFICULTIES,
  ACCESS_OPTIONS,
  CATEGORIES,
  EditorSolution,
} from "../types";
import { FormField, TextInput, SelectInput, NumberInput } from "../form-elements";
import { MarkdownEditor } from "../markdown-editor";
import { MetadataPreview } from "../metadata-preview";
import { SolutionsList } from "../solutions-editor";
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
  const selectedCategories: string[] = (meta.categories as string[]) || [];

  function toggleCategory(cat: string) {
    const cats = selectedCategories.includes(cat)
      ? selectedCategories.filter((c: string) => c !== cat)
      : [...selectedCategories, cat];
    setMeta({ ...meta, categories: cats });
  }

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
        difficulty: importedMeta.difficulty || meta.difficulty,
        access: importedMeta.access || meta.access,
        hasBespokeVisualizer: parsed.hasBespokeVisualizer ?? importedMeta.hasBespokeVisualizer ?? meta.hasBespokeVisualizer,
        estimatedMinutes: importedMeta.estimatedMinutes || meta.estimatedMinutes,
        recommendedOrder: importedMeta.recommendedOrder || meta.recommendedOrder,
        categories: importedMeta.categories || parsed.categories || meta.categories,
        constraints: importedMeta.constraints || parsed.constraints || meta.constraints,
        solutions: importedMeta.solutions || parsed.solutions || meta.solutions,
        examples: importedMeta.examples || parsed.examples || meta.examples,
        tags: importedMeta.tags || parsed.tags || meta.tags,
        prerequisites: importedMeta.prerequisites || parsed.prerequisites || meta.prerequisites,
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
    const exportFileDefaultName = `${slug || "problem"}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="rounded-none border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-3 flex-1">
          <div className="h-2 w-2 rounded-none bg-emerald-500 animate-pulse" />
          Modo de Edição de Problema: Podes importar definições JSON para preenchimento rápido.
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
                Importar Problema (JSON)
              </DialogTitle>
              <DialogDescription className="text-xs uppercase font-bold tracking-widest text-muted-foreground">
                Cola o JSON completo do problema abaixo para preencher os campos automaticamente.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <textarea
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder='{"title": "Novo Problema", "meta": {...}, "body": "..."}'
                rows={12}
                className="w-full bg-[#080808] text-emerald-400 p-4 font-mono text-xs rounded-none border-2 border-border focus:border-emerald-500 outline-none"
              />
            </div>
            <DialogFooter>
              <Button
                onClick={handleImportJson}
                className="rounded-none font-black uppercase tracking-widest w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white"
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

      <div className="rounded-none border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-600 dark:text-emerald-400">
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
            value={(meta.difficulty as string) || "easy"}
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
        <FormField label="Tempo estimado (min)">
          <NumberInput
            value={(meta.estimatedMinutes as number) || 15}
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
          value={(meta.recommendedOrder as number) || 1}
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
              className={`rounded-none px-3 py-1 text-xs font-medium border transition-colors ${
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
          value={((meta.constraints as string[]) || []).join("\n")}
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
        solutions={(meta.solutions as EditorSolution[]) || []}
        onChange={(sols) => setMeta({ ...meta, solutions: sols })}
      />

      <MetadataPreview meta={meta} contentType="problem" />
    </div>
  );
}
