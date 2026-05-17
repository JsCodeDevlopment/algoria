"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Example } from "@/lib/content/schemas";
import { Play, RotateCcw } from "lucide-react";
import { useState } from "react";

interface Props {
  onRun: (...args: unknown[]) => void;
  onReset: () => void;
  problemSlug: string;
  examples?: Example[];
}

export function DynamicInputForm({
  onRun,
  onReset,
  problemSlug,
  examples,
}: Props) {
  const configs: Record<
    string,
    {
      labels: string[];
      placeholders: string[];
      defaults: string[];
      types: ("text" | "number")[];
      parser: (vals: string[]) => unknown[];
    }
  > = {
    "two-sum": {
      labels: ["Dados de Entrada (Números)", "Alvo (Target)"],
      placeholders: ["Ex: 2, 7, 11, 15", "9"],
      defaults: ["2, 7, 11, 15", "9"],
      types: ["text", "number"],
      parser: (vals) => [
        vals[0]
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .map(Number),
        Number(vals[1]),
      ],
    },
    "minimum-window-substring": {
      labels: [
        "String S (Texto Principal)",
        "String T (Caracteres Necessários)",
      ],
      placeholders: ["Ex: ADOBECODEBANC", "ABC"],
      defaults: ["ADOBECODEBANC", "ABC"],
      types: ["text", "text"],
      parser: (vals) => [vals[0].trim(), vals[1].trim()],
    },
    "longest-substring-without-repeating": {
      labels: ["String de Entrada (S)"],
      placeholders: ["Ex: abcabcbb"],
      defaults: ["abcabcbb"],
      types: ["text"],
      parser: (vals) => [vals[0].trim()],
    },
    "subarray-sum-equals-k": {
      labels: ["Números (nums)", "Alvo (k)"],
      placeholders: ["Ex: 1, 1, 1", "2"],
      defaults: ["1, 1, 1", "2"],
      types: ["text", "number"],
      parser: (vals) => [
        vals[0]
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .map(Number),
        Number(vals[1]),
      ],
    },
    "trapping-rain-water": {
      labels: ["Alturas (height)"],
      placeholders: ["Ex: 0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1"],
      defaults: ["0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1"],
      types: ["text"],
      parser: (vals) => [
        vals[0]
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .map(Number),
      ],
    },
    "group-anagrams": {
      labels: ["Lista de Palavras (strs)"],
      placeholders: ["Ex: eat, tea, tan, ate, nat, bat"],
      defaults: ["eat, tea, tan, ate, nat, bat"],
      types: ["text"],
      parser: (vals) => [
        vals[0]
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      ],
    },
    "daily-temperatures": {
      labels: ["Temperaturas (Celsius)"],
      placeholders: ["Ex: 73, 74, 75, 71, 69, 72, 76, 73"],
      defaults: ["73, 74, 75, 71, 69, 72, 76, 73"],
      types: ["text"],
      parser: (vals) => [
        vals[0]
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .map(Number),
      ],
    },
    "3sum": {
      labels: ["Números (nums)"],
      placeholders: ["Ex: -1, 0, 1, 2, -1, -4"],
      defaults: ["-1, 0, 1, 2, -1, -4"],
      types: ["text"],
      parser: (vals) => [
        vals[0]
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .map(Number),
      ],
    },
    "top-k-streams-heap": {
      labels: ["Eventos (events)", "K"],
      placeholders: ["Ex: 1, 1, 1, 2, 2, 3", "2"],
      defaults: ["1, 1, 1, 2, 2, 3", "2"],
      types: ["text", "number"],
      parser: (vals) => [
        vals[0]
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .map(Number),
        Number(vals[1]),
      ],
    },
  };

  const config = configs[problemSlug] || configs["two-sum"];

  const getDynamicDefaults = () => {
    if (!examples || examples.length === 0) return config.defaults;

    const firstInput = examples[0].input;

    if (problemSlug === "two-sum") {
      const numsMatch = firstInput.match(/nums\s*=\s*\[(.*?)\]/);
      const targetMatch = firstInput.match(/target\s*=\s*(-?\d+)/);
      if (numsMatch && targetMatch) {
        return [numsMatch[1], targetMatch[1]];
      }
    }

    if (problemSlug === "subarray-sum-equals-k") {
      const numsMatch = firstInput.match(/nums\s*=\s*\[(.*?)\]/);
      const kMatch = firstInput.match(/k\s*=\s*(-?\d+)/);
      if (numsMatch && kMatch) {
        return [numsMatch[1], kMatch[1]];
      }
    }

    if (problemSlug === "top-k-streams-heap") {
      const eventsMatch = firstInput.match(/events\s*=\s*\[(.*?)\]/);
      const kMatch = firstInput.match(/k\s*=\s*(-?\d+)/);
      if (eventsMatch && kMatch) {
        return [eventsMatch[1], kMatch[1]];
      }
    }

    return config.defaults;
  };

  const [inputs, setInputs] = useState<string[]>(getDynamicDefaults());

  const [prevExamples, setPrevExamples] = useState(examples);

  if (examples !== prevExamples) {
    setPrevExamples(examples);
    setInputs(getDynamicDefaults());
  }

  const handleRun = () => {
    const parsed = config.parser(inputs);
    onRun(...parsed);
  };

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  return (
    <div className="border border-border/50 bg-background/80 backdrop-blur-md overflow-hidden mb-4">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 bg-muted/20">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">
            Configuração de Teste
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {config.labels.map((label, i) => (
            <div
              key={i}
              className={`space-y-2 ${i === 0 ? "flex-1" : "w-full md:w-48"}`}
            >
              <label className="font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">
                {label}
              </label>
              <Input
                value={inputs[i]}
                onChange={(e) => updateInput(i, e.target.value)}
                placeholder={config.placeholders[i]}
                type={config.types[i]}
                className="bg-muted/20 border-border/40 rounded-none h-11 text-base font-mono focus-visible:ring-primary/50 focus-visible:border-primary/50"
              />
            </div>
          ))}

          <div className="flex gap-2 w-full md:w-auto">
            <Button
              onClick={handleRun}
              className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-primary-foreground rounded-none px-8 h-11 font-mono text-[10px] font-bold uppercase tracking-[0.2em] gap-2 transition-all active:translate-y-[1px]"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Executar
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const defaults = getDynamicDefaults();
                setInputs(defaults);
                onReset();
              }}
              className="rounded-none h-11 px-3 border-border/40 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              title="Resetar para o padrão"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground/30">
          Configura o cenário de teste acima e dispara o motor de execução.
        </p>
      </div>
    </div>
  );
}
