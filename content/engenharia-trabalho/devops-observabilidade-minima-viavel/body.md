## Objetivos de aprendizagem

1. Distinguir **logs**, **métricas** e **traces** sem comprar três produtos no primeiro dia.
2. Definir **golden signals** mínimos para um serviço HTTP típico.
3. Evitar custo explosivo de observabilidade por cardinalidade descontrolada.

---

## Os três pilares em linguagem simples

| Pilar | Pergunta que responde | Armadilha comum |
| --- | --- | --- |
| **Logs** | “Que sequência de eventos levou a este erro?” | Logar payload inteiro com PII |
| **Métricas** | “Quantos pedidos lentos por minuto?” | Labels com IDs ilimitados |
| **Traces** | “Qual hop externo atrasou esta requisição?” | Instrumentação inconsistente entre serviços |

Observabilidade boa permite inferir estado interno **a partir de outputs** — não confundir com apenas “muitos dashboards bonitos”.

---

## Passo a passo — começar pequeno mas útil

### 1. Correlação primeiro

Cada pedido HTTP recebe **request id** propagado a logs e chamadas internas. Sem isto, debugging distribuído é adivinhação.

### 2. Logs estruturados

JSON lines ou equivalente com campos estáveis: `level`, `service`, `route`, `duration_ms`, `user_id` mascarado se necessário.

### 3. Métricas HTTP mínimas

- Contagem por status code agregado (não por cada URL única se cardinality explode).
- Histograma ou percentis de latência server-side.

### 4. Um alerta que importa

Melhor um alerta que acorda com razão do que vinte que ignoras. Exemplo: taxa 5xx > limiar por X minutos **e** confirmado por duas fontes.

---

## Golden signals (adaptação livre)

Para serviço pedido/resposta clássico:

1. **Latência** — tempo de trabalho útil, não só tempo até primeiro byte se negligenciares filas.
2. **Tráfego** — pedidos por segundo ou utilizadores simultâneos.
3. **Erros** — taxa de falhas vs sucesso.
4. **Saturação** — CPU, filas internas, conexões DB próximas do limite.

---

## Cardinalidade — onde orçamentos rebentam

Labels tipo `user_id` em métricas são tentadoras para debug — geram explosão de séries temporais → custo e lentidão no backend de métricas.

Preferência:

- Agrega por buckets significativos (`tenant`, `region`) com cardinalidade controlada.
- Detalhe profundo fica em **logs/traces** amostrados.

---

## Erros comuns

| Erro | Resultado |
| --- | --- |
| Sem estratégia de retenção | conta cloud surpreendente |
| Dashboard só para engenharia | produto não confia nos números |
| Tracing só metade dos serviços | gaps que parecem culpa do vizinho |

---

## Checklist observabilidade MVP

- [ ] Request id end-to-end documentado para equipas.
- [ ] Níveis de log definidos — `INFO` não é diário de vida privada.
- [ ] Pelo menos uma métrica de negócio alinhada (conversões, jobs completados).
- [ ] Playbook: “Como vejo logs deste utilizador sem violar privacidade?”

---

## Glossário

- **Sampling**: gravar só fração de traces em sistemas de enorme volume — equilibra custo vs visibilidade.
- **SLI / SLO**: indicador e objetivo de nível de serviço — base para alertas úteis.
- **Noise**: alertas que não exigem ação humana imediata — erodem confiança.

---

## Fecho didático

Escolhe o último incidente da equipa (mesmo pequeno). Lista **uma** métrica e **um** log field que teriam encurtado tempo de diagnóstico à metade. Implementa só isso na próxima sprint — observabilidade evolui por acréscimos conscientes.
