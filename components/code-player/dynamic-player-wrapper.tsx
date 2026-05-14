"use client";

import { ExecutionTraceStep, LineAnnotation } from "@/lib/content/schemas";
import { HighlightedLine } from "@/lib/content/shiki";
import { getSimulator } from "@/lib/simulators";
import { useCallback, useState } from "react";
import { CodePlayer } from "./code-player";
import { DynamicInputForm } from "./dynamic-input-form";
import { hasBespokeVisualizer } from "./visualizers";

interface Props {
  lines: HighlightedLine[];
  annotations: LineAnnotation[];
  conceptTitles: Record<string, string>;
  readOnlyExplanationMd?: string;
  executionTrace: ExecutionTraceStep[];
  problemSlug: string;
  solutionSlug: string;
  autoPlay?: boolean;
  simulatorCode?: string;
}

export function DynamicPlayerWrapper(props: Props) {
  const [dynamicTrace, setDynamicTrace] = useState<
    ExecutionTraceStep[] | undefined
  >(undefined);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  const isBespoke = hasBespokeVisualizer(props.problemSlug);

  const handleRun = useCallback(
    (nums: number[], target: number) => {
      // 1. Prioridade para o código vindo do banco (Admin)
      if (props.simulatorCode) {
        try {
          const dynamicSim = new Function(
            "nums",
            "target",
            "const simulate = " + props.simulatorCode + ";\n" +
            "return typeof simulate === 'function' ? simulate(nums, target) : null;"
          );

          const trace = dynamicSim(nums, target);
          
          if (trace && Array.isArray(trace) && trace.length > 0) {
            setDynamicTrace(trace);
            setShouldAutoPlay(true);
            return;
          }
        } catch (err) {
          console.error("Erro ao executar simulador dinâmico:", err);
        }
      }

      // 2. Fallback para simuladores locais (legado)
      const simulator = getSimulator(props.problemSlug, props.solutionSlug);
      if (simulator) {
        const trace = simulator(nums, target);
        if (trace.length > 0) {
          setDynamicTrace(trace);
          setShouldAutoPlay(true);
        }
      }
    },
    [props.problemSlug, props.solutionSlug, props.simulatorCode],
  );

  const handleReset = useCallback(() => {
    setDynamicTrace(undefined);
    setShouldAutoPlay(false);
  }, []);

  return (
    <div className="flex flex-col">
      {isBespoke && props.problemSlug === "two-sum" && (
        <DynamicInputForm
          onRun={handleRun}
          onReset={handleReset}
          // Valores iniciais do Two Sum padrão
          defaultNums="2, 7, 11, 15"
          defaultTarget={9}
        />
      )}

      <CodePlayer
        {...props}
        executionTrace={dynamicTrace || props.executionTrace}
        autoPlay={shouldAutoPlay}
      />
    </div>
  );
}
