## Objetivos de aprendizagem

Ao terminar este guia deves conseguir:

1. Traduzir **LCP**, **INP** e **CLS** em perguntas concretas sobre HTML, rede e JavaScript.
2. Separar **tempo de rede** do **atraso de render do elemento LCP** (um é download; outro é trabalho na thread principal antes da pintura).
3. Escolher **uma** mudança de bundle ou hidratação por sprint sem dispersão.
4. Explicar à equipa por que “apurar Lighthouse até 100” nem sempre melhora utilizadores reais.

---

:::didactic-figure
{
  "src": "/engenharia/frontend-web-vitals-bundles-hidratacao.svg",
  "alt": "Duas caixas ligadas: descoberta e transferência de rede versus render delay na thread principal",
  "caption": "Se o download da hero termina cedo mas o LCP é tarde, o gargalo não é só CDN — investiga CSS/JS bloqueante e hidratação."
}
:::

Hero com dimensões fixas e prioridade explícita (HTML):

```html
<img
  src="/hero.webp"
  alt="Descrição útil"
  width="1200"
  height="630"
  fetchpriority="high"
  decoding="async"
/>
```

Reduzir CLS reservando espaço antes dos dados assíncronos:

```tsx
<section className="min-h-[220px]" aria-busy={loading}>
  {loading ? <Skeleton /> : <DynamicBlock data={data} />}
</section>
```

---

## Analogia rápida

Imagina uma loja: **LCP** é quanto tempo demoras a ver o cartaz principal à entrada (algo grande e útil). **INP** é o tempo entre pedires algo ao balcão e o funcionário reagir. **CLS** é prateleiras que se mexem depois de já teres estendido a mão. Métricas servem para não discutir “sentimento lentíssimo” — passamos a apontar prateleiras.

:::didactic-figure
{
  "src": "/engenharia/web-vitals-analogia-loja.svg",
  "alt": "Três painéis coloridos associando LCP ao cartaz da loja, INP ao balcão e CLS às prateleiras instáveis",
  "caption": "Mesma analogia em diagrama: útil para onboardings e para alinhar produto com engenharia."
}
:::

---

## O trio Core Web Vitals (mentalidade)

| Métrica | Pergunta que fazemos ao código |
| --- | --- |
| **LCP** | Qual recurso domina o “maior desenho” visível? Imagem hero mal comprimida? Font blocking? CSS pendente? |
| **INP** | Que trabalho longo na thread principal atrasa input (handlers pesados, hidratação total)? |
| **CLS** | O layout reserva espaço para imagens, fontes e blocos async ou salta quando dados chegam? |

Importante: são **sinais de campo** (utilizadores reais). Laboratório (Lighthouse local) orienta; campo decide prioridade.

:::didactic-metrics
{
  "title": "Core Web Vitals — leitura rápida",
  "columns": 3,
  "items": [
    { "label": "LCP", "value": "≤ 2,5 s", "sublabel": "alvo comum em docs públicos (campo)" },
    { "label": "INP", "value": "≤ 200 ms", "sublabel": "boa responsividade percebida" },
    { "label": "CLS", "value": "≤ 0,10", "sublabel": "pouco salto visual acumulado" }
  ]
}
:::

Laboratório estável vs campo **heterogéneo** (rede, dispositivos, caches). Gráfico ilustrativo — não é um relatório real:

:::didactic-line-chart
{
  "title": "Laboratório vs percentis de campo (exemplo didático)",
  "caption": "O laboratório pode parecer ‘óptimo’ enquanto o p95 de campo ainda sofre — por isso priorizamos dados reais.",
  "points": [
    { "x": "Lab", "y": 94 },
    { "x": "p75 campo", "y": 72 },
    { "x": "p95 campo", "y": 51 }
  ]
}
:::

---

## LCP em duas metades (didática que evita culpar só a CDN)

Muitas equipas olham só para “a imagem demorou a baixar”. Na prática o LCP mistura:

1. **Descoberta e transferência** — o browser encontrou o recurso e trouxe bytes (rede, cache, prioridade de fetch).
2. **Render delay do elemento** — o recurso já chegou mas a página **ainda não pintou** porque CSS ou JavaScript na thread principal **adiaram** estilos, layout ou primeiro quadro útil.

Se no trace vês o pedido da imagem hero **completo cedo** mas o LCP **tarde**, o problema não é só CDN: investiga **CSS bloqueante**, **scripts que atravessam o `<head>` sem estratégia** e **trabalho síncrono** antes da primeira pintura.

Ordem mental de hipóteses:

- Recursos no `<head>` que bloqueiam parsing ou execução antes do conteúdo crítico.
- Folhas de estilo grandes ou animações globais que recalculam estilo em cada frame crítico.
- Hero marcado com prioridade baixa de rede — o browser pode adiar o fetch enquanto trata “coisas mais urgentes” à sua escolha.

Para imagens candidatas a LCP, faz sentido garantir **prioridade explícita de fetch** quando o teu stack permite (por exemplo `fetchpriority="high"` no elemento ou política equivalente). Isto não substitui comprimir bem o ficheiro — apenas diz ao browser “este cartaz é mesmo o cartaz”.

---

## Hidratação e LCP: quando o sintoma é “só depois do React”

Frameworks que geram HTML no servidor e depois **hidratam** no cliente ligam eventos ao DOM já pintado. Se existirem **erros de hidratação** (HTML servidor ≠ o que o cliente esperou), o runtime pode **recuperar renderizando outra vez** trechos grandes ou até a raiz. Na prática:

- O utilizador **já viu** uma imagem ou bloco.
- O browser ou o framework **volta a medir** “qual é o maior conteúdo” depois dessa segunda vaga de trabalho — e o relógio do LCP pode **disparar**.

Causas didáticas frequentes (fáceis de ensinar à equipa):

- Texto que muda entre servidor e cliente (datas “agora”, versões de build com minutos diferentes).
- Ramificações `typeof window !== 'undefined'` que produzem markup diferente no primeiro paint vs hidratação.
- Componentes que assumem APIs só disponíveis no cliente mas renderizam como se já existissem no servidor.

Correções típicas alinhadas com documentação moderna de frameworks:

- **Um único valor inicial** no servidor e no cliente; ajustes que dependem do cliente passam para `useEffect` ou equivalente (depois da hidratação).
- Em texto que **tem** de divergir (relógio ao vivo), usar mecanismos explícitos do framework para suprimir aviso de mismatch **só onde é inevitável**, não como desculpa para dados inconsistentes.

Isto explica porque “otimizar só o hero no CDN” às vezes **não mexeu no LCP**: o gargalo era **reenquadramento pós-hidratação**, não megabytes.

---

## Passo a passo — diagnosticar sem ferramentas caras

### 1. Inventário honesto da página crítica

- Lista os **três** elementos maiores no primeiro ecrã (hero, navegação, bloco de texto).
- Para cada um: é imagem, texto com webfont ou componente JS pesado?

### 2. Mapa de rede mental

- CSS bloqueia pintura? Scripts no `<head>` sem `defer`/`async` onde faz sentido?
- Existe **prefetch** útil ou só ruído?

### 3. JavaScript que não era estritamente necessário ao primeiro gesto

Separa mentalmente:

- **Crítico**: sem isto o utilizador não consegue ler ou clicar o call-to-action principal.
- **Adiável**: gráficos animados, widgets secundários, tracking não bloqueante.

Errado comum: hidratar árvore inteira porque “é mais simples no projeto”.

---

## Bundles: cortar com critério

1. **Mede** o bundle da rota (ferramentas de análise do teu bundler). Sem número, tudo é achismo.
2. **Code-splitting por rota** primeiro — ganhos grandes com baixo risco moral (menos regressões cruzadas).
3. **Bibliotecas gigantes**: substituir ícone-a-ícone ou formatter inteiro por uso pontual vale conversa com produto — comunica custo em KB e em parse time.

Frase útil em revisão: “Este import adiciona X KB gzip e corre na primeira visita; precisamos mesmo antes da primeira interação?”

---

## Modelos de render e performance (ligação curta)

**CSR** (quase tudo no cliente): o utilizador espera por JS baixar, parsear e executar antes do conteúdo principal aparecer — **LCP** tende a sofrer em dispositivos modestos.

**SSR clássico**: servidor manda HTML já com conteúdo; melhora “ver texto/logo cedo”, mas **hidratar tudo de uma vez** ainda pode pesar em **interatividade**.

**Streaming + hidratação seletiva** (ideia): mandar HTML em **fatias** e hidratar porções à medida que fazem sentido, em vez de uma única “onda” gigante — melhora equilíbrio entre TTFB, primeiro conteúdo útil e trabalho na thread principal.

Não precisas decorar siglas: escolhe arquitetura **pelo tipo de página** (marketing estático vs app hiper-interativo) e mede **campo**, não só laboratório.

---

## Hidratação: menos é mais clareza

**Hidratar** = React/Vue/similar ligam eventos ao DOM já pintado. Quanto mais árvore hidratas de forma síncrona e pesada, mais competes com input do utilizador (**INP**) e com pintura estável (**CLS**).

Estratégias didáticas (sem mandar framework específico):

- Conteúdo estático pode ficar **servidor ou HTML estático** sem cliente até scroll ou interação.
- Componentes “below the fold” podem entrar **lazy** quando o viewport chega perto.
- Evita duplicar dados enormes no HTML **e** mandar o mesmo por JSON para hidratar — alinha com backend como fonte única.

---

## Erros comuns (e como os nomear em retro)

| Sintoma | Causa típica |
| --- | --- |
| LCP alto só em mobile | Imagens sem `sizes`, CDN distante, hero gigante |
| Imagem hero já veio mas LCP tarde | CSS/JS bloqueante, render delay, hidratação a refazer layout |
| INP mau após deploy de analytics | Script de terceiros bloqueante ou middleware que faz muito trabalho no mesmo turno do clique |
| CLS após auth | Drawer ou banner que empurra layout quando estado chega |

---

## Checklist antes de abrir PR de performance

- [ ] Identifiquei **uma** métrica-alvo (por exemplo LCP da homepage ou INP na página X).
- [ ] Medi antes/depois em ambiente próximo a produção (throttling 4G rápido ajuda).
- [ ] Separei hipótese “rede” vs “render delay” vs “hidratação” para não otimizar o eixo errado.
- [ ] Documentei trade-off de produto (“menos animação na primeira vista”).
- [ ] Plano B se regressão: revert ou feature flag.

---

## Glossário rápido

- **Thread principal**: onde corre parsing, layout, JS — saturar aqui prejudica input e atraso de render do LCP.
- **Crítico vs adiável**: definido pelo utilizador médio da página, não pelo conforto dev.
- **Field data**: telemetria real; confunde menos roadmap que um screenshot isolado de Lighthouse.

---

## Leituras de profundidade (casos reais)

Para ver investigações completas com traces e impacto em produto:

- [Optimizing Next.js Performance: LCP, Render Delay & Hydration](https://www.iamtk.co/optimizing-nextjs-performance-lcp-render-delay-hydration) — exemplo de LCP ligado a scripts, CDN e sobretudo **render delay** e **hidratação**.
- [The Evolution of React Rendering Architectures & Web Performance](https://www.iamtk.co/the-evolution-of-react-rendering-architectures-and-web-performance) — CSR, SSR e streaming em linguagem de métricas web.

---

## Reflexão para fechar

Escolhe uma página que dói em analytics de velocidade. Escreve num post-it (real ou digital): “Qual é **um** elemento que pode esperar 300 ms ou até ao segundo ecrã?” Essa pergunta — repetida — constrói cultura.
