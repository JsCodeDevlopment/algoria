"use client";

import { resolveExecutionSnapshot } from "@/lib/content/resolve-execution-snapshot";
import type { ExecutionTraceStep } from "@/lib/content/schemas";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import { usePlayerStore } from "../use-player-store";

interface Props {
  steps: ExecutionTraceStep[];
  solutionSlug?: string;
}

export function GenericVisualizer({ steps, solutionSlug }: Props) {
  const currentLine = usePlayerStore((s) => s.currentLine);
  const currentStepIndex = usePlayerStore((s) => s.currentStepIndex);

  const snapshot = useMemo(() => {
    if (currentStepIndex !== -1 && steps[currentStepIndex]) {
      return steps[currentStepIndex].snapshot;
    }
    return resolveExecutionSnapshot(currentLine, steps);
  }, [currentLine, currentStepIndex, steps]);

  if (!snapshot) {
    return (
      <section className="border border-dashed border-border bg-muted/30 p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        Motor Offline / Aguardando dados de execução...
      </section>
    );
  }

  const arrays = snapshot.arrays || [];
  const scalars = Object.entries(snapshot.scalars || {});
  const mapEntries = snapshot.mapEntries || [];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <section className="border border-border/50 bg-background/80 backdrop-blur-md overflow-hidden select-none">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/30 bg-muted/20">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">
            Execution Monitor
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-primary px-2.5 py-0.5">
            <span className="font-mono text-xs font-black text-primary-foreground">
              {String(currentStepIndex + 1).padStart(2, "0")}
            </span>
          </div>
          <span className="font-mono text-[9px] text-muted-foreground/40">
            /{steps.length}
          </span>
        </div>
      </div>

      <div className="h-[2px] bg-border/20">
        <motion.div
          className="h-full bg-primary/60"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {arrays.map((arr, arrIdx) => (
        <div key={arrIdx} className="px-5 py-5 border-b border-border/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 px-2.5 py-0.5">
              <span className="font-mono text-[10px] font-semibold text-primary">
                {arr.label}
              </span>
            </div>
            <div className="h-[1px] flex-1 bg-border/30" />
            <span className="font-mono text-[9px] text-muted-foreground/30">
              {arr.values.length} elementos
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {arr.values.map((val, idx) => {
              const isHighlighted = (arr.highlightIndices || []).includes(idx);
              const isInRange = arr.range
                ? idx >= arr.range[0] && idx <= arr.range[1]
                : false;

              return (
                <div key={idx} className="relative flex flex-col items-center">
                  <motion.div
                    layout
                    className={`flex h-12 min-w-[48px] px-3 items-center justify-center border font-mono ${String(val).length > 4 ? "text-xs" : "text-base"} font-black transition-all duration-300 ${
                      isHighlighted
                        ? "border-primary bg-primary/10 text-primary scale-105 z-10"
                        : isInRange
                          ? "border-muted-foreground/40 bg-muted/30 text-foreground"
                          : "border-border/30 bg-muted/10 text-muted-foreground/30"
                    }`}
                  >
                    {val}
                  </motion.div>
                  <div className="mt-1.5 font-mono text-[7px] font-bold text-muted-foreground/25">
                    #{idx}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {(scalars.length > 0 || mapEntries.length > 0) && (
        <div className="border-t border-border/30 bg-muted/10">
          {scalars.length > 0 && (
            <div className="px-5 py-4 border-b border-border/20">
              <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-muted-foreground/40 mb-3">
                Variáveis
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                <AnimatePresence mode="popLayout">
                  {scalars.map(([key, value]) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-1.5"
                    >
                      <span className="font-mono text-[10px] text-muted-foreground/60">
                        {key}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground/30">
                        =
                      </span>
                      <span className="font-mono text-[10px] font-semibold text-primary">
                        {value}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {mapEntries.length > 0 && (
            <div className="px-5 py-4">
              <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-muted-foreground/40 mb-3">
                Hash Map
              </p>
              <div className="flex flex-wrap gap-2 min-h-[36px] items-center">
                <AnimatePresence mode="popLayout">
                  {mapEntries.map((entry) => (
                    <motion.div
                      key={entry.key}
                      layout
                      initial={{ opacity: 0, scale: 0, width: 0 }}
                      animate={{ opacity: 1, scale: 1, width: "auto" }}
                      className="inline-flex items-center gap-0 border border-primary/20 overflow-hidden"
                    >
                      <span className="bg-primary/10 px-2.5 py-1 font-mono text-[10px] font-semibold text-primary">
                        {entry.key}
                      </span>
                      <span className="px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
                        →{entry.value}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {snapshot.caption && (
          <motion.div
            key={snapshot.caption}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-5 py-4 border-t border-border/30 bg-muted/20"
          >
            <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-muted-foreground/40 mb-1">
              Status
            </p>
            <p className="text-sm font-bold leading-tight text-foreground/80">
              {snapshot.caption}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between px-5 py-2.5 border-t border-border/20 bg-muted/5">
        <span className="font-mono text-[9px] text-muted-foreground/40">
          Passo {currentStepIndex + 1}/{steps.length}
        </span>
        <div className="flex gap-1">
          {steps.slice(0, 20).map((_, i) => (
            <div
              key={i}
              className={`h-1 w-1 rounded-full transition-colors duration-300 ${
                i === currentStepIndex
                  ? "bg-primary"
                  : i < currentStepIndex
                    ? "bg-primary/30"
                    : "bg-border/40"
              }`}
            />
          ))}
          {steps.length > 20 && (
            <span className="font-mono text-[7px] text-muted-foreground/30 ml-1">
              +{steps.length - 20}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
