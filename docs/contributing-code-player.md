# Code player — línguas e contribuição

Este guia resume como as **explicações linha-a-linha** funcionam por idioma e o que esperar ao acrescentar código ou conteúdo.

## Onde está a lógica

- Página da solução: `app/problems/[slug]/[solution]/page.tsx`.
- Regras por idioma: `lib/content/language.ts` (`isLineSyncLanguage`, mensagens de modo só leitura).
- O loader carrega sempre `solution.ts` + `annotations.json` da pasta da solução; código alternativo aparece como outros ficheiros `solution.{ext}`.

## Idiomas «com player completo»

As **anotações** (`annotations.json`) são escritas para as **linhas do ficheiro canónico** (`meta.language`, tipicamente **TypeScript** `solution.ts`).

Quando o visitante escolhe outra língua no selector:

- Se essa língua está na lista «sync» (`javascript`, `typescript` na implementação actual), as linhas do ficheiro correspondente devem **alinhar** com as mesmas linhas que as anotações — caso contrário o player desalinha.
- Se escolher uma língua **fora** dessa lista (ou sem `annotations` aplicável), o painel passa a **modo só leitura** explicando que as explicações curadas são para o idioma canónico.

Antes de prometer «player linha-a-linha» numa nova língua, garante:

1. Ficheiro de código presente para essa língua na pasta da solução.
2. **Mesmo número de linhas** e mesma estrutura que `solution.ts`, ou actualiza `language.ts` para marcar essa língua como não-sync.

## Opcional: trace visual (`trace.json`)

Modelo descrito em `docs/execution-trace-phase2.md`. Cada entrada usa números de **linha em `solution.ts`**. Validação editorial (`pnpm validate:content`) avisa se uma linha do trace não existe nas anotações.

## Fluxo rápido para nova solução

1. Copiar uma pasta de solução existente como modelo (meta + intro + annotations).
2. Correr `pnpm validate:content` antes do PR.
3. Se adicionares `trace.json`, mantém consistência com exemplos do enunciado.
