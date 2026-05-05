# Pull Request — Produto, footer, segurança, BRL e documentação

Use este ficheiro como **corpo da descrição do PR** (copiar para GitHub/GitLab). Ajusta o título da PR ao primeiro nível abaixo se quiseres que coincida com o convénio da equipa.

---

## Título sugerido

```
fix(ui): footer legal + endurecimento de APIs; preços em BRL; docs de segurança e credenciais
```

---

## Resumo

Este conjunto de alterações melhora o **layout do rodapé** (links legais sem quebras estranhas), **endurece a superfície de ataque** das rotas sensíveis (cabeçalhos HTTP, rate limiting, limites de payload e validação de progresso), alinha a **apresentação monetária em reais brasileiros (BRL)** com variáveis de ambiente dedicadas, e adiciona **documentação** operacional (segurança e credenciais).

---

## Contexto

- Com mais links na barra inferior do footer, o layout passou a partir-se (*wrap* indesejado; bloco do criador desalinhado).
- Com dados persistentes (Postgres), progresso na conta e Stripe, é necessário reforço explícito em APIs e cabeçalhos.
- O produto alvo Brasil exibe preços em **BRL** na UI; o valor cobrado continua a vir exclusivamente dos **Price IDs** no Stripe.
- Falta um guia único para **variáveis de ambiente** e obtenção de credenciais.

---

## Alterações principais

### 1. Footer (`SiteFooter`)

- Reestruturação da **sub-barra** (copyright, navegação legal, bloco do criador).
- Links legais com **`flex-nowrap`**, **`shrink-0`**, **`whitespace-nowrap`** e **scroll horizontal** opcional em viewports muito estreitos (sem barra visível invasiva).
- Alinhamento **`items-start`** em desktop para o texto do criador não ficar verticalmente “centrado” face a duas linhas de conteúdo à esquerda.

**Ficheiro:** `components/layout/site-footer.tsx`

---

### 2. Segurança

#### Cabeçalhos HTTP globais

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` restritiva (câmara, microfone, geolocalização desativados)
- Em **produção**: `Strict-Transport-Security` (HTTPS no host)

**Ficheiro:** `next.config.ts`

#### Rate limiting (memória, por instância)

- `POST /api/checkout` — limite por **utilizador autenticado** (anti-abuso de criação de sessões de checkout).
- `POST /api/progress/merge` — limite por **utilizador** (anti-spam de merges).

**Ficheiros:** `lib/security/rate-limit.ts`, `app/api/checkout/route.ts`, `app/api/progress/merge/route.ts`

#### Merge de progresso

- Limite de tamanho do corpo (~**512 KiB**).
- Parse de JSON com tratamento de erro (**400** em JSON inválido, **413** se exceder tamanho).
- Validação Zod mais estrita: tamanhos de slugs, número máximo de problemas no blob, limites em arrays e em `lastLinesBySolution`.

**Ficheiros:** `app/api/progress/merge/route.ts`, `lib/progress/local-progress-schema.ts`

#### Documentação de segurança

- Checklist e limitações conhecidas (ex.: rate limit em memória vs. Redis em multi-réplica).

**Ficheiro:** `docs/seguranca.md`

---

### 3. Preços em BRL (UI)

- `formatPricingDisplay()` passa a usar **`Intl.NumberFormat('pt-BR', { currency: 'BRL' })`**.
- Novas variáveis públicas: `NEXT_PUBLIC_PRICE_PRO_MONTHLY_BRL`, `NEXT_PUBLIC_PRICE_PRO_YEARLY_BRL` (texto apenas; aceita vírgula ou ponto).
- Plano Free na página de preços com **`formatFreeTierPrice()`** (ex.: R$ 0,00).
- Remoção de referências a EUR/€ na UI e exemplos de env.

**Ficheiros:** `lib/billing/pricing-env.ts`, `app/pricing/page.tsx`, `.env.example`, `docs/product-tiering.md`

---

### 4. Documentação de credenciais e ambiente

- Guia para **Postgres**, **Better Auth**, **Stripe** (chaves, webhook, Price IDs em BRL), **PostHog** opcional, e relação entre variáveis “só UI” vs. cobrança real no Stripe.

**Ficheiro:** `docs/credenciais-ambiente.md`

---

## Ficheiros tocados (lista)

| Área | Caminhos |
|------|----------|
| UI footer | `components/layout/site-footer.tsx` |
| Next config | `next.config.ts` |
| Billing / UI preços | `lib/billing/pricing-env.ts`, `app/pricing/page.tsx` |
| APIs | `app/api/checkout/route.ts`, `app/api/progress/merge/route.ts` |
| Segurança / progresso | `lib/security/rate-limit.ts`, `lib/progress/local-progress-schema.ts` |
| Env exemplo | `.env.example` |
| Documentação | `docs/seguranca.md`, `docs/credenciais-ambiente.md`, `docs/product-tiering.md` |

---

## Como testar

1. **Footer** — Redimensionar a janela; confirmar que Termos, Privacidade, Cookies e Reembolsos permanecem numa linha (ou scroll horizontal suave) e que o bloco do criador alinha de forma consistente.
2. **Preços** — Abrir `/pricing` e verificar **R$** no plano Free e nos valores Pro (ajustar `.env.local` com `NEXT_PUBLIC_PRICE_PRO_*_BRL` para validar formatação).
3. **Merge** — Com sessão iniciada, enviar `POST /api/progress/merge` com payload válido; repetir em excesso até esperar **429** (se quiseres validar o limite).
4. **Checkout** — Com Stripe configurado, repetir pedidos de checkout até **429** (opcional, apenas validação de limite).
5. **Headers** — Inspecionar resposta HTTP (DevTools ou `curl -I`) e confirmar cabeçalhos de segurança nas rotas da app.
6. **Testes automatizados** — `npx vitest run` e `npx tsc --noEmit`.

---

## Migração / breaking changes

- **Variáveis de ambiente:** renomear ou adicionar no deploy:
  - De `NEXT_PUBLIC_PRICE_PRO_MONTHLY_EUR` / `NEXT_PUBLIC_PRICE_PRO_YEARLY_EUR` → **`NEXT_PUBLIC_PRICE_PRO_MONTHLY_BRL`** / **`NEXT_PUBLIC_PRICE_PRO_YEARLY_BRL`** (valores de exemplo no `.env.example`).
- O comportamento de cobrança **não muda** se os **Price IDs Stripe** (`STRIPE_PRICE_PRO_*`) já estiverem em BRL no dashboard.

---

## Checklist antes do merge

- [ ] `.env.example` e documentação alinhados com o ambiente de staging/produção.
- [ ] Variáveis BRL configuradas no hosting (se diferente dos defaults do código).
- [ ] Webhook Stripe aponta para URL HTTPS e `STRIPE_WEBHOOK_SECRET` corresponde ao endpoint.
- [ ] `NEXT_PUBLIC_APP_URL` igual ao domínio público (Stripe redirects).
- [ ] Revisão rápida do footer em mobile e desktop.

---

## Notas adicionais

- O **rate limit em memória** não é partilhado entre várias instâncias; para escala horizontal, considerar Redis/Upstash (descrito em `docs/seguranca.md`).
- **CSP** (Content-Security-Policy) não foi introduzida neste PR; pode ser um follow-up se houver requisitos de compliance ou scripts de terceiros.

---

## Relacionado

- Tiering de produto: `docs/product-tiering.md`
- Segurança: `docs/seguranca.md`
- Credenciais: `docs/credenciais-ambiente.md`
