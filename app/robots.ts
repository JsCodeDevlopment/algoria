import type { MetadataRoute } from 'next';

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

const RAW_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN?.trim() || 'algoria.app';
const BASE_URL = `https://${RAW_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '')}`;

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
