"use client";

import { Plus, Trash2 } from "lucide-react";
import { FormField, TextInput } from "../form-elements";
import { FormProps } from "../types";
import { MarkdownEditor } from "../markdown-editor";

export function PricingCopyForm({
  slug,
  setSlug,
  title,
  setTitle,
  body,
  setBody,
  meta,
  setMeta,
}: FormProps) {
  const freePerks = (meta.freePerks as string[]) || [];
  const proPerks = (meta.proPerks as string[]) || [];

  const handleUpdatePerks = (key: "freePerks" | "proPerks", index: number, value: string) => {
    const list = [...((meta[key] as string[]) || [])];
    list[index] = value;
    setMeta({ ...meta, [key]: list });
  };

  const handleAddPerk = (key: "freePerks" | "proPerks") => {
    const list = [...((meta[key] as string[]) || [])];
    list.push("");
    setMeta({ ...meta, [key]: list });
  };

  const handleRemovePerk = (key: "freePerks" | "proPerks", index: number) => {
    const list = [...((meta[key] as string[]) || [])];
    list.splice(index, 1);
    setMeta({ ...meta, [key]: list });
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <FormField label="Título da Página *">
          <TextInput
            value={title}
            onChange={setTitle}
            placeholder="ex: Planos e Preços"
          />
        </FormField>
        <FormField label="Slug (Usar 'main-pricing') *">
          <TextInput
            value={slug}
            onChange={setSlug}
            placeholder="main-pricing"
            mono
          />
        </FormField>
      </div>

      <FormField label="Descrição Principal (Markdown)">
        <MarkdownEditor
          value={body}
          onChange={setBody}
          contentType="pricing-copy"
        />
      </FormField>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Free Perks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
              Vantagens Plano FREE
            </h3>
            <button
              onClick={() => handleAddPerk("freePerks")}
              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-primary hover:underline"
            >
              <Plus className="h-3 w-3" /> Adicionar
            </button>
          </div>
          <div className="space-y-2">
            {freePerks.map((perk, i) => (
              <div key={i} className="flex gap-2">
                <TextInput
                  value={perk}
                  onChange={(v) => handleUpdatePerks("freePerks", i, v)}
                  placeholder="ex: 10 Problemas Hero"
                />
                <button
                  onClick={() => handleRemovePerk("freePerks", i)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {freePerks.length === 0 && (
              <p className="text-[10px] italic text-muted-foreground">Nenhuma vantagem adicionada.</p>
            )}
          </div>
        </div>

        {/* Pro Perks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary">
              Vantagens Plano PRO
            </h3>
            <button
              onClick={() => handleAddPerk("proPerks")}
              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-primary hover:underline"
            >
              <Plus className="h-3 w-3" /> Adicionar
            </button>
          </div>
          <div className="space-y-2">
            {proPerks.map((perk, i) => (
              <div key={i} className="flex gap-2">
                <TextInput
                  value={perk}
                  onChange={(v) => handleUpdatePerks("proPerks", i, v)}
                  placeholder="ex: Todo o catálogo"
                />
                <button
                  onClick={() => handleRemovePerk("proPerks", i)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {proPerks.length === 0 && (
              <p className="text-[10px] italic text-muted-foreground">Nenhuma vantagem adicionada.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <FormField label="Preço Mensal (Opcional)" hint="Texto a exibir no preço Pro. Se vazio, usa o valor do Stripe.">
          <TextInput
            value={(meta.monthlyPrice as string) || ""}
            onChange={(v) => setMeta({ ...meta, monthlyPrice: v })}
            placeholder="ex: 19€"
          />
        </FormField>
        <FormField label="Nota Anual/Desconto (Opcional)" hint="Texto pequeno abaixo do preço.">
          <TextInput
            value={(meta.yearlyNote as string) || ""}
            onChange={(v) => setMeta({ ...meta, yearlyNote: v })}
            placeholder="ex: Ou 190€/ano (2 meses grátis)"
          />
        </FormField>
      </div>
    </div>
  );
}
