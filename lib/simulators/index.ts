import type { ExecutionTraceStep } from '@/lib/content/schemas';

/**
 * Tipo genérico para funções de simulação.
 * Usamos 'unknown[]' para garantir tipagem estrita e evitar o uso de 'any'.
 */
export type SimulatorFunction = (...args: unknown[]) => ExecutionTraceStep[];

/**
 * Mapeia Slugs + Soluções para funções de simulação locais (Legado).
 * O sistema agora prioriza o 'simulatorCode' vindo do banco de dados.
 */
export const SIMULATOR_REGISTRY: Record<string, Record<string, SimulatorFunction>> = {
  // Exemplo legado:
  // 'two-sum': { ... }
};

export function getSimulator(problemSlug: string, solutionSlug: string): SimulatorFunction | undefined {
  return SIMULATOR_REGISTRY[problemSlug]?.[solutionSlug];
}
