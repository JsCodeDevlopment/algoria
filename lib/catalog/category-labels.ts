import { CATEGORIES, type Category } from '@/lib/content/schemas';

const CATEGORY_LABEL_PT: Record<Category, string> = {
  arrays: 'Arrays',
  'hash-tables': 'Tabelas de dispersão',
  'two-pointers': 'Two pointers',
  'sliding-window': 'Sliding window',
  'binary-search': 'Busca binária',
  'linked-list': 'Listas ligadas',
  trees: 'Árvores',
  graphs: 'Grafos',
  'dynamic-programming': 'Programação dinâmica',
  greedy: 'Greedy',
  backtracking: 'Backtracking',
  'bit-manipulation': 'Manipulação de bits',
  math: 'Matemática',
  strings: 'Strings',
  stacks: 'Pilhas',
  queues: 'Filas',
  recursion: 'Recursão',
  sorting: 'Ordenação',
};

export function catalogCategoryLabels(): Category[] {
  return [...CATEGORIES];
}

export function categoryLabelPt(cat: Category): string {
  return CATEGORY_LABEL_PT[cat] ?? cat;
}
