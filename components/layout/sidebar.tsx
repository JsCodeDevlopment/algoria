'use client';

import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Code2,
  GraduationCap,
  Languages,
  Map,
  Sparkles,
  Target,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

const SIDEBAR_NAV = [
  { href: '/problems', label: 'Catálogo', description: 'Problemas & player', Icon: Code2 },
  { href: '/pricing', label: 'Preços', description: 'Planos Free e Pro', Icon: CircleDollarSign },
  { href: '/tracks', label: 'Trilhos', description: 'Percursos curados', Icon: Map },
  { href: '/concepts', label: 'Conceitos', description: 'Resumos algoritmos', Icon: BookOpen },
  { href: '/interview-en', label: 'Inglês EN', description: 'Preparação entrevista', Icon: Languages },
  { href: '/course', label: 'Curso', description: 'Fundamentos guiados', Icon: GraduationCap },
  { href: '/#technical-job-tests', label: 'Testes técnicos', description: 'Preparação vagas', Icon: Target },
  { href: '/engineering-work', label: 'Engenharia', description: 'Roadmap produção', Icon: Briefcase },
  { href: '/changelog', label: 'Novidades', description: 'Últimas alterações', Icon: Sparkles },
] as const;

const SIDEBAR_STORAGE_KEY = 'algoria-sidebar-collapsed';
const SIDEBAR_WIDTH_COLLAPSED = 48;
const SIDEBAR_WIDTH_EXPANDED = 260;

/* ── Context to share sidebar width with the layout ── */

const SidebarContext = createContext<{ width: number }>({ width: SIDEBAR_WIDTH_COLLAPSED });

export function useSidebarWidth() {
  return useContext(SidebarContext).width;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (stored !== null) {
        const isCollapsed = stored === 'true';
        if (collapsed !== isCollapsed) {
          queueMicrotask(() => {
            setCollapsed(isCollapsed);
          });
        }
      }
    } catch {
      /* noop */
    }
  }, [collapsed]);

  useEffect(() => {
    const w = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;
    document.documentElement.style.setProperty('--sidebar-width', `${w}px`);
  }, [collapsed]);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try { localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next)); } catch { /* noop */ }
      return next;
    });
  };

  return (
    <SidebarContext.Provider value={{ width: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED }}>
      <SidebarInner collapsed={collapsed} onToggle={toggle} />
      {children}
    </SidebarContext.Provider>
  );
}

function SidebarInner({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Toggle button — outside the sidebar, at the top-right edge */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'hidden xl:flex fixed z-50 top-[4.75rem] items-center justify-center h-6 w-6 border border-border bg-background text-muted-foreground shadow-sm transition-all duration-300 cursor-pointer',
          'hover:bg-primary/10 hover:text-primary hover:border-primary/40',
          collapsed ? 'left-[48px] -translate-x-1/2' : 'left-[260px] -translate-x-1/2',
        )}
        aria-label={collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'hidden xl:flex fixed left-0 top-16 z-40 h-[calc(100dvh-4rem)] flex-col border-r border-border bg-background/95 backdrop-blur-sm transition-all duration-300 ease-in-out',
          collapsed ? 'w-[48px]' : 'w-[260px]',
        )}
      >
        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4" aria-label="Navegação principal">
          <ul className="flex flex-col gap-2">
            {SIDEBAR_NAV.map(({ href, label, description, Icon }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    title={collapsed ? `${label} — ${description}` : undefined}
                    className={cn(
                      'group relative flex items-center overflow-hidden transition-all duration-200',
                      collapsed
                        ? 'justify-center py-2'
                        : 'gap-3 border-2 border-border/90 bg-background/60 px-3 py-2.5 shadow-sm',
                      !collapsed && 'hover:border-primary/55 hover:bg-primary/6 hover:shadow-md',
                      collapsed && 'hover:bg-primary/6',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                      active && !collapsed && 'border-primary/40 bg-primary/5',
                      active && collapsed && 'bg-primary/8',
                    )}
                  >
                    {/* Active indicator */}
                    <span
                      className={cn(
                        'pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-primary transition-opacity',
                        active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                      )}
                      aria-hidden
                    />
                    <span
                      className={cn(
                        'flex shrink-0 items-center justify-center transition-colors',
                        collapsed
                          ? 'h-7 w-7'
                          : 'h-9 w-9 border-2 border-primary/25 bg-primary/5 text-primary',
                        !collapsed && 'group-hover:border-primary/45 group-hover:bg-primary/10',
                        collapsed && active
                          ? 'text-primary'
                          : collapsed ? 'text-muted-foreground group-hover:text-primary' : '',
                      )}
                    >
                      <Icon className={cn(collapsed ? 'h-4 w-4' : 'h-4 w-4')} strokeWidth={2.25} />
                    </span>
                    {!collapsed && (
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            'block text-[10px] font-black uppercase tracking-[0.12em] transition-colors',
                            active ? 'text-primary' : 'text-foreground group-hover:text-primary',
                          )}
                        >
                          {label}
                        </span>
                        <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground group-hover:text-muted-foreground/90">
                          {description}
                        </span>
                      </span>
                    )}
                    {!collapsed && (
                      <ArrowUpRight
                        className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                        aria-hidden
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
