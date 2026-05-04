'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

import type { CourseExerciseHydrated } from '@/lib/content/schemas';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Props {
  exercise: CourseExerciseHydrated;
  alreadySolved: boolean;
  onCorrect: () => void;
  variant?: 'practice' | 'capstone';
}

export function McqLesson({ exercise, alreadySolved, onCorrect, variant = 'practice' }: Props) {
  const solved = alreadySolved;
  const [choice, setChoice] = useState<number | null>(() => {
    /* restaurar seleção apenas quando já concluído mostramos marca visual */
    if (alreadySolved) return exercise.correctIndex;
    return null;
  });
  const [hasSucceededLocally, setHasSucceededLocally] = useState(alreadySolved);

  const showExplain = solved || hasSucceededLocally;

  const wrongPick = choice !== null && choice !== exercise.correctIndex;

  function pick(i: number) {
    if (solved || hasSucceededLocally) return;
    setChoice(i);
    if (i === exercise.correctIndex) {
      setHasSucceededLocally(true);
      onCorrect();
    }
  }

  const frameClasses = useMemo(() => {
    if (variant === 'capstone') {
      return 'border-amber-300/70 bg-gradient-to-br from-amber-50 to-white dark:border-amber-400/40 dark:from-zinc-900 dark:to-zinc-950';
    }
    return 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950';
  }, [variant]);

  return (
    <div className={`rounded-xl border ${frameClasses} p-5 space-y-4`}>
      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
        <span>{variant === 'capstone' ? 'Avaliação final' : 'Exercício'}</span>
        {showExplain ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-2 py-0.5">
            <CheckCircle2 className="h-3.5 w-3.5" /> Resposta certa
          </span>
        ) : null}
      </div>
      <p className="text-base leading-relaxed text-zinc-900 dark:text-zinc-100 font-medium">{exercise.stem}</p>

      <div className="space-y-2">
        {exercise.choices.map((c, idx) => {
          const sel = choice === idx;
          const locked = solved || hasSucceededLocally;
          let ring = 'border-transparent bg-zinc-100/80 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-900/70';
          if (locked && idx === exercise.correctIndex) {
            ring = 'border-emerald-500 bg-emerald-500/10';
          } else if (!locked && sel && wrongPick) {
            ring = 'border-red-400 bg-red-500/10';
          } else if (!locked && sel) {
            ring = 'border-primary bg-primary/5';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={locked}
              onClick={() => pick(idx)}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors text-sm leading-snug cursor-pointer ${ring} disabled:cursor-default`}
            >
              <span className="font-mono mr-3 text-[11px] text-zinc-500">{String.fromCharCode(65 + idx)}.</span>
              {c}
            </button>
          );
        })}
      </div>

      {!showExplain && wrongPick ? (
        <div className="flex items-start gap-2 text-sm text-red-700 dark:text-red-400 bg-red-500/10 border border-red-300/60 rounded-lg p-3">
          <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <p>
            Ainda não está certo — pensa no que esse enunciado exige antes de clicar na opção seguinte (podes trocar
            quantas vezes precisares).
          </p>
        </div>
      ) : null}

      {showExplain ? (
        <Tabs defaultValue="simple">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="simple" className="text-[11px] uppercase tracking-wide">
              Porquê · simples
            </TabsTrigger>
            <TabsTrigger value="deep" className="text-[11px] uppercase tracking-wide">
              Porquê · a fundo
            </TabsTrigger>
          </TabsList>
          <TabsContent value="simple" className="mt-3">
            <div
              className="prose prose-sm prose-zinc dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: exercise.explanationSimpleHtml }}
            />
          </TabsContent>
          <TabsContent value="deep" className="mt-3">
            <div
              className="prose prose-sm prose-zinc dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: exercise.explanationDeepHtml }}
            />
          </TabsContent>
        </Tabs>
      ) : null}
    </div>
  );
}
