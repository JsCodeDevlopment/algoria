import { z } from 'zod';

const iso = z.string().optional();

/** Estado de um problema no dispositivo (sem auth na Fase 1). */
export const ProblemStudyStateSchema = z.object({
  /** Primeira vez que abriste `/problems/[slug]` */
  visitedAt: iso,
  /** Slugs das soluções que já visitaste pelo menos uma vez */
  openedSolutions: z.array(z.string()).default([]),
  /** Opção manual «Concluí o estudo deste problema» */
  markedCompleteAt: iso,
  /** Última linha activa no player por slug de solução (retoma leitura). */
  lastLinesBySolution: z.record(z.string(), z.number().int().positive()).optional(),
});

export const ProgressBlobSchema = z.object({
  version: z.literal(1),
  /** Chave = problem slug */
  problems: z.record(z.string(), ProblemStudyStateSchema).default({}),
});

export type ProgressBlob = z.infer<typeof ProgressBlobSchema>;
export type ProblemStudyState = z.infer<typeof ProblemStudyStateSchema>;

export type StudyStatus = 'not_started' | 'in_progress' | 'completed';
