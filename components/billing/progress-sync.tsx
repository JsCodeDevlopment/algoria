'use client';

import { useEffect } from 'react';

import { authClient } from '@/lib/auth-client';
import { ProgressBlobSchema } from '@/lib/progress/local-progress-schema';
import { loadProgressBlob, saveProgressBlob } from '@/lib/progress/local-progress';

/** Envia o progresso local ao servidor após login e guarda o merge no browser. */
export function ProgressSyncOnLogin() {
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending || !session?.user?.id) return;
    let cancelled = false;
    void (async () => {
      const local = loadProgressBlob();
      try {
        const res = await fetch('/api/progress/merge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ blob: local }),
        });
        if (!res.ok || cancelled) return;
        const json = (await res.json()) as { blob: unknown };
        const merged = ProgressBlobSchema.parse(json.blob);
        saveProgressBlob(merged);
      } catch {
        /* rede offline */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, isPending]);

  return null;
}
