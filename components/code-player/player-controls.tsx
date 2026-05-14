'use client';

import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, FastForward } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { usePlayerStore } from './use-player-store';

const SPEED_OPTIONS = [
  { label: '0.5×', ms: 5000 },
  { label: '1×', ms: 2500 },
  { label: '2×', ms: 1200 },
  { label: '4×', ms: 600 },
];

export function PlayerControls() {
  const currentLine = usePlayerStore((s) => s.currentLine);
  const annotatedLines = usePlayerStore((s) => s.annotatedLines);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const speedMs = usePlayerStore((s) => s.speedMs);
  const prev = usePlayerStore((s) => s.prev);
  const next = usePlayerStore((s) => s.next);
  const togglePlaying = usePlayerStore((s) => s.togglePlaying);
  const setSpeed = usePlayerStore((s) => s.setSpeed);
  const traceSteps = usePlayerStore((s) => s.traceSteps);
  const currentStepIndex = usePlayerStore((s) => s.currentStepIndex);

  const isTraceMode = traceSteps.length > 0 && currentStepIndex !== -1;
  const idx = isTraceMode ? currentStepIndex : annotatedLines.indexOf(currentLine);
  const total = isTraceMode ? traceSteps.length : annotatedLines.length;
  
  const progressPct = total > 0 ? ((idx + 1) / total) * 100 : 0;

  // Autoplay loop. We re-evaluate `speedMs` and `isPlaying` whenever they
  // change so the user can change speed mid-play and see it apply on the
  // next tick (no double timers, no leak).
  useEffect(() => {
    if (!isPlaying) return;
    const t = setTimeout(() => next(), speedMs);
    return () => clearTimeout(t);
  }, [isPlaying, speedMs, currentLine, currentStepIndex, next]);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-none"
        onClick={prev}
        disabled={idx <= 0}
        aria-label="Linha anterior (←)"
        title="Linha anterior (←)"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="default"
        size="icon"
        className="rounded-none"
        onClick={togglePlaying}
        disabled={idx >= total - 1 && !isPlaying}
        aria-label={isPlaying ? 'Pausar (espaço)' : 'Reproduzir (espaço)'}
        title={isPlaying ? 'Pausar (espaço)' : 'Reproduzir (espaço)'}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-none"
        onClick={next}
        disabled={idx >= total - 1}
        aria-label="Próxima linha (→)"
        title="Próxima linha (→)"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="flex-1 min-w-[6rem]">
        <div className="h-1 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-zinc-900 dark:bg-zinc-100 transition-[width]"
            style={{ width: `${progressPct}%` }}
            aria-hidden
          />
        </div>
        <div className="text-xs font-black text-zinc-500 mt-1 tabular-nums uppercase tracking-tighter">
          Step {String(idx + 1).padStart(3, '0')} / {String(total).padStart(3, '0')}
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-1">
        <FastForward className="h-4 w-4 text-zinc-400" aria-hidden />
        {SPEED_OPTIONS.map((opt) => (
          <button
            key={opt.ms}
            onClick={() => setSpeed(opt.ms)}
            className={cn(
              'text-[11px] font-black px-2 py-1 transition-colors uppercase tracking-widest',
              speedMs === opt.ms
                ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100',
            )}
            aria-label={`Velocidade ${opt.label}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
