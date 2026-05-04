# Execution trace — Fase 2 (desenho técnico e MVP)

Este documento fixa o **desenho da Fase 2** descrita no produto (estado da execução alinhado ao code player) e o **MVP já suportado** no repositório.

## Objectivo

Sincronizar **linha activa do player** com uma **vista didática do estado**: vectores com índices realçados, entradas de mapa (`Map` / hash), escalares nomeados.

## Modelo de dados (`trace.json`)

- Ficheiro opcional por solução: `content/problems/<slug>/solutions/<solution-slug>/trace.json`.
- Schema Zod: `ExecutionTraceFileSchema` em [`lib/content/schemas.ts`](../lib/content/schemas.ts).
- Array `steps`: cada entrada tem `line` (número da linha em `solution.ts`, alinhado às anotações) e `snapshot`:
  - `arrays[]`: `label`, `values` (número, string ou `null`), `highlightIndices` opcional.
  - `mapEntries[]`: pares `{ key, value }` para representar um mapa de forma legível.
  - `scalars`: mapa livre `string → string` para variáveis pontuais (`i`, `complement`, …).
  - `caption`: texto curto opcional.

Validação editorial: [`scripts/validate-content.ts`](../scripts/validate-content.ts) garante JSON válido e avisa se alguma linha do trace não corresponde a uma linha anotada.

## Resolução no cliente

[`resolveExecutionSnapshot`](../lib/content/resolve-execution-snapshot.ts) devolve o último snapshot com `step.line <= currentLine`. Assim, linhas sem entrada própria (por exemplo `}`) **herdam** o último estado visual — útil até cada linha ter modelo próprio.

## Limitações do MVP actual

1. **Conteúdo manual**: não há instrumentação nem execução real do código; o autor define snapshots.
2. **Uma linha física = uma entrada**: voltas ao mesmo número de linha no `for` partilham o mesmo snapshot na primeira passagem do utilizador (expandir na Fase 2 com índices de passo ou IDs de «momento»).
3. **Tipos cobertos**: apenas estruturas tabulares simples (arrays + mapas como lista); árvores/grafos ficam para iterações futuras (`react-flow`, SVG).

## Extensões recomendadas

- Gerador semi-automático a partir de exemplos fixos do enunciado.
- Tipos `stack`, `queue`, `linked-list` no mesmo ficheiro com layouts específicos.
- Validação estrita opcional: cada linha anotada obriga entrada em `trace.json`.

## Referência de UI

Componente cliente: [`components/code-player/execution-trace-panel.tsx`](../components/code-player/execution-trace-panel.tsx), montado por [`components/code-player/code-player.tsx`](../components/code-player/code-player.tsx) quando existem passos válidos.
