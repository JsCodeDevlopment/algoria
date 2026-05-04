import { truncateMetaDescription } from './build-metadata';
import { getSiteOrigin } from './site';

function absoluteUrl(pathname: string): string {
  const origin = getSiteOrigin();
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${origin}${path}`;
}

/** Problemas, conceitos, soluções, módulos de curso — recurso educativo gratuito. */
export function learningResourceJsonLd(input: {
  name: string;
  description: string;
  pathname: string;
  inLanguage?: string;
}) {
  const origin = getSiteOrigin();
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: input.name,
    description: truncateMetaDescription(input.description),
    url: absoluteUrl(input.pathname),
    isAccessibleForFree: true,
    learningResourceType: 'tutorial',
    inLanguage: input.inLanguage ?? 'pt-BR',
    provider: { '@id': `${origin}/#organization` },
  };
}

/** Guias longos de engenharia aplicada. */
export function articleJsonLd(input: {
  headline: string;
  description: string;
  pathname: string;
  inLanguage?: string;
}) {
  const origin = getSiteOrigin();
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: truncateMetaDescription(input.description),
    url: absoluteUrl(input.pathname),
    inLanguage: input.inLanguage ?? 'pt-BR',
    author: { '@type': 'Organization', name: 'Algoria' },
    publisher: { '@id': `${origin}/#organization` },
  };
}
