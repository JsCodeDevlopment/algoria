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
      return 'border-amber-500/50 bg-amber-500/5';
    }
    return 'border-border bg-background';
  }, [variant]);

  return (
    <div className={`border-2 ${frameClasses} p-6 space-y-6`}>
      <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
        <span>{variant === 'capstone' ? 'Avaliação Final' : 'Exercício de Fixação'}</span>
        {showExplain ? (
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 px-2 py-0.5 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" /> Resposta Correta
          </span>
        ) : null}
      </div>
      <p className="text-lg leading-relaxed text-foreground font-bold tracking-tight">{exercise.stem}</p>

      <div className="grid gap-3">
        {exercise.choices.map((c, idx) => {
          const sel = choice === idx;
          const locked = solved || hasSucceededLocally;
          let ring = 'border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40';
          if (locked && idx === exercise.correctIndex) {
            ring = 'border-emerald-500 bg-emerald-500/10';
          } else if (!locked && sel && wrongPick) {
            ring = 'border-destructive bg-destructive/10';
          } else if (!locked && sel) {
            ring = 'border-primary bg-primary/5';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={locked}
              onClick={() => pick(idx)}
              className={`w-full text-left px-6 py-4 border-2 transition-all text-sm font-bold leading-snug cursor-pointer rounded-none ${ring} disabled:cursor-default`}
            >
              <span className="font-black mr-4 text-[11px] text-muted-foreground/60">{String.fromCharCode(65 + idx)}.</span>
              {c}
            </button>
          );
        })}
      </div>

      {!showExplain && wrongPick ? (
        <div className="flex items-start gap-3 text-xs font-bold uppercase tracking-wide text-destructive bg-destructive/5 border border-destructive/20 p-4">
          <XCircle className="h-4 w-4 shrink-0" />
          <p>
            Ainda não está certo. Analisa melhor as opções antes de tentar novamente.
          </p>
        </div>
      ) : null}

      {showExplain ? (
        <div className="pt-4 border-t border-border/50">
          <Tabs defaultValue="simple">
            <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-transparent border-b border-border">
              <TabsTrigger
                value="simple"
                className="text-[10px] font-black uppercase tracking-widest rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
              >
                Porquê · Simples
              </TabsTrigger>
              <TabsTrigger
                value="deep"
                className="text-[10px] font-black uppercase tracking-widest rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
              >
                Porquê · A Fundo
              </TabsTrigger>
            </TabsList>
            <TabsContent value="simple" className="mt-6">
              <div
                className="prose prose-sm prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: exercise.explanationSimpleHtml }}
              />
            </TabsContent>
            <TabsContent value="deep" className="mt-6">
              <div
                className="prose prose-sm prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: exercise.explanationDeepHtml }}
              />
            </TabsContent>
          </Tabs>
        </div>
      ) : null}
    </div>
  );
}
