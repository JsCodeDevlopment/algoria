## Objetivos de aprendizagem

1. Ler um trace da **Performance** sem te perderes nos menus.
2. Explicar **long task** à equipa de produto numa frase.
3. Saber quando **virtualizar lista** é ciência e quando é cosmética.

---

## Porque “sinto lag” não chega

Browsers fazem parsing, estilo, layout, pintura e composição — maior parte em coordenação com **uma thread principal** ocupada também com JavaScript.

Se essa thread fica **sem paragens longas** (> ~50 ms é referência clássica para “long task”), input do utilizador espera — isto alimenta métricas de interatividade.

---

## Setup simples de investigação

1. DevTools → **Performance**.
2. Opcional mas útil: CPU **throttling** (4×) para simular telemóvel.
3. Gravar → reproduzir scroll ou clique → parar.
4. Observar faixa **Frames** + linha **Main** — picos altos são candidatos a investigação.

Performance Monitor (painel separado) mostra CPU e nós DOM em tempo real — bom primeiro triagem antes de gravar trace pesado.

---

## Long tasks e flame chart

No flame chart, cada bloco é trabalho síncrono encadeado. Quando é largo:

- desce na pilha até encontrar **função da tua app** (nome preservado no build ou via source maps).
- correlaciona com **frames** perdidos — utilizador vê jank.

Tab **Bottom-Up** ordena por custo agregado — útil quando flame parece “espaguete”.

---

## Redux / estado global no trace

Sinais frequentes em apps complexas:

- `performSyncWorkOnRoot`, `checkForUpdates` — explosão de renders ou selectors a recalcular demais.
- Callbacks nomeados tipo `onSomethingReceived` gigantes após fetch — processing concentrado num único tick.

Isto não diz “Redux é mau”; diz “precisamos de menos trabalho por atualização”.

---

## Listas longas: DOM é recurso finito

Cada linha de lista pode trazer imagens, observers e listeners. Renderizar **mil** nós porque dados existem **duplica custo** de layout e GC.

**Virtualização** (janela deslizante): só manténs no DOM as linhas visíveis (+ pequeno buffer). Ao scroll, reciclás nós — menos trabalho por frame.

Trade-offs honestos:

- acrescentas biblioteca e complexidade.
- ganhas fluidez quando lista é grande **e** medições mostravam long tasks ligadas a scroll.

---

## Erros comuns

| Armadilha | Como aparece |
| --- | --- |
| throttle em scroll onde bastava debounce | estado atualiza vezes demais durante gesto contínuo |
| append infinito sem virtualização | DOM cresce até qualquer interação degradar |
| profiling só em desktop developer machine | lag só aparece em Android modesto |

---

## Checklist

- [ ] Gravei trace com throttle representativo.
- [ ] Identifiquei pelo menos uma **long task** atribuível a código nosso.
- [ ] Decidi se próximo passo é **menos render**, **menos DOM** ou **menos trabalho no handler**.

---

## Leituras de profundidade

- [Profiling & Optimizing the runtime performance with the DevTools Performance tab](https://www.iamtk.co/profiling-and-optimizing-the-runtime-performance-with-the-devtools-performance-tab) — caso FindHotel com virtualização e impacto em métricas de conversão.
- [Optimizing INP for a React App & Performance Learnings](https://www.iamtk.co/optimizing-inp-for-a-react-app-and-performance-learnings) — ligações entre Profiler e INP.

---

## Reflexão

Antes de pedires “refactor épico”, uma gravação Performance costuma mostrar **um** monstro dominante. Mata esse primeiro — momentum da equipa sobe.
