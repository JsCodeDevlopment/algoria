'use client';

import { useEffect, useRef } from 'react';

import { authClient } from '@/lib/auth-client';
import { ProgressBlobSchema } from '@/lib/progress/local-progress-schema';
import { loadProgressBlob, saveProgressBlob } from '@/lib/progress/local-progress';

/** Envia o progresso local ao servidor após login e continuamente (debounced) quando o progresso muda. */
export function ProgressSyncOnLogin() {
  const { data: session, isPending } = authClient.useSession();
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPending || !session?.user?.id) return;

    let cancelled = false;

    const performSync = async () => {
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
        
        // Remove listener temporarily to avoid infinite loop from saveProgressBlob
        window.removeEventListener('algoria-progress', scheduleSync);
        saveProgressBlob(merged);
        window.addEventListener('algoria-progress', scheduleSync);
      } catch {
        /* rede offline */
      }
    };

    const scheduleSync = () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
      // Debounce the sync to avoid spamming the API (e.g., when scrolling through code player)
      syncTimerRef.current = setTimeout(() => {
        void performSync();
      }, 5000); // 5 seconds debounce
    };

    // 1. Initial sync on login/mount
    void performSync();

    // 2. Listen to ongoing progress changes
    window.addEventListener('algoria-progress', scheduleSync);

    return () => {
      cancelled = true;
      window.removeEventListener('algoria-progress', scheduleSync);
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [session?.user?.id, isPending]);

  return null;
}

