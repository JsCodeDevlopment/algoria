"use client";

import Link from "next/link";

import { AlgoriaBrand } from "@/components/branding/algoria-logo";

const explore = [
  { href: "/problems", label: "Catálogo de problemas" },
  { href: "/pricing", label: "Preços e Pro" },
  { href: "/tracks", label: "Trilhos curados" },
  { href: "/changelog", label: "Novidades" },
  { href: "/concepts", label: "Conceitos algorítmicos" },
  { href: "/interview-en", label: "Inglês técnico · entrevistas (EN)" },
  { href: "/engineering-work", label: "Engenharia no trabalho" },
  { href: "/course/fundamentos-fase-1", label: "Curso fundamentos" },
];

const roadmap = [
  { href: "/#technical-job-tests", label: "Testes técnicos de vagas" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-muted/30 print:hidden">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-16 md:grid-cols-2 lg:grid-cols-[minmax(0,1.35fr)_1fr_1fr] lg:gap-12">
        <div className="flex max-w-md flex-col gap-6">
          <AlgoriaBrand
            href="/"
            size="footer"
            className="items-start hover:text-primary"
          />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Plataforma em português para estudar decisões em código clássico e
            preparar vagas sem perder profundidade: catálogo com várias
            implementações por problema, um code player linha-a-linha e curso
            guiado modular.
          </p>
          <div className="flex flex-wrap gap-2 font-mono text-[10px] font-bold uppercase tracking-widest">
            <span className="border border-primary/35 bg-background px-2 py-1 text-primary">
              Algoritmos
            </span>
            <span className="border border-border bg-background px-2 py-1 text-muted-foreground">
              Frontend
            </span>
            <span className="border border-border bg-background px-2 py-1 text-muted-foreground">
              Backend
            </span>
            <span className="border border-border bg-background px-2 py-1 text-muted-foreground">
              DevOps
            </span>
            <span className="border border-border bg-background px-2 py-1 text-muted-foreground">
              IA
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6 md:pt-1">
          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-primary">
            Explorar
          </span>
          <nav className="flex flex-col gap-3">
            {explore.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-6 md:pt-1">
          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-primary">
            Trilhos & roadmap
          </span>
          <nav className="flex flex-col gap-3">
            {roadmap.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <span className="text-[11px] font-normal normal-case tracking-normal text-muted-foreground/85">
              Secções seguintes combinam teoria aplicada e casos reais conforme
              o catálogo crescer.
            </span>
          </nav>
        </div>
      </div>

      <div className="border-t border-border/60 bg-muted/15">
        <div className="mx-auto max-w-7xl px-6 py-10 text-muted-foreground">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
            <div className="min-w-0 space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground/70">
                &copy; {new Date().getFullYear()} Algoria. Conteúdo educativo.
              </p>
              <nav
                className="flex max-w-full flex-nowrap gap-x-5 overflow-x-auto pb-1 text-[10px] font-bold uppercase tracking-widest [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                aria-label="Links legais"
              >
                <Link
                  href="/legal/terms"
                  className="shrink-0 whitespace-nowrap hover:text-primary"
                >
                  Termos
                </Link>
                <Link
                  href="/legal/privacy"
                  className="shrink-0 whitespace-nowrap hover:text-primary"
                >
                  Privacidade
                </Link>
                <Link
                  href="/legal/cookies"
                  className="shrink-0 whitespace-nowrap hover:text-primary"
                >
                  Cookies
                </Link>
                <Link
                  href="/legal/refunds"
                  className="shrink-0 whitespace-nowrap hover:text-primary"
                >
                  Reembolsos
                </Link>
              </nav>
            </div>
            <div className="shrink-0 lg:max-w-md lg:text-right">
              <span className="inline-flex flex-wrap items-center justify-start gap-x-2 gap-y-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 lg:justify-end">
                <span
                  className="h-2 w-2 shrink-0 rounded-none bg-primary"
                  aria-hidden
                />
                <span>
                  Criador e idealizador:&nbsp;
                  <Link
                    href="https://github.com/JsCodeDevlopment"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline decoration-dotted underline-offset-2 text-primary transition-colors hover:text-primary/80"
                  >
                    Jonatas Silva
                  </Link>
                  &nbsp;— Senior Fullstack Software Engineer
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
