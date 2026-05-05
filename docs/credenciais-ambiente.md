# Credenciais e variáveis de ambiente

Lista orientativa para desenvolvimento local e produção. Valores reais nunca devem ir para o repositório (usa `.env.local`).

Referência de nomes: `.env.example` na raiz do projeto.

## Obrigatórias para a app completa

### App

| Variável | Para que serve |
|----------|----------------|
| `NEXT_PUBLIC_APP_URL` | URL canónica (ex. `https://algoria.pt`). Usada em redirects do Stripe e links absolutos. Em dev: `http://localhost:3000`. |
| `NEXT_PUBLIC_ENVIRONMENT` | Etiqueta de ambiente (ex. `development`, `production`). |

### Better Auth

| Variável | Como obter |
|----------|------------|
| `BETTER_AUTH_SECRET` | Gera uma string longa e aleatória (ex. `openssl rand -base64 32`). Nunca partilhes nem commits. |
| `BETTER_AUTH_URL` | Mesmo valor base que `NEXT_PUBLIC_APP_URL` (origem da API de auth). |

### PostgreSQL

| Variável | Como obter |
|----------|------------|
| `DATABASE_URL` | Connection string do Postgres (Neon, Supabase, RDS, Docker local, etc.). Formato: `postgresql://user:password@host:5432/dbname`. |

Após definir a URL, corre as migrações Drizzle conforme o README ou scripts do projeto.

### Stripe (pagamentos reais ou teste)

| Variável | Como obter |
|----------|------------|
| `STRIPE_SECRET_KEY` | [Stripe Dashboard](https://dashboard.stripe.com) → Developers → API keys → Secret key (test ou live). |
| `STRIPE_WEBHOOK_SECRET` | Developers → Webhooks → endpoint da tua app (`/api/webhooks/stripe`) → Signing secret. |
| `STRIPE_PRICE_PRO_MONTHLY` | Products → cria produto “Algoria Pro” → Price **recorrente mensal** em **BRL** → copia o Price ID (`price_...`). |
| `STRIPE_PRICE_PRO_YEARLY` | Opcional: Price anual em BRL, para uso futuro (portal, upsell). |

**Importante:** os preços cobrados são sempre os dos Price IDs no Stripe. As variáveis `NEXT_PUBLIC_PRICE_PRO_*_BRL` são só texto na UI.

### Textos de preço na UI (BRL)

| Variável | Nota |
|----------|------|
| `NEXT_PUBLIC_PRICE_PRO_MONTHLY_BRL` | Ex.: `49,90` ou `49.90` — apenas apresentação. |
| `NEXT_PUBLIC_PRICE_PRO_YEARLY_BRL` | Idem para o plano anual. |

## Opcionais

### PostHog (analytics)

| Variável | Como obter |
|----------|------------|
| `NEXT_PUBLIC_POSTHOG_KEY` | Projeto PostHog → Project API Key. |
| `NEXT_PUBLIC_POSTHOG_HOST` | Instância (ex. `https://eu.i.posthog.com`). |

---

## Configuração rápida do Stripe em modo teste

1. Cria conta Stripe (modo teste).
2. Cria produto com subscrição mensal em **BRL**.
3. Copia `STRIPE_SECRET_KEY` (test).
4. Expõe o projeto localmente com `ngrok` ou similar, ou usa “Stripe CLI listen” para encaminhar webhooks para `localhost`.
5. Adiciona endpoint `https://<teu-dominio>/api/webhooks/stripe` e copia o **signing secret** para `STRIPE_WEBHOOK_SECRET`.

Quando fores a produção, repete com chaves **live**, URLs públicas e webhook HTTPS.
