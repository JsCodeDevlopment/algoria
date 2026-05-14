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

export function TwoSumVisualizer({ steps, solutionSlug }: Props) {
  const currentLine = usePlayerStore((s) => s.currentLine);
  const currentStepIndex = usePlayerStore((s) => s.currentStepIndex);

  const snapshot = useMemo(() => {
    if (currentStepIndex !== -1 && steps[currentStepIndex]) {
      return steps[currentStepIndex].snapshot;
    }
    return resolveExecutionSnapshot(currentLine, steps);
  }, [currentLine, currentStepIndex, steps]);

  const foundAtStr = snapshot?.scalars?.found_at;
  const foundAtIndices = useMemo(() => {
    if (!foundAtStr) return [];
    return foundAtStr
      .replace(/[\[\]]/g, "")
      .split(",")
      .map((s) => parseInt(s.trim(), 10));
  }, [foundAtStr]);

  if (!snapshot) {
    return (
      <section className="border border-dashed border-zinc-200 bg-zinc-50 p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
        Motor Offline / Aguardando dados de execução...
      </section>
    );
  }

  const numsArray = snapshot.arrays?.find((a) => a.label === "nums");
  const nums = numsArray ? (numsArray.values as number[]) : [];

  const iStr = snapshot.scalars?.i;
  const jStr = snapshot.scalars?.j;
  const iIdx = iStr !== undefined ? parseInt(iStr, 10) : null;
  const jIdx = jStr !== undefined ? parseInt(jStr, 10) : null;

  const target = snapshot.scalars?.target;
  const val = snapshot.scalars?.val;
  const complement = snapshot.scalars?.complement;
  const currentSum = snapshot.scalars?.current_sum;

  const result = snapshot.scalars?.result;
  const mapEntries = snapshot.mapEntries || [];

  const isFound =
    foundAtStr !== undefined ||
    result !== undefined ||
    (currentSum !== undefined && currentSum === target);

  return (
    <section className="flex flex-col gap-10 border-x border-b border-zinc-200 bg-white p-10 select-none dark:border-zinc-800 dark:bg-zinc-950 shadow-sm">
      {/* Header Area */}
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

        {target !== undefined && (
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
              Target Value
            </span>
            <div
              className={`flex min-w-[100px] items-center justify-center border-2 px-6 py-3 transition-all duration-500 ${
                isFound
                  ? "bg-emerald-500 border-emerald-500 text-white shadow-xl scale-105"
                  : "bg-zinc-50 border-zinc-900 dark:bg-zinc-900 dark:border-zinc-100"
              }`}
            >
              <span className="font-mono text-3xl font-black">{target}</span>
            </div>
          </div>
        )}
      </div>

      {/* Array Visualization */}
      <div className="relative flex flex-col items-center py-6">
        <div className="flex flex-wrap justify-center gap-2.5">
          {nums.map((num, idx) => {
            const isI = idx === iIdx;
            const isJ = idx === jIdx;
            const isSolved = foundAtIndices.includes(idx);

            return (
              <div key={idx} className="relative flex flex-col items-center">
                <motion.div
                  layout
                  className={`flex h-16 w-16 items-center justify-center border-2 font-mono text-xl font-black transition-all duration-300 ${
                    isSolved
                      ? "border-emerald-500 bg-emerald-500 text-white z-10 shadow-[8px_8px_0_0_rgba(16,185,129,0.15)]"
                      : isI
                        ? "border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 scale-110 z-10 shadow-lg"
                        : isJ
                          ? "border-orange-500 bg-orange-50 text-orange-500 dark:bg-orange-900/20 dark:text-orange-400 scale-110 z-10 shadow-lg"
                          : "border-zinc-100 bg-white text-zinc-200 dark:border-zinc-800 dark:bg-zinc-950"
                  }`}
                >
                  {num}
                </motion.div>

                <div className="mt-2 font-mono text-[9px] font-bold text-zinc-300">
                  #{idx}
                </div>

                <AnimatePresence>
                  {isI && (
                    <motion.div
                      layoutId="pointer-i"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="absolute -top-10 flex flex-col items-center"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                      <div className="bg-blue-600 px-2 py-0.5 shadow-sm">
                        <span className="font-mono text-[10px] font-black text-white">I</span>
                      </div>
                      <div className="h-2 w-[2px] bg-blue-600" />
                    </motion.div>
                  )}
                  {isJ && (
                    <motion.div
                      layoutId="pointer-j"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="absolute -top-10 flex flex-col items-center"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                      <div className="bg-orange-500 px-2 py-0.5 shadow-sm">
                        <span className="font-mono text-[10px] font-black text-white">J</span>
                      </div>
                      <div className="h-2 w-[2px] bg-orange-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Logic Stage */}
      <div
        className={`relative overflow-hidden border-2 p-10 transition-all duration-700 ${
          isFound
            ? "bg-emerald-50 border-emerald-500/40 dark:bg-emerald-950/20"
            : "bg-zinc-50 border-zinc-100 dark:bg-zinc-900/40 dark:border-zinc-900"
        }`}
      >
        <AnimatePresence mode="wait">
          {complement !== undefined && val !== undefined ? (
            <motion.div
              key="hash-logic"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-8 bg-zinc-200 dark:bg-zinc-800" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">
                  Lógica de Busca
                </span>
                <div className="h-[1px] w-8 bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="flex items-center gap-12">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-zinc-400">Target</span>
                  <span className="font-mono text-4xl font-black">{target}</span>
                </div>
                <span className="text-3xl font-light text-zinc-200">−</span>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-blue-600/60">Atual</span>
                  <span className="font-mono text-4xl font-black text-blue-600">{val}</span>
                </div>
                <span className="text-3xl font-light text-zinc-200">=</span>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-orange-500/60">Complemento</span>
                  <motion.span
                    key={complement}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`font-mono text-6xl font-black ${isFound ? "text-emerald-500" : "text-orange-500"}`}
                  >
                    {complement}
                  </motion.span>
                </div>
              </div>
            </motion.div>
          ) : currentSum !== undefined ? (
            <motion.div
              key="brute-logic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-8 bg-zinc-200 dark:bg-zinc-800" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">
                  Verificação de Soma
                </span>
                <div className="h-[1px] w-8 bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="flex items-center gap-12">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-blue-600/60">num[i]</span>
                  <span className="font-mono text-4xl font-black text-blue-600">{nums[iIdx!]}</span>
                </div>
                <span className="text-3xl font-light text-zinc-200">+</span>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-orange-500/60">num[j]</span>
                  <span className="font-mono text-4xl font-black text-orange-500">{nums[jIdx!]}</span>
                </div>
                <span className="text-3xl font-light text-zinc-200">=</span>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-zinc-400">Total</span>
                  <motion.span
                    key={currentSum}
                    className={`font-mono text-6xl font-black ${isFound ? "text-emerald-500" : "text-zinc-900 dark:text-white"}`}
                  >
                    {currentSum}
                  </motion.span>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Memory Area */}
      {(mapEntries.length > 0 || complement !== undefined) && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-900">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              Memória (Hash Map)
            </h4>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-zinc-200" />
              <span className="font-mono text-[9px] font-bold text-zinc-300 uppercase">
                {mapEntries.length} entradas ativas
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 min-h-[60px]">
            <AnimatePresence mode="popLayout">
              {mapEntries.map((entry) => {
                const isTargeted = String(entry.key) === String(complement) && isFound;
                return (
                  <motion.div
                    key={entry.key}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex items-center border-2 px-4 py-3 transition-all duration-300 ${
                      isTargeted
                        ? "border-emerald-500 bg-emerald-500 text-white z-10 shadow-xl scale-110"
                        : "border-zinc-100 bg-zinc-50 dark:border-zinc-900 dark:bg-zinc-900/30"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase opacity-40 mb-0.5">Key</span>
                      <span className="font-mono text-base font-black">{entry.key}</span>
                    </div>
                    <div className="mx-4 h-6 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase opacity-40 mb-0.5">Value</span>
                      <span className="font-mono text-base font-bold text-zinc-400">{entry.value}</span>
                    </div>
                  </motion.div>
                );
              })}
              {mapEntries.length === 0 && (
                <div className="flex w-full items-center justify-center border-2 border-dashed border-zinc-100 py-10 dark:border-zinc-900">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-200">
                    Memória Vazia
                  </span>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* System Status */}
      <AnimatePresence mode="wait">
        {snapshot.caption && (
          <motion.div
            key={snapshot.caption}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-8 border-l-8 transition-all duration-500 ${
              isFound
                ? "bg-emerald-500 border-emerald-600 text-white shadow-lg"
                : "bg-zinc-900 border-zinc-700 text-white"
            }`}
          >
            <div className="flex flex-col gap-1">
              <span className={`text-[9px] font-black uppercase tracking-[0.4em] ${isFound ? 'text-emerald-200' : 'text-zinc-500'}`}>
                Status do Sistema
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

