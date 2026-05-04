## Objetivos de aprendizagem

Ao terminar este guia deves conseguir:

1. Separar **rastreio**, **renderização**, **indexação** e **ranking** sem misturar responsabilidades nem prometer posições mágicas ao negócio.
2. Escolher **estratégia de renderização** (estático, SSR, CSR, híbrido) coerente com o tipo de página **pública** vs **autenticada**.
3. Aplicar **canonical**, **hreflang**, **noindex** e **redirects** em cenários típicos de produção sem criar armadilhas de duplicação.
4. Escrever **requisitos auditáveis** para SEO técnico — o que medimos em Search Console, logs e CI — em vez de “subir para primeiro lugar”.

---

:::didactic-figure
{
  "src": "/engenharia/frontend-seo-tecnico-cenarios-producao.svg",
  "alt": "Fluxo Discover Fetch Render Index signals da perspetiva de engenharia",
  "caption": "Ranking não é uma pasta no repositório: engenharia reduz atritos técnicos e deixa o conteúdo competir."
}
:::

:::didactic-metrics
{
  "title": "Quem controla o quê (expectativas alinhadas)",
  "columns": 3,
  "items": [
    { "label": "Engenharia", "value": "URLs estáveis", "sublabel": "HTTP, HTML semântico, dados estruturados válidos, velocidade, segurança" },
    { "label": "Produto / SEO", "value": "Intenção de busca", "sublabel": "copy, pesquisa palavras-chave, estratégia de conteúdo" },
    { "label": "Plataforma externa", "value": "Ranking final", "sublabel": "concorrência, backlinks, histórico — não contratáveis como SLA de código" }
  ]
}
:::

:::didactic-bar-chart
{
  "title": "Onde equipas gastam tempo primeiro em SEO técnico (exemplo)",
  "unit": "Esforço relativo 1–10",
  "bars": [
    { "label": "HTTPS + duplicados", "value": 6 },
    { "label": "Indexação / robots", "value": 7 },
    { "label": "Performance campo", "value": 8 },
    { "label": "Structured data", "value": 5 },
    { "label": "Hreflang multi-site", "value": 9 }
  ],
  "caption": "Hreflang mal feito destrói confiança entre mercados; performance má má experiência mesmo com HTML perfeito."
}
:::

---

## Três mundos — vocabulario partilhado com marketing

### Rastreio (crawl)

Robô segue links e pedidos na fila. Tu controlas **descoberta**: links internos, sitemap, bloqueios (`robots.txt`, `noindex`), erros 5xx intermitentes e **profundidade** da arquitetura de links.

### Renderização e HTML entregue ao crawler

Com JavaScript, o crawler pode precisar de **segunda fase** de renderização. Nem todos os bots comportam-se igual ao Googlebot moderno. Implicação prática: páginas críticas de receita orgânica não devem depender só de hidratação tardia sem plano B.

### Indexação vs ranking

**Indexação** é “entrar ao livro”. **Ranking** é “em que página do livro apareces”. Podes estar indexado e mal posicionado — problema frequentemente de conteúdo/intenção, não só de `meta`.

---

## Cenário A — Site institucional amplamente estático

**Perfil:** páginas `/`, `/precos`, `/blog/*` geradas em build, CDN na frente.

**O que queremos**

- HTML completo no primeiro response (ótimo para crawl barato).
- `ETag` / cache headers claros para assets; HTML pode ter TTL curto se publicas frequentemente.

**Armadilhas**

- Deploy que altera hashes de asset mas **não** atualiza referências em HTML cacheado — utilizador ou crawler vê mistura de versões até invalidar CDN.
- Blog em Markdown sem datas consistentes no markup — confunde dados estruturados `Article`.

**Snippet — canonical estável**

```html
<link rel="canonical" href="https://www.exemplo.pt/blog/como-medir-core-web-vitals" />
```

---

## Cenário B — SPA com shell CSR e rotas públicas

**Perfil:** uma app React/Vue com router no cliente; páginas públicas (`/marketing`, `/produto/publico`) competem por SEO.

**Tensões**

- Primeiro HTML pode ser um `<div id="root">` quase vazio — crawler pode executar JS, mas **custo** e **fragilidade** sob erros de rede em scripts de terceiros.
- Metadados dinâmicos via JS podem chegar **tarde** para ferramentas que não executam JS profundo.

**Mitigações realistas**

1. **Pré-render** só onde SEO importa (SSG por rota ou micro-front estático).
2. **`<head>` mínimo no servidor** com `<title>` e descrição mesmo antes da hidratação — requer suporte de framework ou HTML shell por rota.
3. Evitar que erros de analytics ou A/B bloqueiem bundle crítico nos primeiros segundos.

**Pseudo-decisão**

```text
Se a URL traz receita orgânica mensurável -> não pode ser CSR puro sem pré-render ou SSR parcial.
```

---

## Cenário C — Híbrido SSG / SSR (produto tipo Next.js / equivalente)

**Perfil:** rotas estáticas onde possível; SSR onde há dados por pedido; ISR opcional.

**Cenários dentro do cenário**

| Subtipo | Exemplo | Cuidado técnico |
| --- | --- | --- |
| SSG puro | Landing de campanha | Rebuild quando copy muda; preview editorial |
| SSR dinâmico | Listagem com filtros moderados | TTFB vs frescura; caching na edge |
| ISR | Blog grande | `stale` aceitável para negócio; botão “regenerar” operacional |

**Headers úteis**

```http
HTTP/1.1 200 OK
Cache-Control: public, max-age=0, s-maxage=3600, stale-while-revalidate=86400
```

Interpretação para equipas: browser pode revalidar rápido; CDN pode servir fresco dentro da janela — política deve estar escrita no runbook, não só na cabeça do dev.

---

## Cenário D — E-commerce — filtros, ordenação e URLs parametrizadas

**Perfil:** `/produtos?cor=azul&ordenacao=preco`.

**Problemas típicos**

- Centenas de combinações geram **URLs quase duplicadas** com o mesmo conteúdo substantivo.
- Parâmetros de tracking (`utm_*`) criam URLs infinitas — não devem gerar páginas indexáveis “novas”.

**Padrões defendíveis**

1. Escolher **URL canónica** por lista — frequentemente versão sem parâmetros cosméticos ou com conjunto acordado de filtros “SEO-friendly” (`/sapatos/azul`).
2. Para facetas de baixo valor de busca: `noindex, follow` ou consolidar via canonical para página mãe — decisão é **estratégia**, não dogma; documenta no SEO brief.
3. **Paginação**: cada página é real para utilizadores; canonical deve refletir **acordo editorial** (_self vs página agregadora). Evitar mil páginas finas só por números.

**Exemplo de robots por página de filtro experimental**

```html
<meta name="robots" content="noindex, follow" />
```

---

## Cenário E — Multi-idioma e hreflang

**Perfil:** `exemplo.pt`, `exemplo.com/en`, ou path `/en/blog/slug`.

**Erros caros**

- Cadeias quebradas — `pt` aponta para `en` mas `en` não reverte para `pt`.
- Misturar **idioma** com **região** sem critério (`pt` vs `pt-BR`).
- Canonical que contradiz hreflang (mesmo URL declarada como alternativa e ao mesmo tempo canonical de outra).

**Checklist mínimo**

- Cada URL indexável tem **conjunto completo** de alternativas **ou** justificativa documentada para exclusões.
- Usar **URLs estáveis** — não depender só de cookies para idioma em páginas públicas indexáveis.

**JSON-LD pode complementar mas não substitui hreflang quando o motor espera tags de página.**

---

## Cenário F — Staging, previews de CMS e branches

**Perfil:** `preview.exemplo.pt`, `*.vercel.app`, Pull Request deployments.

**Regra de ouro**

Ambientes não produtivos devem ser **não indexáveis por defeito**:

```html
<meta name="robots" content="noindex, nofollow" />
```

Ou cabeçalho HTTP:

```http
X-Robots-Tag: noindex, nofollow
```

**Cenário subtil**

Cliente pede “preview partilhável” — marketing copia link para Gmail; dias depois o URL aparece indexado. Solução combina **noindex**, **autenticação fraca por token** ou TTL curto com política clara.

---

## Cenário G — Migração de URLs ou domínio

**Perfil:** reorganização de `/blog/` para `/recursos/` ou mudança de hostname.

**Contrato técnico**

1. Mapa `301` **persistente** de URLs antigas para destinos mais próximos semanticamente — não desviar tudo para homepage sem auditoria.
2. Manter **redirect chains** curtos (idealmente um hop).
3. Atualizar **sitemap**, **internal links**, **hreflang**, **Search Console** propriedades conforme stack permitir.

**Trecho conceitual nginx / CDN**

```nginx
location /blog/artigo-antigo {
  return 301 https://www.exemplo.pt/recursos/artigo-novo;
}
```

Testes automatizados podem validar lista CSV de top URLs antes do cutover.

---

## Cenário H — Área autenticada (dashboard) vs área pública

**Perfil:** SaaS com `/app/*` atrás de login.

**Expectativa realista**

Google não deve indexar dados privados — não é “SEO ruim”, é **exclusão correta**.

**Armadilhas**

- Erros devolvem HTML de login **200 OK** em vez de **401** — crawler pode indexar um “fantasma” da app.
- Assets públicos partilhados com hashes previsíveis vazando dados — tema mais segurança que SEO, mas aparece em audits.

**Sitemap**

Tipicamente só URLs públicas. Apps não públicas podem omitir-se inteiramente ou usar `noindex` em páginas de signup que não são landing SEO.

---

## Cenário I — Portal de documentação técnica em subpath

**Perfil:** `docs.exemplo.com` ou `/docs`.

**Tensões**

- Versões (`/docs/v1`, `/docs/v2`) geram duplicação — canonical ou `noindex` para versões antigas conforme política de suporte.
- Pesquisa client-side sem URLs dedicadas — utilizadores não partilham estado; SEO depende de **landings** estáticas por tema.

**Mitigação**

Gerar páginas **anchor** para títulos H2 populares quando volume orgânico justifica — não substituir UX interna de doc.

---

## Dados estruturados — cenários por tipo de página

### Landing editorial longa

`Article` ou `BlogPosting` com `author`, `datePublished`, `publisher`.

### SaaS com página de preços

`Product` nem sempre encaixa — avaliar `SoftwareApplication` ou `WebPage` + FAQs (`FAQPage`) onde copy é estável.

### Ajuda / suporte

`FAQPage` apenas quando **conteúdo visível** na página espelha as perguntas — não inventar FAQs só para rich results.

**Esqueleto Article (ilustrativo)**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Guia de SEO técnico para equipas front-end",
  "datePublished": "2026-05-04",
  "author": { "@type": "Organization", "name": "Algoria" }
}
</script>
```

Validar com **Rich Results Test** antes de celebrar.

---

## robots.txt — o que é (e o que não é)

`robots.txt` orienta **crawl político**, não substitui **segurança**. Um URL “bloqueado” pode continuar indexável se ter links externos — usar **`noindex`** quando queres **retirar** da SERP.

**Erro comum**

```txt
User-agent: *
Disallow: /
```

Em staging esquecido atrás de proxy mal configurado — cópia espelhada do site some da pesquisa de forma imprevisível.

---

## Sitemap XML — fatias e honestidade

- Dividir por tipo quando ultrapassas limites de URLs por ficheiro na especificação que segues.
- **`lastmod`** deve refletir mudança **real** — pipelines que bumpam data universalmente erosionam confiança interna nos relatórios.

---

## Performance — Core Web Vitals e narrativa SEO

Um site lento prejudica **conversão** e pode degradar **sinais de experiência** onde motores os utilizam. Não confundir **Lighthouse local** com **campo real**. Liga ao guia **Web Vitals** deste hub para métricas detalhadas.

---

## Erros frequentes em revisões de código “por causa do SEO”

| Sintoma em PR | Porque dói |
| --- | --- |
| `canonical` aponta sempre para homepage | consolida autoridade no sítio errado |
| mil rotas `noindex` por receio | páginas úteis somem sem substituto |
| JSON-LD gerado de props não escapadas | risco XSS + dados inválidos |
| hreflang só no cliente via JS | algumas ferramentas e bots nem chegam lá |

---

## Checklists rápidos por tipo de produto

### Marketing + blog

- [ ] HTTPS com redirects 301 de hosts espúrios.
- [ ] Canonical por URL indexável.
- [ ] Sitemap só com 200 OK indexáveis.
- [ ] Structured data validado em staging.

### Marketplace / catálogo

- [ ] Política escrita para filtros + canonical / noindex.
- [ ] Paginação não explode URLs infinitas por parâmetros.

### Docs / developer portal

- [ ] Versões antigas tratadas (canonical ou noindex).
- [ ] Páginas âncora para temas de alto tráfego quando aplicável.

---

## Glossário curto

- **SERP** — página de resultados do motor de busca.
- **Rich result** — resultado com tratamento visual extra quando dados estruturados elegíveis são aceites.
- **Crawl budget** — quantidade/prioridade de rastreio que um motor dedica ao host — relevante em sites enormes.

---

## Ligações úteis no mesmo hub

- **XSS e superfícies perigosas** — onde dados estruturados encontram sanitização.
- **CSR / SSR / streaming** — decisões de renderização com impacto direto em SEO técnico.

---

## Fecho didático

Escolhe **uma** propriedade em Search Console (ou equivalente) e lista **três** URLs exemplares deste produto: landing principal, uma página de lista com filtros, uma página autenticada fictícia. Para cada uma, escreve numa frase: **devia indexar? por quê? qual canonical?** Se não consegues responder sem discordância com produto, o primeiro trabalho é alinhar política — só depois abrir tickets no front.
