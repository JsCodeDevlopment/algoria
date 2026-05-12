"use client";

import { FormField, NumberInput, SelectInput, TextInput } from "../../form-elements";
import { TopicSelector } from "./topic-selector";

const TRACKS = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "devops", label: "DevOps" },
];

const LEVELS = [
  { value: "junior", label: "Júnior" },
  { value: "pleno", label: "Pleno" },
  { value: "senior", label: "Sênior" },
];

const DIFFICULTIES = [
  { value: "fácil", label: "Fácil" },
  { value: "médio", label: "Médio" },
  { value: "difícil", label: "Difícil" },
];

interface GeneralInfoSectionProps {
  title: string;
  setTitle: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  meta: Record<string, unknown>;
  setMeta: (v: Record<string, unknown>) => void;
  timeLimitMinutes: number;
  setTimeLimitMinutes: (v: number) => void;
  description: string;
  setDescription: (v: string) => void;
  mode: "create" | "edit";
  existingTopics: string[];
}

export function GeneralInfoSection({
  title,
  setTitle,
  slug,
  setSlug,
  meta,
  setMeta,
  timeLimitMinutes,
  setTimeLimitMinutes,
  description,
  setDescription,
  mode,
  existingTopics,
}: GeneralInfoSectionProps) {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <FormField label="Título do Simulado *">
          <TextInput
            value={title}
            onChange={setTitle}
            placeholder="Ex: Performance Crítica em React"
          />
        </FormField>
        <FormField label="Slug *">
          <TextInput
            value={slug}
            onChange={(v) =>
              setSlug(v.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
            }
            disabled={mode === "edit"}
            mono
          />
        </FormField>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <FormField label="Trilha *">
          <SelectInput
            value={(meta.track as string) || "frontend"}
            onChange={(v) => setMeta({ ...meta, track: v })}
            options={TRACKS}
          />
        </FormField>
        <FormField label="Nível *">
          <SelectInput
            value={(meta.level as string) || "junior"}
            onChange={(v) => setMeta({ ...meta, level: v })}
            options={LEVELS}
          />
        </FormField>
        <FormField label="Dificuldade *">
          <SelectInput
            value={(meta.difficulty as string) || "médio"}
            onChange={(v) => setMeta({ ...meta, difficulty: v })}
            options={DIFFICULTIES}
          />
        </FormField>
        <FormField label="Tempo (Min)">
          <NumberInput
            value={timeLimitMinutes || 30}
            onChange={setTimeLimitMinutes}
            min={1}
          />
        </FormField>
      </div>

      <FormField label="Categoria / Tópico *">
        <TopicSelector
          value={(meta.topic as string) || ""}
          onChange={(v) => setMeta({ ...meta, topic: v })}
          existingTopics={existingTopics}
        />
      </FormField>

      <FormField label="Descrição do Simulado">
        <textarea
          value={description || ""}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Breve resumo sobre o que este teste aborda..."
          rows={3}
          className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground resize-y focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
      </FormField>
    </section>
  );
}
