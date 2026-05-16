"use client";

import {
  ChevronLeft,
  ChevronRight,
  FastForward,
  Pause,
  Play,
} from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { usePlayerStore } from "./use-player-store";

const SPEED_OPTIONS = [
  { label: "0.5×", ms: 5000 },
  { label: "1×", ms: 2500 },
  { label: "2×", ms: 1200 },
  { label: "4×", ms: 600 },
];

export function PlayerControls() {
  const currentLine = usePlayerStore((s) => s.currentLine);
  const annotatedLines = usePlayerStore((s) => s.annotatedLines);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const speedMs = usePlayerStore((s) => s.speedMs);
  const prev = usePlayerStore((s) => s.prev);
  const next = usePlayerStore((s) => s.next);
  const togglePlaying = usePlayerStore((s) => s.togglePlaying);
  const setSpeed = usePlayerStore((s) => s.setSpeed);
  const traceSteps = usePlayerStore((s) => s.traceSteps);
  const currentStepIndex = usePlayerStore((s) => s.currentStepIndex);

  const isTraceMode = traceSteps.length > 0 && currentStepIndex !== -1;
  const idx = isTraceMode
    ? currentStepIndex
    : annotatedLines.indexOf(currentLine);
  const total = isTraceMode ? traceSteps.length : annotatedLines.length;

  const progressPct = total > 0 ? ((idx + 1) / total) * 100 : 0;

  useEffect(() => {
    if (!isPlaying) return;
    const t = setTimeout(() => next(), speedMs);
    return () => clearTimeout(t);
  }, [isPlaying, speedMs, currentLine, currentStepIndex, next]);

  return (
    <div className="border border-border/50 bg-background/80 backdrop-blur-md overflow-hidden">
      <div className="h-[2px] bg-border/20">
        <div
          className="h-full bg-primary/60 transition-[width] duration-300"
          style={{ width: `${progressPct}%` }}
          aria-hidden
        />
      </div>

      <div className="flex items-center gap-3 px-4 py-2.5">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-none h-8 w-8 hover:bg-primary/10"
          onClick={prev}
          disabled={idx <= 0}
          aria-label="Linha anterior (←)"
          title="Linha anterior (←)"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          className="rounded-none h-8 w-8 bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={togglePlaying}
          disabled={idx >= total - 1 && !isPlaying}
          aria-label={isPlaying ? "Pausar (espaço)" : "Reproduzir (espaço)"}
          title={isPlaying ? "Pausar (espaço)" : "Reproduzir (espaço)"}
        >
          {isPlaying ? (
            <Pause className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-none h-8 w-8 hover:bg-primary/10"
          onClick={next}
          disabled={idx >= total - 1}
          aria-label="Próxima linha (→)"
          title="Próxima linha (→)"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div className="flex-1 min-w-[4rem] flex items-center gap-3">
          <div className="bg-primary px-2 py-0.5">
            <span className="font-mono text-[10px] font-black text-primary-foreground tabular-nums">
              STEP {String(idx + 1).padStart(3, "0")} /{" "}
              {String(total).padStart(3, "0")}
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1">
          <FastForward
            className="h-3.5 w-3.5 text-muted-foreground/30 mr-1"
            aria-hidden
          />
          {SPEED_OPTIONS.map((opt) => (
            <button
              key={opt.ms}
              onClick={() => setSpeed(opt.ms)}
              className={cn(
                "font-mono text-[9px] font-bold px-2 py-1 transition-colors duration-200 uppercase tracking-wider",
                speedMs === opt.ms
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground/40 hover:text-foreground hover:bg-muted/30",
              )}
              aria-label={`Velocidade ${opt.label}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
