# Pacotes Free vs Pro (Algoria)

Documento de produto para o lançamento freemium. Preços efectivos vêm de variáveis de ambiente (`STRIPE_PRICE_*`) e da página `/pricing`.

## Free

- **10 problemas** do catálogo com player completo (3 níveis de explicação), incluindo **execution trace** quando existir `trace.json`.
- Conceitos públicos, páginas de marketing e changelog.
- Progresso no **localStorage** (como antes) + opção de criar conta para sincronizar (Pro ou migração futura).

## Pro (assinatura)

- **Todo o catálogo** actual e futuras entradas marcadas como `access: "pro"` no `meta.json` do problema.
- **Execution traces** em todos os problemas onde o conteúdo existir.
- **Sincronização de progresso** na conta (merge com dados locais no primeiro login).
- Suporte à evolução: trilhos completos, curso — ver roadmap na página de preços.

## Preços sugeridos (configurar no Stripe)

- Mensal: definir `STRIPE_PRICE_PRO_MONTHLY` (Price ID).
- Anual: definir `STRIPE_PRICE_PRO_YEARLY` (Price ID).

Valores apresentados na UI vêm de `NEXT_PUBLIC_PRICE_PRO_MONTHLY_BRL` e `NEXT_PUBLIC_PRICE_PRO_YEARLY_BRL` (texto apenas; o cobrado é o Price ID no Stripe, em moeda BRL).

## Marcador técnico

Cada `content/problems/<slug>/meta.json` inclui `"access": "free" | "pro"`. O valor omisso é tratado como **`pro`** no código para segurança.
