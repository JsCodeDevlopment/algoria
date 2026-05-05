'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { analyticsCapture } from '@/components/analytics/posthog-provider';

export function CheckoutButton({ disabled }: { disabled?: boolean }) {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    analyticsCapture('checkout_start');
    try {
      const res = await fetch('/api/checkout', { method: 'POST', credentials: 'include' });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        alert(data.error ?? 'Não foi possível iniciar o checkout.');
        return;
      }
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      className="rounded-none font-black uppercase"
      disabled={disabled || loading}
      onClick={() => void onClick()}
    >
      {loading ? 'A redirecionar…' : 'Subscrever Pro'}
    </Button>
  );
}
