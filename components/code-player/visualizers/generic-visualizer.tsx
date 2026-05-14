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
      <section className="border border-dashed border-zinc-200 bg-zinc-50 p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
        Motor Offline / Aguardando dados de execução...
      </section>
    );
  }

  const arrays = snapshot.arrays || [];
  const scalars = Object.entries(snapshot.scalars || {});
  const mapEntries = snapshot.mapEntries || [];

  return (
    <section className="flex flex-col gap-10 border-x border-b border-zinc-200 bg-white p-10 select-none dark:border-zinc-800 dark:bg-zinc-950 shadow-sm">
      {/* Header with Step Counter */}
      <div className="flex items-center justify-between border-b-2 border-zinc-900 pb-8 dark:border-zinc-100">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
              Execution Monitor
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-zinc-900 px-4 py-1.5 dark:bg-white">
              <span className="font-mono text-base font-black text-white dark:text-zinc-900">
                {String(currentStepIndex + 1).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Passo de {steps.length}
            </span>
          </div>
        </div>
      </div>

      {/* Arrays Section */}
      {arrays.map((arr, arrIdx) => (
        <div key={arrIdx} className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <span className="bg-zinc-900 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white dark:bg-zinc-100 dark:text-zinc-900">
              {arr.label}
            </span>
            <div className="h-[1px] flex-1 bg-zinc-100 dark:bg-zinc-800" />
            <span className="font-mono text-[9px] font-bold text-zinc-300 uppercase">
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
                    className={`flex h-14 min-w-[56px] px-4 items-center justify-center border-2 font-mono ${String(val).length > 4 ? "text-xs" : "text-lg"} font-black transition-all duration-300 ${
                      isHighlighted
                        ? "border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 scale-105 z-10 shadow-lg"
                        : isInRange
                          ? "border-zinc-400 bg-zinc-50 text-zinc-900 dark:border-zinc-500 dark:bg-zinc-900 dark:text-zinc-100"
                          : "border-zinc-100 bg-white text-zinc-200 dark:border-zinc-800 dark:bg-zinc-950"
                    }`}
                  >
                    {val}
                  </motion.div>
                  <div className="mt-1.5 font-mono text-[8px] font-bold text-zinc-300">
                    #{idx}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Scalars & Map Section */}
      {(scalars.length > 0 || mapEntries.length > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-zinc-100 pt-8 dark:border-zinc-900">
          {scalars.map(([key, value]) => (
            <div
              key={key}
              className="flex flex-col border-2 border-zinc-100 bg-zinc-50/30 p-4 transition-all hover:border-zinc-200 dark:border-zinc-900 dark:bg-zinc-900/10"
            >
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                {key}
              </span>
              <span className="font-mono text-2xl font-black text-zinc-900 dark:text-zinc-100">
                {value}
              </span>
            </div>
          ))}
          {mapEntries.map((entry, idx) => (
            <div
              key={idx}
              className="col-span-2 flex flex-col border-2 border-zinc-100 bg-zinc-50/30 p-4 dark:border-zinc-900 dark:bg-zinc-900/10"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                  MAP ENTRY
                </span>
                <span className="text-[9px] font-mono font-bold text-zinc-300 uppercase">
                  KEY: {entry.key}
                </span>
              </div>
              <span className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100 break-all leading-relaxed">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Status Log */}
      <AnimatePresence mode="wait">
        {snapshot.caption && (
          <motion.div
            key={snapshot.caption}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-8 border-l-8 bg-zinc-900 border-zinc-700 text-white dark:bg-white dark:border-zinc-200 dark:text-zinc-900 shadow-xl"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-1">
                Log do Sistema
              </span>
              <p className="text-xl font-black uppercase tracking-tight leading-tight">
                {snapshot.caption}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
