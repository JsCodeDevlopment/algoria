import type { Metadata } from 'next';

import { getSiteOrigin } from './site';

export type BuildPublicMetadataInput = {
  /** Com template do layout: `%s · Algoria` */
  title?: string;
  /** Sem sufixo automático (ex.: página inicial) */
  titleAbsolute?: string;
  description: string;
  pathname: string;
  image?: string;
  imageIsSquare?: boolean;
  keywords?: string[];
  openGraphLocale?: string;
  openGraphType?: 'website' | 'article';
};

/**
 * Metadados consistentes: canonical, Open Graph, Twitter, robots.
 * O layout define `title.template` como `%s · Algoria` (exceto quando `titleAbsolute`).
 */
export function buildPublicMetadata(opts: BuildPublicMetadataInput): Metadata {
  const origin = getSiteOrigin();
  const path = opts.pathname.startsWith('/') ? opts.pathname : `/${opts.pathname}`;
  const canonical = `${origin}${path}`;
  const plain = opts.description.replace(/\s+/g, ' ').trim();
  const description = plain.length <= 158 ? plain : `${plain.slice(0, 157)}…`;

  const kw = opts.keywords?.filter(Boolean);
  const uniqueKw = kw ? [...new Set(kw.map((k) => k.trim()).filter(Boolean))].slice(0, 24) : undefined;

  const titleMeta: Metadata['title'] =
    opts.titleAbsolute !== undefined ? { absolute: opts.titleAbsolute } : (opts.title ?? 'Algoria');

  const ogTitle =
    opts.titleAbsolute ??
    (typeof opts.title === 'string' ? opts.title : 'Algoria');

  const defaultImage = `${origin}/algoria-logo.png`;
  const shareImage = opts.image ? (opts.image.startsWith('http') ? opts.image : `${origin}${opts.image.startsWith('/') ? '' : '/'}${opts.image}`) : defaultImage;

  const isSquare = opts.imageIsSquare || !opts.image;

  return {
    title: titleMeta,
    description,
    ...(uniqueKw?.length ? { keywords: uniqueKw } : {}),
    alternates: {
      canonical,
      ...(opts.openGraphLocale?.startsWith('en')
        ? {
          languages: {
            en: canonical,
          },
        }
        : {}),
    },
    openGraph: {
      title: ogTitle,
      description,
      url: canonical,
      siteName: 'Algoria',
      locale: opts.openGraphLocale ?? 'pt_BR',
      type: opts.openGraphType ?? 'website',
      images: [
        {
          url: shareImage,
          alt: ogTitle,
          ...(isSquare ? { width: 400, height: 400 } : { width: 1200, height: 630 }),
        },
      ],
    },
    twitter: {
      card: isSquare ? 'summary' : 'summary_large_image',
      title: ogTitle,
      description,
      images: [shareImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export function truncateMetaDescription(text: string, max = 158): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

