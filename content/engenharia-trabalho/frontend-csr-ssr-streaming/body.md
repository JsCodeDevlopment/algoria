## Objetivos de aprendizagem

1. Comparar **CSR**, **SSR clássico** e **streaming** sem tribalismo.
2. Ligar cada modelo a **efeitos típicos** em LCP, TTFB e interatividade.
3. Entender **Suspense** como “placeholder honesto” enquanto dados viajam.

---

:::didactic-figure
{
  "src": "/engenharia/frontend-csr-ssr-streaming.svg",
  "alt": "Diagrama comparando CSR com HTML mínimo e JS primeiro, SSR com HTML útil cedo e streaming em fatias",
  "caption": "Nenhum modelo é “equipa de futebol”: mistura rotas estáticas, SSR onde SEO exige e CSR onde métricas internas aceitam."
}
:::

:::didactic-metrics
{
  "title": "Sinais típicos por modelo (ordem de grandeza ilustrativa)",
  "columns": 3,
  "items": [
    { "label": "CSR · primeiro HTML útil", "value": "Tarde", "sublabel": "depende de JS + dados no cliente" },
    { "label": "SSR · leitura inicial", "value": "Cedo", "sublabel": "TTFB pode subir se servidor esperar tudo" },
    { "label": "Streaming · UX", "value": "Melhor", "sublabel": "shell + Suspense honesto — watchdog em APIs" }
  ]
}
:::

:::didactic-bar-chart
{
  "title": "Complexidade operacional relativa (exemplo didático)",
  "unit": "1–10",
  "bars": [
    { "label": "CDN CSR estático", "value": 3 },
    { "label": "SSR monólito", "value": 6 },
    { "label": "Streaming + boundaries", "value": 8 }
  ],
  "caption": "Mais flexibilidade costuma exigir mais disciplina em timeouts, caches e erros por segmento."
}
:::

HTML mínimo típico de SPA (conceito — o teu framework pode gerar mais):

```html
<!doctype html>
<html lang="pt">
  <head>
    <meta charset="utf-8" />
    <script type="module" src="/assets/entry.js" defer></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

---

## CSR — o browser faz quase tudo

**Client-Side Rendering**: servidor manda HTML mínimo; bundle JS baixa, parseia, executa; só então montas DOM rico e buscas dados.

**Prós:** hospedagem simples em CDN; navegação interna pode ser suave.

**Contras para utilizadores:** LCP e primeiro conteúdo útil dependem de **cadeia JS + rede + dados** na máquina do utilizador — em telemóveis modestos isso dói.

Citação útil para reunir produto e engenharia (parafraseando argumentos públicos de especialistas): *com métricas tipo Core Web Vitals, CSR puro é estruturalmente desfavorecido; SSR ou geradores estáticos podem ajudar — mas SSR bem feito ainda precisa de disciplina na hidratação.*

---

## SSR clássico — HTML cheio cedo, hidratação depois

Servidor busca dados (às vezes tudo de uma vez), gera HTML completo, cliente recebe **página legível rapidamente**.

**Ganho:** utilizador vê texto/imagem antes do JS pesado terminar.

**Custo:** se o servidor esperar **todas** as fontes de dados lentas, **TTFB** aumenta; quando JS chega, ainda podes hidratar **tudo** síncrono — interatividade atrasa.

Frase-chave pedagógica: *“SSR não é problema — hidratar à pressa demais é que compete com input.”*

---

## Streaming — fatias de HTML em vez de monólito

Ideia: enviar **primeiro** o que não depende de dados lentos (cabecalho, moldura), depois **stream** de blocos dinâmicos quando cada fetch termina.

No ecossistema React moderno isto liga-se a limites de **Suspense**: fallback visível (esqueleto) enquanto servidor/cliente resolve.

**Hidratação seletiva** (conceito): blocos que já chegaram podem ficar interativos **sem** esperar o último byte da página inteira — melhora sensação de “_site responde”_ comparado com uma única onda gigante.

---

## Como escolher na vida real

| Cenário | Tendência |
| --- | --- |
| Marketing / blog com pouca personalização por pedido | estático (SSG) + CDN |
| Dashboard pesado privado | CSR pode bastar **se** aceitares métricas internas; mede INP |
| E-commerce ou pesquisa com SEO forte | SSR ou estático + incremental; streaming quando há blocos lentos isolados |

---

## Erros comuns

- “Migrámos para SSR” mas hero continua atrás de **dez** chamadas sequenciais no servidor — ganho visual pequeno.
- Skeleton eterno porque timeouts de API não tratados — streaming não substitui SLAs de backend.
- Hidratar árvore inteira só porque “é o default do boilerplate”.

---

## Checklist

- [ ] Desenhei diagrama com setas: rede → HTML → JS → dados → pintura.
- [ ] Sei qual pedido bloqueia **primeiro conteúdo útil**.
- [ ] Defini fallback aceitável para cada Suspense/boundary.

---

## Leituras de profundidade

- [The Evolution of React Rendering Architectures & Web Performance](https://www.iamtk.co/the-evolution-of-react-rendering-architectures-and-web-performance) — quadro comparativo com métricas relacionadas.
- [Optimizing Next.js Performance: LCP, Render Delay & Hydration](https://www.iamtk.co/optimizing-nextjs-performance-lcp-render-delay-hydration) — onde streaming/hidratação encontra LCP real.

---

## Reflexão

Arquitetura não é equipa de futebol. Podes misturar **rotas estáticas**, **SSR só onde SEO exige** e **CSR em áreas autenticadas** — desde que instrumentação mostre onde dói para o utilizador final.
