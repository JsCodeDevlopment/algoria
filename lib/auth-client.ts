'use client';

import { createAuthClient } from 'better-auth/react';

/** Cliente Better Auth; usa a mesma origem (`/api/auth`). */
export const authClient = createAuthClient({});
