'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { getStudyStatus } from '@/lib/progress/local-progress';
import {
  toggleProblemMarkedComplete,
  touchProblemVisited,
} from '@/lib/progress/local-progress';

interface Props {
  problemSlug: string;
  solutionCount: number;
}

/** Marcar problema como estudado manualmente — complementa «visitou todas as soluções». */
export function ProblemStudyCompletionBar({ problemSlug, solutionCount }: Props) {
  const [, bump] = useState(0);
  useEffect(() => {
    touchProblemVisited(problemSlug);
  }, [problemSlug]);

  const refresh = () => bump((x) => x + 1);
  const status = getStudyStatus(problemSlug, solutionCount);

  return (
    <div className="mt-12 flex flex-col gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/60 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        {status === 'completed'
          ? 'Marcado como estudado neste browser.'
          : 'Quando terminares todas as estratégias (ou ficares à vontade com o problema), marca como estudado para o estado aparecer verde no catálogo.'}
      </div>
      <Button
        type="button"
        variant={status === 'completed' ? 'secondary' : 'default'}
        onClick={() => {
          toggleProblemMarkedComplete(problemSlug);
          refresh();
        }}
      >
        {status === 'completed' ? 'Desmarcar conclusão' : 'Marcar como estudado'}
      </Button>
    </div>
  );
}
