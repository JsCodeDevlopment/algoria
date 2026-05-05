## Objetivos de aprendizagem

1. Entender concorrência como problema de **invariantes de negócio**, não apenas de threads.
2. Diagnosticar e comunicar **race conditions** em cenários reais de API (retry, timeout, duplo clique, webhook duplicado).
3. Escolher entre idempotência, transação, locks e fila com critérios técnicos claros.
4. Projetar uma API defensiva sob escala horizontal sem prometer consistência mágica.

---

:::didactic-figure
{
  "src": "/engenharia/backend-concorrencia-e-consistencia.svg",
  "alt": "Dois pedidos em paralelo lendo saldo antes dos writes convergirem",
  "caption": "A corrida nasce no intervalo entre ler, decidir e escrever. Esse intervalo é o território da inconsistência."
}
:::

:::didactic-bar-chart
{
  "title": "Técnicas de controle de concorrência (esforço relativo)",
  "unit": "1-10",
  "bars": [
    { "label": "Idempotency key", "value": 4 },
    { "label": "Transação curta", "value": 5 },
    { "label": "Lock pessimista", "value": 7 },
    { "label": "Fila por agregado", "value": 8 }
  ],
  "caption": "Comece pelo invariante e pelo tipo de conflito, não pela ferramenta da moda."
}
:::

---

## O núcleo do problema

Em APIs, concorrência significa isto: **mais de uma operação tenta alterar o mesmo fato de negócio ao mesmo tempo**.

Exemplos cotidianos:

- pagamento submetido duas vezes por retry automático;
- dois admins editando o mesmo recurso;
- webhook repetido pelo provedor após timeout de resposta;
- múltiplas instâncias processando comandos equivalentes em paralelo.

Quando a regra de negócio é sensível ("não cobrar duas vezes", "estoque não negativo", "uma assinatura ativa por conta"), qualquer corrida vira incidente.

---

## Race condition sem jargão

Race condition é quando o resultado depende da ordem de chegada e essa ordem não está protegida.

Fluxo clássico:

1. Request A lê estado `X`.
2. Request B lê o mesmo estado `X`.
3. A calcula novo estado `Y`.
4. B calcula novo estado `Z` com base no estado antigo.
5. Quem grava por último sobrescreve o outro.

Problema central: ambos decidiram com leitura desatualizada.

---

## Invariante primeiro, tecnologia depois

Antes de escolher técnica, escreva a regra que não pode ser violada:

- "saldo nunca fica negativo";
- "um pedido externo gera no máximo uma cobrança";
- "não existe duas transferências com mesma referência de cliente".

Sem invariante explícita, o time implementa remendos isolados e chama isso de consistência.

---

## Ferramentas defensivas e quando usar

### 1) Idempotência para efeitos colaterais repetidos

Objetivo: repetir o mesmo request sem repetir efeito.

Use quando:

- cliente pode reenviar por timeout/retry;
- gateway/proxy pode reenviar;
- provedores externos repetem webhooks.

Mecanismo típico:

- cliente envia `Idempotency-Key`;
- servidor persiste resultado associado à chave e ao escopo;
- repetição devolve resposta equivalente, não nova execução.

```http
POST /v1/payments HTTP/1.1
Idempotency-Key: 7b03f9e2-8c41-4f6a-9d12-4f8e1c2b9a00
Content-Type: application/json
```

Erro comum: guardar chave sem vincular ao contexto (rota/conta/payload), gerando colisão semântica.

### 2) Constraint única para impedir duplicado lógico

A aplicação valida, mas a base impõe.

```sql
CREATE UNIQUE INDEX ux_wallet_transfer
ON transfers (wallet_id, client_reference);
```

Vantagem: proteção forte contra corrida no nível de persistência.
Cuidados: tratar erro de violação de unicidade como resposta de negócio, não como 500 genérico.

### 3) Transações curtas para invariantes locais

Quando tudo cabe na mesma base relacional:

- leia, valide e escreva na mesma transação;
- escolha nível de isolamento compatível com risco;
- mantenha transação curta para reduzir lock contention.

Transação resolve muita coisa, mas não tudo:

- não cobre efeitos externos já disparados (email, webhook, PSP);
- não resolve coordenação entre bancos distintos de forma barata.

### 4) Lock otimista vs pessimista

**Otimista**

- inclui versão (`version`, `updated_at`, etag);
- `UPDATE ... WHERE id = ? AND version = ?`;
- se atualizar 0 linhas, houve conflito e você decide retry/rejeição.

Bom para baixa taxa de conflito.

**Pessimista**

- bloqueia registro cedo (`SELECT ... FOR UPDATE`, equivalente);
- reduz corridas, mas aumenta espera e risco de deadlock.

Bom para conflito alto com janela crítica curta.

### 5) Fila por agregado para serializar decisões

Quando cada agregado (ex.: conta, carrinho, pedido) precisa de ordem forte:

- chave de partição = identificador do agregado;
- consumidor processa em sequência por chave;
- elimina corrida sem lock global no endpoint HTTP.

Trade-off: adiciona latência e complexidade operacional (reprocessamento, DLQ, observabilidade).

---

## Concorrência x paralelismo (alinhamento de equipe)

- **Paralelismo:** executar ao mesmo tempo em núcleos distintos.
- **Concorrência:** múltiplas operações intercaladas disputando recursos/estado.

API moderna costuma ser I/O-bound. A dor principal raramente é CPU; é consistência de dados sob interleaving e retry.

---

## Armadilhas comuns em código assíncrono

1. Estado mutável compartilhado em memória de processo como "fonte da verdade".
2. Supor que "single instance" em dev representa produção com múltiplas réplicas.
3. Repetir request sem idempotência porque "timeout é raro".
4. Fazer transação englobar chamadas externas lentas.
5. Tratar conflito como exceção genérica e esconder semântica do erro.

---

## Fluxo defensivo de endpoint crítico (exemplo prático)

Para `POST /payments`:

1. validar schema e autenticação;
2. extrair `Idempotency-Key`;
3. verificar se já existe resultado para chave + escopo;
4. abrir transação curta;
5. aplicar validações de negócio;
6. persistir com constraints de unicidade;
7. commit;
8. publicar efeito externo de forma segura (outbox/evento);
9. salvar e retornar resposta idempotente.

Este desenho reduz duplicidade, preserva invariantes e melhora previsibilidade de retry.

---

## Testes que realmente pegam corrida

Testes unitários são necessários, mas insuficientes. Inclua:

- teste de integração com duas requisições simultâneas ao mesmo recurso;
- teste de retry automático com mesma idempotency key;
- teste de violação de unique constraint mapeando para erro de negócio;
- teste de escala com múltiplas instâncias e carga moderada.

Sem estes cenários, você valida caminho feliz e deixa o problema real para produção.

---

## Observabilidade mínima para concorrência

Métricas úteis:

- contagem de conflitos otimistas;
- taxa de deduplicação por idempotency key;
- erros de unicidade por endpoint;
- retries por tipo de cliente;
- tempo de espera por lock e deadlocks.

Sinais de alerta:

- aumento súbito de conflitos após campanha/tráfego;
- crescimento de timeout com lock waits;
- picos de duplicidade financeira.

---

## Checklist antes de liberar feature sensível

- [ ] A invariante principal está escrita de forma objetiva?
- [ ] Existe mecanismo de idempotência para retries?
- [ ] O banco impõe constraints que refletem a regra?
- [ ] Conflitos têm resposta de domínio clara?
- [ ] Há testes com requests simultâneas e reenvio?
- [ ] Dashboards mostram conflitos, deduplicação e lock waits?

---

## Reflexão final

Concorrência robusta não nasce de uma única técnica. Ela emerge de um desenho defensivo em camadas: contrato HTTP idempotente, persistência com restrições corretas, transações bem delimitadas e observabilidade para aprender com conflito real. Esse é o caminho para escalar sem transformar cada pico de tráfego em crise de consistência.
