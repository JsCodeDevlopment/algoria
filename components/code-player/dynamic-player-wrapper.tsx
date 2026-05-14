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
    (...args: unknown[]) => {
      // 1. Prioridade para o código vindo do banco (Admin)
      if (props.simulatorCode) {
        try {
          // Criamos uma função que aceita argumentos variáveis
          const dynamicSim = new Function(
            "...args",
            `const simulate = ${props.simulatorCode};
             return typeof simulate === 'function' ? simulate(...args) : null;`
          );

          const trace = dynamicSim(...args);
          
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
        const trace = simulator(...args);
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
      {isBespoke && (
        <DynamicInputForm
          onRun={handleRun}
          onReset={handleReset}
          problemSlug={props.problemSlug}
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
