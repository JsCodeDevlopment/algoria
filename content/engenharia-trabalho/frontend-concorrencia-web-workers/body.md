## Objetivos de aprendizagem

1. Explicar, sem jargão oco, **por que a thread principal parece “travar”** quando o código JavaScript faz muito trabalho de uma vez.
2. Escolher **Dedicated Worker**, **Shared Worker** ou nenhum — com critérios de latência e de volume de dados.
3. Comparar **cópia estruturada** vs **`Transferable`**: saber onde o overhead de cópia mata o ganho paralelo.
4. Integrar um fluxo típico (mensagens pesadas ↔ UI atualizada) com **erros**, **cancelamento** e **telemetria** mínimos.

---

:::didactic-figure
{
  "src": "/engenharia/frontend-concorrencia.png",
  "alt": "À esquerda a thread principal bloqueada por trabalho pesado; à direita a UI livre enquanto um Worker calcula isolado",
  "caption": "Mesma página, duas filosofias: enterrar trabalho síncrono na UI vs deslocar compute para uma fábrica isolada comunicada só por mensagens."
}
:::

:::didactic-metrics
{
  "title": "Regra prática para ‘isto vai para Worker?’",
  "columns": 3,
  "items": [
    { "label": "Orçamento de frame", "value": "~16 ms", "sublabel": "referência útil para 60 Hz" },
    { "label": "Candidato forte", "value": "> 2 frames", "sublabel": "filtros, parse, FFT, grafos grandes" },
    { "label": "Custo a medir", "value": "Clone + msgs", "sublabel": "grandes payloads podem neutralizar ganho" }
  ]
}
:::

---

## Analogia que alinha equipa inteira

Imagina uma **loja única**. Há só um balcão (a thread principal). Se o funcionário atrás desse balcão começa a resolver um sudoku gigante antes de tirar cada ticket seguinte, a fila congela: ninguém paga, ninguém pergunta onde fica o produto, as caixas de som animadas param.

Um **Worker** não é mais um funcionário atrás **do mesmo** balcão — é uma **salinha separada** com a sua própria mesa de trabalho e o mesmo manual de segurança: **sem tocar diretamente na montra** (DOM), mas pode telefonar resultado para o balcão (mensagens). O trabalho paralelo aparece porque o browser pode agendar esse outro mundo enquanto a montra respira.

Esta analogia já explica uma confusão comum:

- **Concorrência no browser** não significa que “várias operações síncronas infinitas” somem por magia — significa que **mudaste de lugar** onde o trabalho síncrono acontece.

---

## O event loop na thread principal (em duas frases honestas)

A thread principal faz **várias responsabilidades** que o utilizador percebe como “fluidez”: layout, pintura (paint), distribuição de eventos do rato/teclado, execução de JavaScript quando o navegador o agenda. Um bloco síncrono longo atrasa todas elas porque **ocupa o próprio ciclo**.

Daí o sintoma mais claro: spinner que não gira; scroll que “morre”; primeiro input que demora porque o navegador ainda nem processou handlers de interação úteis. Ferramentas de performance (painel Performance / Performance Insights) são o teu amigo objetivo aqui — o guia **DevTools: performance runtime** no hub fecha o ciclo de diagnóstico.

---

## Tipos de worker (mentalidade antes de código)

### Dedicated Workers

O modelo mais usado na prática para “**tarefas pesadas**”. Cada instância de `Worker` típica mapeia para **um único criador**. Morre quando fecha o documento/tab relevante ou quando você termina explicitamente.

### Shared Workers

Menos frequentes nos stacks modernos, mas pedagogicamente úteis: **várias páginas/aba/contextos ligados ao mesmo Worker** quando o browser permite. Exige modelo mental de ciclo de vida partilhado e APIs mais restritas em alguns browsers; na maioria dos produtos SPA hoje Dedicated + boa política de pool cobre mais terreno simplesmente.

Importante não confundir com **service workers** — estes últimos são por natureza próximos de **proxy de rede/offline/cache** e ciclo separado por origem/documento; são maravilhosos para resiliência de fetch, menos para resolver “meu CSV de 120 MB trava filtros ao vivo”. Se precisares dos dois mundos na mesma página, **separa responsabilidades** na cabeça antes de misturar ficheiros e mensagens.

---

## Como a mensagem realmente atravessa a fronteira

### Structured clone (cópia estruturada)

`postMessage` serializa muitos tipos de dados JavaScript em **cópia profunda** no outro lado. Vantagem: simplicidade e segurança de memória (não partilhas referências mutáveis acidentalmente). Desvantagem: **custo proporcional ao tamanho** e à complexidade da estrutura.

**Sintomas de ter escolhido Worker sem rebalancear payloads:**

- Profiler mostra tempo alto em **`postMessage`** ou **serialização**.
- Frames melhoraram pouco porque metade do problema era mover um “elefante JSON” inteiro a cada tecla digitada na pesquisa.

**Boas pragmáticas:**

- Enviar **diffs**, **offsets**, ou **chunks** em vez da coleção inteira quando o modelo de dados permitir.
- Manter modelo de **versão/imutabilidade**: “processa chunk[k] já normalizado”.
- Preferir **`ArrayBuffer`**, **`TypedArray`** e estruturas contíguas quando o trabalho é numérico.

### Transferable objects

Ao passar determinados objetos marcados como *transferível*, transferes **a posse** do buffer para o outro lado. A thread original deixa de o usar de forma válida como antes — menos cópias, mais disciplina manual.

Útil quando o **payload é volumoso** mas o formato é binário/contíguo. Continua a haver **overhead de orquestração**: não é grátis, só **tende** a ser melhor que clonar o mundo.

### SharedArrayBuffer e atomics (nota de maturidade)

Disponibilidade e requisitos de segurança (isolamento de origem, cabeçalhos `Cross-Origin-Opener-Policy` / `Cross-Origin-Embedder-Policy` em stacks que permitem) tornam isto **ferramenta de casos avançados** — compreende o conceito, mas mede se a tua equipa precisa mesmo de memória compartilhada de baixo nível vs um design de mensagens mais simples.

---

## Padrão de protocolo de mensagens (evita o “message hell”)

Sem disciplina, entram-se rapidamente em `switch (type)` gigantes e estados implícitos. Um contrato mínimo que escala em squads:

1. **Envelope** com `id`, `type`, `payload`, `version`.
2. **Correlação pedido/resposta** no mesmo `id` para permitir `Promise` no lado da UI.
3. **Erros serializáveis** — `name`, `message`, `stack` opcional desligado em produção se policy de privacidade exigir.
4. **Cancelamento** — `AbortSignal` no mundo async da UI mapeado para mensagem `cancel` com o mesmo `id`.

Bibliotecas como **Comlink** reduzem atrito: expões um objeto no Worker e no main consomes como se fosse async remoto. Ainda assim, **o contrato de tipos** (TypeScript compartilhado) evita que “helpers mágicos” escondam payloads gigantes.

---

## OffscreenCanvas e render pesado

Quando o teu gargalo é **desenho** (milhares de sprites, visualização científica), **OffscreenCanvas** permite preparar frames fora da thread principal e depois entregar resultado. A UI continua a **não** manipular DOM do Worker — mas o **bitmap** ou o pipeline de desenho pode morar mais longe do event loop crítico.

Combina bem com:

- **throttling** de envio de frames (não mandar 4K de mensagens por segundo “porque dá”).
- **requestAnimationFrame** só no lado que realmente precisa orquestrar cadência percebida.

---

## Pool de workers (quando uma fábrica não chega)

Se agendares muitas tarefas longas em série com um único Worker, crias **fila interna** e o utilizador continua a esperar. Um **pool** com N workers (N pequeno, baseado em cores do device e observação) pode distribuir lotes.

Cuidados:

- **N** grande demais pode piorar — contestação de CPU, mais serialização, mais memória.
- Mede **p95** do tempo “do submit ao resultado” com device alvo real, não só MacBook M3.

---

## Erros, telemetria e lifecycle

- **Workers precisam de `onerror` / `messageerror` pensados** — um uncaught no Worker não deve ser “silêncio elegante” em produção.
- **Reinício controlado**: em jobs críticos, define política de “Worker morreu → recriar com backoff”.
- **Não uses Worker para fugir de refatorar algoritmo O(n²)** — primeiro reduz complexidade, depois paraleliza.

---

## Quando NÃO usar Worker (lista honesta)

| Situação | Porque |
| --- | --- |
| Trabalho < **1–2 ms** constantemente | Overhead de bootstrap e mensagens pode superar benefício. |
| Precisas de **DOM** ou **estilo** imediato | Worker não é o lugar; considera `requestIdleCallback` / fatiar trabalho na main com yield. |
| Rede simples com API async | `fetch` já é assíncrono; o problema real pode ser parse na main — move **parse**, não o fetch. |
| Equipa sem cultura de **contratos de mensagem** | Primeiro padroniza logging e tipos; senão vais debugar Heisenbugs de payload. |

---

## Checklist antes de promover PR com Worker

- [ ] Identifiquei **um** trace (antes/depois) mostrando long task na main — e ela **baixou** ou mudou de sítio?
- [ ] Medição de tamanho médio e p95 de **payload** por mensagem.
- [ ] Plano para **backpressure** — e se o utilizador dispara 30 ações enquanto o Worker ainda processa a primeira?
- [ ] Teste em **telefone modesto** — nem todo o mundo tem desktop com 12 núcleos “sobrando”.
- [ ] Erro de Worker **não** derruba silenciosamente o estado global da app.

---

## Ligações no hub Algoria

- **INP e interatividade** — Workers endereçam uma fatia de long tasks; INP exige visão completa de handlers e hidratação.
- **Web Vitals, bundles e hidratação** — às vezes o “travão” é bundle + hidratação, não matemática pura.
- **DevTools: performance runtime** — valida hipóteses com números, não com opinião.

---

## Reflexão para fechar

Antes de `new Worker`, escreve numa linha: **“Qual trabalho exactamente saiu da fila do utilizador?”** Se a resposta for vaga (“os cálculos”), volta ao **trace**. Paralelismo bem contado começa com **fronteira de dados** clara — o resto é implementação.
