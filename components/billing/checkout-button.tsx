"use client";

import { useState } from "react";

import { analyticsCapture } from "@/components/analytics/posthog-provider";
import { Button } from "@/components/ui/button";
import { useToastStore } from "@/lib/store/use-toast-store";

export function CheckoutButton({ disabled }: { disabled?: boolean }) {
  const [loading, setLoading] = useState(false);

  const addToast = useToastStore((s) => s.addToast);

  async function onClick() {
    setLoading(true);
    analyticsCapture("checkout_start");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        credentials: "include",
      });

      if (res.status === 401) {
        window.location.href = "/";
        return;
      }

      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };

      if (!res.ok) {
        addToast(data.error ?? "Erro no servidor ao iniciar o checkout.", "error");
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
      className="rounded-none font-black cursor-pointer uppercase"
      disabled={disabled || loading}
      onClick={() => void onClick()}
    >
      {loading ? "A redirecionar…" : "Subscrever Pro"}
    </Button>
  );
}
