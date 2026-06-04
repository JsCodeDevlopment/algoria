/**
 * Real examples from the Acite platform for each content type.
 * These are used by the content editor to show creators how to structure their content.
 */

/* ── Interview EN ─────────────────────────────────────────────────── */

export const INTERVIEW_EN_BODY_EXAMPLE = `## Learning goals (especially if you are B1 / intermediate)

By the end of this page you should:

1. **Name patterns in short English sentences** ("I'll keep a sliding window…" / "I'll use memoization…").
2. Understand **complexity phrases** recruiters expect—without memorizing proofs.
3. Have a **minimal "say it simply" phrase** plus a **polished variant** per idea.

Interview English rewards **accuracy + pacing**, not rare words. If grammar is tiring, prioritize **chunks** (multi-word phrases said as one rhythm).

---

## How to practise (10 minutes/day)

Pick **five** phrases from below and repeat them aloud **ten times**:

- Whisper → normal volume → louder (like you are explaining to a teammate on a call).

Then record **sixty seconds** explaining one LeetCode problem you already solved—but **English only**:

- Aim for seven to ten **chunks**, not fluent storytelling.

---

## "Say it simply" vs "Interview polish" (pattern cheatsheet)

Same idea—two depths. Practice both; use **simple English under stress**.

| Idea | Simple (B1-friendly) | Polished interviewer English |
| --- | --- | --- |
| I need to check membership fast | "I'll store visited values in a set." | "Membership tests must be amortized **\`O(1)\` expected**, so I'll back the lookup with hash-based structure." |
| I walk the structure once | "I'll loop through the array one time." | "I maintain a linear scan preserving an invariant enforced at each step." |
| I reuse earlier work | "I'll save results so I don't repeat work." | "Overlapping subproblems justify memoizing state transitions." |

---

## Arrays & strings

### Core verbs you will actually say

traverse / scan · iterate · index into · mutate in place · copy into auxiliary buffer · concatenate · split tokens

### Narration snippets (copy rhythm more than wording)

- "I'll traverse once and **keep counters / indices** stable while the window slides."
- "If substring uniqueness matters I'll anchor uniqueness with **\`O(alphabet)\`** frequency vector or map."
- "Before optimizing I'll articulate **constraints on mutation** — read-only forbids reshuffling."

---

## Complexity talk (minimal safe templates)

Blend **facts + WHY**:

1. "Each pointer advances at most **\`n\`** times → **\`O(n)\`** aggregated."
2. "Heap operations multiply by **\`log n\`** pushes—not hidden if loop factor explicit."

---

## Drill homework (tiered)

**Tier A (five minutes)**
List five problems you solved; speak only **purpose of each DS** aloud.

**Tier B (twelve minutes)**
Explain one medium problem aloud:
- minute one constraints
- minute two brute idea
- minute three optimised idea + complexity

Weekly repetition beats isolated glossaries—the phrases become **motor memory**.
`;

export const INTERVIEW_EN_META_EXAMPLE = {
  slug: 'dsa-vocabulary-for-interviews',
  title: 'DSA vocabulary you actually say out loud',
  summary: 'High-frequency DSA wording for live explanations—paired with simpler B1-friendly phrases plus drills for pronunciation and complexity talk under stress.',
  estimatedMinutes: 42,
  track: 'vocabulary',
  difficulty: 'medium',
};

/* ── Engineering Work ─────────────────────────────────────────────── */

export const ENGINEERING_WORK_BODY_EXAMPLE = `## Objetivos de aprendizagem

1. Entender **XSS** como confiança mal colocada em dados que viram HTML ou JS no browser.
2. Separar **sanitização** por contexto (HTML vs atributo vs URL vs CSS).
3. Negociar **SEO técnico** com critérios que engenharia pode cumprir e medir.

---

:::didactic-figure
{
  "src": "/engenharia/frontend-xss-seo-superficies-perigosas.svg",
  "alt": "Fluxo de entrada a HTML executável e camadas de defesa; bloco sobre SEO auditável",
  "caption": "CSP não substitui sanitização; SEO técnico traduz-se em requisitos que podes medir (sitemap, canonical, Vitals)."
}
:::

:::didactic-metrics
{
  "title": "Classificação rápida de dados para reviews",
  "columns": 3,
  "items": [
    { "label": "Confiável", "value": "Sistema", "sublabel": "ainda assim escapa por hábito" },
    { "label": "Semi", "value": "Moderador", "sublabel": "política própria" },
    { "label": "Não confiável", "value": "Público", "sublabel": "nunca → HTML cru sem pipeline" }
  ]
}
:::

React: dados dinâmicos no DOM sem interpretar HTML da rede:

\`\`\`tsx
// ✅ texto tratado como texto
export function UserBio({ bio }: { bio: string }) {
  return <p>{bio}</p>;
}

// ⚠️ só com pipeline de sanitização explícita e auditoria
export function RichBio({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
\`\`\`

---

## XSS em linguagem de equipa

Cross-site scripting não é "virus misterioso". É quase sempre: **o servidor ou o cliente aceita texto que contém instruções de página** e coloca-o onde o browser interpreta como código.

---

## Superfícies perigosas no dia-a-dia

| Superfície | Por que dói |
| --- | --- |
| **Rich text editors** | Utilizadores colam HTML de emails; limpar "à mão" falha sempre com tempo. |
| **Campos que ecoam query params** | Mensagens de erro bonitas refletem input sem escape. |
| **Markdown livre → HTML** | Extensões permitem HTML cru se não limitares parser e lista de tags. |
| **Links dinâmicos** | \`javascript:\` ou \`data:\` em \`href\` abrem vetores se não validares protocolo. |

---

## Checklist de revisão de formulário ou CMS

- [ ] Entrada categorizada (confiável / não confiável)?
- [ ] HTML de utilizador passa por pipeline com lista branca documentada?
- [ ] URLs externas validadas quanto a esquema (\`https\` apenas, por exemplo)?
- [ ] CSP ativa em ambientes de pré-produção com relatório de violações?
`;

export const ENGINEERING_WORK_META_EXAMPLE = {
  slug: 'frontend-xss-seo-superficies-perigosas',
  title: 'XSS, formulários ricos e SEO técnico honesto',
  summary: 'De onde nasce script injection na prática, como pensar sanitização por contexto e o que engenharia pode prometer em indexação sem mentir ao marketing.',
  estimatedMinutes: 24,
  pillar: 'frontend',
};

/* ── Problem ──────────────────────────────────────────────────────── */

export const PROBLEM_BODY_EXAMPLE = `## O problema (sem saberes programar… ainda)

Tens uma **lista de números** chamada \`nums\` e um número alvo chamado \`target\`.

Queres responder: **existem dois números nesta lista, em posições diferentes, que somados dão exactamente \`target\`?**

Se existirem, devolves **os dois "números de lugar"** (chamamos **índices**) onde eles aparecem. Por exemplo índices \`1\` e \`3\` porque esses dois lugares diferentes somam bem com o valor pedido.

O enunciado clássico garante-te que **existe sempre** um par válido quando o programa corre.

---

## Analogia rápida

É como encontrares na lista de gastos **duas despesas** cujo valor somado fecha exactamente um objectivo definido antes — usando só a ordem onde apareceram escritas à mão ao longo do bloquinho das compras sem teres de perguntar bocado a bocado infinitamente.

---

## O que estas duas versões aqui na app querem que sintas

Na versão "**força bruta**" vasculhas conscientemente todas as equipas **duas‑a‑duas**.

Na segunda, aprendes a **lembrares no caminho números que já apareceram**, para perguntares instantaneamente: "**já existe o número parceiro disto atrás?**" — ideia repetida mundo fora mesmo em backends enormes quando se indexa eventos repetidos rapidamente sem varrer sempre tudo sempre.
`;

export const PROBLEM_META_EXAMPLE = {
  slug: 'two-sum',
  title: 'Two Sum',
  difficulty: 'easy',
  categories: ['arrays', 'hash-tables'],
  prerequisites: ['big-o', 'hash-tables'],
  tags: ['leetcode-1', 'blind-75', 'neetcode-150'],
  estimatedMinutes: 15,
  recommendedOrder: 1,
  access: 'free',
  examples: [
    { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]', explanation: 'nums[0] + nums[1] == 9, então devolvemos os índices [0, 1].' },
    { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]' },
  ],
  constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', '-10⁹ ≤ target ≤ 10⁹', 'Existe exactamente uma solução válida.'],
};

/* ── Concept ──────────────────────────────────────────────────────── */

export const CONCEPT_BODY_EXAMPLE = `## O problema que resolver — sem ficar perdido na fila

Imagina esta cena mundana:

- Tens uma **lista enorme com nomes** de pessoas que entraram num concerto à porta.
- Alguém pergun-te de repente: "**O João já entrou?**"

Duas estratégias:

1. **Sem ajuda especial** — lês desde o topo da lista até ao fim até encontrares "João" ou ficares convencido que não aparece.
   Se a lista é curta, funciona bem. Se há milhares de nomes **e** alguém repete a pergunta muitas vezes, vais ficar sempre a varrer tudo.

2. **Com um marcador rápido** — à medida que lês a lista na entrada, anotas: **\`João ✓\`** num sítio onde **não precisas de reler todas as páginas**. Esse sistema — no código chama-se muitas vezes **hash map** ou **dicionário** — trata perguntas "já aparece?" de forma **muito rápida**.

---

### Palavras que vais ver no código

- **Chave (key)** — o que perguntamos ("este número já passou?", "esta palavra já contamos?").
- **Valor (value)** — o que guardamos: às vezes só "sim/não"; outras vezes **onde** apareceu (índice).

Em JavaScript/TypeScript aparece sobretudo como \`Map\`. Em outros ecossistemas: \`dict\` em Python, \`HashMap\` em Java.

---

### Quatro padrões que vais repetir sempre

1. **Já apareceu?** — existência rápida (muitas vezes com um \`Set\`).
2. **Quantas vezes?** — contar por chave (\`map[chave] += 1\` mentalmente).
3. **Onde apareceu?** — lembrar o índice original.
4. **Agrupar iguais** — várias strings que são "iguais depois de reordenadas" ficam todas na mesma gaveta (anagramas).

---

### Quando *não* é a primeira escolha?

- Lista **mesmo pequena** — demasiada parafernália não compensa.
- Precisas de **ordenação garantida pela chave** sempre explícita — outras estruturas resolvem isto melhor.

---

## Resumo antes de continuares para os problemas

Um **hash map** guarda associações **chave valor** para **responder rápido** a perguntas repetidas, muitas vezes trocando **memória extra** por **tempo**.
`;

export const CONCEPT_META_EXAMPLE = {
  slug: 'hash-tables',
  title: 'Hash Tables — o canivete suíço das estruturas de dados',
  category: 'hash-tables',
  difficulty: 'medium',
  estimatedMinutes: 10,
  prerequisites: ['big-o'],
  summary: 'Como funciona um hash map por dentro, porque é que O(1) é "amortizado" e quando a tabela hash não é a ferramenta certa.',
  access: 'free',
};
