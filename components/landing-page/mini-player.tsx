"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

const CODE_LINES = [
  { indent: 0, text: "function twoSum(nums, target) {" },
  { indent: 1, text: "const seen = new Map();" },
  { indent: 1, text: "for (let i = 0; i < nums.length; i++) {" },
  { indent: 2, text: "const comp = target - nums[i];" },
  { indent: 2, text: "if (seen.has(comp))" },
  { indent: 3, text: "return [seen.get(comp), i];" },
  { indent: 2, text: "seen.set(nums[i], i);" },
  { indent: 1, text: "}" },
  { indent: 0, text: "}" },
];

interface TraceStep {
  line: number;
  vars: Record<string, string>;
  annotation: string;
  annotationDetail?: string;
  mapState: [string, string][];
  isResult?: boolean;
}

const TRACE: TraceStep[] = [
  {
    line: 0,
    vars: { nums: "[2, 7, 11, 15]", target: "9" },
    annotation: "Recebemos o array e o target",
    mapState: [],
  },
  {
    line: 1,
    vars: { nums: "[2, 7, 11, 15]", target: "9" },
    annotation: "Map vazio para guardar valores já vistos",
    mapState: [],
  },
  {
    line: 2,
    vars: { i: "0", "nums[i]": "2" },
    annotation: "Início do loop — i = 0",
    mapState: [],
  },
  {
    line: 3,
    vars: { i: "0", "nums[i]": "2", comp: "7" },
    annotation: "Precisamos encontrar o 7 no Map",
    annotationDetail: "target(9) - nums[0](2) = 7",
    mapState: [],
  },
  {
    line: 4,
    vars: { i: "0", comp: "7", "seen.has(7)": "false" },
    annotation: "7 ainda não foi visto — seguimos",
    mapState: [],
  },
  {
    line: 6,
    vars: { i: "0", "nums[i]": "2" },
    annotation: "Guardamos: valor 2 está no índice 0",
    mapState: [["2", "0"]],
  },
  {
    line: 2,
    vars: { i: "1", "nums[i]": "7" },
    annotation: "Próxima iteração — i = 1",
    mapState: [["2", "0"]],
  },
  {
    line: 3,
    vars: { i: "1", "nums[i]": "7", comp: "2" },
    annotation: "Precisamos encontrar o 2 no Map",
    annotationDetail: "target(1)(7) = 2",
    mapState: [["2", "0"]],
  },
  {
    line: 4,
    vars: { i: "1", comp: "2", "seen.has(2)": "true ✓" },
    annotation: "O 2 já foi guardado! Encontrámos o par",
    mapState: [["2", "0"]],
  },
  {
    line: 5,
    vars: { resultado: "[0, 1]" },
    annotation: "Par encontrado nos índices 0 e 1",
    annotationDetail: "nums[0]=2 + nums[1]=7 = 9 ✓",
    mapState: [["2", "0"]],
    isResult: true,
  },
];

export function MiniPlayer() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const advance = useCallback(() => {
    setStep((s) => (s + 1) % TRACE.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const ms = TRACE[step]?.isResult ? 3000 : 1800;
    const timer = setTimeout(advance, ms);
    return () => clearTimeout(timer);
  }, [step, isPaused, advance]);

  const current = TRACE[step];
  const progress = ((step + 1) / TRACE.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
      className="relative w-full max-w-[430px] select-none"
    >
      <div className="absolute -inset-6 bg-primary/[0.03] blur-3xl rounded-full pointer-events-none" />

      <div className="relative border border-border/50 bg-background/80 backdrop-blur-md overflow-hidden h-[540px] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-muted/20">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-red-400/60" />
            <div className="h-2 w-2 rounded-full bg-yellow-400/60" />
            <div className="h-2 w-2 rounded-full bg-green-400/60" />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">
            two-sum.ts · Algoria Player
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="font-mono text-[9px] uppercase tracking-wider text-primary/60 hover:text-primary transition-colors pointer-events-auto"
            >
              {isPaused ? "▶ play" : "⏸ pause"}
            </button>
          </div>
        </div>

        <div className="h-[2px] bg-border/20">
          <motion.div
            className="h-full bg-primary/60"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>

        <div className="px-4 py-4 space-y-0 flex-1 overflow-hidden">
          {CODE_LINES.map((line, i) => {
            const isActive = current.line === i;
            return (
              <div
                key={i}
                className={`
                  relative flex items-center gap-3 py-[3px] -mx-4 px-4
                  transition-colors duration-300
                  ${isActive ? "bg-primary/[0.08]" : ""}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="line-indicator"
                    className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span
                  className={`w-4 text-right font-mono text-[10px] transition-colors duration-300 ${
                    isActive ? "text-primary/80" : "text-muted-foreground/25"
                  }`}
                >
                  {i + 1}
                </span>
                <span
                  className={`font-mono text-[11px] leading-relaxed transition-colors duration-300 ${
                    isActive ? "text-foreground" : "text-muted-foreground/50"
                  }`}
                  style={{ paddingLeft: `${line.indent * 14}px` }}
                >
                  {line.text}
                </span>
              </div>
            );
          })}
        </div>

        <div className="border-t border-border/30 bg-muted/10">
          <div className="px-4 py-3 border-b border-border/20">
            <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-muted-foreground/40 mb-2">
              Variáveis
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 min-h-[40px] items-start">
              <AnimatePresence mode="popLayout">
                {Object.entries(current.vars).map(([k, v]) => (
                  <motion.div
                    key={k}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1"
                  >
                    <span className="font-mono text-[10px] text-muted-foreground/60">
                      {k}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground/30">
                      =
                    </span>
                    <span
                      className={`font-mono text-[10px] font-semibold ${
                        current.isResult && k === "resultado"
                          ? "text-green-500"
                          : v.includes("true")
                            ? "text-green-500"
                            : v.includes("false")
                              ? "text-orange-400"
                              : "text-primary"
                      }`}
                    >
                      {v}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="px-4 py-3 border-b border-border/20">
            <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-muted-foreground/40 mb-2">
              Hash Map
            </p>
            <div className="flex gap-2 min-h-[44px] items-center">
              {current.mapState.length === 0 ? (
                <span className="font-mono text-[10px] text-muted-foreground/30 italic">
                  vazio
                </span>
              ) : (
                <AnimatePresence>
                  {current.mapState.map(([key, val]) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, scale: 0, width: 0 }}
                      animate={{ opacity: 1, scale: 1, width: "auto" }}
                      className="inline-flex items-center gap-0 border border-primary/20 overflow-hidden"
                    >
                      <span className="bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
                        {key}
                      </span>
                      <span className="px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                        →{val}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          <div className="px-4 py-3 min-h-[68px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <p
                  className={`text-[11px] font-medium leading-relaxed ${
                    current.isResult ? "text-green-500" : "text-foreground/80"
                  }`}
                >
                  {current.annotation}
                </p>
                {current.annotationDetail && (
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground/50">
                    {current.annotationDetail}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-border/20 bg-muted/5">
          <span className="font-mono text-[9px] text-muted-foreground/40">
            Passo {step + 1}/{TRACE.length}
          </span>
          <div className="flex gap-1">
            {TRACE.map((_, i) => (
              <div
                key={i}
                className={`h-1 w-1 rounded-full transition-colors duration-300 ${
                  i === step
                    ? "bg-primary"
                    : i < step
                      ? "bg-primary/30"
                      : "bg-border/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
