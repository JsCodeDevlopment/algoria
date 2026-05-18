"use client";

import { Cookie, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

interface CookieBannerProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

export function CookieBanner({ onAccept, onDecline }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("algoria-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("algoria-cookie-consent", "accepted");
    setIsVisible(false);
    if (onAccept) onAccept();
    window.dispatchEvent(new Event("algoria-cookie-consent-updated"));
  };

  const handleDecline = () => {
    localStorage.setItem("algoria-cookie-consent", "declined");
    setIsVisible(false);
    if (onDecline) onDecline();
    window.dispatchEvent(new Event("algoria-cookie-consent-updated"));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out">
      <div className="relative overflow-hidden border border-border bg-background/95 p-5 shadow-2xl backdrop-blur-md bg-grid-pattern md:p-6">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-600 via-primary to-cyan-500" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8 relative z-10">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10 text-primary border border-primary/20 bg-background">
              <Cookie className="h-5 w-5" />
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5 flex-wrap">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Respeitamos a sua Privacidade
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Utilizamos cookies essenciais para o funcionamento da plataforma
                (como logins seguros) e cookies analíticos (via PostHog) para
                melhorar nosso conteúdo educacional. Você pode aceitar ou
                recusar cookies analíticos. Consulte nossa{" "}
                <Link
                  href="/legal/privacy"
                  className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                >
                  Política de Privacidade
                </Link>{" "}
                e{" "}
                <Link
                  href="/legal/cookies"
                  className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                >
                  Política de Cookies
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
            <Button
              onClick={handleDecline}
              variant="secondary"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground transition-all h-auto no-underline hover:no-underline"
            >
              Rejeitar
            </Button>

            <Button
              onClick={handleAccept}
              size="sm"
              className="rounded-none bg-primary text-xs font-bold uppercase tracking-wider text-primary-foreground hover:text-white hover:bg-primary/95 transition-all shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"
            >
              Aceitar Todos
            </Button>

            <button
              onClick={handleDecline}
              className="hidden md:flex ml-1 p-1 text-muted-foreground/60 hover:text-foreground transition-colors"
              aria-label="Fechar e recusar analíticos"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
