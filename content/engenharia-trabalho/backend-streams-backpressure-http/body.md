## Objetivos de aprendizagem

1. Entender **streaming** como um contrato de capacidade, não como "truque de performance".
2. Explicar **backpressure** de forma operacional: quem abranda, onde acumula, quando falha.
3. Escolher entre buffer completo e fluxo contínuo com base em p95/p99 de payload, concorrência e SLO.
4. Diagnosticar gargalos reais em pipelines HTTP (app, proxy, runtime, cliente).

---

:::didactic-figure
{
  "src": "/engenharia/backend-streams-backpressure-http.svg",
  "alt": "Produtor envia chunks para consumidor e HTTP chunked à direita",
  "caption": "Se qualquer etapa materializa o payload inteiro, o pipeline deixa de ser stream e volta a ser monólito em RAM."
}
:::

:::didactic-bar-chart
{
  "title": "Pico de memória em exportação concorrente (ilustrativo)",
  "unit": "Memória relativa",
  "bars": [
    { "label": "buffer completo por request", "value": 100 },
    { "label": "stream com backpressure", "value": 31 }
  ],
  "caption": "A diferença explode com concorrência: 1 request pode parecer barata; 80 requests simultâneos revelam a verdade."
}
:::

---

## O problema real (e por que ele aparece tarde)

A versão que parece "simples" em staging normalmente faz isto:

1. Consulta tudo no banco.
2. Monta um array gigante em memória.
3. Serializa e envia no final.

Com 2 utilizadores, funciona. Em produção, com dezenas de requests concorrentes, acontece a multiplicação escondida:

- `payload médio por request x requests simultâneos x buffers intermediários`
- soma de cópias transitórias (serialização, compressão, logging, proxy)
- picos de GC, tail latency alta e eventualmente OOM.

Ponto didático importante: o incidente não é "porque o payload individual era gigante". Muitas vezes ele era moderado; o problema era **cardinalidade de requests em paralelo**.

---

## Modelo mental: fluxo, taxa e pressão

**Stream** não é só "dividir em chunks"; é manter o sistema estável quando produtor e consumidor têm velocidades diferentes.

- **Produtor:** gera bytes/registros.
- **Consumidor:** processa/escreve bytes.
- **Backpressure:** sinal de controle quando o consumidor não acompanha.

Sem backpressure honesto, você só tem duas opções ruins:

- crescer buffers até estourar memória;
- descartar dado/timeout sob carga.

Com backpressure:

- a fonte desacelera;
- o sistema preserva memória e previsibilidade;
- a latência pode subir, mas de forma controlada e observável.

---

## Comparação direta: buffer completo vs streaming

### Buffer completo

**Prós**

- código inicial menor;
- fácil calcular `Content-Length`;
- integração simples com middlewares que exigem corpo completo.

**Contras**

- memória cresce com tamanho do payload;
- concorrência multiplica custo de RAM;
- primeiro byte só sai no final.

### Streaming com backpressure

**Prós**

- memória tende a crescer com janela de buffer, não com tamanho total;
- cliente recebe bytes cedo (melhor TTFB percebido);
- lida melhor com payloads longos/infinitos (logs, eventos, exportes grandes).

**Contras**

- exige disciplina em toda cadeia (app + proxy + cliente);
- debugging e observabilidade precisam ser pensados para fluxo;
- alguns middlewares quebram streaming sem aviso.

Regra prática: se payload pode crescer sem limite confortável, ou concorrência é relevante, buffer completo vira dívida operacional.

---

## HTTP chunked e o mito do "já está streamando"

`Transfer-Encoding: chunked` permite enviar resposta em partes sem `Content-Length` prévio. Isso é necessário, mas não suficiente.

Para ser stream de verdade, o caminho inteiro precisa preservar fluxo:

1. aplicação gera chunks progressivamente;
2. servidor HTTP escreve sem reter tudo;
3. proxy/CDN não bufferiza agressivamente;
4. cliente processa incrementalmente (quando aplicável).

Se qualquer etapa materializar o corpo completo, o contrato de streaming morreu.

Exemplo clássico: middleware de logging que tenta registrar response body inteiro. Resultado: volta tudo para RAM.

---

## Exemplo Node.js: pipeline com cancelamento e propagação correta

```typescript
import { pipeline } from 'node:stream/promises';
import { Transform } from 'node:stream';
import type { IncomingMessage, ServerResponse } from 'node:http';

function csvSanitizer() {
  return new Transform({
    transform(chunk, _enc, callback) {
      // Exemplo didático: normaliza quebra de linha sem materializar tudo.
      const normalized = chunk.toString('utf8').replace(/\r\n/g, '\n');
      callback(null, normalized);
    },
  });
}

export async function exportCsv(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  const source = db.query('COPY (...) TO STDOUT WITH CSV').stream();
  const abort = new AbortController();

  req.on('close', () => abort.abort()); // cliente desconectou: pare de produzir

  await pipeline(source, csvSanitizer(), res, { signal: abort.signal });
}
```

Boas práticas representadas:

- propagação de erro automática via `pipeline`;
- interrupção quando cliente fecha conexão;
- transformação incremental em stream.

---

## Upload: o outro lado do mesmo problema

No upload, o anti-padrão é equivalente: ler arquivo inteiro para memória antes de persistir.

Estratégia robusta:

- stream de entrada -> validações incrementais -> destino (disco/S3/blob);
- cálculo de hash incremental;
- limites de tamanho no proxy e na aplicação;
- timeouts e limites de taxa para evitar abuso.

Se upload e download usam stream, a aplicação se comporta melhor em picos dos dois lados.

---

## Armadilhas frequentes em produção

| Sintoma | Causa provável | Ação recomendada |
| --- | --- | --- |
| RSS cresce em degraus durante exportações | payload acumulado em arrays temporários | eliminar buffers globais; processar linha/bloco |
| TTFB alto com endpoint "stream" | primeiro `write` só acontece após consulta terminar | iniciar escrita cedo e paginar/cursor |
| Throughput cai atrás de proxy | proxy com buffering ativo | ajustar config para passthrough de chunks |
| Erros intermitentes em cancelamento | fonte continua produzindo após disconnect | propagar `abort` e fechar recursos upstream |
| CPU alta por GC | muitas alocações transitórias em concatenação | usar pipeline e evitar cópias desnecessárias |

---

## Observabilidade que separa teoria de operação

Métricas mínimas por endpoint de fluxo:

- TTFB e tempo total de resposta;
- bytes enviados por request;
- pico de RSS e frequência de GC sob carga;
- número de requests simultâneos e taxa de cancelamento;
- erro por etapa (fonte, transformação, escrita).

Teste de carga recomendado:

1. cenário com payload típico;
2. cenário com p95/p99 de payload;
3. crescimento de concorrência em degraus;
4. comparação entre versão bufferizada e versão stream.

Sem isso, "funcionou no meu ambiente" engana.

---

## Ligação com concorrência de negócio

Mesmo stream eficiente pode colapsar se abrir concorrência sem controle:

- cursores de banco em excesso;
- muitos arquivos abertos;
- saturação de pool de conexões.

Aplique backpressure também no nível de orquestração:

- semáforos por endpoint;
- limite de jobs simultâneos;
- fila quando capacidade esgota;
- respostas explícitas (`429`, retry policy) quando necessário.

---

## Checklist de revisão técnica

- [ ] Existe caminho 100% streaming do produtor ao cliente?
- [ ] O endpoint cancela upstream quando cliente desconecta?
- [ ] Há qualquer middleware que materialize corpo completo?
- [ ] Métricas de TTFB, bytes e memória estão instrumentadas?
- [ ] Concor­rência máxima está definida e testada em carga?

---

## Reflexão final

Streaming com backpressure não é "otimização de niched". É engenharia de confiabilidade: você troca picos imprevisíveis por comportamento controlável. Em APIs reais, isso costuma ser a diferença entre escalar com serenidade e viver apagando incêndio de memória.
