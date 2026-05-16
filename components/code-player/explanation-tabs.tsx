"use client";

import { cn } from "@/lib/utils";
import { type ExplanationLevel } from "./use-player-store";

export const LEVEL_LABEL: Record<ExplanationLevel, string> = {
  1: "Resumo",
  2: "Detalhado",
  3: "Deep dive",
};

export const LEVEL_DESCRIPTION: Record<ExplanationLevel, string> = {
  1: "Uma frase que fixa a ideia antes de veres o código correr.",
  2: "Passo a passo: o que muda no estado e porquê agora.",
  3: "Riscos, invariantes, custo e onde isto reaparece na prática.",
};

interface LevelTabsProps {
  level: ExplanationLevel;
  setLevel: (l: ExplanationLevel) => void;
  availability: Record<ExplanationLevel, boolean>;
}

export function LevelTabs({
  level,
  setLevel,
  availability,
}: LevelTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Nível de explicação"
      className="inline-flex bg-muted/30 border border-border/20 p-0.5"
    >
      {([1, 2, 3] as const).map((l) => {
        const active = level === l;
        const enabled = availability[l];
        return (
          <button
            key={l}
            role="tab"
            aria-selected={active}
            disabled={!enabled}
            onClick={() => enabled && setLevel(l)}
            className={cn(
              "px-2.5 py-1 font-mono text-[8px] font-bold uppercase tracking-wider transition-colors duration-200 whitespace-nowrap",
              active
                ? "bg-primary text-primary-foreground"
                : enabled
                  ? "text-muted-foreground/50 hover:text-foreground"
                  : "text-muted-foreground/20 cursor-not-allowed",
            )}
            title={`${LEVEL_LABEL[l]} (atalho ${l})`}
          >
            {LEVEL_LABEL[l]}
          </button>
        );
      })}
    </div>
  );
}
