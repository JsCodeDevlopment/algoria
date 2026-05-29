'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, CheckCircle2, EyeOff, Flame } from 'lucide-react';

import { formatDigitalTime, formatTime } from './daily-challenge-utils';
import { useDailyChallenge } from './use-daily-challenge';

interface DailyChallengeTrackerProps {
  problemSlug: string;
  isAccessible: boolean;
  solutionSlugs: string[];
}

export function DailyChallengeTracker({
  problemSlug,
  isAccessible,
  solutionSlugs,
}: DailyChallengeTrackerProps) {
  const {
    isActive,
    completed,
    elapsedMs,
    isTabVisible,
    visitedTabs,
    visitedAllSolutions,
    timeReached,
    remainingSeconds,
    progressPercent,
    visitedSolutionCount,
    totalSolutions,
  } = useDailyChallenge({ problemSlug, isAccessible, solutionSlugs });

  if (!isActive) return null;

  if (completed) {
    return (
      <div className="sticky top-16 z-40 mx-auto max-w-7xl w-full px-6 pt-4 select-none">
        <div className="border-2 border-emerald-500/30 bg-zinc-950 py-5 px-6 rounded-none shadow-md relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-emerald-500/30 bg-emerald-500/10 rounded-none">
                <CheckCircle2 className="h-6 w-6 text-emerald-500 glow-green" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 glow-green">
                    Desafio Diário Concluído
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 bg-orange-500/10 px-2 py-0.5 border border-orange-500/20 rounded-none">
                    <Flame className="h-3 w-3 shrink-0" />
                    +50 XP
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-zinc-400 font-mono">
                  SISTEMA DE XP: ATUALIZADO. Mantém a tua streak amanhã!
                </p>
              </div>
            </div>

            <div className="bg-black border border-emerald-500/30 px-5 py-2.5 rounded-none inline-flex items-center justify-center min-w-[200px] shadow-[inset_0_0_10px_rgba(0,0,0,0.9)] self-start sm:self-auto">
              <span className="font-digital tracking-[0.15em] text-xl md:text-2xl glow-green text-emerald-500 select-none">
                00:03:00:00
              </span>
            </div>
          </div>

          <div className="h-[2px] w-full bg-emerald-500 absolute bottom-0 left-0" />
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-16 z-40 mx-auto max-w-7xl w-full px-6 pt-4 select-none">
      <div className="border-2 border-orange-500/30 bg-gradient-to-r from-orange-950/20 via-zinc-950 to-amber-950/20 py-5 px-6 rounded-none shadow-md relative overflow-hidden">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-orange-500/30 bg-orange-500/10 rounded-none">
              <CalendarDays className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 glow-orange">
                  Desafio do Dia em Progresso
                </span>
                <AnimatePresence mode="wait">
                  {!isTabVisible && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 border border-amber-500/20 rounded-none"
                    >
                      <EyeOff className="h-2.5 w-2.5" />
                      Pausado
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="mt-2.5 flex items-center gap-4">
                <div className="bg-black border border-zinc-800 px-5 py-2 rounded-none inline-flex items-center justify-center min-w-[200px] shadow-[inset_0_0_10px_rgba(0,0,0,0.9)]">
                  <span className={`font-digital tracking-[0.15em] text-xl md:text-2xl ${
                    timeReached ? 'glow-green text-emerald-500' : 'glow-timer text-white'
                  }`}>
                    {formatDigitalTime(elapsedMs)}
                  </span>
                </div>
                
                <div className="flex flex-col text-[10px] text-zinc-500 font-mono">
                  <span>META: 00:03:00:00</span>
                  <span className="mt-0.5 text-zinc-600">PASSO A PASSO</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full lg:w-[480px]">
            <div className={`flex items-center justify-between gap-4 px-4 py-2 border rounded-none transition-all duration-300 ${
              isAccessible 
                ? 'bg-zinc-900/60 border-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.05)]' 
                : 'bg-zinc-900/40 border-zinc-800 text-zinc-500'
            }`}>
              <span className="text-[9px] font-mono uppercase tracking-wider">01. ACESSO</span>
              <span className="font-mono text-[10px]">{isAccessible ? 'DESBLOQUEADO' : 'BLOQUEADO'}</span>
            </div>

            <div className={`flex items-center justify-between gap-4 px-4 py-2 border rounded-none transition-all duration-300 ${
              visitedTabs.has('statement') 
                ? 'bg-zinc-900/60 border-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.05)]' 
                : 'bg-zinc-900/40 border-zinc-800 text-zinc-500'
            }`}>
              <span className="text-[9px] font-mono uppercase tracking-wider">02. ENUNCIADO</span>
              <span className="font-mono text-[10px]">{visitedTabs.has('statement') ? 'LIDO' : 'PENDENTE'}</span>
            </div>

            <div className={`flex items-center justify-between gap-4 px-4 py-2 border rounded-none transition-all duration-300 ${
              visitedAllSolutions 
                ? 'bg-zinc-900/60 border-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.05)]' 
                : 'bg-zinc-900/40 border-zinc-800 text-zinc-500'
            }`}>
              <span className="text-[9px] font-mono uppercase tracking-wider">03. SOLUÇÕES</span>
              <span className="font-mono text-[10px]">{visitedAllSolutions ? 'CONCLUÍDO' : `${visitedSolutionCount}/${totalSolutions}`}</span>
            </div>

            <div className={`flex items-center justify-between gap-4 px-4 py-2 border rounded-none transition-all duration-300 ${
              timeReached 
                ? 'bg-zinc-900/60 border-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.05)]' 
                : 'bg-zinc-900/40 border-zinc-800 text-zinc-500'
            }`}>
              <span className="text-[9px] font-mono uppercase tracking-wider">04. TEMPO (3M)</span>
              <span className="font-mono text-[10px]">
                {timeReached ? 'ATINGIDO' : `${formatTime(remainingSeconds)} REST.`}
              </span>
            </div>
          </div>

        </div>

        <div className="h-[2px] w-full bg-zinc-900 absolute bottom-0 left-0">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500"
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </div>
      </div>
    </div>
  );
}
