'use client';

import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { StudyStatus } from '@/lib/progress/local-progress-schema';
import { getStudyStatus } from '@/lib/progress/local-progress';

export function ProblemStatusBadge({
  problemSlug,
  solutionCount,
  className,
}: {
  problemSlug: string;
  solutionCount: number;
  className?: string;
}) {
  const [status, setStatus] = useState<StudyStatus | null>(null);

  useEffect(() => {
    const refresh = () => setStatus(getStudyStatus(problemSlug, solutionCount));
    refresh();

    function onStorage(e: StorageEvent) {
      if (e.key === 'algoria:progress:v1') refresh();
    }
    window.addEventListener('storage', onStorage);
    window.addEventListener('algoria-progress', refresh);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('algoria-progress', refresh);
    };
  }, [problemSlug, solutionCount]);

  if (!status || status === 'not_started') return null;
  return (
    <Badge
      variant={status === 'completed' ? 'default' : 'secondary'}
      className={cn('font-mono text-[9px] uppercase tracking-tight', className)}
    >
      {status === 'completed' ? 'Concluído' : 'Em progresso'}
    </Badge>
  );
}
