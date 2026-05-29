/**
 * daily-challenge.ts — Selecciona deterministicamente o "Desafio do Dia".
 *
 * Usa um hash da data (YYYY-MM-DD) combinado com um salt mensal para
 * indexar a lista de problemas publicados. Inclui mecanismo anti-repetição
 * que garante variação mesmo com listas pequenas de problemas.
 */

import { toDateKey } from './xp-engine';

/**
 * Hash simples de string → número positivo (djb2).
 * Usado para gerar um índice determinístico a partir da data.
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
}

/**
 * Second hash function (FNV-1a) for double hashing anti-collision.
 */
function hashStringFNV(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return Math.abs(hash);
}

export interface DailyChallengeInfo {
  /** Slug do problema seleccionado para hoje. */
  slug: string;
  /** Título do problema. */
  title: string;
  /** Dificuldade. */
  difficulty: string;
  /** Data formatada do desafio. */
  dateKey: string;
}

/**
 * Gera o índice dos últimos N dias para evitar repetições.
 * Retorna um Set com os slugs que foram usados recentemente.
 */
function getRecentChallenges(
  sorted: string[],
  now: Date,
  lookbackDays: number,
): Set<string> {
  const recent = new Set<string>();
  if (sorted.length <= 1) return recent;

  for (let d = 1; d <= lookbackDays; d++) {
    const pastDate = new Date(now);
    pastDate.setDate(pastDate.getDate() - d);
    const pastKey = toDateKey(pastDate);
    const pastIdx = hashString(`algoria-daily-v2-${pastKey}`) % sorted.length;
    recent.add(sorted[pastIdx]!);
  }
  return recent;
}

/**
 * Retorna o problema do dia de forma determinística.
 *
 * Usa um algoritmo de seleção com anti-repetição: se o hash primário
 * gerar um problema que foi usado nos últimos N dias, avança ciclicamente
 * usando um segundo hash até encontrar um problema não repetido.
 *
 * @param problemSlugs Lista de slugs disponíveis (deve estar ordenada para consistência).
 * @param problemMeta  Map de slug → { title, difficulty } para enriquecer a resposta.
 * @param now          Data actual (opcional, para testes).
 */
export function getDailyChallenge(
  problemSlugs: string[],
  problemMeta: Map<string, { title: string; difficulty: string }>,
  now: Date = new Date(),
): DailyChallengeInfo | null {
  if (problemSlugs.length === 0) return null;

  const dateKey = toDateKey(now);
  const sorted = [...problemSlugs].sort();
  const n = sorted.length;

  // Salt includes year-month for extra variation across months
  const yearMonth = dateKey.slice(0, 7); // YYYY-MM
  const seed = `algoria-daily-v2-${dateKey}-${yearMonth}`;

  const primaryIdx = hashString(seed) % n;

  // For small lists, limit lookback to avoid exhausting all options
  const lookbackDays = Math.min(n - 1, 30);

  if (lookbackDays <= 0 || n <= 1) {
    // Only 1 problem, no alternative
    const slug = sorted[primaryIdx]!;
    const meta = problemMeta.get(slug);
    return {
      slug,
      title: meta?.title ?? slug,
      difficulty: meta?.difficulty ?? 'medium',
      dateKey,
    };
  }

  const recentSlugs = getRecentChallenges(sorted, now, lookbackDays);

  // Try primary index first
  let slug = sorted[primaryIdx]!;
  if (!recentSlugs.has(slug)) {
    const meta = problemMeta.get(slug);
    return {
      slug,
      title: meta?.title ?? slug,
      difficulty: meta?.difficulty ?? 'medium',
      dateKey,
    };
  }

  // Double hashing: step forward using a second hash
  const step = (hashStringFNV(seed) % (n - 1)) + 1;
  for (let attempt = 1; attempt < n; attempt++) {
    const idx = (primaryIdx + step * attempt) % n;
    slug = sorted[idx]!;
    if (!recentSlugs.has(slug)) {
      const meta = problemMeta.get(slug);
      return {
        slug,
        title: meta?.title ?? slug,
        difficulty: meta?.difficulty ?? 'medium',
        dateKey,
      };
    }
  }

  // Fallback: all exhausted (shouldn't happen with lookback < n), use primary
  slug = sorted[primaryIdx]!;
  const meta = problemMeta.get(slug);
  return {
    slug,
    title: meta?.title ?? slug,
    difficulty: meta?.difficulty ?? 'medium',
    dateKey,
  };
}
