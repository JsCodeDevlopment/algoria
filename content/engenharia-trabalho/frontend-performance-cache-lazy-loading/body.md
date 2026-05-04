## Objetivos de aprendizagem

1. Separar mentalmente **cache HTTP (rede/CDN)** de **cache de dados na aplicação** (hooks / stores) sem misturar semânticas diferentes.
2. Aplicar **stale-while-revalidate** e **lazy loading** com consciência de **LCP**, **CLS**, **bundle** e falsos ganhos (“adiamos problema para o primeiro scroll”).
3. Escolher **code-splitting** por rota vs por widget com critérios de primeiro gesto útil vs custo cognitivo.
4. Ler um pedido nas DevTools ou num proxy e saber **quem** decidiu servir recurso fresco vs velho e **qual** cabeçalho prova isso.

---

:::didactic-figure
{
  "src": "/engenharia/performance-lazy-loading.png",
  "alt": "Comparação visual entre carregar tudo de imediato e carregar só o necessário sob demanda reservando espaço",
  "caption": "Instantâneo percebido != baixar tudo de uma vez · Reserva espaço antes de dados async para não sabotar CLS."
}
:::

:::didactic-bar-chart
{
  "title": "Onde o custo aparece primeiro (ordenar investigação)",
  "unit": "frequência em auditorias improvisadas",
  "bars": [
    { "label": "JS inicial bloqueante", "value": 8 },
    { "label": "Imagemhero sem dims/prioridade", "value": 7 },
    { "label": "Dados sempre refetch síncronos", "value": 6 },
    { "label": "Fontes síncrones sem subset", "value": 6 },
    { "label": "Bundles demasiado únicos por rota", "value": 4 }
  ],
  "caption": "Ilustrativo — mede sempre o teu site; usar isto apenas como mapa mental de perguntas, não verdade universal."
}
:::

---

## Analogia de armazém e expositor

Imagina dois armazéns:

1. **Armazém da rua** (CDN / cache intermediário próximo ao utilizador) — rápido a entregar prateleiras repetidas porque **mil pessoas** pediram o mesmo SKU hoje.

2. **Gavetas atrás do balcão do browser** — guardas etiquetas já construídas (objetos em memória) para não perguntares de novo ao armazém a cada segundo.

Uma página “lenta emocionalmente” quase sempre mistura falhas nos **dois níveis**:

- Ou **voltas sempre ao armazém remoto sem necessidade**.
- Ou **trazes camião cheio até ao expositor antes de o cliente conseguir ver o cartaz**.

Performance percebida moderna não é apenas “Mbps”; é **o que aparece primeiro**, **sem saltar layout**, sem animar spinners porque o modelo de dados **nunca confia temporariamente** em nada útil.

---

## Camadas de cache (sem confundir o mapa)

| Camada | O que guarda exemplar | Decide quão “fresco” | Ferramentas típicas |
| --- | --- | --- | --- |
| **Browser HTTP cache** | ficheiros estáticos, respostas GET cacheáveis | `Cache-Control`, `ETag`, `Last-Modified` | DevTools → Network → “from disk/cache” etc. |
| **CDN / reversa próxima** | cópias por PoP geográfico | mesmas políticas HTTP + invalidação comercial da CDN | dashboards de purge, surrogate keys onde existir |
| **Cache de dados app** | “último JSON útil por chave”, normalizado opcionalmente | TTL, eventos invalidação manual, webhooks internos | SWR / TanStack Query / Apollo `cache-first` segundo stack |
| **Service Worker** estratégia explícita | assets precache/runtime | escolhas tua código (`cache-first` vs `network-first`) | maior poder, maior superfície de bugs |

Um erro típico de equipa iniciante é dizer **“implementámos caching”** sem especificar camada — e depois ficar perplexa porque “apagar cache” no browser não mexe na CDN, ou porque “invalidação no hook” não muda `Cache-Control`.

---

## Lado cliente: dados vivos entre “rápido”, “certo” e “tranquilo”

Bibliotecas como **TanStack Query** e **SWR** popularizaram **mostrar rápido o que já se sabe e reconciliar**. Tradução pragmática:

- **Stale** não é erro — é política económica declarada (“aceito ler um balanço até 30 s atrás até receber fresco”).
- **Revalidate** é instrumento de segurança (rede em background ao focar janela, ao intervalo configurado, ao evento disparado quando o utilizador muda recurso relacionado).

### Chaves são contrato semântico

Uma URL de API repetida sob **queries diferentes** sem chaves distintas = UI que “pulula” porque duas vistas partilham o mesmo cache quando não deviam — ou vice-versa, fragmentação que impede prefetch inteligente. **Nomear bem a chave** é metade da arquitetura de cliente.

### Três comportamentos fundamentais comparados diretamente

| Abordagem | Sensação utilizador | Custo servidor | Ideal quando |
| --- | --- | --- | --- |
| **Fresh-only** típico (sempre aguardas rede) | Lento e ansioso | Alto | formulários médicos onde qualquer segundo de dado velho falha política legal |
| **Cache-only imprudente** | Instantâneo e perigoso | Baixo até trust quebrado | cenários só leitura congelados (build estático já publicado com hash) |
| **Stale + revalidate** | Instantâneo e honesto (indicadores de “actualizando…”) controlável | Moderado bem dimensionado | dashboards e catálogo com tolerância a segundos de defasagem |

### Invalidação: lista de cenários onde equipas apanham rajada

| Cenário | Armadilha | Mitigação didática |
| --- | --- | --- |
| Mutações | UI mostra resultado antigo porque cache não marca dependências | invalidate queries relacionadas; normalizar por id |
| Listas enormes paginadas | revalidate da página 3 quando alteras item da página 1 | invalidar filtros/agregações por `predicate` não só página |
| Autorização muda entre tabs | primeira tab ainda reflecte dados de role antigo | revalidate ao `visibilitychange` + invalidação quando token muda |

### Actualizações optimistas como UX (não como magia distribuída)

Mostras o estado esperado primeiro; reverte se servidor recusar. Exige pensar em **rollback** e em **ordering** quando o mesmo recurso pode ser editado rápido (concorrência lê `backend/concorrencia` no hub quando houver valores monetários sérios ligados ao optimistic).

---

## HTTP e CDN: ler cabeçalhos como documento legal da frescura

Tu não precisas decorar todas as directives — precisas de **perguntas**:

| Pergunta | Onde olhar | Leitura em produto |
| --- | --- | --- |
| Isto pode ser cacheado públicamente ou tem PII embutido? | `Cache-Control: private vs public`, cookies | recurso público sem auth cookie → candidato forte a CDN edge |
| Quanto tempo toleras servir igual sem revalidação? | `max-age`, `s-maxage`, `immutable` onde seguro | assets versionados/hash → TTL longo pode ser sane |
| E se mudou “igual slug”? | versioning no path/query + purge | migrações sem herdarem fantasma CDN |
| Há estratégia de revalidate barata em rede? | `ETag`, `Last-Modified` | evita downloads completos grandes |

Um sub-tópico fácil de ensinar juniors: **`stale-while-revalidate`** a nível HTTP (quando navegadores e configs respeitam) permite servir **cópia velha** enquanto busca fresca — **parecido em espírito** com SWR, mas em camada diferente. Misturar os dois sem plano gera “porque vejo X no Network tab mas Y no React DevTools”.

---

## Browser hints: antecipar sem roubar largura de banda de emergência

| Hint | O que promete | Cuidado |
| --- | --- | --- |
| `preconnect` | handshake cedo com origem | excesso de preconnects por página dilui benefício |
| `dns-prefetch` | resolve DNS cedo | não substitui TLS — entenda diferença |
| `prefetch` | baixa baixa prioridade próximo recurso | pode consumir dados móveis se abusado |
| `preload` | pede **agora** com prioridade explícita | usar só para recursos críticos comprovados no trace |

Regra de ouro: **mede com trace** se o hint realmente antecipou gargalo ou só adicionou competição de rede com o LCP.

---

## Lazy loading de imagens (além do `loading="lazy"`)

`loading="lazy"` no `<img>` é óptimo para conteúdo **abaixo da dobra** — browser adia fetch até proximidade de viewport (política interna do engine). Mas:

### LCP e hero

**Não** marques candidato a LCP como lazy por defeito “porque artigo disse”. O browser precisa descobrir e priorizar o recurso certo. Combina com:

- `width` e `height` explícitos **ou** aspect ratio via CSS moderno.
- `fetchpriority="high"` quando stack permitir e trace justificar.
- formatos modernos (`AVIF`/`WebP`) com fallback documentado se suportes segmentos antigos.

### Srcset e sizes (sem mandar ficheiro de 4000 px para ecrã de 360 CSS px)

```html
<img
  src="/hero-800.avif"
  srcset="/hero-800.avif 800w, /hero-1600.avif 1600w"
  sizes="(max-width: 640px) 100vw, 1200px"
  width="1200"
  height="675"
  alt="Equipa Algoria a analisar um trace Web Vitals"
  fetchpriority="high"
  decoding="async"
/>
```

### CLS: placeholder não é cosmético

Sem espaço reservado, imagem aparece → layout empurra → utilizador odeia mesmo que LCP oficial melhore médio. Skeleton com `min-height` próximo ao layout final salva reputação mais que micro-optimização irrelevante.

```tsx
<section className="min-h-[220px]" aria-busy={isLoading}>
  {isLoading ? <DashboardSkeleton /> : <DashboardPanels data={data} />}
</section>
```

---

## Code-splitting dinâmico (React/Next típico, mentalidade aplicável)

| Estratégia | Ganho esperado | Risco moral |
| --- | --- | --- |
| **Por rota** | reduz primeira visita a área profunda sem arrastar mundo inteiro | navegações subsequentes pagam waterfalls se não combinado com prefetch de link |
| **Por interação pesada** (modal, wizard) | primeira pintura menos JS parse | erro de suspense/ loading state fraco penaliza CLS |
| **Biblioteca gigantes isoladas** (charts/pdf) | alivia TBT inicial | granularidade alta → excesso pequenas requests em HTTP/1 cenários menos comuns |

Padrão com `dynamic`:

```tsx
const RelatorioPDF = dynamic(() => import("../widgets/RelatorioPDF"), {
  ssr: false,
  loading: () => <RelatorioSkeleton />,
});
```

`ssr: false` é decisão **contratual** — valida SEO e primeiro conteúdo útil antes de repetir boilerplate.

---

## Fontes Web: onde performance conhece marca

Subset agressivo e `font-display: swap` / `optional` conforme design system reduzem bloqueio de texto invisível. Preload só em famílias realmente críticas no primeiro ecrã — cada preload a mais é competição com hero.

---

## Integração com render no servidor e streaming (ligação curta)

Quando o HTML chega com conteúdo e o cliente hidrata, **lazy** no cliente ainda convive com escolhas de **prioridade de chunk** no servidor. Se notas “dados chegam cedo mas UI interactiva tarde”, o problema pode ser **hidratação ampla** — cruza com guia de Web Vitals do hub.

---

## Erros comuns (nomeá-los em retro acelera cultura)

| Sintoma | Hipótese frequente |
| --- | --- |
| “Cache infinito” após deploy | hash de asset não mudou por build mal configurado |
| Dados certos no laboratório, errados em campo | política de rede diferente (service worker antigo) |
| Lazy em tudo e LCP pior | adiaste descoberta do recurso crítico |
| CLS enorme após skeleton | altura final muito diferente do placeholder |

---

## Checklist antes de PR de performance de carregamento

- [ ] Trace mostra **um** foco: rede vs parse vs layout vs hidratação (não “foi mais rápido”).
- [ ] Imagens acima da dobra com dimensões e estratégia LCP consciente.
- [ ] Política de dados (stale window) **documentada** num comentário curto ou ADR se impacta negócio.
- [ ] Medição mobile throttling (4G rápido já filtra ilusões de Wi-Fi gigabit).
- [ ] Plano de invalidação após mutações críticas.

---

## Ligações no hub Algoria

- **Web Vitals, bundles e hidratação** — LCP/CLS/INP em linguagem de causas.
- **CSR, SSR e streaming** — onde lazy no cliente encontra streaming no servidor.
- **APIs com cache, quotas e resiliência** — simetria cliente/servidor em contratos de frescura.

---

## Reflexão para fechar

Escreve no teu template de PR: **“O que o utilizador vê nos primeiros 300 ms e que promessa esse instantâneo faz?”** Se não consegues responder sem citar loaders genéricos, ainda há trabalho narrativo antes de trabalho técnico.
