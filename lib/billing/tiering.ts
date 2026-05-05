import type { ContentAccess, ProblemMeta } from '@/lib/content/schemas';

/** Slugs que devem permanecer gratuitos (espelha metadata editorial). */
export const FREE_PROBLEM_SLUGS = [
  'two-sum',
  'contains-duplicate',
  'valid-anagram',
  'merge-sorted-array',
  'move-zeroes',
  'maximum-subarray',
  'best-time-to-buy-and-sell-stock',
  'valid-palindrome',
  'squares-of-a-sorted-array',
  'intersection-of-two-arrays-ii',
] as const;

export function getProblemAccess(meta: Pick<ProblemMeta, 'access'>): ContentAccess {
  return meta.access ?? 'pro';
}

export function isProblemUnlockedForUser(access: ContentAccess, hasPro: boolean): boolean {
  if (access === 'free') return true;
  return hasPro;
}
