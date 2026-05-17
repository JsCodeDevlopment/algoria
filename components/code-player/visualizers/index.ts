'use client';

import { TwoSumVisualizer } from './two-sum-visualizer';
import { GenericVisualizer } from './generic-visualizer';
import type { ExecutionTraceStep } from '@/lib/content/schemas';

/**
 * Mapeamento de Slugs de Problemas para os seus Visualizadores Pro.
 * Adicionar um novo problema aqui "habilita" a funcionalidade premium para esse slug.
 */
export const BESPOKE_VISUALIZERS: Record<string, React.ComponentType<{ steps: ExecutionTraceStep[]; solutionSlug?: string }>> = {
  'two-sum': TwoSumVisualizer,
  'minimum-window-substring': GenericVisualizer,
  'longest-substring-without-repeating': GenericVisualizer,
  'subarray-sum-equals-k': GenericVisualizer,
  'trapping-rain-water': GenericVisualizer,
  'group-anagrams': GenericVisualizer,
  'daily-temperatures': GenericVisualizer,
  '3sum': GenericVisualizer,
  'top-k-streams-heap': GenericVisualizer,
  'autocomplete-trie': GenericVisualizer,
  'cidade-inteligente-dijkstra': GenericVisualizer,
};

/**
 * Verifica se um problema tem suporte a visualização Pro.
 */
export function hasBespokeVisualizer(slug: string): boolean {
  return !!BESPOKE_VISUALIZERS[slug];
}
