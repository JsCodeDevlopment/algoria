"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Play, RotateCcw } from "lucide-react";
import { useState } from "react";

interface Props {
  onRun: (nums: number[], target: number) => void;
  onReset: () => void;
  defaultNums?: string;
  defaultTarget?: number;
}

export function DynamicInputForm({
  onRun,
  onReset,
  defaultNums = "2, 7, 11, 15",
  defaultTarget = 9,
}: Props) {
  const [numsStr, setNumsStr] = useState(defaultNums);
  const [target, setTarget] = useState(String(defaultTarget));

  const handleRun = () => {
    const nums = numsStr
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "")
      .map(Number)
      .filter((n) => !isNaN(n));

    const targetNum = Number(target);
    if (nums.length > 0 && !isNaN(targetNum)) {
      onRun(nums, targetNum);
    }
  };

  return (
    <Card className="border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 shadow-none rounded-none mb-4 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              Dados de Entrada (Números)
            </label>
            <Input
              value={numsStr}
              onChange={(e) => setNumsStr(e.target.value)}
              placeholder="Ex: 2, 7, 11, 15"
              className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-none h-12 text-base font-mono focus-visible:ring-zinc-900"
            />
          </div>
          <div className="w-full md:w-32 space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              Alvo (Target)
            </label>
            <Input
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="9"
              type="number"
              className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-none h-12 text-base font-mono focus-visible:ring-zinc-900"
            />
          </div>
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
                setNumsStr(defaultNums);
                setTarget(String(defaultTarget));
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
