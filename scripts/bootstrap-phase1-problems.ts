/**
 * Escreve rapidamente os 9 problemas da Fase 1 (órden 2–10).
 * Execução: `pnpm bootstrap:phase1`
 *
 * Duas-sum (ordem 1) já existe no repositório. As linhas nível‑1 repetem texto
 * didácto curto; convém revisar/editorial antes de público final.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

type Kind = 'brute-force' | 'optimal';
type Complexity = { time: string; space: string; rationale: string };

type SolSeed = {
  folder: string;
  name: string;
  kind: Kind;
  complexity: Complexity;
  ts: string;
  introMd: string;
};

type ProblemSeed = {
  slug: string;
  title: string;
  difficulty: 'easy' | 'medium';
  categories: string[];
  prerequisites: string[];
  tags: string[];
  estimatedMinutes: number;
  recommendedOrder: number;
  descriptionMd: string;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  constraints: string[];
  solutions: SolSeed[];
};

const ROOT = path.join(process.cwd(), 'content', 'problems');

function annotationsGeneric(tsCode: string) {
  const lines = tsCode.trimEnd().split(/\r?\n/).length;
  const annotations = [];
  for (let line = 1; line <= lines; line++) {
    annotations.push({
      line,
      level1:
        line === 1
          ? 'Definimos cabeça de leitura: identifica entrada/saída da função antes de explorar invariantes mais finas.'
          : 'Trecho seguinte mantém este passo dentro da estratégia mostrada ao lado.',
      concepts: [] as string[],
    });
  }
  return annotations;
}

async function emitSolution(pSlug: string, sol: SolSeed) {
  const base = path.join(ROOT, pSlug, 'solutions', sol.folder);
  await mkdir(base, { recursive: true });

  await writeFile(
    path.join(base, 'meta.json'),
    JSON.stringify(
      {
        slug: sol.folder,
        name: sol.name,
        kind: sol.kind,
        language: 'typescript',
        complexity: sol.complexity,
      },
      null,
      2,
    ) + '\n',
    'utf8',
  );

  await writeFile(path.join(base, 'solution.ts'), sol.ts.endsWith('\n') ? sol.ts : `${sol.ts}\n`, 'utf8');

  await writeFile(path.join(base, 'intro.md'), `${sol.introMd}\n`, 'utf8');

  await writeFile(path.join(base, 'annotations.json'), `${JSON.stringify({ annotations: annotationsGeneric(sol.ts) }, null, 2)}\n`, 'utf8');
}

async function emitProblem(seed: ProblemSeed) {
  const dir = path.join(ROOT, seed.slug);
  await mkdir(path.join(dir, 'solutions'), { recursive: true });

  await writeFile(
    path.join(dir, 'meta.json'),
    JSON.stringify(
      {
        slug: seed.slug,
        title: seed.title,
        difficulty: seed.difficulty,
        categories: seed.categories,
        prerequisites: seed.prerequisites,
        tags: seed.tags,
        estimatedMinutes: seed.estimatedMinutes,
        recommendedOrder: seed.recommendedOrder,
        examples: seed.examples,
        constraints: seed.constraints,
      },
      null,
      2,
    ) + '\n',
    'utf8',
  );

  await writeFile(path.join(dir, 'description.md'), seed.descriptionMd.endsWith('\n') ? seed.descriptionMd : `${seed.descriptionMd}\n`, 'utf8');

  await Promise.all(seed.solutions.map((s) => emitSolution(seed.slug, s)));
}

const SEEDS: ProblemSeed[] = [
  {
    slug: 'contains-duplicate',
    title: 'Contains Duplicate',
    difficulty: 'easy',
    categories: ['arrays', 'hash-tables'],
    prerequisites: ['big-o', 'hash-tables'],
    tags: ['blind-75', 'phase1-bootstrap'],
    estimatedMinutes: 10,
    recommendedOrder: 2,
    descriptionMd:
      '## Enunciado\n\nIndica resultado verdadeiro quando existirem dois índices diferentes com o mesmo valor; caso contrário falso.\n\nContrasta brute-force contra conjuntos/hash.',
    examples: [
      { input: 'nums = [1, 2, 3, 1]', output: 'true' },
      { input: 'nums = [1, 2, 3]', output: 'false' },
    ],
    constraints: ['até tens de mil elementos', 'nums[i] em inteiros grandes'],
    solutions: [
      {
        folder: 'brute-force',
        name: 'Brute-force (pares)',
        kind: 'brute-force',
        complexity: {
          time: 'O(n²)',
          space: 'O(1)',
          rationale: 'Comparação directa todos os índices `i < j`; sem espaço extra.',
        },
        introMd: `# Brute-force

Percurso duplo típico: útil porque mostra porque precisamos de memória.`,
        ts: `function containsDuplicate(nums: number[]): boolean {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] === nums[j]) {
        return true;
      }
    }
  }
  return false;
}`,
      },
      {
        folder: 'hash-set',
        name: 'Conjunto incremental',
        kind: 'optimal',
        complexity: {
          time: 'O(n)',
          space: 'O(n)',
          rationale:
            '`Set.has` amortizado permite saltar segunda camada inteira quando detectamos repetições cedo.',
        },
        introMd: `# Conjunto

Memória contra tempo — exemplo canónico de trade-off.`,
        ts: `function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>();
  for (const x of nums) {
    if (seen.has(x)) {
      return true;
    }
    seen.add(x);
  }
  return false;
}`,
      },
    ],
  },
  {
    slug: 'valid-anagram',
    title: 'Valid Anagram',
    difficulty: 'easy',
    categories: ['strings', 'hash-tables'],
    prerequisites: ['hash-tables', 'big-o'],
    tags: ['phase1-bootstrap'],
    estimatedMinutes: 12,
    recommendedOrder: 3,
    descriptionMd: `## Enunciado

Verifica se \`t\` é um anagrama de \`s\` usando o mesmo multiset de caracteres.`,
    examples: [
      { input: 's = anagram , t = nagaram', output: 'true' },
      { input: 's = rat , t = car', output: 'false' },
    ],
    constraints: ['Strings minúsculas ou mistas segundo enunciado clássico'],
    solutions: [
      {
        folder: 'sort-and-compare',
        name: 'Ordenar e igualar',
        kind: 'brute-force',
        complexity: {
          time: 'O(k log k)',
          space: 'O(k)',
          rationale: '`k = s.length`; ordenações domésticas com sort nativo.',
        },
        introMd: '# Ordenar\nMesmas letras implicam a mesma assinatura ordenada.',
        ts: `function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const a = [...s].sort().join('');
  const b = [...t].sort().join('');
  return a === b;
}`,
      },
      {
        folder: 'frequency',
        name: 'Contagens (26 buckets)',
        kind: 'optimal',
        complexity: {
          time: 'O(k)',
          space: 'O(1)',
          rationale: 'Alfabeto minúsculo limitado permite vector fixo de contagem diferencial.',
        },
        introMd: '# Histograma\nAcrescentas na primeira string e retiras pela segunda.',
        ts: `function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const count = Array.from({ length: 26 }, () => 0);
  const base = 'a'.charCodeAt(0);
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - base]++;
    count[t.charCodeAt(i) - base]--;
  }
  return count.every((x) => x === 0);
}`,
      },
    ],
  },
  {
    slug: 'maximum-subarray',
    title: 'Maximum Subarray',
    difficulty: 'medium',
    categories: ['arrays', 'dynamic-programming'],
    prerequisites: ['big-o'],
    tags: ['kadane', 'phase1-bootstrap'],
    estimatedMinutes: 18,
    recommendedOrder: 4,
    descriptionMd: `## Enunciado

Soma máxima de subarray contínuo (Kadane é a referência óptima).`,
    examples: [{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'Segmento óptimo 4,-1,2,1.' }],
    constraints: ['1 ≤ nums.length ≤ 100000'],
    solutions: [
      {
        folder: 'brute-ranges',
        name: 'Intervalos explícitos',
        kind: 'brute-force',
        complexity: {
          time: 'O(n²)',
          space: 'O(1)',
          rationale: 'Força duplo índice com somas incrementais intermedias.',
        },
        introMd: '# Brute\nMostra porque precisamos de uma passagem linear.',
        ts: `function maxSubArray(nums: number[]): number {
  let best = nums[0];
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      best = Math.max(best, sum);
    }
  }
  return best;
}`,
      },
      {
        folder: 'kadane',
        name: 'Kadane incremental',
        kind: 'optimal',
        complexity: {
          time: 'O(n)',
          space: 'O(1)',
          rationale:
            '`current = max(nums[i], current + nums[i])` garante invariante óptimo com subarry contíguos.',
        },
        introMd: '# Kadane linear\nAceita resets quando suffix fica prejudicial.',
        ts: `function maxSubArray(nums: number[]): number {
  let best = nums[0];
  let current = nums[0];
  for (let i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);
  }
  return best;
}`,
      },
    ],
  },
  {
    slug: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'easy',
    categories: ['arrays'],
    prerequisites: ['big-o'],
    tags: ['phase1-bootstrap'],
    estimatedMinutes: 12,
    recommendedOrder: 5,
    descriptionMd: `## Enunciado

Uma única compra e venda: maximiza lucro olhando preços.`,
    examples: [{ input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Compra em 1, vende em 6.' }],
    constraints: [],
    solutions: [
      {
        folder: 'brute-pairs',
        name: 'Todos os dias de compra',
        kind: 'brute-force',
        complexity: { time: 'O(n²)', space: 'O(1)', rationale: 'Compra em i vende depois sempre.' },
        introMd: '# Brute-force em pares dias',
        ts: `function maxProfit(prices: number[]): number {
  let best = 0;
  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      best = Math.max(best, prices[j] - prices[i]);
    }
  }
  return best;
}`,
      },
      {
        folder: 'single-pass-min',
        name: 'Mínimo de compra + scan',
        kind: 'optimal',
        complexity: {
          time: 'O(n)',
          space: 'O(1)',
          rationale:
            '`minPrice` desloca sempre que descobrimos preço menor; atualizamos melhor ganho quando vendemos no dia atual.',
        },
        introMd: '# Greedy 1‑pass\nSó nos interessa o menor preço visto antes de cada dia.',
        ts: `function maxProfit(prices: number[]): number {
  let minPrice = Infinity;
  let best = 0;
  for (const p of prices) {
    minPrice = Math.min(minPrice, p);
    best = Math.max(best, p - minPrice);
  }
  return best;
}`,
      },
    ],
  },
  {
    slug: 'valid-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'easy',
    categories: ['strings', 'two-pointers'],
    prerequisites: ['two-pointers'],
    tags: ['phase1-bootstrap'],
    estimatedMinutes: 10,
    recommendedOrder: 6,
    descriptionMd: `## Enunciado

Palíndromo aofanumérico ignorando espaços não alfanuméricos.`,
    examples: [{ input: 's = \"A man, a plan...\" ', output: 'true' }],
    constraints: [],
    solutions: [
      {
        folder: 'clean-and-reverse',
        name: 'Sanitizar + reverse',
        kind: 'brute-force',
        complexity: { time: 'O(n)', space: 'O(n)', rationale: 'Cópias adicionais do array sanitizado.' },
        introMd: '# Abordagem de arrays auxiliares',
        ts: `function isPalindrome(s: string): boolean {
  const cleaned = [...s.toLowerCase()].filter((ch) =>
    /^[a-z0-9]$/u.test(ch),
  );
  const rev = [...cleaned].reverse();
  return cleaned.join('') === rev.join('');
}`,
      },
      {
        folder: 'two-pointers-scan',
        name: 'Dois ponteiros',
        kind: 'optimal',
        complexity: { time: 'O(n)', space: 'O(1)', rationale: 'Não há materialização extra das strings sanitizadas.' },
        introMd: '# Ponteiros deslizantes\nIgnora símbolo indesejado movendo apenas índices.',
        ts: `function isPalindrome(s: string): boolean {
  let i = 0;
  let j = s.length - 1;

  while (i < j) {
    while (i < j && !/^[a-z0-9]$/iu.test(s[i])) i++;
    while (i < j && !/^[a-z0-9]$/iu.test(s[j])) j--;
    if (i >= j) break;
    if (s[i].toLowerCase() !== s[j].toLowerCase()) return false;
    i++;
    j--;
  }
  return true;
}`,
      },
    ],
  },
  {
    slug: 'merge-sorted-array',
    title: 'Merge Sorted Array',
    difficulty: 'easy',
    categories: ['arrays', 'two-pointers'],
    prerequisites: ['two-pointers'],
    tags: ['phase1-bootstrap'],
    estimatedMinutes: 14,
    recommendedOrder: 7,
    descriptionMd: `## Enunciado

Fundir \`nums2\` em \`nums1\` (com placeholders 0 ao fim).`,
    examples: [],
    constraints: [],
    solutions: [
      {
        folder: 'sort-tail',
        name: 'Colar tail + ordenar',
        kind: 'brute-force',
        complexity: {
          time: 'O((m+n) log(m+n))',
          space: 'O(log(m+n))',
          rationale: '`sort()` nativo suficientemente simples onde performance não é pré-requisito.',
        },
        introMd: '# Inserção grosseira + ordenação estável lexical',
        ts: `function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  for (let k = 0; k < n; k++) {
    nums1[m + k] = nums2[k];
  }
  const sorted = [...nums1.slice(0, m + n)].sort((a, b) => a - b);
  for (let i = 0; i < m + n; i++) {
    nums1[i] = sorted[i];
  }
}`,
      },
      {
        folder: 'merge-from-tail',
        name: 'Do fim ao início',
        kind: 'optimal',
        complexity: {
          time: 'O(m+n)',
          space: 'O(1)',
          rationale:
            '`write` anda para trás; comparamos sempre os dois maiores restantes antes de pisar elementos vivos.',
        },
        introMd: '# Ponteiros inversos clássicos',
        ts: `function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  let i = m - 1;
  let j = n - 1;
  let write = m + n - 1;

  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) {
      nums1[write--] = nums1[i--];
    } else {
      nums1[write--] = nums2[j--];
    }
  }
}`,
      },
    ],
  },
  {
    slug: 'squares-of-a-sorted-array',
    title: 'Squares of a Sorted Array',
    difficulty: 'easy',
    categories: ['arrays', 'two-pointers'],
    prerequisites: ['two-pointers'],
    tags: ['phase1-bootstrap'],
    estimatedMinutes: 12,
    recommendedOrder: 8,
    descriptionMd: `## Objetivo

Quadrados ordenados a partir do array inicial ordenado.`,
    examples: [{ input: 'nums=[-4,-1,0,3,10]', output: '[0,1,9,16,100]' }],
    constraints: [],
    solutions: [
      {
        folder: 'square-sort',
        name: 'Mapeia + ordena',
        kind: 'brute-force',
        complexity: { time: 'O(n log n)', space: 'O(log n)', rationale: 'Ordenação após cópias.' },
        introMd: '# Caminho rápido de validação mental',
        ts: `function sortedSquares(nums: number[]): number[] {
  return nums.map((x) => x * x).sort((a, b) => a - b);
}`,
      },
      {
        folder: 'merge-extremes',
        name: 'Dois ponteiros extremos',
        kind: 'optimal',
        complexity: {
          time: 'O(n)',
          space: 'O(n)',
          rationale: 'Maiores quadrados sempre vêm das pontas pois há monotonia fora da origem.',
        },
        introMd: '# Resultado desde o maior para o menor',
        ts: `function sortedSquares(nums: number[]): number[] {
  const ans = Array.from<number>({ length: nums.length });
  let left = 0;
  let right = nums.length - 1;
  for (let idx = nums.length - 1; idx >= 0; idx--) {
    const l2 = nums[left] * nums[left];
    const r2 = nums[right] * nums[right];
    if (l2 >= r2) {
      ans[idx] = l2;
      left++;
    } else {
      ans[idx] = r2;
      right--;
    }
  }
  return ans;
}`,
      },
    ],
  },
  {
    slug: 'intersection-of-two-arrays-ii',
    title: 'Intersection of Two Arrays II',
    difficulty: 'easy',
    categories: ['arrays', 'hash-tables'],
    prerequisites: ['hash-tables'],
    tags: ['phase1-bootstrap'],
    estimatedMinutes: 14,
    recommendedOrder: 9,
    descriptionMd: `## Enunciado

Interseccionar respeitando repetições mínimas entre ambos.`,
    examples: [],
    constraints: [],
    solutions: [
      {
        folder: 'nested-removal',
        name: 'Procura repetida + flags',
        kind: 'brute-force',
        complexity: { time: 'O(nm)', space: 'O(m)', rationale: 'Flag booleana marca slots consumidos.' },
        introMd: '# Abordagem O(nm) intuitiva',
        ts: `function intersect(nums1: number[], nums2: number[]): number[] {
  const ans: number[] = [];
  const used = nums2.map(() => false);

  for (const x of nums1) {
    for (let j = 0; j < nums2.length; j++) {
      if (!used[j] && nums2[j] === x) {
        ans.push(x);
        used[j] = true;
        break;
      }
    }
  }
  return ans;
}`,
      },
      {
        folder: 'hash-frequency',
        name: 'Contagem decremental',
        kind: 'optimal',
        complexity: {
          time: 'O(n+m)',
          space: 'O(min(n,m))',
          rationale: 'Map conta aparições antes de decrementar segundo array.',
        },
        introMd: '# Memória proporcional aos elementos únicos',
        ts: `function intersect(nums1: number[], nums2: number[]): number[] {
  const count = new Map<number, number>();
  for (const x of nums1) {
    count.set(x, (count.get(x) ?? 0) + 1);
  }
  const ans: number[] = [];
  for (const x of nums2) {
    const remaining = count.get(x) ?? 0;
    if (remaining === 0) continue;
    ans.push(x);
    count.set(x, remaining - 1);
  }
  return ans;
}`,
      },
    ],
  },
  {
    slug: 'move-zeroes',
    title: 'Move Zeroes',
    difficulty: 'easy',
    categories: ['arrays', 'two-pointers'],
    prerequisites: ['two-pointers'],
    tags: ['phase1-bootstrap'],
    estimatedMinutes: 12,
    recommendedOrder: 10,
    descriptionMd: `## Enunciado

Empurrar todos os zeros para o fim mantendo relativa ordem.`,
    examples: [],
    constraints: [],
    solutions: [
      {
        folder: 'copy-nonzero-fill',
        name: 'Cópia auxiliar estável',
        kind: 'brute-force',
        complexity: { time: 'O(n)', space: 'O(n)', rationale: 'Duplicamos filtros antes de recolagem.' },
        introMd: '# Buffer extra\nSempre correcto; útil antes de inplace.',
        ts: `function moveZeroes(nums: number[]): void {
  const filtered = nums.filter((x) => x !== 0);
  nums.fill(0);
  filtered.forEach((value, idx) => {
    nums[idx] = value;
  });
}`,
      },
      {
        folder: 'snowball-swaps',
        name: 'Ponteiro de escrita contíguo',
        kind: 'optimal',
        complexity: {
          time: 'O(n)',
          space: 'O(1)',
          rationale: '`write` apenas avança para não-zero; segunda passagem preenche zeros.',
        },
        introMd: '# Reorganização inplace\nReaproveitas o próprio vetor.',
        ts: `function moveZeroes(nums: number[]): void {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== 0) {
      nums[write++] = nums[read];
    }
  }
  while (write < nums.length) {
    nums[write++] = 0;
  }
}`,
      },
    ],
  },
];

async function main() {
  await Promise.all(SEEDS.map((s) => emitProblem(s)));
  console.log(`Gerados ${SEEDS.length} problemas em ${ROOT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
