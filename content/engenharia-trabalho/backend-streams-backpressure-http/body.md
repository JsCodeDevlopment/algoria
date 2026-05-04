## Objetivos de aprendizagem

1. Explicar **backpressure** sem equações — produtor não deve afogar consumidor.
2. Escolher entre **buffer inteiro** vs **fluxo** quando exportas CSV ou proxy de ficheiros.
3. Relacionar **chunked HTTP** com latência percebida e uso de memória.

---

## Problema que todos repetem uma vez

Implementação “rápida”:

1. Lê ficheiro ou resultado de query **inteiro** para string ou array em RAM.
2. Serializa JSON gigante ou concatena CSV num único bloco.
3. Empurra para resposta.

Funciona em staging com **dois** utilizadores. Em produção com ficheiro modesto por cliente mas **muitos** pedidos simultâneos → **GC**, **OOM**, latências que parecem “misteriosas”.

---

## Stream mental model

**Stream** = sequência de **pedaços** ao longo do tempo (bytes, linhas, registos) em vez de monólito.

**Consumidor** processa pedaço a pedaço — quando vai mais devagar que o produtor, precisa de mecanismo para **sinalizar “para um pouco”** — isso é **backpressure**.

Sem backpressure honesto:

- buffers internos crescem até à Lua,
- ou dados são silenciosamente largados — ambos são bugs sob stress.

---

## HTTP e corpo em chunks

Quando o servidor não sabe `Content-Length` final cedo ou quer começar a enviar **antes** de terminar de gerar tudo, **Transfer-Encoding: chunked** permite fatiar resposta.

Benefícios didáticos:

- cliente começa a receber **primeiros bytes** mais cedo (útil para UX de download longo),
- servidor não precisa segurar **estrutura inteira** antes do primeiro flush — desde que **pipeline** suporte streaming end-to-end.

Cadeia típica onde streaming quebra: middleware que materializa corpo para logging — volta ao monólito sem querer.

---

## Node.js e ecossistemas semelhantes

Ideias portáveis:

- **`Readable` / `Writable`** — ligar fonte a destino com `.pipe()` ou APIs modernas equivalentes.
- **Pausar fonte** quando destino sinaliza congestão — frameworks maduros tratam parte disto; código customizado precisa disciplina explícita.

Em stacks diferentes (JVM streams, Go pipes, etc.) o vocabulário muda — o **diagrama mental** não.

---

## Parser JSON “streaming”

Para arrays enormes, bibliotecas que parseiam **token a token** ou linha NDJSON evitam árvore DOM inteira na memória.

Trade-off: formato talvez menos “bonito” para humanos (`NDJSON` linha a linha) mas **previsível** operacionalmente.

---

## Uploads e disco

Receber upload como stream para disco temporário ou armazenamento objeto **com hash incremental** reduz picos de RAM.

Combinar com limite de tamanho no reverse proxy **e** na app — defesa em profundidade.

---

## Erros comuns

| Sintoma | Causa provável |
| --- | --- |
| RSS dispara durante export | acumular todas as linhas num array antes de responder |
| Latência inicial alta mesmo com dados “ligeiros” | esperar fecho de cursor DB inteiro antes do primeiro byte ao cliente |
| Timeout intermitente em proxy | body buffering mal combinado com upstream lentamente chunked |

---

## Ligação com concorrência

Múltiplos streams paralelos sem limite de concorrência → cada um parece pequeno mas somados saturam **descritores de ficheiro** ou **ligações à BD**. Politicas tipo **pool + semáforo** aplicam “backpressure” ao nível de negócio.

---

## Checklist

- [ ] Medi tamanho p95 de payload gerado por este endpoint?
- [ ] Consigo processar **linha ou bloco fixo** sem materializar coleção completa?
- [ ] Proxies e middleware no caminho **preservam** streaming?

---

## Reflexão

Streaming não é micro-optimização cosmética — é **contrato operacional**: memória e tempo passam a escalar com **taxa** mais que com **tamanho instantâneo** do maior cliente.
