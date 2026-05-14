'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { resolveExecutionSnapshot } from '@/lib/content/resolve-execution-snapshot';
import { usePlayerStore } from '../use-player-store';
import type { ExecutionTraceStep } from '@/lib/content/schemas';

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

  if (!snapshot) {
    return (
      <section className="border border-dashed border-zinc-200 bg-zinc-50 p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
        Motor Offline / Aguardando dados de execução...
      </section>
    );
  }

  const numsArray = snapshot.arrays?.find((a) => a.label === 'nums');
  const nums = numsArray ? (numsArray.values as number[]) : [];
  
  const iStr = snapshot.scalars?.i;
  const jStr = snapshot.scalars?.j;
  const iIdx = iStr !== undefined ? parseInt(iStr, 10) : null;
  const jIdx = jStr !== undefined ? parseInt(jStr, 10) : null;
  
  const target = snapshot.scalars?.target;
  const val = snapshot.scalars?.val;
  const complement = snapshot.scalars?.complement;
  const currentSum = snapshot.scalars?.current_sum;
  const foundAt = snapshot.scalars?.found_at;
  const result = snapshot.scalars?.result;

  const mapEntries = snapshot.mapEntries || [];
  
  // Deteta se o objetivo foi encontrado nesta frame (sucesso visual)
  const isFound = foundAt !== undefined || result !== undefined || (currentSum !== undefined && currentSum === target);

  return (
    <section className="border-x border-b border-zinc-200 bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden flex flex-col gap-10 select-none">
      
      {/* CABEÇALHO */}
      <div className="flex items-center justify-between border-b-2 border-zinc-900 dark:border-zinc-100 pb-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-zinc-100">
            MONITOR DE EXECUÇÃO PRO
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 dark:bg-zinc-100">
              <span className="text-[10px] font-black uppercase tracking-tight text-zinc-100 dark:text-zinc-900">PASSO</span>
              <span className="font-mono text-sm font-black text-zinc-100 dark:text-zinc-900">
                {currentStepIndex !== -1 ? String(currentStepIndex + 1).padStart(3, '0') : '000'}
              </span>
            </div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              DE {steps.length}
            </span>
          </div>
        </div>
        {target !== undefined && (
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Valor Alvo</span>
            <div className={`border-2 px-6 py-2 transition-colors ${isFound ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-zinc-50 border-zinc-900 dark:bg-zinc-900 dark:border-zinc-100'}`}>
              <span className="font-mono text-2xl font-black">{target}</span>
            </div>
          </div>
        )}
      </div>

      {/* PALCO 1: O ARRAY */}
      <div className="relative pt-6 pb-16 flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-1.5">
          {nums.map((num, idx) => {
            const isI = iIdx === idx;
            const isJ = jIdx === idx;
            const isActive = isI || isJ;
            const isHighlighted = numsArray?.highlightIndices.includes(idx);

            return (
              <div key={idx} className="relative flex flex-col items-center">
                {/* A Caixa do Array */}
                <motion.div
                  layout
                  className={`flex h-16 w-16 items-center justify-center border-2 font-mono text-xl font-black transition-all ${
                    isFound && isHighlighted
                      ? 'border-emerald-500 bg-emerald-500 text-white shadow-[6px_6px_0px_0px_rgba(16,185,129,0.2)]'
                      : isI
                        ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 scale-110 z-10'
                        : isJ
                        ? 'border-orange-500 bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 scale-110 z-10'
                        : 'border-zinc-100 bg-white text-zinc-300 dark:border-zinc-800 dark:bg-zinc-950'
                  }`}
                >
                  {num}
                </motion.div>
                
                {/* Índice */}
                <div className="mt-2 text-[10px] font-mono font-black text-zinc-300 uppercase">#{idx}</div>

                {/* Apontador I */}
                {isI && (
                  <motion.div
                    layoutId="pointer-i"
                    className="absolute -bottom-10 flex flex-col items-center z-20"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  >
                    <div className="h-4 w-[2px] bg-blue-600" />
                    <span className="bg-blue-600 px-2 py-1 font-mono text-[10px] font-black text-white border border-blue-600">
                      I
                    </span>
                  </motion.div>
                )}

                {/* Apontador J */}
                {isJ && (
                  <motion.div
                    layoutId="pointer-j"
                    className="absolute -bottom-10 flex flex-col items-center z-20"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  >
                    <div className="h-4 w-[2px] bg-orange-500" />
                    <span className="bg-orange-500 px-2 py-1 font-mono text-[10px] font-black text-white border border-orange-500">
                      J
                    </span>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* PALCO 2: A EQUAÇÃO */}
      <div className={`flex justify-center border-y-4 py-12 transition-colors ${isFound ? 'bg-emerald-50 border-emerald-500 dark:bg-emerald-950/20' : 'bg-zinc-50 border-zinc-900 dark:bg-zinc-900/20 dark:border-zinc-100'}`}>
        <AnimatePresence mode="wait">
          {complement !== undefined && val !== undefined && target !== undefined ? (
            <motion.div
              key="hash-eq"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 px-12 py-6"
            >
              <div className={`text-[10px] font-black uppercase tracking-[0.4em] mb-2 ${isFound ? 'text-emerald-600' : 'text-zinc-400'}`}>
                LÓGICA: BUSCA POR COMPLEMENTO
              </div>
              <div className="flex items-center gap-10">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-widest opacity-50">ALVO</span>
                  <span className="font-mono text-4xl font-black">{target}</span>
                </div>
                <span className="font-mono text-4xl font-light opacity-20">-</span>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-widest opacity-50">ATUAL</span>
                  <span className="font-mono text-4xl font-black text-blue-600 dark:text-blue-400">{val}</span>
                </div>
                <span className="font-mono text-4xl font-light opacity-20">=</span>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-widest opacity-50">PROCURAR</span>
                  <motion.span 
                    key={complement}
                    className={`font-mono text-5xl font-black underline decoration-4 underline-offset-8 ${isFound ? 'text-emerald-600' : 'text-orange-500'}`}
                  >
                    {complement}
                  </motion.span>
                </div>
              </div>
            </motion.div>
          ) : currentSum !== undefined && iIdx !== null && jIdx !== null ? (
            <motion.div
              key="brute-eq"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 px-12 py-6"
            >
              <div className={`text-[11px] font-black uppercase tracking-[0.4em] border-b-2 pb-1 ${isFound ? 'border-emerald-500 text-emerald-600' : 'border-zinc-900 dark:border-zinc-100'}`}>
                TENTATIVA #{currentStepIndex !== -1 ? Math.ceil((currentStepIndex + 1) / 2) : 0}
              </div>
              <div className="flex items-center gap-10 pt-4">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-widest opacity-50">NUM[I]</span>
                  <span className="font-mono text-4xl font-black text-blue-600 dark:text-blue-400">{nums[iIdx]}</span>
                </div>
                <span className="font-mono text-4xl font-light opacity-20">+</span>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-widest opacity-50">NUM[J]</span>
                  <span className="font-mono text-4xl font-black text-orange-500">{nums[jIdx]}</span>
                </div>
                <span className="font-mono text-4xl font-light opacity-20">=</span>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-widest opacity-50">SOMA</span>
                  <motion.span 
                    key={currentSum}
                    className={`font-mono text-5xl font-black ${isFound ? 'text-emerald-600' : ''}`}
                  >
                    {currentSum}
                  </motion.span>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* PALCO 3: O HASH MAP */}
      {(mapEntries.length > 0 || complement !== undefined) && (
        <div className="flex flex-col gap-6 pt-4">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-zinc-100">
              ARMAZENAMENTO_HASH_MAP
            </h4>
            <span className="font-mono text-[10px] font-black text-zinc-400">ENTRADAS: {String(mapEntries.length).padStart(2, '0')}</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 min-h-[4rem]">
            <AnimatePresence mode="popLayout">
              {mapEntries.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="col-span-full text-[11px] font-black font-mono text-zinc-300 uppercase tracking-widest flex items-center justify-center py-8 border-2 border-dashed border-zinc-100 dark:border-zinc-900"
                >
                  MEMÓRIA_VAZIA
                </motion.div>
              ) : (
                mapEntries.map((entry) => {
                  const isBeingFound = isFound && entry.key === complement;
                  return (
                    <motion.div
                      layout
                      key={entry.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex flex-col border-2 transition-all ${
                        isBeingFound 
                          ? 'border-emerald-500 bg-emerald-500 text-white scale-105 z-20 shadow-[4px_4px_0px_0px_rgba(16,185,129,0.2)]' 
                          : 'border-zinc-100 bg-zinc-50 text-zinc-500 dark:border-zinc-900 dark:bg-zinc-950'
                      }`}
                    >
                      <div className="px-3 py-1 font-black text-[10px] uppercase border-b border-inherit opacity-40">
                        Valor
                      </div>
                      <div className="px-3 py-2 font-mono text-lg font-black">
                        {entry.key}
                      </div>
                      <div className="px-3 py-1 font-mono text-[10px] border-t border-inherit bg-white/5">
                        POS: {entry.value}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
      
      {/* MENSAGEM DO SISTEMA */}
      <AnimatePresence mode="wait">
        {snapshot.caption && (
          <motion.div
            key={snapshot.caption}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-6 border-2 transition-colors ${
              isFound 
                ? 'bg-emerald-500 border-emerald-500 text-white' 
                : 'bg-zinc-50 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100'
            }`}
          >
            <p className={`text-[11px] font-black uppercase tracking-[0.4em] text-center mb-1 ${
              isFound ? 'text-emerald-200' : 'text-zinc-400'
            }`}>
              LOG_DO_SISTEMA
            </p>
            <p className="text-lg font-black text-center uppercase tracking-tight">
              {snapshot.caption}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
