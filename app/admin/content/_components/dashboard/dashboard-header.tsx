'use client';

import Link from 'next/link';

interface DashboardHeaderProps {
  total: number;
  tab: 'editorial' | 'sistema';
}

export function DashboardHeader({ total, tab }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Gestão de Conteúdos
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {total} conteúdo{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
        </p>
      </div>
      {tab === 'editorial' && (
        <Link
          href="/admin/content/create"
          className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Criar Conteúdo
        </Link>
      )}
    </div>
  );
}
