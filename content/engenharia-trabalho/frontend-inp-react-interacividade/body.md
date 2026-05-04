## Objetivos de aprendizagem

1. Dizer com palavras simples o que **INP** mede e porque usa “a **pior** interação” da visita.
2. Dividir uma interação em **três fases** e escolher onde atacar primeiro.
3. Usar **Performance** + **React Profiler** como binóculos, não como decoração.
4. Reconhecer padrões que parecem “só analytics” mas bloqueiam o utilizador.

---

## INP em linguagem humana

**INP** (*Interaction to Next Paint*) pergunta: *depois que o utilizador toca, clica ou pressiona tecla, quanto tempo até o ecrã mostrar uma resposta visível útil?*

Não é média bonita: para classificar a página, o campo usa algo próximo do **percentil alto das interações** (na prática “as piores experiências contam”).

Escalas úteis para comunicar à equipa:

| Classificação | Latência |
| --- | --- |
| Boa | até ~200 ms |
| Precisa melhorar | até ~500 ms |
| Fraca | acima de ~500 ms |

São números orientadores de ecossistema web — não substituem o teu painel de produto.

---

## As três fatias de uma interação

Toda interação pode pensar-se em três tempos **sequenciais**:

1. **Input delay** — da ação física até os handlers começarem (thread ocupada com outra coisa).
2. **Processing time** — o teu JavaScript de evento corre (reducers, árvore React, etc.).
3. **Presentation delay** — layout, pintura e composição até pixels novos no ecrã.

**Heurísticas de investigação** (não mandamentos milimétricos): quando INP está má:

- input delay alto sugere **fila na thread principal** (long tasks, timers a disparar trabalho pesado em loop).
- processing alto sugere **callbacks gigantes**, **re-render em cascata**, estado global a notificar meio mundo.
- presentation alto sugere **DOM enorme**, **reflow forçado** (ler layout logo após escrever estilo em ciclo apertado), ou callbacks pesados em `requestAnimationFrame` / observadores.

Medição fina pode vir da biblioteca `web-vitals` e versões que expõem breakdown — guardar em ferramentas tipo APM ajuda a não discutir “à sorte”.

---

## Métricas “do produto” ao lado da métrica genérica

INP resume **toda** a página. Para priorizar backlog, vale criar **uma métrica própria** no fluxo que mais dinheiro ou retenção move — por exemplo “tempo até overlay X estar utilizável”. Quando melhoras esse fluxo, INP global frequentemente **acompanha**, e tens narrativa para negócio.

---

## DevTools: rumo ao primeiro suspeito

Rotina curta:

1. CPU throttle (ex.: 4×) para simular telemóveis modestos.
2. Aba **Performance** → gravar → reproduzir **uma** interação → parar.
3. Olhar **Main Thread**: blocos longos aparecem empilhados? Isso são candidatos a **long tasks** (trabalho contínuo que atrasa tudo o que chega depois).
4. Painel **Bottom-Up** ou árvore invertida: ordenar por tempo e filtrar código da **tua** origem — não culpes o GC até ver proporção.

Extensões que etiquetam timings de Web Vitals ajudam a alinhar o trace ao número que vês em campo.

---

## React Profiler: três culpados habituais

Quando o teu stack é React, depois de ver processing alto:

1. **Pai renderizou** — estado no ancestral disparou render em árvore grande.
2. **Props mudaram** — referências novas (`{}`, funções inline) que quebram memoização superficial.
3. **Hook mudou** — `useState` / `useReducer` / contexto a atualizar; o Profiler indica qual índice de hook disparou o trabalho.

Truque pedagógico: temporariamente um `useEffect` que regista qual estado mudou durante a interação — reduz caça ao tesouro em código desconhecido.

---

## Estado global e seletores (Redux ou parecidos)

Padrões que aparecem em apps grandes:

- **`useSelector` com função que não é seletor memoizado** — o Redux assume mudança frequente e faz trabalho extra de verificação.
- **Seletores que devolvem objetos inteiros** quando só precisas de dois campos escalares — memorizar **camadas finas** (`createSelector` ou equivalente) reduz diffs inúteis.
- **História / router** que atualiza localização em cada micro-gesto — componentes subscritos tornam-se “alarmes falsos” de render.

Regra prática: estado global deve ser **tão perto quanto possível** do sítio que precisa — menos superfície de notificação.

---

## Analytics e logs no mesmo instante do clique

Vários produtos disparam HTTP ou filas pesadas **dentro** do middleware logo após o utilizador agir. Isso junta analytics ao **mesmo bloco** que devia pintar feedback visual.

Ideia **didática** (nome em inglês comum na comunidade: *yield to the main thread*):

- Primeiro deixa o browser respirar para pintar e responder ao input.
- Depois agenda analytics em **nova tarefa** (`setTimeout(…, 0)` ou `scheduler.yield()` quando disponível).

Trade-off transparente: equipa de dados deve validar que **não** perdem eventos em navegações ultra-rápidas — por exemplo usando `sendBeacon` ou fila servidor fiável.

---

## React 18 e “renderização concorrente” (intuição)

Versões mais novas do React podem **parcelar** trabalho e devolver a thread principal mais vezes do que um render totalmente síncrono. Na prática ajuda **input** quando antes um render monolítico ocupava a thread durante demasiado tempo.

Não é mágica: ainda precisas de componentes pequenos, estado bem colocado e menos trabalho por evento.

---

## Erros comuns

| Sintoma | Hipótese primeira |
| --- | --- |
| Scroll dispara renders em botão fixo | throttle vs debounce mal escolhido; `ResizeObserver` a atualizar estado demasiado |
| Abrir modal lento | router/history a notificar meio layout |
| INP melhora em desktop, horror em mobile | CPU throttle revela processing alto só em hardware fraco |

---

## Checklist de sprint único

- [ ] Escolhi **uma** interação crítica e medi INP ou proxy próprio.
- [ ] Tracei uma gravação Performance com throttle.
- [ ] Liste uma causa em **input / processing / presentation**.
- [ ] Validei com QA que analytics não regrediu.

---

## Leituras de profundidade

- [Optimizing INP for a React App & Performance Learnings](https://www.iamtk.co/optimizing-inp-for-a-react-app-and-performance-learnings) — estudo de caso longo com breakdown, Profiler e padrões de fila.
- [Profiling & Optimizing the runtime performance with the DevTools Performance tab](https://www.iamtk.co/profiling-and-optimizing-the-runtime-performance-with-the-devtools-performance-tab) — long tasks e listas.

---

## Reflexão

Da próxima vez que alguém disser “optimiza INP”, pergunta: **qual das três fatias** está a doer? Sem essa pergunta, vais optimizar bundler quando o problema era um `useSelector` mal pensado.
