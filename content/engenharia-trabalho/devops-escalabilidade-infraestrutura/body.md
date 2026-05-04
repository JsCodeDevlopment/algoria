## Objetivos de aprendizagem

1. Explicar **scale up** vs **scale out** a stakeholders sem reduzir tudo a “mais VMs”.
2. Distinguir sintomas tratáveis só com mais CPU (**vertical**) de sintomas estruturais que exigem **particionamento**, **queues** ou **stores especializados**.
3. Ler uma arquitetura e apontar **pontos de estado**, **sessions**, **sticky routing** — e propor caminho para modelo **sem estado onde o negócio permitir**.
4. Escolher gatilhos de **auto-scaling** conscientes das armadilhas de métricas frágeis (“CPU sempre baixa porque app bloqueada em I/O esperando BD”).

---

:::didactic-figure
{
  "src": "/engenharia/devops-escalabilidade.png",
  "alt": "À esquerda um servidor maior (scale vertical); à direita várias instâncias com balanceador à frente",
  "caption": "Duas filosofias válidas · Muitos produtos combinam‑nas ao longo do tempo · O erro é só escalar e ignorar modelo de dados e sessão."
}
:::

:::didactic-bar-chart
{
  "title": "Complexidade operacional típica (ilustrativo, não benchmarking)",
  "unit": "1–10 maior = mais peças a acertar em incidentes",
  "bars": [
    { "label": "Um monólito forte vertical", "value": 2 },
    { "label": "N instâncias + LB + BD única modesta", "value": 5 },
    { "label": "N instâncias + réplicas só leitura + cache distribuído", "value": 7 },
    { "label": "Particionamento sharded + várias zonas + filas", "value": 9 }
  ],
  "caption": "Subires na escala aumenta paralelismo real mas também aumenta perguntas de consistência observável — planeia comunicação aos produtos antes do painel de métricas explodir."
}
:::

:::didactic-metrics
{
  "title": "Glossário mínimo de escala antes de propor cluster",
  "columns": 3,
  "items": [
    { "label": "Estado onde?", "value": "Explícito", "sublabel": "sessions, uploads, websocket fan-out…" },
    { "label": "SPOF atual", "value": "Nomeado", "sublabel": "única zona, BD without HA…" },
    { "label": "Limites externos", "value": "Mapeados", "sublabel": "RDS max conns / partner API quotas" }
  ]
}
:::

---

## Analogia do restaurante que cresce (alinhamento produto + engenharia)

No primeiro mês tens **uma única equipa de cozinha** num só espaço. Se chegar mais clientes, podes comprar uma **coxa de fogão monstruosa** (**scale vertical**) — menos cabos novos mentalmente porque o trabalho continuou dentro da mesma sala.

Mas um dia aparece uma fila que **rodeia o quarteirão**:

- Mais fogão já não cobre porque **entrada física**, **mesa de mise en place**, ou até **estrutura estrutural** do edifício vira bottleneck.
- Aí abres uma **nova filial** igual à primeira (**horizontal**). Clients espalham-se. Precisam de uma **entrada neutra que orienta cada um** para uma filial menos cheia (**load balancer**).
- Todas precisam de **livro‑regra comum rápido** para “quem já pagou conta” porque ninguém confia apenas na cabeça de cada chefe (**Redis/session store**/token stateless bem modelado).

A analogia já mostra porque “**só scale out porque é moderno**” falha assim que **receitas monopolizam recurso físico singular** como base de dados transaccional forte sem plano para read replicas/particionação.

---

## Escalabilidade vertical (scale up / scale vertically)

É literalmente aumentar poder **na mesma unidade**: mais vCPU, maior RAM melhor classe rede, disco mais rápido (NVMe, IOPS planeados conforme CSP).

### Vantagens reais não banalizar

| Pro | Narrativa técnico‑funcional breve |
| --- | --- |
| Menos nós físicos inicialmente monitorizar em dashboards | menor superfície de alertas dispersos até cultura observabilidade amadurecer |
| Localidade forte | caching em NUMA dentro do host para workloads que conseguirem tirar proveito quando dimensionados conscientemente |

### Limitações objetivas (“teto não é filosofia abstracta”)

| Contra | O que comunicar aos decisores |
| --- | --- |
| Ponto único de falha lógico ainda lá | upgrades de downtime precisam janelas ou alta disponiblidade dentro do proveedor mesmo num nó maior |
| Custo pode crescer supralinear máquinas topo | curva económica cruza várias institâncias médias — modela em planilhas |
| Limits de SKU | cloud provider para de permitir aumento linear só com click — precisamos redesign arquitectónico mesmo |

Momento onde vertical **bem justificado**:

- cargas inicialmente pouco paraleláveis dentro de **uma** instância (certas licenças comerciais, DB legado forte).
- otimização de curto prazo até migrar hotspots identificados (read replica, offload estático CDN).

---

## Escalabilidade horizontal (scale out)

Adicionam-se **várias replicas** trabalhadores equivalentes atrás do balanceador ou consumindo partições específicas. O ganho aparece porque **margem paralela** aumenta quando o problema **parcela bem**.

### Ingredientes obrigatórios (lista curta antes de ficar mesmerizado por número de pods)

1. **Tráfego entrada roteável** (~ load balancer nível HTTP/gRPC TCP).
2. **Sem estado onde possível OU externalização bem definida**.
3. **Consistência e caching** conscientes quando escreves em store central.

### Custos aceites (nem todos são só “mais infra”)

| Aspecto complexidade | Como reduz dor |
| --- | --- |
| Affinity / sessão cliente | vai para cookies assinadas + servidor side store central ou modelo token de curta duração |
| Divergências de cache local em memória | invalidação cross-pod via pub/sub redis ou apenas caching read-only bem TTL |
| Excesso de chatter interno síncrono | eventos assíncronos / aggregates |

---

## Glossário aplicado à escala produtiva (mais que etiquetas glossadas)

### Load balancer / reverse proxy layer

Distribui pedidos segundo algoritmos (**round-robin**, **least connections**, *hashing* por IP — cada escolha tem **semântica** diferente). Pode também fazer terminação TLS, aliviando trabalho no processo da aplicação.

Escolhas práticas: **sticky sessions** apenas quando absolutamente indispensável porque escondem hotspots e complicam drenagens.

### Estado vs stateless aplicacional

Estado dentro do processo só em memória = **sticky mental** até reboot imprevisível. Externaliza‑se antes de aumentar replicas; senão regressões fantasmas aparecem “só aos utilizadores específicos cujo request cai sempre no pod novo”.

Modelos típicos:

| Modelo sessão | Resumo rápido | Trade-offs |
| --- | --- | --- |
| Cookie session opaque + servidor store | servidor decide validade rápido | infra store precisa SLA |
| JWT assinado stateless bem curto refresh | menos roundtrips servidor store | revocation complexa mal modelada torna problema incidente |
| Híbridos OIDC/session server | segurança + UX | onboarding dev maior |

Redis citado tanto como caching layer quanto ephemeral coordination (locks distribuídos) — mas **persistência** declarada segundo use-case (persistencia AOF+RDB política específicas vs apenas cache ephemeral).

### CDN

Move bytes estáticos ou respostas cacheáveis geograficamente. Reduz egress central e latency percebida grande em marketing pages. CDN não resolve DB escrita saturada mágico.

### Réplicas só leitura

Alivia consultas relatórias — consistência eventual clara (lag replica). Escreve caminho sempre à primária (ou quorum complexo segundo stack).

### Sharding / particionação

Divide conjunto dados por shard key (usuário modulo N, geograficamente, etc.). Aumento horizontal de dados verdadeiros — aumenta dor operacional proporcional ao número de partições menos disciplinadas.

### Auto‑scaling grupos ou HPA equivalents

Amplia/atenua número instâncias baseado **métrica proxy** (CPU, memória saturações, métricas custom fila profundidade, RPS combinado latency). Mau desenho: escala apenas CPU enquanto fila espera disco — problema persiste cara mais custo infra.

Melhores combos emergem quando medes também **latency p95** de serviços críticos além apenas CPU média superficial.

---

## CAP em uma frase operacional útil (sem seminário inteiro distribuídos)

Distribuídos: quando a rede falha ou particiona, **há que escolher** entre **consistência forte com resposta sempre imediata** e **disponibilidade** — engenharias modernas fazem partições conscientes usando **bases específicas** (consistência eventual em analytics, consistência forte no núcleo financeiro). Ensina isto a PM para expectativas de “zero divergência em todo o cluster global sem custo enorme” deixarem de ser fantasias antes do roadmap.

---

## Quando só escalar infra não resolve (“escala enganosa”)

| Cheiro sintoma técnico | Provável causa real |
| --- | --- |
| Queries N+1 invisíveis | CPU subiu linearmente mesmo tráfego “igual”? |
| Hot key num cache central | aumentar pods não dispersa hotspots chave igual |
| File locking concorrent mal desenhado locks serializantes | parece infra mas é código síncroneo |
| Excesso timeouts integrações externas | threads/pools saturations — só maquinas maiores aumentam paralelismo de espera idiota prolongada |

Nestes cenários combinam refactor + partitioning + quotas melhores antes de aumentar apenas `desiredCount`.

---

## Segurança e compliance na escala maior

Replicação aumenta também **tokens de automatização** distribuídos: least privilege IAM, rotações de segredos, logging central sem vazar payload sensível porque “agora há 400 logs streams” mal agregados. Multi‑zonas aumentam disponibilidade — mas cross‑AZ **data egress** pode surpreender fatura se payloads chatty mal projectados permanecem grandes.

---

## Mapa rápido: vertical vs horizontal em decisões comuns pequenas equipes MVP → growth

| Cenário de evolução | Primeiro ganho habitual | Próximo degraus frequentes responsáveis |
| --- | --- | --- |
| Marketing estático CDN | mover assets -> CDN aggressive caching | ISR / edge functions conforme stack |
| API monolito CPU bound real | vertical moderada + profiling depois | horizontal + connection pool tuning DB |
| Uploads pesados unicamente processados síncrono | offload async job queue antes escalar apenas API | autoscaler pods workers só process queue |
| Leituras massivas relatórias | replica read offload | materialized aggregates / warehouses |

Evita checklist “saltamos directo kubernetes day one sem observabilidade mínima” — ver guia pipelines + observabilidade no hub primeiro.

---

## Erros típicos (nomeá‑los antes de RCA)

| Error pattern | Correção primeira ordem verbal |
| --- | --- |
| Multiplicamos pods mas só uma DB primary pequena | DB tornou bottleneck — precisa sizing honesto primeiro |
| Sticky porque “rápido” esconderam bug sessão mal externalizada | reabrir design sessão antes de aumentar churn horizontal |
| Autoscale agressivo + cold start alto | aumenta erro taxa porque novas réplicas aquecem lento caches locais aquecidos — precisa warmup policy |
| Apenas aumentar TTL cache global onde writes frequentes inconsistentes aparecem | invalidação modelo precisa primeiro |

---

## Checklist antes de propor “saltar replicas” oficialmente stakeholders

- [ ] Identificado **estado cliente** atual e próximo modelo alvo (**stateless** viável?)
- [ ] Store central com limites quotas conhecidos (max conns redis / RDS / etc.).
- [ ] Load tests **staging** próximo real com dataset não trivial proporcional sanitizado sintético bem dimensionado.
- [ ] Plano fallback se auto‑scaling causa **flapping**.
- [ ] SLIs escolhidos comunicados antes (latência usuário primeiro, infra métricas depois).

---

## Ligações no hub Algoria

- **Observabilidade mínima viável** antes de aumentar cardinality instâncias.
- **Pipelines, deploy & rollbacks** — como promover seguramente mudanças de capacidade infra + app juntando.
- **APIs cache quotas resiliência** — simetrias camada servidor com caching edge e limites quotas terceiros.
- **CronJobs & automações** onde batch processing move carga spikes previsível.

---

## Reflexão para fechar numa retrospectiva infra

Pergunta de fecho: **“Se amanhã duplicarmos tráfego legítimo, qual componente **deixa de encaixar primeiro** no nosso diagrama atual?”** Se a resposta for “não sabemos medir isso ainda”, o próximo passo não é escolher vertical versus horizontal na teoria — é **instrumentar até a pergunta deixar de ser retórica**.
