import type { ExecutionTraceSnapshot, ExecutionTraceStep } from '@/lib/content/schemas';

/** Último passo com `line <= currentLine` — mantém estado visual em linhas sem entrada própria no trace. */
export function resolveExecutionSnapshot(
  currentLine: number,
  steps: ExecutionTraceStep[],
): ExecutionTraceSnapshot | null {
  let bestLine = -1;
  let best: ExecutionTraceSnapshot | null = null;
  for (const s of steps) {
    if (s.line <= currentLine && s.line >= bestLine) {
      best = s.snapshot;
      bestLine = s.line;
    }
  }
  return best;
}
