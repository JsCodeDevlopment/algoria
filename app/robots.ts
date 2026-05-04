import type { MetadataRoute } from 'next';

import { getSiteOrigin } from '@/lib/seo/site';

const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'ClaudeBot',
  'anthropic-ai',
  'PerplexityBot',
  'Google-Extended',
  'Amazonbot',
  'cohere-ai',
  'YouBot',
  'Diffbot',
];

const BASE_URL = getSiteOrigin();

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production' && process.env.NODE_ENV === 'production';
  if (!isProduction) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...AI_CRAWLERS.map((agent) => ({ userAgent: agent, allow: '/' })),
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
