import { z } from 'zod';

const slugKey = z.string().max(220);

const iso = z.string().optional();

/** Estado de um problema no dispositivo (sem auth na Fase 1). */
export const ProblemStudyStateSchema = z.object({
  /** Primeira vez que abriste `/problems/[slug]` */
  visitedAt: iso,
  /** Slugs das soluções que já visitaste pelo menos uma vez */
  openedSolutions: z.array(slugKey).max(80).default([]),
  /** Opção manual «Concluí o estudo deste problema» */
  markedCompleteAt: iso,
  /** Última linha activa no player por slug de solução (retoma leitura). */
  lastLinesBySolution: z
    .record(slugKey, z.number().int().positive().max(500_000))
    .optional(),
});

export const ProgressBlobSchema = z.object({
  version: z.literal(1),
  /** Chave = problem slug */
  problems: z
    .record(slugKey, ProblemStudyStateSchema)
    .default({})
    .refine((p) => Object.keys(p).length <= 600, {
      message: 'Demasiados problemas no progresso.',
    }),

  /* ── Gamificação ──────────────────────────────────────────── */
  /** Pontos de experiência acumulados. */
  xp: z.number().int().nonnegative().default(0),
  /** Dias consecutivos com actividade na plataforma. */
  streakCount: z.number().int().nonnegative().default(0),
  /** Maior streak já atingida. */
  longestStreak: z.number().int().nonnegative().default(0),
  /** Data ISO (YYYY-MM-DD) do último dia de actividade. */
  lastActiveDate: z.string().optional(),
  /** Datas (YYYY-MM-DD) em que completou o desafio diário. */
  dailyChallengesCompleted: z.array(z.string()).max(400).default([]),
});

export type ProgressBlob = z.infer<typeof ProgressBlobSchema>;
export type ProblemStudyState = z.infer<typeof ProblemStudyStateSchema>;

export type StudyStatus = 'not_started' | 'in_progress' | 'completed';
