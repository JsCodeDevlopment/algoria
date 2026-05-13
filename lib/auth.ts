import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';

import { db } from '@/lib/db';
import { authSchema } from '@/lib/db/schema';

const baseURL =
  process.env.BETTER_AUTH_URL?.replace(/\/$/, '') ||
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
  'http://localhost:3000';

const secret = process.env.BETTER_AUTH_SECRET;

export const auth = betterAuth({
  baseURL,
  basePath: '/api/auth',
  secret: secret || 'super-secret-development-key-that-is-at-least-32-characters',
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: authSchema,
  }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },
  trustedOrigins: [
    baseURL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || '',
  ].filter(Boolean),
  plugins: [nextCookies()],
  user: {
    additionalFields: {
      role: { type: 'string' },
      creatorRequestStatus: { type: 'string' },
    },
  },
});
