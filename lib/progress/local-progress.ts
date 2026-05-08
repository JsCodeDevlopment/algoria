import { ProgressBlobSchema, type ProgressBlob, type StudyStatus } from './local-progress-schema';

export const PROGRESS_STORAGE_KEY = 'algoria:progress:v1';

function emptyBlob(): ProgressBlob {
  return { version: 1, problems: {} };
}

export function loadProgressBlob(): ProgressBlob {
  if (typeof window === 'undefined') return emptyBlob();
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return emptyBlob();
    const parsed = JSON.parse(raw) as unknown;
    return ProgressBlobSchema.parse(parsed);
  } catch {
    return emptyBlob();
  }
}

export function saveProgressBlob(blob: ProgressBlob): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(blob));
  window.dispatchEvent(new CustomEvent('algoria-progress'));
}

/** Marca problema como visitado (tab enunciado ou entrada na página). */
export function touchProblemVisited(problemSlug: string): ProgressBlob {
  const blob = loadProgressBlob();
  const cur = blob.problems[problemSlug] ?? {};
  blob.problems[problemSlug] = {
    ...cur,
    openedSolutions: cur.openedSolutions ?? [],
    visitedAt: cur.visitedAt ?? new Date().toISOString(),
    markedCompleteAt: cur.markedCompleteAt,
  };
  saveProgressBlob(blob);
  return blob;
}

/** Regista abertura de uma página de solução. */
export function touchSolutionVisited(problemSlug: string, solutionSlug: string): ProgressBlob {
  const blob = loadProgressBlob();
  const cur = blob.problems[problemSlug] ?? { openedSolutions: [] };
  const set = new Set(cur.openedSolutions ?? []);
  set.add(solutionSlug);
  blob.problems[problemSlug] = {
    ...cur,
    visitedAt: cur.visitedAt ?? new Date().toISOString(),
    markedCompleteAt: cur.markedCompleteAt,
    openedSolutions: [...set],
  };
  saveProgressBlob(blob);
  return blob;
}

/** Persiste a linha actual do player para uma solução (debounced no cliente). */
export function touchSolutionLastLine(problemSlug: string, solutionSlug: string, line: number): ProgressBlob {
  const blob = loadProgressBlob();
  const cur = blob.problems[problemSlug] ?? { openedSolutions: [] };
  blob.problems[problemSlug] = {
    ...cur,
    lastLinesBySolution: {
      ...(cur.lastLinesBySolution ?? {}),
      [solutionSlug]: line,
    },
  };
  saveProgressBlob(blob);
  return blob;
}

export function getSolutionResumeLine(
  problemSlug: string,
  solutionSlug: string,
  annotatedLines: number[],
): number | undefined {
  const blob = loadProgressBlob();
  const line = blob.problems[problemSlug]?.lastLinesBySolution?.[solutionSlug];
  if (line != null && annotatedLines.includes(line)) return line;
  return undefined;
}

/** Serializa o blob actual para backup (browser). */
export function serializeProgressBlob(): string {
  return JSON.stringify(loadProgressBlob(), null, 2);
}

/** Substitui o progresso pelo JSON validado (útil para restaurar backup). */
export function importProgressReplace(jsonText: string): { ok: true } | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(jsonText) as unknown;
    const blob = ProgressBlobSchema.parse(parsed);
    saveProgressBlob(blob);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'JSON inválido';
    return { ok: false, error: msg };
  }
}

export function toggleProblemMarkedComplete(problemSlug: string): ProgressBlob {
  const blob = loadProgressBlob();
  const cur = blob.problems[problemSlug] ?? { openedSolutions: [] };
  if (cur.markedCompleteAt) {
    blob.problems[problemSlug] = { ...cur, markedCompleteAt: undefined };
  } else {
    blob.problems[problemSlug] = {
      ...cur,
      markedCompleteAt: new Date().toISOString(),
      visitedAt: cur.visitedAt ?? new Date().toISOString(),
    };
  }
  saveProgressBlob(blob);
  return blob;
}

export function getStudyStatus(problemSlug: string, solutionCount: number): StudyStatus {
  const blob = loadProgressBlob();
  const st = blob.problems[problemSlug];
  if (!st) return 'not_started';

  const opened = new Set(st.openedSolutions ?? []);
  if (st.markedCompleteAt) return 'completed';
  if (solutionCount > 0 && opened.size >= solutionCount) return 'completed';
  if (st.visitedAt || opened.size > 0) return 'in_progress';
  return 'not_started';
}
