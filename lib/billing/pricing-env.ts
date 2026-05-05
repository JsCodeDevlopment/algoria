/**
 * Textos de preço na UI (BRL, apenas apresentação).
 * O valor cobrado é sempre o definido no Stripe (Price IDs).
 */
function formatBrlAmount(amountString: string, suffix: string): string {
  const normalized = amountString.replace(',', '.');
  const n = Number.parseFloat(normalized);
  if (Number.isFinite(n)) {
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(n);
    return `${formatted}${suffix}`;
  }
  return `R$ ${amountString}${suffix}`;
}

export function formatPricingDisplay(): {
  monthly: string;
  yearly: string;
  yearlyNote: string;
} {
  const monthly =
    process.env.NEXT_PUBLIC_PRICE_PRO_MONTHLY_BRL ?? '49,90';
  const yearly =
    process.env.NEXT_PUBLIC_PRICE_PRO_YEARLY_BRL ?? '479,90';
  return {
    monthly: formatBrlAmount(monthly, '/mês'),
    yearly: formatBrlAmount(yearly, '/ano'),
    yearlyNote: 'Cerca de 2 meses grátis vs. mensal',
  };
}

/** Preço zero para o plano Free na UI. */
export function formatFreeTierPrice(): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(0);
}

export function checkoutAvailable(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_PRO_MONTHLY);
}
