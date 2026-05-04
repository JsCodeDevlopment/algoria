import { describe, expect, it } from 'vitest';

import { ProgressBlobSchema } from '@/lib/progress/local-progress-schema';

describe('ProgressBlobSchema', () => {
  it('aceita blob legado sem lastLinesBySolution', () => {
    const blob = {
      version: 1 as const,
      problems: {
        'two-sum': {
          visitedAt: '2026-01-01T00:00:00.000Z',
          openedSolutions: ['hash-map'],
        },
      },
    };
    expect(() => ProgressBlobSchema.parse(blob)).not.toThrow();
  });

  it('aceita lastLinesBySolution por solução', () => {
    const blob = {
      version: 1 as const,
      problems: {
        'two-sum': {
          visitedAt: '2026-01-01T00:00:00.000Z',
          openedSolutions: ['hash-map'],
          lastLinesBySolution: { 'hash-map': 6 },
        },
      },
    };
    const parsed = ProgressBlobSchema.parse(blob);
    expect(parsed.problems['two-sum']?.lastLinesBySolution?.['hash-map']).toBe(6);
  });
});
