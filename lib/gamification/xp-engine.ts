/**
 * xp-engine.ts — Funções puras para cálculo de XP e streaks.
 *
 * Toda a lógica é determinística (data passada como argumento)
 * para facilitar testes e funcionar tanto no browser como no servidor.
 */

import type { ProgressBlob } from '@/lib/progress/local-progress-schema';

/* ── Constantes de XP ──────────────────────────────────────────── */

export const XP_EVENTS = {
  /** Concluir a leitura de uma solução (abrir e percorrer). */
  solution_read: 20,
  /** Marcar um problema como completo. */
  problem_complete: 30,
  /** Completar o desafio diário. */
  daily_challenge: 50,
} as const;

export type XpEvent = keyof typeof XP_EVENTS;

/* ── Streak ────────────────────────────────────────────────────── */

/** Formato de data usado para comparações: YYYY-MM-DD */
export function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const msA = Date.parse(a + 'T00:00:00Z');
  const msB = Date.parse(b + 'T00:00:00Z');
  if (Number.isNaN(msA) || Number.isNaN(msB)) return Infinity;
  return Math.round(Math.abs(msB - msA) / 86_400_000);
}

/**
 * Atualiza a streak com base na data de hoje.
 * - Se `lastActiveDate` é ontem → incrementa streak
 * - Se `lastActiveDate` é hoje → noop
 * - Caso contrário → reseta para 1
 *
 * Retorna o blob atualizado (cópia rasa — imutável o suficiente).
 */
export function updateStreak(blob: ProgressBlob, now: Date = new Date()): ProgressBlob {
  const today = toDateKey(now);

  if (blob.lastActiveDate === today) {
    return blob; // já contou hoje
  }

  const gap = blob.lastActiveDate ? daysBetween(blob.lastActiveDate, today) : Infinity;

  let streakCount: number;
  if (gap === 1) {
    // dia consecutivo
    streakCount = blob.streakCount + 1;
  } else {
    // quebrou a streak (ou primeiro acesso)
    streakCount = 1;
  }

  const longestStreak = Math.max(blob.longestStreak, streakCount);

  return {
    ...blob,
    streakCount,
    longestStreak,
    lastActiveDate: today,
  };
}

/* ── XP ────────────────────────────────────────────────────────── */

/**
 * Multiplicador de XP baseado na streak actual.
 * 1–6 dias: 1.0x │ 7–13 dias: 1.2x │ 14–29 dias: 1.5x │ 30+ dias: 2.0x
 */
export function getStreakMultiplier(streak: number): number {
  if (streak >= 30) return 2.0;
  if (streak >= 14) return 1.5;
  if (streak >= 7) return 1.2;
  return 1.0;
}

/**
 * Concede XP a um blob, aplicando o multiplicador de streak.
 * O blob já deve ter tido a streak atualizada nesta sessão.
 */
export function awardXP(blob: ProgressBlob, event: XpEvent): ProgressBlob {
  const base = XP_EVENTS[event];
  const multiplier = getStreakMultiplier(blob.streakCount);
  const earned = Math.round(base * multiplier);

  return {
    ...blob,
    xp: blob.xp + earned,
  };
}

/**
 * Marca o desafio diário como concluído para hoje e concede o XP bónus.
 */
export function completeDailyChallenge(blob: ProgressBlob, now: Date = new Date()): ProgressBlob {
  const today = toDateKey(now);
  if (blob.dailyChallengesCompleted.includes(today)) {
    return blob; // já completou hoje
  }

  let updated: ProgressBlob = {
    ...blob,
    dailyChallengesCompleted: [...blob.dailyChallengesCompleted, today],
  };
  updated = awardXP(updated, 'daily_challenge');
  return updated;
}

/**
 * Verifica se o desafio diário já foi completado hoje.
 */
export function isDailyChallengeCompleted(blob: ProgressBlob, now: Date = new Date()): boolean {
  return blob.dailyChallengesCompleted.includes(toDateKey(now));
}
