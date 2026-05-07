"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToastStore } from "@/lib/store/use-toast-store";

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  async function onClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/customer-portal", {
        method: "POST",
        credentials: "include",
      });

      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };

      if (!res.ok) {
        addToast(data.error ?? "Erro ao abrir o portal de gestão.", "error");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      addToast("Erro de rede ao tentar aceder ao portal.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      className="w-full rounded-none font-black uppercase flex items-center justify-center gap-2"
      disabled={loading}
      onClick={() => void onClick()}
    >
      <Settings className="h-4 w-4" />
      {loading ? "A carregar..." : "Gerir Assinatura"}
    </Button>
  );
}
