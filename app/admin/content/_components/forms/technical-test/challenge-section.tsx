"use client";

import { useState } from "react";
import { CodeChallenge } from "@/lib/content/schemas";
import { Code2, Trash2, X, Plus } from "lucide-react";
import { FormField, TextInput } from "../../form-elements";

interface ChallengeSectionProps {
  challenge: CodeChallenge;
  onChange: (updates: Partial<CodeChallenge>) => void;
}

const SUPPORTED_LANGUAGES = [
  { id: "javascript", label: "JavaScript", color: "bg-yellow-500" },
  { id: "python", label: "Python", color: "bg-blue-500" },
  { id: "java", label: "Java", color: "bg-red-500" },
  { id: "csharp", label: "C#", color: "bg-purple-500" },
  { id: "rust", label: "Rust", color: "bg-orange-500" },
  { id: "go", label: "Go", color: "bg-cyan-500" },
];

export function ChallengeSection({
  challenge,
  onChange,
}: ChallengeSectionProps) {
  const [activeTab, setActiveTab] = useState("javascript");

  const enabledLanguages = Object.keys(challenge.templates || {});

  const toggleLanguage = (langId: string) => {
    const templates = { ...challenge.templates };
    if (templates[langId]) {
      // Garantir que resta sempre pelo menos uma linguagem
      if (enabledLanguages.length > 1) {
        delete templates[langId];
        if (activeTab === langId) {
          setActiveTab(Object.keys(templates)[0]);
        }
      }
    } else {
      templates[langId] = { 
        initialCode: "// Escreve o teu código aqui", 
        testRunner: "" 
      };
      setActiveTab(langId);
    }
    onChange({ templates });
  };

  const addTestCase = () => {
    const newTC = {
      id: `tc${(challenge.testCases?.length || 0) + 1}`,
      description: "",
      assertion: "",
    };
    onChange({ testCases: [...(challenge.testCases || []), newTC] });
  };

  const removeTestCase = (index: number) => {
    const tcs = [...(challenge.testCases || [])];
    tcs.splice(index, 1);
    onChange({ testCases: tcs });
  };

  const updateTestCase = (
    index: number,
    v: string,
    field: "description" | "assertion",
  ) => {
    const tcs = [...(challenge.testCases || [])];
    tcs[index] = { ...tcs[index], [field]: v };
    onChange({ testCases: tcs });
  };

  const updateTemplate = (
    lang: string,
    field: "initialCode" | "testRunner",
    v: string,
  ) => {
    const templates = { ...challenge.templates };
    if (!templates[lang]) {
      templates[lang] = { initialCode: "", testRunner: "" };
    }
    templates[lang] = { ...templates[lang], [field]: v };
    onChange({ templates });
  };

  return (
    <section className="space-y-6 rounded-2xl border border-border bg-card/30 p-8">
      <h3 className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
        <Code2 className="h-5 w-5 text-primary" /> Desafio de Código
      </h3>

      <div className="grid gap-4">
        <TextInput
          value={challenge.title || ""}
          onChange={(v) => onChange({ title: v })}
          placeholder="Título do Desafio (ex: Implemente um LRU Cache)"
        />
        <textarea
          value={challenge.description || ""}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Descrição técnica e instruções..."
          rows={4}
          className="w-full rounded-lg border border-border bg-background p-3 text-sm focus:border-primary outline-none"
        />
        <div className="grid lg:grid-cols-2 gap-4">
          <FormField
            label="Nome da Função Principal"
            hint="A função que será chamada pelos testes"
          >
            <TextInput
              value={challenge.functionName || ""}
              onChange={(v) => onChange({ functionName: v })}
              placeholder="ex: solve"
              mono
            />
          </FormField>
        </div>
      </div>

      {/* IDE-STYLE LANGUAGE BAR */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-1 w-4 rounded-full bg-primary" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground">
                Configuração Poliglota
              </h4>
            </div>
            <span className="text-[9px] font-bold text-muted-foreground uppercase">
              {enabledLanguages.length} {enabledLanguages.length === 1 ? 'Linguagem Ativa' : 'Linguagens Ativas'}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1 bg-background/50 p-1 rounded-xl border border-border/50">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isEnabled = enabledLanguages.includes(lang.id);
              const isActive = activeTab === lang.id;
              
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => {
                    if (!isEnabled) toggleLanguage(lang.id);
                    setActiveTab(lang.id);
                  }}
                  className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : isEnabled
                        ? "bg-secondary/50 text-foreground hover:bg-secondary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                  }`}
                >
                  <div className={`h-1.5 w-1.5 rounded-full transition-transform group-hover:scale-125 ${
                    isActive ? "bg-white" : lang.color
                  } ${!isEnabled && "opacity-40 grayscale"}`} />
                  
                  <span className="text-[10px] font-black uppercase tracking-tight">{lang.label}</span>
                  
                  {isEnabled && !isActive && (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLanguage(lang.id);
                      }}
                      className="ml-1 p-0.5 rounded-md hover:bg-destructive/20 hover:text-destructive transition-colors"
                      title="Desativar"
                    >
                      <X className="h-3 w-3" />
                    </div>
                  )}
                  
                  {!isEnabled && (
                    <Plus className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* EDITOR AREA */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-[#080808] shadow-2xl">
          {/* Editor Header Decor */}
          <div className="flex items-center justify-between border-b border-border/50 bg-secondary/20 px-4 py-2">
            <div className="flex gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500/20" />
              <div className="h-2 w-2 rounded-full bg-amber-500/20" />
              <div className="h-2 w-2 rounded-full bg-emerald-500/20" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">
                Template Editor
              </span>
              <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border/50">
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Código Inicial
                </label>
              </div>
              <textarea
                value={challenge.templates?.[activeTab]?.initialCode || ""}
                onChange={(e) => updateTemplate(activeTab, "initialCode", e.target.value)}
                rows={10}
                className="w-full bg-transparent text-emerald-400 p-2 font-mono text-xs outline-none resize-none custom-scrollbar"
                placeholder={`// Escreve o código base para o candidato em ${activeTab}...`}
              />
            </div>
            
            <div className="p-4 space-y-3 bg-primary/5">
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Test Runner
                </label>
              </div>
              <textarea
                value={challenge.templates?.[activeTab]?.testRunner || ""}
                onChange={(e) => updateTemplate(activeTab, "testRunner", e.target.value)}
                rows={10}
                className="w-full bg-transparent text-amber-400 p-2 font-mono text-xs outline-none resize-none custom-scrollbar"
                placeholder={`// Implementa o runner de testes para ${activeTab}...`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Casos de Teste
            </label>
          </div>
          <button
            type="button"
            onClick={addTestCase}
            className="text-[10px] font-black text-primary hover:underline"
          >
            + Adicionar Caso
          </button>
        </div>
        <div className="grid gap-3">
          {(challenge.testCases || []).map((tc, tcIndex) => (
            <div
              key={tc.id}
              className="flex gap-3 items-center bg-background p-3 rounded-lg border border-border"
            >
              <div className="flex-1 grid grid-cols-2 gap-3">
                <TextInput
                  value={tc.description}
                  onChange={(v) => updateTestCase(tcIndex, v, "description")}
                  placeholder="O que este caso testa?"
                />
                <TextInput
                  value={tc.assertion}
                  onChange={(v) => updateTestCase(tcIndex, v, "assertion")}
                  placeholder="Afirmação (ex: returns [1])"
                  mono
                />
              </div>
              <button
                type="button"
                onClick={() => removeTestCase(tcIndex)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
