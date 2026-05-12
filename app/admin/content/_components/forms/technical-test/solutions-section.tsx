"use client";

import { useState } from "react";
import { TestSolution } from "@/lib/content/schemas";
import { Lightbulb as LightbulbIcon, Plus, Trash2 } from "lucide-react";
import { TextInput } from "../../form-elements";

interface SolutionsSectionProps {
  solutions: TestSolution[];
  onAddSolution: () => void;
  onRemoveSolution: (index: number) => void;
  onUpdateSolution: (index: number, updates: Partial<TestSolution>) => void;
  enabledLanguages: string[];
}

const LANGUAGE_LABELS: Record<string, { label: string; color: string }> = {
  javascript: { label: "JS", color: "bg-yellow-500" },
  python: { label: "PY", color: "bg-blue-500" },
  java: { label: "JV", color: "bg-red-500" },
  csharp: { label: "C#", color: "bg-purple-500" },
  rust: { label: "RS", color: "bg-orange-500" },
  go: { label: "GO", color: "bg-cyan-500" },
};

export function SolutionsSection({
  solutions,
  onAddSolution,
  onRemoveSolution,
  onUpdateSolution,
  enabledLanguages,
}: SolutionsSectionProps) {
  const [activeLang, setActiveLang] = useState(enabledLanguages[0] || "javascript");

  return (
    <section className="space-y-6 rounded-2xl border border-border bg-card/30 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
            <LightbulbIcon className="h-5 w-5 text-amber-500" /> Resoluções Sugeridas
          </h3>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">
            Explicações pedagógicas e implementações de referência
          </p>
        </div>
        <button
          type="button"
          onClick={onAddSolution}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-xs font-black uppercase rounded-lg hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
        >
          <Plus className="h-4 w-4" /> Nova Resolução
        </button>
      </div>

      <div className="space-y-8">
        {solutions.map((sol, sIndex) => (
          <div
            key={sol.id}
            className="p-6 border border-border bg-background/50 backdrop-blur-sm rounded-2xl space-y-6 relative group animate-in slide-in-from-bottom-4 duration-500"
          >
            <button
              type="button"
              onClick={() => onRemoveSolution(sIndex)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all p-2 rounded-xl hover:bg-destructive/10"
              title="Remover Resolução"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <div className="space-y-4 max-w-2xl">
              <TextInput
                value={sol.title}
                onChange={(v) => onUpdateSolution(sIndex, { title: v })}
                placeholder="Título da Solução (ex: Otimização com Two Pointers)"
              />
              <textarea
                value={sol.explanation}
                onChange={(e) =>
                  onUpdateSolution(sIndex, { explanation: e.target.value })
                }
                placeholder="Explicação técnica detalhada..."
                rows={3}
                className="w-full rounded-xl border border-border bg-background p-4 text-sm focus:border-amber-500 outline-none transition-all placeholder:text-muted-foreground/50 shadow-inner"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex gap-1 bg-secondary/30 p-1 rounded-lg border border-border/50">
                  {enabledLanguages.map((lang) => {
                    const info = LANGUAGE_LABELS[lang] || { label: lang.toUpperCase(), color: "bg-primary" };
                    const isActive = activeLang === lang;
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setActiveLang(lang)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${
                          isActive 
                            ? "bg-primary text-primary-foreground shadow-md" 
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                      >
                        <div className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-white" : info.color}`} />
                        {info.label}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                  Referência de Implementação
                </span>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-[#080808] shadow-xl">
                <div className="flex items-center gap-1 px-4 py-2 border-b border-border/30 bg-secondary/10">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/50" />
                  <span className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground">
                    code_block_{activeLang}.src
                  </span>
                </div>
                <textarea
                  value={sol.code[activeLang] || ""}
                  onChange={(e) =>
                    onUpdateSolution(sIndex, {
                      code: { ...sol.code, [activeLang]: e.target.value },
                    })
                  }
                  placeholder={`Insere aqui o código completo da solução em ${activeLang}...`}
                  rows={10}
                  className="w-full bg-transparent text-emerald-400/90 p-4 font-mono text-xs outline-none shadow-inner resize-none custom-scrollbar"
                />
              </div>
            </div>
          </div>
        ))}
        
        {solutions.length === 0 && (
          <div className="py-12 border-2 border-dashed border-border rounded-xl text-center text-sm text-muted-foreground">
            Nenhuma resolução sugerida adicionada.
          </div>
        )}
      </div>
    </section>
  );
}
