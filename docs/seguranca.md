# Segurança — revisão e endurecimento

Este documento resume a postura de segurança da app e o que foi endurecido no código.

## Autenticação e sessão

- **Better Auth** gere cookies de sessão (HTTP-only no servidor). Não expor `BETTER_AUTH_SECRET` nem chaves Stripe no cliente.
- Rotas `/api/checkout`, `/api/progress/*` e `/api/billing/status` exigem sessão válida onde aplicável.

## Pagamentos (Stripe)

- **Checkout**: apenas utilizadores autenticados; limite de pedidos por utilizador (anti-abuso).
- **Webhook**: `stripe-signature` validada com `STRIPE_WEBHOOK_SECRET`; corpo tratado em texto bruto para verificação da assinatura.
- O estado Pro na base de dados vem dos eventos Stripe; não confiar apenas no cliente.

## Dados de progresso

- **Merge** (`POST /api/progress/merge`): limite de tamanho do JSON (~512 KiB), validação Zod com limites em chaves e arrays, rate limit por utilizador.
- **Armazenamento**: Drizzle com parâmetros ligados (sem SQL interpolado por strings).

## Cabeçalhos HTTP

Configurados em `next.config.ts` para todas as rotas:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` restritiva
- Em produção: `Strict-Transport-Security` (requer HTTPS no host)

## Limitações conhecidas / próximos passos

- **Rate limiting** em memória: adequado a uma instância; com várias réplicas usar Redis/Upstash ou limite no edge.
- **CSP** (Content-Security-Policy) não está definida globalmente; definir por ambientes se introduzires scripts de terceiros ou estilos inline complexos.
- **Portal de faturação Stripe** e cancelamentos self-service: documentar quando implementados.

## Checklist de produção

- [ ] `BETTER_AUTH_SECRET` forte e único
- [ ] `DATABASE_URL` com utilizador de BD com privilégios mínimos
- [ ] Stripe em modo live com webhook apontando para URL HTTPS pública
- [ ] `NEXT_PUBLIC_APP_URL` igual ao domínio público (redirects e emails)
- [ ] Logs sem dados sensíveis (PII, tokens)
- [ ] Revisão periódica de dependências (`npm audit`)
