"use client";

import { LevelTabs, LEVEL_DESCRIPTION } from "./explanation-tabs";
import { type ExplanationLevel } from "./use-player-store";

interface ExplanationHeaderProps {
  line: number;
  level: ExplanationLevel;
  setLevel: (l: ExplanationLevel) => void;
}

export function ExplanationHeader({
  line,
  level,
  setLevel,
}: ExplanationHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-border/30 bg-muted/20 px-4 py-2.5">
      <div className="flex items-center gap-3">
        <div className="bg-primary px-2 py-1 flex items-center justify-center shrink-0">
          <span className="font-mono text-[10px] font-black text-primary-foreground whitespace-nowrap">
            LINE {line}
          </span>
        </div>
        <span className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-[0.15em] hidden sm:inline">
          {LEVEL_DESCRIPTION[level]}
        </span>
      </div>
      <LevelTabs
        level={level}
        setLevel={setLevel}
        availability={{ 1: true, 2: true, 3: true }}
      />
    </header>
  );
}
