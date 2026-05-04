import { describe, expect, it } from 'vitest';

import { resolveExecutionSnapshot } from '@/lib/content/resolve-execution-snapshot';
import type { ExecutionTraceStep } from '@/lib/content/schemas';

describe('resolveExecutionSnapshot', () => {
  const steps: ExecutionTraceStep[] = [
    { line: 2, snapshot: { caption: 'A', scalars: { x: '1' } } },
    { line: 5, snapshot: { caption: 'B', scalars: { x: '2' } } },
  ];

  it('devolve null quando não há passos', () => {
    expect(resolveExecutionSnapshot(10, [])).toBeNull();
  });

  it('usa o último passo com linha <= currentLine', () => {
    expect(resolveExecutionSnapshot(2, steps)?.caption).toBe('A');
    expect(resolveExecutionSnapshot(4, steps)?.caption).toBe('A');
    expect(resolveExecutionSnapshot(5, steps)?.caption).toBe('B');
    expect(resolveExecutionSnapshot(99, steps)?.caption).toBe('B');
  });
});
