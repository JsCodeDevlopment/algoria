/**
 * daily-challenge.ts — Selecciona deterministicamente o "Desafio do Dia".
 *
 * Usa um hash simples da data (YYYY-MM-DD) para indexar a lista de
 * problemas publicados, garantindo que todos os utilizadores vêem
 * o mesmo desafio no mesmo dia.
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
 * Retorna o problema do dia de forma determinística.
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
  const idx = hashString(`algoria-daily-${dateKey}`) % sorted.length;
  const slug = sorted[idx]!;
  const meta = problemMeta.get(slug);

  return {
    slug,
    title: meta?.title ?? slug,
    difficulty: meta?.difficulty ?? 'medium',
    dateKey,
  };
}
