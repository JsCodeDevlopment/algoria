"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { AlgoriaBrand } from "@/components/branding/algoria-logo";
import { NavLinks } from "@/components/layout/nav-links";
import { SessionNav } from "@/components/layout/session-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const navId = useId();
  const drawerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDownCapture = (e: PointerEvent) => {
      const t = e.target as Node;
      if (drawerRef.current?.contains(t)) return;
      if (menuButtonRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDownCapture, true);
    return () =>
      document.removeEventListener("pointerdown", onPointerDownCapture, true);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={cn(
        "sticky top-0 border-b border-border bg-background/90 backdrop-blur-md transition-colors print:hidden supports-backdrop-filter:bg-background/75",
        open ? "z-200" : "z-50",
      )}
    >
      {open && (
        <div
          className="fixed inset-0 z-100 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200"
          aria-hidden
          onPointerDown={close}
        />
      )}

      <div className="relative z-110 mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6">
        <AlgoriaBrand size="header" />

        <div className="flex shrink-0 items-center gap-2 sm:gap-3 xl:gap-4">
          <ThemeToggle />
          <SessionNav />
          <Button
            ref={menuButtonRef}
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-none cursor-pointer border-2 border-border hover:border-primary xl:hidden"
            aria-expanded={open}
            aria-controls={navId}
            aria-label={open ? "Fechar navegação" : "Abrir navegação"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </Button>
        </div>
      </div>

      {open && (
        <aside
          ref={drawerRef}
          id={navId}
          className={cn(
            "fixed top-16 right-0 z-105 flex max-h-[calc(100dvh-4rem)] w-[min(calc(100vw-0.75rem),24rem)] flex-col overflow-hidden border-l-2 border-primary/35 shadow-2xl animate-in slide-in-from-right-4 duration-200 xl:hidden",
            "bg-grid-pattern bg-background",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Navegação principal"
        >
          <div className="relative shrink-0 border-b border-border bg-linear-to-br from-primary/8 via-background to-muted/30 px-5 py-4">
            <div
              className="absolute inset-x-0 top-0 h-[3px] bg-primary"
              aria-hidden
            />
            <p className="text-[10px] font-black uppercase tracking-[0.38em] text-primary">
              Navegar
            </p>
            <p className="mt-1.5 text-sm font-semibold tracking-tight text-foreground">
              Explora a Algoria
            </p>
            <p className="mt-1 max-w-[20rem] text-xs leading-relaxed text-muted-foreground">
              Atalhos para estudo, curso e conteúdo de carreira — o mesmo visual
              técnico do resto do site.
            </p>
          </div>

          <nav
            className="min-h-0 flex-1 overflow-y-auto px-4 py-5"
            aria-label="Secções"
          >
            <NavLinks onNavigate={close} />
          </nav>
        </aside>
      )}
    </header>
  );
}
