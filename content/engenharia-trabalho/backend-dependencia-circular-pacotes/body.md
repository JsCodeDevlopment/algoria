## Objetivos de aprendizagem

1. Explicar **porque é que** um ciclo de imports pode partir inicialização e testes sem dar erro óbvio até rebentar em produção.
2. **Detectar** ciclos em TypeScript/JavaScript, Java e monorepos antes do merge.
3. Aplicar **três estratégias** comprovadas para cortar o ciclo sem “god package” genérico.

---

:::didactic-figure
{
  "src": "/engenharia/backend-dependencia-circular-pacotes.svg",
  "alt": "Três módulos A B C ligados num ciclo de importação",
  "caption": "Quando o grafo fecha, qualquer ordem de carregamento pode ser a errada — o sintoma nem sempre é erro na primeira linha."
}
:::

:::didactic-metrics
{
  "title": "Sinais de alerta num codebase maduro",
  "columns": 4,
  "items": [
    { "label": "Ordem", "value": "Frágil", "sublabel": "testes só passam em certa suite" },
    { "label": "Startup", "value": "undefined", "sublabel": "export usado antes de inicializar" },
    { "label": "Refactor", "value": "Medo", "sublabel": "mover um ficheiro parte uma dezena" },
    { "label": "CI", "value": "Flaky", "sublabel": "mesmo commit verde e vermelho" }
  ]
}
:::

:::didactic-bar-chart
{
  "title": "Custo relativo de estratégias para desfazer um ciclo (ilustrativo)",
  "unit": "esforço 1–10 (maior = mais trabalho inicial)",
  "bars": [
    { "label": "Extrair contrato", "value": 4 },
    { "label": "Inverter dependência", "value": 5 },
    { "label": "Eventos / fila", "value": 6 },
    { "label": "God package", "value": 9 }
  ],
  "caption": "God package parece rápido e empata dívida técnica — contratos pequenos custam menos ao longo dos trimestres."
}
:::

## Analogia rápida: dois colegas numa reunião fechada

Imagina que **Ana** só decide depois de ouvir **Bruno**, mas **Bruno** só prepara o slide depois de ver a decisão da Ana. **Ninguém** pode ir primeiro: é um **impasse lógico**. Em código, o *runtime* tenta uma ordem de carregamento; em linguagens com avaliação preguiçosa o problema esconde-se até alguém chamar o módulo tarde demais.

---

## O que é uma dependência circular

**Grafo dirigido**: cada módulo (pacote, *namespace*, ficheiro) é um nó; um `import` é uma aresta. **Ciclo** = caminho que volta ao mesmo nó.

- **Ciclo direto**: `A → B → A`.
- **Ciclo longo**: `A → B → C → A` (como no diagrama).

O problema não é o desenho no quadro branco — é **acoplamento temporal**: dois mundos precisam um do outro no **mesmo instante** de arranque.

---

## Passo a passo — detectar antes de discutir arquitetura

### 1. Ferramentas por ecossistema

| Stack | Ferramenta típica | O que procuras |
| --- | --- | --- |
| TS / JS | `madge --circular`, `dependency-cruiser` | lista de ciclos com ficheiros |
| Java | `archunit`, módulos Gradle/Maven | violações de camadas |
| Monorepo | grafo do build (Nx, Turborepo) | dependências proibidas entre apps |

Regra de equipa: **o CI falha** se aparecer ciclo novo — não é aviso.

### 2. Ler o primeiro ciclo pequeno

Escolhe **apenas** `A ↔ B`. Pergunta: *que conceito de domínio pertence a ambos?* Esse conceito é candidato a **extrair** para um terceiro módulo.

---

## Três formas de cortar o ciclo (com mentalidade de domínio)

### 1) Extrair **contrato** (*interfaces* / tipos / DTO)

Move o que **ambos** precisam para `contracts/` ou `domain/` sem implementação pesada. `A` e `B` passam a depender do contrato, **não um do outro**.

Boas práticas:

- Contrato **estável** — mudanças versionadas.
- **Sem** lógica de *framework* dentro do contrato.

### 2) **Inversão de dependência** (DIP)

Quem tem regra de negócio define **interface**; infraestrutura implementa. O ciclo quebra porque o domínio deixa de importar detalhes de e-mail, HTTP ou ORM diretamente.

### 3) **Comunicação assíncrona** (*evento*, fila, *message bus*)

Quando dois contextos precisam “reagir” um ao outro mas não precisam na mesma pilha de chamadas: `A` publica `UserSuspended`; `B` subscreve. O grafo de **import** deixa de ser ciclo (depende do desenho do *bus*).

---

## Erros comuns

- **Barrel files** (`index.ts` que reexporta tudo) que escondem o ciclo real — desliga temporariamente *barrels* para ver o grafo verdadeiro.
- **Test doubles** no mesmo pacote que produção, criando imports cruzados “só para *mock*”.
- Resolver com **`require()` dinâmico** dentro de função: mascara o problema e dificulta *tree-shaking* e análise estática.

---

## Checklist para PR que toca em fronteiras de módulo

- [ ] **Corre** `madge` / `depcruise` localmente e **anexa** o *output* ou o sumário no PR.
- [ ] Novos tipos partilhados vivem num pacote **sem** dependência de UI nem de *adapter* de BD.
- [ ] Se introduziste evento, documentaste **schema** e **idempotência** do consumidor.

---

## Glossário

- **DIP** (*Dependency Inversion Principle*): módulos de alto nível não dependem de detalhes de baixo nível; ambos dependem de abstrações.
- **Barrel file**: ficheiro agregador de *exports*; útil como API pública, perigoso se virar “lixo comum”.
- **Acoplamento temporal**: dois módulos precisam um do outro no mesmo momento de inicialização.

---

## Exercício de equipa (25 minutos)

Desenha no quadro o grafo atual do teu serviço preferido (5–8 caixas). Marca um ciclo real ou hipotético. Escolhe **uma** estratégia (contrato, DIP ou evento) e escreve **duas frases** de plano de migração em três PRs — sem “*refactor* *big bang*”.
