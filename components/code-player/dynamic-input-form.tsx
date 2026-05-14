"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Play, RotateCcw } from "lucide-react";
import { useState } from "react";

interface Props {
  onRun: (...args: unknown[]) => void;
  onReset: () => void;
  problemSlug: string;
}

export function DynamicInputForm({
  onRun,
  onReset,
  problemSlug,
}: Props) {
  // Configurações por slug
  const configs: Record<string, {
    labels: string[];
    placeholders: string[];
    defaults: string[];
    types: ("text" | "number")[];
    parser: (vals: string[]) => unknown[];
  }> = {
    "two-sum": {
      labels: ["Dados de Entrada (Números)", "Alvo (Target)"],
      placeholders: ["Ex: 2, 7, 11, 15", "9"],
      defaults: ["2, 7, 11, 15", "9"],
      types: ["text", "number"],
      parser: (vals) => [
        vals[0].split(",").map(s => s.trim()).filter(Boolean).map(Number),
        Number(vals[1])
      ]
    },
    "minimum-window-substring": {
      labels: ["String S (Texto Principal)", "String T (Caracteres Necessários)"],
      placeholders: ["Ex: ADOBECODEBANC", "ABC"],
      defaults: ["ADOBECODEBANC", "ABC"],
      types: ["text", "text"],
      parser: (vals) => [vals[0].trim(), vals[1].trim()]
    },
    "longest-substring-without-repeating": {
      labels: ["String de Entrada (S)"],
      placeholders: ["Ex: abcabcbb"],
      defaults: ["abcabcbb"],
      types: ["text"],
      parser: (vals) => [vals[0].trim()]
    },
    "subarray-sum-equals-k": {
      labels: ["Números (nums)", "Alvo (k)"],
      placeholders: ["Ex: 1, 1, 1", "2"],
      defaults: ["1, 1, 1", "2"],
      types: ["text", "number"],
      parser: (vals) => [
        vals[0].split(",").map(s => s.trim()).filter(Boolean).map(Number),
        Number(vals[1])
      ]
    },
    "trapping-rain-water": {
      labels: ["Alturas (height)"],
      placeholders: ["Ex: 0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1"],
      defaults: ["0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1"],
      types: ["text"],
      parser: (vals) => [
        vals[0].split(",").map(s => s.trim()).filter(Boolean).map(Number)
      ]
    },
    "group-anagrams": {
      labels: ["Lista de Palavras (strs)"],
      placeholders: ["Ex: eat, tea, tan, ate, nat, bat"],
      defaults: ["eat, tea, tan, ate, nat, bat"],
      types: ["text"],
      parser: (vals) => [
        vals[0].split(",").map(s => s.trim()).filter(Boolean)
      ]
    },
    "daily-temperatures": {
      labels: ["Temperaturas (Celsius)"],
      placeholders: ["Ex: 73, 74, 75, 71, 69, 72, 76, 73"],
      defaults: ["73, 74, 75, 71, 69, 72, 76, 73"],
      types: ["text"],
      parser: (vals) => [
        vals[0].split(",").map(s => s.trim()).filter(Boolean).map(Number)
      ]
    },
    "3sum": {
      labels: ["Números (nums)"],
      placeholders: ["Ex: -1, 0, 1, 2, -1, -4"],
      defaults: ["-1, 0, 1, 2, -1, -4"],
      types: ["text"],
      parser: (vals) => [
        vals[0].split(",").map(s => s.trim()).filter(Boolean).map(Number)
      ]
    }
  };

  const config = configs[problemSlug] || configs["two-sum"];
  const [inputs, setInputs] = useState<string[]>(config.defaults);

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
    <Card className="border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 shadow-none rounded-none mb-4 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {config.labels.map((label, i) => (
            <div key={i} className={`space-y-1.5 ${i === 0 ? 'flex-1' : 'w-full md:w-48'}`}>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                {label}
              </label>
              <Input
                value={inputs[i]}
                onChange={(e) => updateInput(i, e.target.value)}
                placeholder={config.placeholders[i]}
                type={config.types[i]}
                className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-none h-12 text-base font-mono focus-visible:ring-zinc-900"
              />
            </div>
          ))}
          
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              onClick={handleRun}
              className="flex-1 md:flex-none bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-none px-8 h-12 font-black text-xs uppercase tracking-[0.2em] gap-3 transition-all active:translate-y-[1px]"
            >
              <Play className="h-4 w-4 fill-current" />
              Executar
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setInputs(config.defaults);
                onReset();
              }}
              className="rounded-none h-12 px-4 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              title="Resetar para o padrão"
            >
              <RotateCcw className="h-4 w-4 text-zinc-500" />
            </Button>
          </div>
        </div>
        <p className="mt-2 text-[9px] text-zinc-400 font-bold uppercase tracking-tighter">
          INFO: Configura o cenário de teste acima e dispara o motor de execução.
        </p>
      </CardContent>
    </Card>
  );
}
