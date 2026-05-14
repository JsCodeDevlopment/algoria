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
    <section className="border-x border-b border-zinc-200 bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden flex flex-col gap-10 select-none">
      <div className="flex items-center justify-between border-b-2 border-zinc-900 dark:border-zinc-100 pb-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-zinc-100">
            DADOS DE EXECUÇÃO DINÂMICA
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 dark:bg-zinc-100">
              <span className="text-[10px] font-black uppercase tracking-tight text-zinc-100 dark:text-zinc-900">
                PASSO
              </span>
              <span className="font-mono text-sm font-black text-zinc-100 dark:text-zinc-900">
                {currentStepIndex !== -1
                  ? String(currentStepIndex + 1).padStart(3, "0")
                  : "000"}
              </span>
            </div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              DE {steps.length}
            </span>
          </div>
        </div>
      </div>

      {arrays.map((arr, arrIdx) => (
        <div key={arrIdx} className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-2 py-0.5 text-[10px] font-black uppercase">
              {arr.label}
            </span>
            <div className="h-[1px] flex-1 bg-zinc-100 dark:bg-zinc-800" />
          </div>
          <div className="flex flex-wrap gap-1">
            {arr.values.map((val, idx) => {
              const isHighlighted = arr.highlightIndices.includes(idx);
              const isInRange = arr.range
                ? idx >= arr.range[0] && idx <= arr.range[1]
                : false;

              return (
                <div key={idx} className="relative flex flex-col items-center">
                  <motion.div
                    layout
                    className={`flex h-12 w-12 items-center justify-center border-2 font-mono text-lg font-black transition-all ${
                      isHighlighted
                        ? "border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 scale-105 z-10"
                        : isInRange
                          ? "border-zinc-400 bg-zinc-50 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                          : "border-zinc-100 bg-white text-zinc-300 dark:border-zinc-800 dark:bg-zinc-950"
                    }`}
                  >
                    {val}
                  </motion.div>
                  <div className="mt-1 text-[8px] font-mono font-bold text-zinc-300">
                    #{idx}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {(scalars.length > 0 || mapEntries.length > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {scalars.map(([key, value]) => (
            <div
              key={key}
              className="flex flex-col border-2 border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20 p-3"
            >
              <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider mb-1">
                {key}
              </span>
              <span className="font-mono text-xl font-black text-zinc-900 dark:text-zinc-100">
                {value}
              </span>
            </div>
          ))}
          {mapEntries.map((entry, idx) => (
            <div
              key={idx}
              className="col-span-2 flex flex-col border-2 border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20 p-3"
            >
              <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider mb-1">
                MAP: {entry.key}
              </span>
              <span className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100 break-all">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {snapshot.caption && (
          <motion.div
            key={snapshot.caption}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 border-2 bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 dark:text-zinc-500 mb-1">
              LOG_DO_SISTEMA
            </p>
            <p className="text-lg font-black uppercase tracking-tight">
              {snapshot.caption}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
