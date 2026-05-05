import type { ProblemStudyState, ProgressBlob } from './local-progress-schema';

function latestIso(a?: string, b?: string): string | undefined {
  if (!a) return b;
  if (!b) return a;
  return new Date(a).getTime() >= new Date(b).getTime() ? a : b;
}

function mergeStudy(local: ProblemStudyState, server: ProblemStudyState): ProblemStudyState {
  const opened = new Set([...(local.openedSolutions ?? []), ...(server.openedSolutions ?? [])]);
  const keys = new Set([
    ...Object.keys(local.lastLinesBySolution ?? {}),
    ...Object.keys(server.lastLinesBySolution ?? {}),
  ]);
  const lastLines: Record<string, number> = {};
  for (const k of keys) {
    const lv = local.lastLinesBySolution?.[k] ?? 0;
    const sv = server.lastLinesBySolution?.[k] ?? 0;
    lastLines[k] = Math.max(lv, sv);
  }
  const mergedLast =
    Object.keys(lastLines).length > 0 ? lastLines : undefined;
  return {
    visitedAt: latestIso(local.visitedAt, server.visitedAt),
    openedSolutions: [...opened],
    markedCompleteAt: latestIso(local.markedCompleteAt, server.markedCompleteAt),
    lastLinesBySolution: mergedLast,
  };
}

/** Une progresso local com servidor (preferindo dados mais recentes / linhas mais avançadas). */
export function mergeProgressBlobs(local: ProgressBlob, server: ProgressBlob): ProgressBlob {
  const problems: ProgressBlob['problems'] = { ...server.problems };
  for (const [slug, localState] of Object.entries(local.problems)) {
    const srv = problems[slug];
    problems[slug] = srv ? mergeStudy(localState, srv) : localState;
  }
  return { version: 1, problems };
}
