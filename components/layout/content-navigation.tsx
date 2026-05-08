import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface ContentNavItem {
  slug: string;
  title: string;
  /** Full href path — e.g. `/concepts/two-pointers` */
  href: string;
  /** Optional short description */
  description?: string;
}

interface ContentNavigationProps {
  /** Label shown above the nav, e.g. "Próximo conceito" */
  sectionLabel: string;
  /** Previous item in the list (if any) */
  prev?: ContentNavItem | null;
  /** Next item in the list (if any) */
  next?: ContentNavItem | null;
  className?: string;
}

/**
 * Renders a premium "next / previous" navigation card at the bottom of content pages.
 * Supports problems, concepts, interview english, engineering work, and courses.
 */
export function ContentNavigation({ sectionLabel, prev, next, className }: ContentNavigationProps) {
  if (!prev && !next) return null;

  return (
    <section
      className={cn('mt-16 border-t border-border pt-10', className)}
      aria-label="Navegação entre conteúdos"
    >
      <p className="mb-5 text-[10px] font-black uppercase tracking-[0.3em] text-primary">{sectionLabel}</p>

      <div className={cn('grid gap-4', prev && next ? 'sm:grid-cols-2' : 'sm:grid-cols-1')}>
        {prev && (
          <Link
            href={prev.href}
            className={cn(
              'group relative flex items-center gap-4 overflow-hidden border-2 border-border/80 bg-background/60 p-5 shadow-sm transition-all duration-250',
              'hover:border-primary/50 hover:bg-primary/4 hover:shadow-md',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            )}
          >
            <span
              className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-primary opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden
            />
            <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-border/60 bg-muted/30 text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Anterior
              </span>
              <span className="mt-1 block truncate text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                {prev.title}
              </span>
              {prev.description && (
                <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                  {prev.description}
                </span>
              )}
            </span>
          </Link>
        )}

        {next && (
          <Link
            href={next.href}
            className={cn(
              'group relative flex items-center gap-4 overflow-hidden border-2 border-border/80 bg-background/60 p-5 shadow-sm transition-all duration-250',
              'hover:border-primary/50 hover:bg-primary/4 hover:shadow-md',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              !prev && 'sm:col-start-2',
            )}
          >
            <span
              className="pointer-events-none absolute inset-y-0 right-0 w-[3px] bg-primary opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden
            />
            <span className="min-w-0 flex-1 text-right">
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Próximo
              </span>
              <span className="mt-1 block truncate text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                {next.title}
              </span>
              {next.description && (
                <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                  {next.description}
                </span>
              )}
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-border/60 bg-muted/30 text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}
