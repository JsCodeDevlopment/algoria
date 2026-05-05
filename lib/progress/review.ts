import type { ProgressBlob } from '@/lib/progress/local-progress-schema';

const MS_PER_DAY = 86_400_000;

/** Slugs com «Concluí o estudo» há pelo menos `minDays` dias (relógio local do browser ao gravar). */
export function getProblemSlugsDueForReview(blob: ProgressBlob, minDays: number, nowMs: number = Date.now()): string[] {
  if (minDays <= 0) return [];
  const threshold = minDays * MS_PER_DAY;
  const out: string[] = [];
  for (const [slug, st] of Object.entries(blob.problems)) {
    const iso = st.markedCompleteAt;
    if (!iso) continue;
    const t = Date.parse(iso);
    if (Number.isNaN(t)) continue;
    if (nowMs - t >= threshold) out.push(slug);
  }
  return out.sort((a, b) => a.localeCompare(b));
}
