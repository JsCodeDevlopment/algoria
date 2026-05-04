## Objetivos de aprendizagem

1. Ler e **escrever** expressões `cron` comuns sem surpresas de fusos horários e “overlap” não planeado.
2. Comparar **agendador dentro do processo**, **cron do SO**, **CronJob Kubernetes** e **serviços geridos** (scheduler HTTP) segundo risco de **execuções duplicadas**.
3. Desenhar jobs **idempotentes**, com **retentativas** e observabilidade mínima (saber quando falhou *antes* do cliente gritar).
4. Quebrar processamento volumoso em **cursor / chunk** com checkpoint seguro contra recomeços.

---

:::didactic-figure
{
  "src": "/engenharia/cron-expression-guide.png",
  "alt": "Diagrama dos cinco campos minuto hora dia mês dia-da-semana de uma expressão cron",
  "caption": "Cinco campos padrão — segundos em variantes são armadilha clássica entre ambientes; confirma o motor que estás mesmo a usar."
}
:::

:::didactic-metrics
{
  "title": "Antes do primeiro job em prod — checklist numérico mínimo",
  "columns": 4,
  "items": [
    { "label": "Fuso/TZ", "value": "Explícito", "sublabel": "UTC ou IANA definido nos docs" },
    { "label": "Duplicidade", "value": "Mitigado", "sublabel": "scheduler externo OU lock forte" },
    { "label": "Idempotente", "value": "Sim", "sublabel": "reexecução segura observada" },
    { "label": "Timeout", "value": "< SLO", "sublabel": "kill ou requeue antes de overlaps" }
  ]
}
:::

---

## Analogia dos turnos na fábrica

Um CronJob não é só “código que corre às três da manhã” — é uma **mudança de turno automatizada**:

- Precisa saber **o relógio oficial** da fábrica (fusos e horário de Verão onde aplicável através de política UTC).
- Não pode **duplicar o mesmo relatório físico duas vezes** só porque dois capatazes acharam ambos que era sua vez sem coordenação central.
- Se a máquina embirra, deve haver **rastreio**, **reentrada**, e **quota** para não atropelar outros turnos seguintes (“efeito comboio de atrasos”).

Cron mal desenhado parece infra “estável” durante meses porque **silêncio costuma soar a sucesso** até explodires stock, repetires emails financeiros ou apagares linhas porque uma retentativa “meio bem sucedida” partiu invariantes.

---

## Alfabeto do tempo: expressões `cron`

A maioria dos ambientes POSIX fala dos **cinco** campos (minuto, hora, dia do mês, mês, dia da semana). Muitos agendadores geridos na nuvem também expõem **segundos** — **misturar** tutoriais causa jobs que disparam ou 60× mais rápido ou nem disparam porque parser ignora último campo.

### Leitura do padrão (sem decorar todas as dialect variants)

Um guia rápido de leitura humana ao rever PR:

```
* * * * *
│ │ │ │ └── dia da semana (0–6 domingo-em-muitos-sistemas; confirma documentação!)
│ │ │ └──── mês (1–12 typical)
│ │ └────── dia do mês (1–31)
│ └──────── hora (0–23 localidade agendador)
└────────── minuto (0–59)
```

### Exemplos de engenharia com intenção clara

| Expressão (5 campos) | Intenção de produto típico |
| --- | --- |
| `0 9 * * 1-5` | relatório interno todas as manhãs úteis 09h — atenção: “manhã de quem”? |
| `*/15 * * * *` | ingestão alta frequência — perguntares se precisam mesmo quarto‑horários vs fila dirigida por eventos |
| `30 4 * * SUN` | janelas de sobrecusto domingo madrugada (backup / vacuums pesados) |
| `15 22 28-31 * *` combinações perigosas | últimos dias do mês têm dias inexistentes em meses curtos — certos parsers saltam execuções; outros correm sempre — **explicita comportamento esperado**. |

Escreve sempre num comentário de PR: **fusos** (“roda UTC-0 no scheduler X”) sem confiar só em valor default do host.

---

## Onde vive o agendamento importa tanto quanto quando

### `node-cron` / Quartz / lib equivalente dentro do processo da app

- **Facilidade** máxima no dia um.
- **Risco brutal** assim que há **várias replicas** atrás do load balancer: cada replica tem o seu próprio relógio lógico — **N execuções** para o mesmo trabalho único mundialmente.

Mitigações documentadas repetidamente porque continuam relevantes:

1. **Advisory DB lock**: transação tenta ocupar marca `processing` apenas se estado anterior permitir.
2. **Distributed lock/redis** + TTL menor que tempo típico de job + renovação apenas se modelo permitir saneidade.
3. **Leader election** forte (complexidade operacional alta — não adornes se equipa não suportar).

### `crontab` no servidor único ou VM “batch” dedicada

- Bom quando **infra manual** assume **uma única** instância de correr job.
- Ainda assim: failover manual fraco ⇒ job para de pingar ⇒ ninguém repara ⇒ descoberta dramática quando compliance pergunta.

### Kubernetes CronJob

- Óptimo quando queres declarar recurso infra versionado (**GitOps** vibe).
- Atenção aos campos **`startingDeadlineSeconds`**, policies de **overlap** (`Forbid`, `Replace`, `Allow`). Valores permissivos ⇒ pods duplicados e pressão surge em picos recuperados tarde da fila.
- Jobs longos ⇒ precisas quotas de recurso definidas e alertas quando “run pendurado” ultrapassa SLO esperado.

### Schedulers geridos disparando HTTPS (EventBridge / Cloud Scheduler etc.)

Ideia forte: um **serviço sem estado temporal** apenas recebe webhook autenticado e publica comando numa **fila** ou inicia trabalho já **isolado**:

- Cron “vira apenas relógio” — **workers** decididos por fila garantem paralelismo e retentativa sem multiplicares efeitos colaterais.
- Autenticação via segredo rodante, JWT assinado, ou VPC privada segundo threat model — **nunca** apenas “endpoint aberto porque URL é secreta” como única linha.

---

## Idempotência: regra não negociável

Define frase invariante antes de código: **Executar este job duas vezes seguidas deixa o sistema igual a executá-lo uma vez bem sucedida?**

Implementações típicas que merecem ser citadas nos teus README internos:

- **Chave única determinística**: hash(userId, período-agregação) garante relatório só uma entrada final.
- **Upsert estável**: grava sempre snapshot completo revisão N em vez de `+=` cego.
- **Checkpoints**: tabela auxiliar registra último `cursor` processado; retomar continua onde parou sem reler milhões.

Conecta conscientemente ao guia **concorrência e consistência** quando job e API HTTP concurrently escrevem mesmas linhas — scheduler não dissolve race conditions só por correr quando “ninguém clica”.

---

## Não fazers absolutos sobre volume único síncrono

Pattern “cursor” repetido porque continua sendo resposta quando alguém sugere streaming one-shot de tabela inteira residente só em RAM:

```
while (tem_mais){
  pagina := SELECT ... WHERE id > ultimo_cursor ORDER BY id LIMIT N
  processe(pagina)
  atualize_checkpoint(maior_id_da_pagina)
}
```

Propriedades desejadas:

- transação DB curta onde possível (`SELECT` + marca local + commits pequenos) — modelo exacto depende de isolamento aceitável.
- `N` definido pelo SLO tempo + memória (teste com dataset realista sanitizado).

---

## Filas BullMQ/RabbitMQ/SQS/etc.: cron apenas injeta comando

O `cron` em si não precisa segurar trabalho grande — apenas de **colocar o comando na fila** (_enqueue_). Os *workers*:

- fazem backoff exponencial (ou política fixa comunicada aos stakeholders),
- gravam causa de erro para UI interna ou suporte,
- alimentam fila **dead-letter** quando há veneno permanente (mensagem irreparável).

Backoff sem *jitter* num cluster grande provoca uma corrida sincronizada de retries (**thundering herd**) — versões modernas de libs permitem *jitter*; documenta sempre na configuração de base.

---

## Overlap temporal e timeouts

Imagina um job que esperava 30 minutos, mas a infra lenta fez cada execução durar **45**. Se não bloqueares *overlap* nem terminares com critério definido, duas execuções escrevem em concorrência mesmo com CronJob “singleton” quando a política o permite — ou a fila acumula.

Checklist rápido:

- **Timeout** documentado menor que período cron base (folga segurança).
- **Distributed lock TTL** menor que período apenas se garantires renovação sane — locks mortos seguram jobs errados igualmente ruins.

---

## Observabilidade: quem vigia vigias

Ideias ordenadas por maturidade crescente:

| Nível prático | O que adicionas |
| --- | --- |
| Logs estruturados | `job_name`, `run_id`, correlation id com API downstream |
| Métricas | histograma duração, contadores sucesso/retry/fatal |
| Tracing distribuído | spans para cada integração pesada quando library suportado |
| **Dead man’s ping** | espera beacon após cada janela — silêncio vira página |
| SLO dashboards | erro budget semanal mesmo para jobs não user-facing |

Falha silenciosa de job é onboarding acidental para burnout on-call mais tarde — portanto tratamento de job como **serviço** com SLA interno já no design.

---

## Segurança e compliance em jobs

Um job roda frequentemente **com credenciais altas**:

- Principle of least privilege em DB (**só schemas necessários**) evita ransomware interno benigno inadvertido quando script tem `DELETE FROM` permissivo durante refactors.
- Rotações de segredos: job precisa rollout coordenado (env vars em sync com vault).
- Dados exportados automatizados: logar apenas metadados, não payload PII inteiro ao console central.

---

## Erros típicos (nome para retro)

| Problema | Cheiro |
| --- | --- |
| Job duplicado pós-deploy com réplicas escaladas horizontalmente sem lock | relatórios / emails repetidos bursts |
| Fuso DST “saltou” dia | relatório disparou ou não aparece uma vez ano |
| Assumimos “cron garante unicidade mágica” sobre fila Kafka | ordenação partições mal escolhida |
| Checkpoint sem unicidade forte | segunda retentativa reprocessa página antiga já mutada upstream |

---

## Checklist antes de activar novo job recurrente em produção

- [ ] Especificação textual: período absoluto (**UTC?), overlap policy, comportamento esperado em falhas parciais.
- [ ] Teste rodado pelo menos uma vez contra base **staging cópia** com volume não trivial sanitizado ou gerado sintético proporcionalmente.
- [ ] Idempotência demonstrada ou unique constraints documentadas onde falharem alto.
- [ ] Logs/metrics pings verificados no dashboard esperado antes de madrugada real.
- [ ] Planilha stakeholder sabe onde ver status humano-readable (painel ou query).

---

## Ligações no hub Algoria

- **Streams, backpressure HTTP** quando job consome grandes volumes externos de rede.
- **Concorrência e consistência** — invariantes escritas continuam válidas mesmo com jobs + API concorrentes.
- **Observabilidade mínima viável** — reduz checklist de alertas repetitivos quando escalas squad.

---

## Reflexão para fechar

Pergunta de fecho em design review interno: **“Se este job falhar todas as madrugadas de uma semana, quais invariantes monetárias/legais partimos?”** Se a resposta for “acho que não muito”, volta ao desenho de idempotência e constraints — automação bem feita aparece aos utilizadores sobretudo pela **ausência** de dramas.
