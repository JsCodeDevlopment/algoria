## Objetivos de aprendizagem

1. Definir **gates** mínimos que um pipeline deve validar antes de promover artefacto.
2. Comparar libertação **big bang** vs **gradual** sem buzzwords vazias.
3. Executar **rollback** sem apagar dados nem confiar só em “git revert”.

---

:::didactic-figure
{
  "src": "/engenharia/devops-pipelines-deploy-rollbacks.svg",
  "alt": "Pipeline build test artifact promote deploy e quatro modos de deploy",
  "caption": "Canary sem métricas úteis é teatro · rollback de código não desfaz migração já aplicada."
}
:::

:::didactic-metrics
{
  "title": "Gates mínimos antes de promover artefacto",
  "columns": 4,
  "items": [
    { "label": "Build", "value": "Reprod.", "sublabel": "checksum igual ao commit" },
    { "label": "Testes", "value": "Pirâmide", "sublabel": "unit + integração + e2e crítico" },
    { "label": "Secrets", "value": "Inject", "sublabel": "nunca em repo" },
    { "label": "Obs.", "value": "Acoplada", "sublabel": "erro + latência na libertação" }
  ]
}
:::

:::didactic-bar-chart
{
  "title": "Risco residual por estratégia (ilustrativo)",
  "unit": "1–10 (maior = mais risco)",
  "bars": [
    { "label": "Recreate", "value": 7 },
    { "label": "Rolling", "value": 5 },
    { "label": "Canary", "value": 3 },
    { "label": "Blue-green", "value": 4 }
  ],
  "caption": "Canary precisa observação; blue-green duplica custo temporário mas simplifica swap."
}
:::

Fragmento declarativo de pipeline (GitHub Actions estilo):

```yaml
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
      - run: pnpm audit --audit-level=high
```

---

## Pipeline como conversa com risco

Pipeline automatiza decisões repetíveis: **build**, **testes**, **análise estática**, eventualmente **assinatura** e **promoção**.

Separar mentalmente:

- **Integração contínua**: cada merge corre verificações rápidas — falhou, não merges ou revert imediato.
- **Entrega contínua**: principal está sempre deployável; libertação pode ser manual ou automática com políticas.

---

## Passo a passo — gates sensatos

### 1. Build reprodutível

Mesmo commit → mesmo artefacto (checksum). Evita “funciona na minha máquina” transformado em imagem Docker mágica.

### 2. Testes em pirâmide

Unitários rápidos bloqueiam regressões óbvias; integração cobre contratos; poucos end-to-end caros correm em ramos estáveis ou nocturnos se budget apertar — mas **nunca zero** se há fluxo crítico de receita.

### 3. Secrets e configuração

Segredos injetados pelo orchestrator ou vault — não texto plano no repositório. Config por ambiente explícita (`staging` ≠ `prod`).

---

## Estratégias de deploy

| Modo | Ideia | Risco residual |
| --- | --- | --- |
| **Recreate** | pára antigo, sobe novo | downtime perceptível |
| **Rolling** | substitui instâncias aos poucos | versões misturadas durante janela |
| **Canary** | fatia pequena recebe novo build | observar métricas antes de ampliar |
| **Blue-green** | dois ambientes; swap de tráfego | custo duplicado temporário |

Escolha depende de capacidade de observação — sem métricas, canary é teatro.

---

## Rollback com dados envolvidos

**Revert de código** nem sempre desfaz migração de BD já aplicada.

Checklist mental:

1. Migrações são **compatíveis para trás** (expand-contract) quando possível — novo código lê colunas novas e antigas durante transição.
2. Feature flags desligam comportamento sem rollback de schema completo.
3. Backup restaurável testado (restore não é óbvio até tentares).

---

## Erros comuns

- Deploy sexta à tarde sem dono de incidente definido.
- Pipeline verde mas deploy manual esquece variável de ambiente — produção diverge de staging silenciosamente.
- Rollback assume estado idempotente onde há jobs async que já dispararam.

---

## Checklist pré-go-live de serviço novo

- [ ] Runbook com comandos exatos de rollback e contactos.
- [ ] Monitorização mínima acoplada (taxa erro, latência, filas).
- [ ] Migrações revisadas por segundo par de olhos.
- [ ] Limite de blast radius (quota de instâncias novas no primeiro salto).

---

## Glossário

- **Artifact**: pacote imutável gerado pelo pipeline (imagem, tarball).
- **Immutable infrastructure**: substituir instância em vez de SSH para patch manual.
- **Blast radius**: quanto sistema falha quando algo corre mal neste deploy.

---

## Exercício de equipa (30 minutos)

Simulação tabletop: “Último deploy elevou latência p95 em 40%. O que verificas primeiro?” Escreve ordem consensual — evita improvisação caótica às 3h.
