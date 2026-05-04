# LeetCode Didático — Plano de Produto e Engenharia

> Documento de planeamento. Última actualização: 2026-05-01.
> Projecto novo, standalone (não depende de marketplace, poker-pro,
> backend monorepo). Codename provisório: **Algoria**.

## 1. Visão

Hoje o LeetCode optimiza para **resolver problemas** (entrevista de
emprego). Há centenas de YouTubers e cursos a explicar a *resposta*,
mas pouquíssimas ferramentas a explicar **o porquê e o como** —
linha-por-linha, no momento exacto em que o utilizador olha para o
código.

A **Algoria** é uma plataforma onde o utilizador **não escreve código** —
ele escolhe um exercício, escolhe uma estratégia de solução
(brute-force, óptima, alternativas), e percorre o código linha a linha
recebendo uma explicação extremamente didática:

- O que aquela linha faz.
- Porque foi escrita assim e não de outra forma.
- Que estrutura/algoritmo foi escolhido e porquê.
- Que conceito de complexidade está a ser exercitado (`O(n)`, `O(log n)`,
  `O(n²)`, …).
- Como o estado das variáveis muda quando aquela linha executa.

A diferença em relação ao LeetCode tradicional, ao NeetCode, AlgoExpert
e similares está em **três pilares simultâneos**:

1. **Foco no aprendizado**, não na velocidade de resolução.
2. **Múltiplas soluções por problema**, com comparação explícita
   brute-force ↔ óptima e explicação de quando cada uma é aceitável.
3. **Explicação granular** ao nível de linha, com vários níveis de
   profundidade (resumo → detalhado → deep-dive).

## 2. Proposta de valor

| Perfil | Dor actual | Como Algoria resolve |
| --- | --- | --- |
| Estudante de CS | Vê a solução no LeetCode mas não percebe porquê funciona | Cada linha tem explicação didática progressiva |
| Self-taught dev | Não tem base teórica de complexidade | Conceitos pré-requisitos linkados em cada problema |
| Dev sénior a refrescar | Quer comparar abordagens rapidamente | Brute-force vs óptima lado-a-lado com trade-offs |
| Bootcamper preparando entrevistas | Decora soluções mas falha em variantes | Aprende o "padrão", não o "código" |

## 3. Personas e Jobs-To-Be-Done

### Persona A — "Aprendente curioso"

- 19–25 anos, estudante de Engenharia/CC ou bootcamp.
- Já tentou LeetCode, ficou frustrado por não entender soluções.
- JTBD: *"Quando vejo uma solução que funciona, quero entender porque
  funciona, para a saber adaptar a problemas parecidos."*

### Persona B — "Profissional a actualizar-se"

- 25–40 anos, dev profissional, vai a uma entrevista em 2 meses.
- Sabe programar mas é fraco em complexidade e em padrões clássicos.
- JTBD: *"Quero rever os 75 problemas mais importantes em 4 semanas,
  com confiança de que estou a perceber e não a decorar."*

### Persona C — "Educador / Mentor"

- Coach, professor, criador de conteúdo.
- JTBD: *"Quero linkar para os meus alunos uma explicação visual e
  granular sem ter de ser eu a fazer todas as vezes."*

## 4. Funcionalidades — MVP e roadmap

### 4.1 MVP (Fase 1)

1. **Catálogo de problemas**
   - Filtros: dificuldade (Easy/Medium/Hard), categoria (Arrays, Hash
     Tables, Two Pointers, …), status (não visto / em progresso /
     concluído — local-storage no MVP, sem auth).
   - Ordenação: dificuldade, ordem recomendada de aprendizagem.
2. **Página do problema**
   - Enunciado em MDX com exemplos, constraints, edge cases.
   - Lista de **conceitos pré-requisitos** linkados (e.g. "antes de
     fazer este, lê: Big O, Hash Tables").
   - Selector de **estratégia de solução**: Brute-force, Óptima,
     Alternativa (quando faz sentido).
3. **Player linha-por-linha** (a peça central)
   - Editor read-only com syntax highlighting (Monaco ou Shiki).
   - Linha activa com highlight visual claro.
   - Painel lateral com explicação da linha actual.
   - **Três níveis de profundidade** por linha:
     - Nível 1 — Resumo (1–2 frases)
     - Nível 2 — Detalhado (parágrafo, exemplos)
     - Nível 3 — Deep-dive (porque não fazer de outra forma,
       referências, trade-offs)
   - Controles: linha anterior / próxima / play (autoplay) /
     velocidade.
   - Atalhos de teclado: ←/→ para linhas, espaço para play/pause,
     1/2/3 para nível de explicação.
4. **Análise de complexidade** (no fim de cada solução)
   - Tempo e espaço com explicação.
   - Comparação visual quando há mais que uma solução para o mesmo
     problema (brute-force vs óptima).
5. **Mini-cursos de conceitos**
   - Big O notation, hash tables, two-pointers, sliding window,
     recursão básica, DP introdutório.
   - Pré-requisito explícito linkado dos problemas.

### 4.2 Fase 2 — Visualizador de execução

- Para cada solução, gerar um **execution trace**: estado das
  variáveis em cada linha executada.
- Componentes visuais por tipo de estrutura:
  - Array com índice destacado.
  - Hash map em formato chave→valor.
  - Linked list, tree, graph (renderizadas com `react-flow` ou SVG
    custom).
  - Stack/queue.
- Botões: passo anterior, próximo passo, "play" do trace inteiro.
- Sincronização: avançar a linha avança o estado, e vice-versa.

### 4.3 Fase 3 — Conteúdo escalado

- 75–150 problemas curados (cobre o "Blind 75" e Neetcode 150).
- 30+ mini-cursos de conceitos.
- Visual gallery com gráficos animados de Big O comparando funções.

### 4.4 Fase 4 — Auth + progresso + gamificação

- Auth (OAuth Google/GitHub + e-mail) com Better Auth ou Clerk.
- Progresso server-side (sincroniza entre devices).
- Streaks, badges, "review queue" baseado em spaced repetition.
- Histórico: "viste esta solução em DD/MM, queres rever?".

### 4.5 Fase 5 — AI Tutor

- "Pergunta livre" sobre a linha actual: o utilizador escreve uma
  pergunta em linguagem natural, o sistema responde com contexto da
  linha + estado actual da execução + conceitos relacionados.
- Modelo: GPT-5/Claude com system prompt curado por problema (não
  generic LLM call).
- **Importante**: respostas geradas devem ser citáveis para a
  documentação humana — não substituem a explicação curada, complementam.

### 4.6 Fase 6 — Comunidade e UGC

- Utilizadores podem submeter **explicações alternativas** de uma
  linha (revistas por moderação).
- Discussão por linha (à la Genius lyrics).
- Soluções submetidas pela comunidade (Pull-Request style).

## 5. Arquitectura técnica

### 5.1 Stack

| Camada | Escolha | Razão |
| --- | --- | --- |
| Framework | Next.js 15 (App Router) | SSR para SEO, streaming, server actions |
| Linguagem | TypeScript estrito | Tipos para o conteúdo (DSL) |
| UI | Tailwind v4 + shadcn/ui + Radix | Acessibilidade out-of-the-box |
| Editor | Shiki (highlight) + Monaco quando precisar de hover | Shiki é leve e suficiente para read-only |
| Conteúdo | MDX + JSON | MDX para texto longo, JSON para metadata estruturada |
| State (UI) | React + Zustand para o player | Player tem state complexo (linha, nível, autoplay) |
| Persistência local (MVP) | localStorage com Zod validation | Sem backend na fase 1 |
| BD (Fase 4+) | Postgres + Drizzle ORM | Type-safe, migrações simples |
| Auth (Fase 4+) | Better Auth ou Clerk | Setup rápido, OAuth incluído |
| Hosting | Vercel | Edge runtime e ISR para conteúdo |
| Analytics | PostHog (open source) | Eventos custom para "linha lida" |
| Visualizadores | SVG custom + Framer Motion | Controlo fino sobre animações |

### 5.2 Decisões importantes

- **Conteúdo é dado, não código**. Cada problema é um folder
  `content/problems/<slug>/` com MDX e JSON. Trocar de plataforma de
  CMS no futuro é um cherry-pick. Permite PRs de conteúdo.
- **Read-only no editor**. O utilizador **não digita**. Isto liberta-nos
  de ter sandbox de execução (judge backend, Docker, segurança).
- **Execution trace pré-gerado**. Não corremos o código do utilizador
  em runtime; o trace é gerado **uma vez** (build-time ou
  manualmente) e guardado em JSON. Funciona porque o input é fixo.
- **i18n preparado desde dia 1**. Estrutura permite traduzir as
  explicações sem mudar arquitectura. Idiomas iniciais: pt-BR, en.
- **Acessibilidade é first-class**. Player navegável só com teclado;
  leitor de ecrã anuncia mudança de linha e nível.

## 6. Modelo de dados

### 6.1 Tipos centrais (TypeScript)

```ts
type Difficulty = 'easy' | 'medium' | 'hard';

type Category =
  | 'arrays'
  | 'hash-tables'
  | 'two-pointers'
  | 'sliding-window'
  | 'binary-search'
  | 'linked-list'
  | 'trees'
  | 'graphs'
  | 'dynamic-programming'
  | 'greedy'
  | 'backtracking'
  | 'bit-manipulation'
  | 'math';

type Complexity = {
  time: string;            // 'O(n)'
  space: string;           // 'O(1)'
  rationale: string;       // MDX curto a explicar
};

interface Problem {
  slug: string;
  title: string;            // 'Two Sum'
  difficulty: Difficulty;
  categories: Category[];
  prerequisites: string[];  // slugs de Concept
  description: string;      // path para MDX
  examples: Array<{ input: string; output: string; explanation?: string }>;
  constraints: string[];
  solutions: Solution[];
  tags: string[];
}

interface Solution {
  slug: string;             // 'brute-force', 'hash-map'
  name: string;             // 'Brute-force (nested loops)'
  kind: 'brute-force' | 'optimal' | 'alternative';
  language: 'typescript' | 'python' | 'java' | 'cpp';
  code: string;             // path para .ts/.py
  complexity: Complexity;
  intro: string;            // MDX overview da solução
  annotations: LineAnnotation[];
  trace?: ExecutionTrace;   // opcional, Fase 2
}

interface LineAnnotation {
  line: number;             // 1-indexed
  level1: string;           // resumo, 1-2 frases (markdown leve)
  level2?: string;          // detalhado (MDX)
  level3?: string;          // deep-dive (MDX)
  concepts?: string[];      // slugs de Concept linkados
  warnings?: string[];      // pitfalls comuns
}

interface ExecutionTrace {
  input: unknown;           // input usado
  steps: ExecutionStep[];
}

interface ExecutionStep {
  line: number;
  variables: Record<string, JsonValue>;
  callStack?: string[];     // para recursão
  highlight?: {             // qual variável/index destacar
    variable: string;
    index?: number;
    key?: string;
  };
  note?: string;            // override do annotation default
}

interface Concept {
  slug: string;
  title: string;
  category: Category | 'fundamentals';
  body: string;             // path para MDX
  estimatedMinutes: number;
  prerequisites: string[];
}
```

### 6.2 Estrutura de conteúdo no disco

```
content/
├── problems/
│   └── two-sum/
│       ├── meta.json              # Problem (sem code/annotations inline)
│       ├── description.mdx
│       └── solutions/
│           ├── brute-force/
│           │   ├── meta.json      # Solution metadata + complexity
│           │   ├── solution.ts    # código real
│           │   ├── intro.mdx
│           │   ├── annotations.json   # array de LineAnnotation
│           │   └── trace.json     # opcional, gerado
│           └── hash-map/
│               └── ... (mesma estrutura)
├── concepts/
│   ├── big-o/
│   │   ├── meta.json
│   │   └── body.mdx
│   ├── hash-tables/
│   │   └── ...
│   └── two-pointers/
│       └── ...
└── learning-paths/
    └── blind-75.json               # ordem recomendada
```

### 6.3 Validação de conteúdo

- Cada `meta.json` tem schema Zod.
- Build falha se um `Solution` tem `annotations` para linhas
  inexistentes no `solution.ts`.
- Build falha se um `prerequisite` aponta para Concept que não existe.
- CI verifica que cada Solution tem pelo menos `level1` para cada
  linha não-trivial (whitespace e `}` podem ser opcionais).

## 7. UX — fluxos chave

### 7.1 Fluxo de aprendizagem (happy path)

1. Utilizador abre `/`.
2. Vê CTAs: "Começar pelo básico" / "Explorar problemas" / "Ver
   conceitos".
3. Clica "Explorar problemas" → catálogo `/problems`.
4. Filtra por dificuldade Easy + categoria Arrays.
5. Clica em "Two Sum" → `/problems/two-sum`.
6. Vê o enunciado, exemplos, constraints. Vê callout de pré-
   requisitos: "Recomendamos saber: Big O, Hash Tables".
7. Pode fazer side-trip aos conceitos antes de continuar.
8. Escolhe estratégia: "Brute-force" ou "Hash Map (óptima)".
9. Aterra em `/problems/two-sum/hash-map`.
10. Vê o código completo highlighted. Linha 1 destacada. Painel à
    direita com explicação Nível 1.
11. Carrega `→` ou clica "Próxima linha". Linha 2 destacada,
    explicação muda. Pode subir para Nível 2 ou 3 com `2`/`3`.
12. (Fase 2) Em paralelo, painel inferior mostra estado das
    variáveis: `nums = [2,7,11,15]`, `target = 9`, `seen = {}`.
13. No fim, vê secção "Análise de complexidade" e tem CTA "Ver outra
    solução: Brute-force" para comparação.

### 7.2 Fluxo de comparação

- Botão "Comparar com brute-force" abre modo split: dois players
  lado-a-lado, sincronizados pela mesma execução conceptual.
- Diff visual destaca linhas que mudaram entre estratégias.

### 7.3 Edge cases de UX

- Mobile: player vira vertical (código em cima, explicação em baixo,
  swipe horizontal para mudar linha).
- Sem JavaScript: SSR renderiza o código + primeira linha + Nível 2
  inline (graceful degradation).
- Linha tem só `}`: pular automaticamente em autoplay (configurable).

## 8. Estrutura de pastas (proposta)

```
algoria/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                # landing
│   │   ├── pricing/page.tsx        # se houver tier pago
│   │   └── about/page.tsx
│   ├── (app)/
│   │   ├── problems/
│   │   │   ├── page.tsx            # catálogo
│   │   │   ├── [slug]/
│   │   │   │   ├── page.tsx        # overview do problema
│   │   │   │   └── [solution]/
│   │   │   │       └── page.tsx    # player
│   │   ├── concepts/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── paths/
│   │       └── [slug]/page.tsx     # learning paths
│   ├── api/
│   │   └── trace/[problem]/[solution]/route.ts
│   ├── layout.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── code-player/
│   │   ├── CodePlayer.tsx          # componente raiz
│   │   ├── CodeView.tsx            # renderiza código com highlight
│   │   ├── LineHighlighter.tsx
│   │   ├── ExplanationPanel.tsx    # Painel lateral
│   │   ├── PlayerControls.tsx      # play/pause/speed/level
│   │   ├── KeyboardShortcuts.tsx   # registers atalhos
│   │   └── usePlayerStore.ts       # Zustand
│   ├── execution-visualizer/       # Fase 2
│   │   ├── ArrayVisual.tsx
│   │   ├── HashMapVisual.tsx
│   │   ├── TreeVisual.tsx
│   │   ├── LinkedListVisual.tsx
│   │   ├── StackVisual.tsx
│   │   └── VariablePanel.tsx
│   ├── complexity/
│   │   ├── ComplexityBadge.tsx
│   │   ├── ComplexityChart.tsx     # Big O comparativo
│   │   └── ComparisonTable.tsx
│   ├── catalog/
│   │   ├── ProblemCard.tsx
│   │   ├── DifficultyBadge.tsx
│   │   └── Filters.tsx
│   └── ui/                         # shadcn primitives
├── lib/
│   ├── content/
│   │   ├── loader.ts               # carrega problems do FS
│   │   ├── schemas.ts              # Zod schemas
│   │   └── search.ts
│   ├── progress/
│   │   ├── localProgress.ts        # localStorage
│   │   └── serverProgress.ts       # Fase 4
│   └── analytics.ts
├── content/
│   ├── problems/
│   ├── concepts/
│   └── learning-paths/
├── scripts/
│   ├── validate-content.ts         # Zod + integridade
│   └── generate-trace.ts           # Fase 2: gera trace.json automaticamente
├── public/
└── tests/
```

## 9. Plano de execução por fases

### Fase 0 — Discovery & design (1 semana)

- [ ] Wireframes Figma das 4 telas-chave (catálogo, problema, player,
      conceito).
- [ ] Componente "Player" prototipado em isolamento (Storybook).
- [ ] Definir paleta, tipografia (mono para código + sans para texto),
      espaçamento.
- [ ] Validar 1 explicação completa de Two Sum / Hash Map com 2
      utilizadores reais (teste de comprensibilidade).

### Fase 1 — MVP (4 semanas)

- [ ] Setup repo Next.js 15 + Tailwind + shadcn.
- [ ] `lib/content/loader.ts` lê `content/problems/`.
- [ ] Catálogo `/problems` com filtros e search.
- [ ] Página de problema com tabs (Enunciado / Soluções).
- [ ] **CodePlayer** funcional (linha-por-linha, 3 níveis,
      keyboard nav).
- [ ] 10 problemas curados (Easy + Medium iniciais), 2 soluções cada.
- [ ] 8 conceitos: Big O, Hash Tables, Two Pointers, Sliding Window,
      Recursão, Stack, Queue, Linked List.
- [ ] sitemap.ts + robots.ts (espelha padrão dos outros projectos).
- [ ] Deploy em Vercel.
- [ ] PostHog instrumentado (eventos: `problem_open`, `solution_open`,
      `line_view`, `level_change`, `concept_open`).

### Fase 2 — Visualizador (3 semanas)

- [ ] `scripts/generate-trace.ts` corre o código com input fixo e
      grava `trace.json`.
- [ ] Componentes de visualização (Array, HashMap, Tree).
- [ ] Sincronização player ↔ trace.
- [ ] 5 problemas iniciais com trace completo.

### Fase 3 — Escalar conteúdo (contínuo)

- [ ] Atingir 75 problemas (Blind 75 cobertos).
- [ ] 30 conceitos.
- [ ] 4 learning paths: "Iniciante absoluto", "Blind 75", "Dynamic
      Programming intensivo", "Estruturas de dados clássicas".

### Fase 4 — Auth + sincronização (2 semanas)

- [ ] Better Auth com Google/GitHub.
- [ ] Schema Postgres + Drizzle: `users`, `progress`, `bookmarks`,
      `streaks`.
- [ ] Migração transparente do localStorage para servidor no primeiro
      login.
- [ ] Página `/me` com dashboard de progresso.

### Fase 5 — AI Tutor (3 semanas)

- [ ] System prompt template por problema (com contexto da solução).
- [ ] Endpoint `POST /api/tutor` com streaming.
- [ ] UI: pergunta livre dentro do player (foco mantém-se no estudo).
- [ ] Rate limiting + custo monitorizado.
- [ ] Logs de respostas para curadoria humana posterior.

### Fase 6 — Comunidade (4+ semanas)

- [ ] Submissão de explicações alternativas (PR-style com moderação).
- [ ] Comentários por linha.
- [ ] Sistema de upvote para "explicação mais clara".

## 10. Conteúdo — guia editorial

### 10.1 Tom

- **Conversacional mas preciso**. Evitar jargão sem o explicar logo.
- **2ª pessoa** ("nota como aqui usamos um Map") em vez de 1ª pessoa
  do plural ("usamos") ou voz passiva.
- **Frases curtas**. Idealmente <25 palavras por frase.

### 10.2 Estrutura de uma anotação

- **Nível 1 (sempre obrigatório)**: o que esta linha faz, em 1–2 frases.
  Sem jargão.
- **Nível 2 (recomendado em linhas-chave)**: porque foi escrita assim,
  o que aconteceria se fosse de outra forma, exemplo concreto.
- **Nível 3 (opcional)**: trade-offs, edge cases, referência a paper
  ou link, performance hidden cost (cache miss, GC pressure, …).

### 10.3 Checklist por problema

Antes de publicar:

- [ ] Enunciado em pt-BR e en (mínimo).
- [ ] Pelo menos 2 estratégias de solução (brute-force + óptima).
- [ ] Para cada solução: complexity time + space justificada.
- [ ] Pelo menos 80% das linhas têm Nível 1.
- [ ] Linhas-chave (loop principal, condição não óbvia, retorno) têm
      Nível 2.
- [ ] Pré-requisitos linkados.
- [ ] 3 utilizadores leram e perceberam sem precisar de googlar.

## 11. Métricas de sucesso

### 11.1 Engajamento

- **Time on page** por problema (target: > 4 min).
- **% de linhas lidas** (computed): scroll + tempo na linha.
- **% de soluções concluídas** (chegam à última linha).
- **Conversão de "vi enunciado" → "abri solução"** (target: > 70%).
- **Conversão de "abri Brute-force" → "abri Óptima"** (target: > 50%).

### 11.2 Aprendizagem (proxy)

- **Repeat rate**: utilizador volta a abrir o mesmo problema dias
  depois (esperado para revisão).
- **Concept dive rate**: % de utilizadores que clica num pré-requisito
  durante a leitura de um problema.
- **Path completion**: % que termina um learning path inteiro.

### 11.3 Negócio (Fase 4+)

- Free → Premium conversion.
- Churn mensal < 5%.
- NPS > 50.

## 12. Riscos e mitigações

| Risco | Severidade | Mitigação |
| --- | --- | --- |
| Custo de criação de conteúdo (cada problema demora 2–4h a curar bem) | Alta | Pipeline assistido por LLM com revisão humana obrigatória; pagar a colaboradores externos para Fase 3 |
| Qualidade inconsistente entre autores | Média | Style guide editorial + linter de conteúdo + revisão dupla |
| LLM hallucinations no AI Tutor (Fase 5) | Alta | Sandbox: AI só pode citar conceitos existentes; logs auditados; respostas com confidence baixa caem para "Não tenho a certeza, [link humano]" |
| Performance do player com soluções >100 linhas | Média | Virtualização do scroll de código; carregar annotations lazy por nível |
| Mobile UX é fraco para "ler código" | Média | Layout dedicado + considerar app nativa em fase tardia |
| LeetCode tem direitos sobre os enunciados | Média | Reescrever os enunciados pela própria equipa; nunca copiar verbatim |
| SEO competitivo (NeetCode, AlgoExpert têm vantagem) | Média | Long-tail: cada (problema × estratégia × linha) é uma URL única indexável; AI agents podem citar-nos |

## 13. Considerações futuras

- **App nativa (iOS/Android)**: o player linha-por-linha é
  excepcionalmente adequado a swipe gestures. Provavelmente Capacitor
  ou Expo a partir do core web.
- **Modo "questionário"**: depois do player, fazer perguntas de
  compreensão antes de marcar como concluído.
- **Whiteboarding mode**: permitir desenhar por cima do código (útil
  para explicar trees, graphs).
- **Integração com IDEs**: extensão VS Code que mostra a explicação
  da linha actual quando o utilizador está a resolver no LeetCode.
- **Monetização** (se aplicável): Free (10 problems + conceitos
  básicos) + Pro (todos + visualizer + AI tutor + offline).

## 14. Inspirações e referências

- [LeetCode](https://leetcode.com), [NeetCode](https://neetcode.io),
  [AlgoExpert](https://www.algoexpert.io/) — concorrentes diretos.
- [Python Tutor](https://pythontutor.com) — visualizador de execução.
- [Genius](https://genius.com) — anotações por linha.
- [Brilliant](https://brilliant.org) — UX de aprendizagem progressiva.
- [Excalidraw](https://excalidraw.com) — possível para
  whiteboarding mode.
- ["Big O Cheat Sheet"](https://www.bigocheatsheet.com/) — referência
  visual para a página de conceitos.

## 15. Próximo passo concreto

Se este plano for aprovado, o passo zero é:

1. Validar o **CodePlayer** isoladamente — protótipo HTML+JS de uma
   página com Two Sum / Hash Map e 3 níveis de explicação.
2. Mostrar a 5 utilizadores potenciais (3 estudantes, 2 devs
   profissionais) e iterar até toda a gente perceber a primeira
   solução sem ajuda externa.
3. Só depois: Fase 1.

Razão: a viabilidade do produto inteiro depende da qualidade desta
única peça. Se o player não convencer em 5 minutos, o resto não vale
a pena.
