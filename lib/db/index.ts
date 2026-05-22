import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import {
  account,
  contentReviewComments,
  contents,
  session,
  subscription,
  user,
  userFollower,
  userProfile,
  userProgress,
  verification,
} from './schema';

const connectionString =
  process.env.DATABASE_URL ?? 'postgresql://127.0.0.1:5432/algoria_dev_placeholder';

const pool = new Pool({
  connectionString,
  max: 10,
  connectionTimeoutMillis: 8_000,
});

export const db = drizzle(pool, {
  schema: {
    user,
    session,
    account,
    verification,
    subscription,
    userProgress,
    userProfile,
    contents,
    contentReviewComments,
    userFollower,
  },
});
export { pool };
