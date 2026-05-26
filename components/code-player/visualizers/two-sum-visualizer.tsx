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

export function TwoSumVisualizer({ steps }: Props) {
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
      <section className="border border-dashed border-border bg-muted/30 p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
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

  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <section className="border border-border/50 bg-background/80 backdrop-blur-md overflow-hidden select-none">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/30 bg-muted/20">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">
            Execution Monitor
          </span>
        </div>
        <div className="flex items-center gap-4">
          {target !== undefined && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground/40">
                Target
              </span>
              <div
                className={`px-3 py-1 font-mono text-sm font-black transition-all duration-500 ${
                  isFound
                    ? "bg-green-500 text-white"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {target}
              </div>
            </div>
          )}
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
      </div>

      <div className="h-[2px] bg-border/20">
        <motion.div
          className="h-full bg-primary/60"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      <div className="px-5 py-6">
        <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-muted-foreground/40 mb-4">
          Array
        </p>
        <div className="flex flex-wrap justify-center gap-2.5">
          {nums.map((num, idx) => {
            const isI = idx === iIdx;
            const isJ = idx === jIdx;
            const isSolved = foundAtIndices.includes(idx);

            return (
              <div key={idx} className="relative flex flex-col items-center">
                <AnimatePresence>
                  {isI && (
                    <motion.div
                      layoutId="pointer-i"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="absolute -top-9 flex flex-col items-center"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    >
                      <div className="bg-blue-500 px-1.5 py-0.5">
                        <span className="font-mono text-[9px] font-black text-white">
                          i
                        </span>
                      </div>
                      <div className="h-1.5 w-[2px] bg-blue-500" />
                    </motion.div>
                  )}
                  {isJ && (
                    <motion.div
                      layoutId="pointer-j"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="absolute -top-9 flex flex-col items-center"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    >
                      <div className="bg-orange-500 px-1.5 py-0.5">
                        <span className="font-mono text-[9px] font-black text-white">
                          j
                        </span>
                      </div>
                      <div className="h-1.5 w-[2px] bg-orange-500" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  layout
                  className={`flex h-14 w-14 items-center justify-center border font-mono text-lg font-black transition-all duration-300 ${
                    isSolved
                      ? "border-green-500 bg-green-500 text-white z-10 shadow-lg"
                      : isI
                        ? "border-blue-500 bg-blue-500/10 text-blue-500 scale-110 z-10"
                        : isJ
                          ? "border-orange-500 bg-orange-500/10 text-orange-500 scale-110 z-10"
                          : "border-border/40 bg-muted/20 text-muted-foreground/30"
                  }`}
                >
                  {num}
                </motion.div>
                <div className="mt-1.5 font-mono text-[8px] font-bold text-muted-foreground/25">
                  #{idx}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={`mx-5 border p-6 transition-all duration-500 ${
          isFound
            ? "bg-green-500/5 border-green-500/30"
            : "bg-muted/10 border-border/30"
        }`}
      >
        <AnimatePresence mode="wait">
          {complement !== undefined && val !== undefined ? (
            <motion.div
              key="hash-logic"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="flex flex-col items-center gap-6"
            >
              <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-muted-foreground/40">
                Lógica de Busca
              </p>
              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center gap-1">
                  <span className="font-mono text-[9px] text-muted-foreground/50">
                    Target
                  </span>
                  <span className="font-mono text-3xl font-black text-foreground">
                    {target}
                  </span>
                </div>
                <span className="text-2xl font-light text-muted-foreground/20">
                  −
                </span>
                <div className="flex flex-col items-center gap-1">
                  <span className="font-mono text-[9px] text-blue-500/60">
                    Atual
                  </span>
                  <span className="font-mono text-3xl font-black text-blue-500">
                    {val}
                  </span>
                </div>
                <span className="text-2xl font-light text-muted-foreground/20">
                  =
                </span>
                <div className="flex flex-col items-center gap-1">
                  <span className="font-mono text-[9px] text-orange-500/60">
                    Complemento
                  </span>
                  <motion.span
                    key={complement}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`font-mono text-4xl font-black ${isFound ? "text-green-500" : "text-orange-500"}`}
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
              className="flex flex-col items-center gap-6"
            >
              <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-muted-foreground/40">
                Verificação de Soma
              </p>
              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center gap-1">
                  <span className="font-mono text-[9px] text-blue-500/60">
                    nums[i]
                  </span>
                  <span className="font-mono text-3xl font-black text-blue-500">
                    {nums[iIdx!]}
                  </span>
                </div>
                <span className="text-2xl font-light text-muted-foreground/20">
                  +
                </span>
                <div className="flex flex-col items-center gap-1">
                  <span className="font-mono text-[9px] text-orange-500/60">
                    nums[j]
                  </span>
                  <span className="font-mono text-3xl font-black text-orange-500">
                    {nums[jIdx!]}
                  </span>
                </div>
                <span className="text-2xl font-light text-muted-foreground/20">
                  =
                </span>
                <div className="flex flex-col items-center gap-1">
                  <span className="font-mono text-[9px] text-muted-foreground/50">
                    Total
                  </span>
                  <motion.span
                    key={currentSum}
                    className={`font-mono text-4xl font-black ${isFound ? "text-green-500" : "text-foreground"}`}
                  >
                    {currentSum}
                  </motion.span>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {(mapEntries.length > 0 || complement !== undefined) && (
        <div className="border-t border-border/30 bg-muted/10">
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-muted-foreground/40">
                Hash Map
              </p>
              <span className="font-mono text-[9px] text-muted-foreground/30">
                {mapEntries.length}{" "}
                {mapEntries.length === 1 ? "entrada" : "entradas"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[44px] items-center">
              <AnimatePresence mode="popLayout">
                {mapEntries.map((entry) => {
                  const isTargeted =
                    String(entry.key) === String(complement) && isFound;
                  return (
                    <motion.div
                      key={entry.key}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`inline-flex items-center gap-0 border overflow-hidden transition-all duration-300 ${
                        isTargeted
                          ? "border-green-500 bg-green-500 text-white scale-110 z-10 shadow-lg"
                          : "border-primary/20"
                      }`}
                    >
                      <span
                        className={`px-3 py-1.5 font-mono text-xs font-semibold ${
                          isTargeted
                            ? "bg-green-600 text-white"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {entry.key}
                      </span>
                      <span
                        className={`px-3 py-1.5 font-mono text-xs ${
                          isTargeted
                            ? "text-green-100"
                            : "text-muted-foreground"
                        }`}
                      >
                        →{entry.value}
                      </span>
                    </motion.div>
                  );
                })}
                {mapEntries.length === 0 && (
                  <span className="font-mono text-[10px] text-muted-foreground/30 italic">
                    vazio
                  </span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {snapshot.caption && (
          <motion.div
            key={snapshot.caption}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`px-5 py-4 border-t transition-all duration-500 ${
              isFound
                ? "bg-green-500 border-green-600 text-white"
                : "bg-muted/20 border-border/30"
            }`}
          >
            <p
              className={`font-mono text-[8px] uppercase tracking-[0.3em] mb-1 ${
                isFound ? "text-green-200" : "text-muted-foreground/40"
              }`}
            >
              Status
            </p>
            <p
              className={`text-sm font-bold leading-tight ${
                isFound ? "text-white" : "text-foreground/80"
              }`}
            >
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
