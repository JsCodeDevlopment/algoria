'use client';

import { listContents, updateContentStatus } from '@/lib/actions/admin';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';

import { ContentRow, ContentStatus } from './_components/types';
import { DashboardHeader } from './_components/dashboard/dashboard-header';
import { DashboardTabs } from './_components/dashboard/dashboard-tabs';
import { DashboardFilters } from './_components/dashboard/dashboard-filters';
import { DashboardTable } from './_components/dashboard/dashboard-table';
import { Pagination } from './_components/dashboard/pagination';

export default function ContentDashboardClient({ isAdmin }: { isAdmin: boolean }) {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // State
  const [tab, setTab] = useState<'editorial' | 'sistema'>(
    searchParams.get('tab') === 'sistema' && isAdmin ? 'sistema' : 'editorial'
  );
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') ?? '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') ?? '');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const load = useCallback(async (p: number, s: string) => {
    const result = await listContents({
      page: p,
      search: s,
      type: typeFilter || undefined,
      status: statusFilter || undefined,
      tab,
    });

    if (!result.error) {
      setRows(result.contents as unknown as ContentRow[]);
      setTotal(result.total);
    }
  }, [typeFilter, statusFilter, tab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      load(page, search);
    }, 300);
    return () => clearTimeout(timer);
  }, [page, typeFilter, statusFilter, search, tab, load]);

  function handleTabChange(newTab: 'editorial' | 'sistema') {
    setTab(newTab);
    setPage(1);
    setTypeFilter('');
    setStatusFilter('');
    setSearch('');
  }

  function handleStatusUpdate(id: string, status: ContentStatus) {
    startTransition(async () => {
      const res = await updateContentStatus(id, status);
      if (res.success) {
        setFeedback({ type: 'success', msg: 'Status atualizado' });
        load(page, search);
      } else if (res.error) {
        setFeedback({ type: 'error', msg: res.error });
      }
      setTimeout(() => setFeedback(null), 3000);
    });
  }

  function clearFilters() {
    setSearch('');
    setTypeFilter('');
    setStatusFilter('');
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-in">
      <DashboardHeader total={total} tab={tab} />
      
      <div className="space-y-6">
        <DashboardTabs tab={tab} onTabChange={handleTabChange} isAdmin={isAdmin} />

        {tab === 'sistema' && isAdmin && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
            <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <div>
              <strong>Conteúdos de sistema</strong> — Estes conteúdos são parte da estrutura da plataforma. 
              Não podem ser criados, apenas editados para manter consistência.
            </div>
          </div>
        )}

        {feedback && (
          <div
            className={`rounded-lg px-4 py-3 text-sm font-medium ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-destructive/10 text-destructive'
            }`}
          >
            {feedback.msg}
          </div>
        )}

        <DashboardFilters 
          tab={tab}
          search={search}
          onSearchChange={setSearch}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onClearFilters={clearFilters}
        />

        <DashboardTable 
          rows={rows} 
          isPending={isPending} 
          onStatusUpdate={handleStatusUpdate} 
          isAdmin={isAdmin}
        />

        <Pagination 
          page={page} 
          total={total} 
          pageSize={20} 
          onPageChange={setPage} 
        />
      </div>
    </div>
  );
}

