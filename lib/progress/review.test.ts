import { describe, expect, it } from 'vitest';

import type { ProgressBlob } from '@/lib/progress/local-progress-schema';
import { getProblemSlugsDueForReview } from '@/lib/progress/review';

describe('getProblemSlugsDueForReview', () => {
  it('lista apenas problemas marcados concluídos há pelo menos N dias', () => {
    const now = Date.parse('2026-05-20T12:00:00.000Z');
    const blob: ProgressBlob = {
      version: 1,
      xp: 0,
      streakCount: 0,
      longestStreak: 0,
      dailyChallengesCompleted: [],
      problems: {
        fresh: {
          openedSolutions: [],
          markedCompleteAt: '2026-05-18T12:00:00.000Z',
        },
        oldie: {
          openedSolutions: [],
          markedCompleteAt: '2026-05-01T12:00:00.000Z',
        },
        open: {
          openedSolutions: ['x'],
          visitedAt: '2026-05-01T00:00:00.000Z',
        },
      },
    };
    const slugs = getProblemSlugsDueForReview(blob, 14, now);
    expect(slugs).toEqual(['oldie']);
  });

  it('devolve vazio quando minDays é zero ou negativo', () => {
    const blob: ProgressBlob = { version: 1, problems: {}, xp: 0, streakCount: 0, longestStreak: 0, dailyChallengesCompleted: [] };
    expect(getProblemSlugsDueForReview(blob, 0)).toEqual([]);
    expect(getProblemSlugsDueForReview(blob, -5)).toEqual([]);
  });
});
