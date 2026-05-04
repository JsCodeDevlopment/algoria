/** Lógica pura sobre progresso (sem saber onde persiste). */

export interface StoredModuleSlice {
  lessonReadAt: number | null;
  solvedExerciseIds: Record<string, boolean>;
  capstonePassedAt: number | null;
}

export function defaultModuleSlice(): StoredModuleSlice {
  return {
    lessonReadAt: null,
    solvedExerciseIds: {},
    capstonePassedAt: null,
  };
}

export function moduleUnlocked(
  modulesOrderedIds: string[],
  moduleIndex: number,
  getSlice: (moduleId: string) => StoredModuleSlice | undefined,
): boolean {
  if (moduleIndex <= 0) return true;
  const prevId = modulesOrderedIds[moduleIndex - 1];
  if (!prevId) return true;
  return !!getSlice(prevId)?.capstonePassedAt;
}

/** Pesos pedagógicos simples: leitura 1 unit, cada exercício 1, avaliação final 2 */
export function progressUnitsForModule(
  exerciseIds: string[],
  slice: StoredModuleSlice | undefined,
): { earned: number; total: number } {
  const s = slice ?? defaultModuleSlice();
  let earned = s.lessonReadAt ? 1 : 0;
  for (const id of exerciseIds) {
    if (s.solvedExerciseIds[id]) earned += 1;
  }
  if (s.capstonePassedAt) earned += 2;
  const total = 1 + exerciseIds.length + 2;
  return { earned, total };
}
