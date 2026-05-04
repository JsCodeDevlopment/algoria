import { Menu } from 'lucide-react';
import Link from 'next/link';

import { AlgoriaBrand } from '@/components/branding/algoria-logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/problems', label: 'Problemas' },
  { href: '/concepts', label: 'Conceitos' },
  { href: '/interview-en', label: 'Inglês entrevistas' },
  { href: '/course', label: 'Curso' },
  { href: '/#technical-job-tests', label: 'Testes técnicos' },
  { href: '/engineering-work', label: 'Engenharia no trabalho' },
] as const;

function NavLinks({ vertical }: { vertical?: boolean }) {
  return (
    <ul
      className={cn(
        'flex items-center',
        vertical ? 'flex-col gap-0' : 'flex-nowrap gap-x-3 gap-y-0 xl:gap-x-5 2xl:gap-x-8',
      )}
    >
      {NAV.map((item) => (
        <li key={item.href} className={cn(!vertical && 'shrink-0')}>
          <Link
            href={item.href}
            className={cn(
              'text-[8px] font-bold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-primary xl:tracking-[0.18em]',
              !vertical && 'block whitespace-nowrap',
              vertical && 'flex border-b border-border py-4 last:border-b-0',
            )}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md transition-colors print:hidden supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <AlgoriaBrand size="header" />

        {/* Desktop: desde lg — evita barra partida entre md e lg; links sem wrap */}
        <div className="hidden items-center gap-3 lg:flex xl:gap-6">
          <NavLinks />
          <span className="hidden h-3 w-[2px] shrink-0 bg-border xl:inline-block" aria-hidden />
          <ThemeToggle />
          <Button
            asChild
            variant="outline"
            size="sm"
            className="shrink-0 rounded-none border-2 border-primary px-3 font-black uppercase tracking-wide xl:px-5 xl:tracking-wider"
          >
            <Link href="/problems" className="whitespace-nowrap">
              Abrir catálogo
            </Link>
          </Button>
        </div>

        {/* Tablet estreito + mobile — mesmo nav sem wrap forçado */}
        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <details className="group relative">
            <summary
              aria-label="Abrir navegação"
              className="flex h-9 w-9 cursor-pointer list-none items-center justify-center border-2 border-border transition-colors hover:border-primary [&::-webkit-details-marker]:hidden"
            >
              <Menu className="h-5 w-5 shrink-0" aria-hidden />
            </summary>
            <div className="fade-in animate-in zoom-in-95 slide-in-from-top-2 absolute right-0 top-12 z-[60] max-h-[min(70vh,calc(100dvh-4rem))] w-[min(calc(100vw-3rem),20rem)] overflow-y-auto border-2 border-border bg-background px-6 py-2 shadow-xl">
              <NavLinks vertical />
              <Link
                href="/problems"
                className="mt-5 mb-6 block border border-primary bg-primary px-6 py-3 text-center text-[8px] font-black uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
              >
                Abrir catálogo
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
