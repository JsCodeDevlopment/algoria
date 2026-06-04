/**
 * Origem canónica do site para SEO (sem barra final).
 * Preferir `NEXT_PUBLIC_APP_URL` (ex.: https://acite.app ou http://localhost:3000).
 * Fallback: https://`NEXT_PUBLIC_APP_DOMAIN`
 */
export function getSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (raw) {
    try {
      const u = new URL(raw.includes('://') ? raw : `https://${raw}`);
      return u.origin;
    } catch {
      /* continua */
    }
  }
  let domain = process.env.NEXT_PUBLIC_APP_DOMAIN?.trim() || 'acite.app';
  domain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return `https://${domain}`;
}

/** Base URL para `metadataBase` no Next.js (com barra final). */
export function getMetadataBase(): URL {
  return new URL(`${getSiteOrigin()}/`);
}
