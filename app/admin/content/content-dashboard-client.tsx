'use client';

import { listContents, updateContentStatus, updateContentAccess } from '@/lib/actions/admin';
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
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') ?? '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') ?? '');
  const [accessFilter, setAccessFilter] = useState(searchParams.get('access') ?? '');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Helper to update URL params without a full refresh
  const updateUrl = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    window.history.pushState(null, '', `?${params.toString()}`);
  }, []);

  // Sync state with URL when it changes (for sidebar navigation and back/forward)
  useEffect(() => {
    const urlType = searchParams.get('type') ?? '';
    const urlTab = searchParams.get('tab') ?? '';
    const urlStatus = searchParams.get('status') ?? '';
    const urlSearch = searchParams.get('search') ?? '';
    const urlAccess = searchParams.get('access') ?? '';
    const urlPage = parseInt(searchParams.get('page') || '1');

    // Se houver um tipo específico na URL, verificamos se ele é de sistema
    const SYSTEM_TYPES_LIST = ['changelog', 'legal-page', 'landing-section', 'pricing-copy', 'navigation', 'taxonomy'];
    const isSystemType = SYSTEM_TYPES_LIST.includes(urlType);

    setTimeout(() => {
      if (isSystemType && isAdmin) {
        setTab('sistema');
      } else if (urlTab === 'sistema' && isAdmin) {
        setTab('sistema');
      } else if (urlTab === 'editorial') {
        setTab('editorial');
      }

      setTypeFilter(urlType);
      setStatusFilter(urlStatus);
      setSearch(urlSearch);
      setAccessFilter(urlAccess);
      setPage(urlPage);
    }, 0);
  }, [searchParams, isAdmin]);

  const load = useCallback(async (p: number, s: string) => {
    const result = await listContents({
      page: p,
      search: s,
      type: typeFilter || undefined,
      status: statusFilter || undefined,
      tab,
      access: accessFilter || undefined,
    });

    if (!result.error) {
      setRows(result.contents as unknown as ContentRow[]);
      setTotal(result.total);
    }
  }, [typeFilter, statusFilter, tab, accessFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      load(page, search);
    }, 300);
    return () => clearTimeout(timer);
  }, [page, typeFilter, statusFilter, search, tab, accessFilter, load]);

  function handleTabChange(newTab: 'editorial' | 'sistema') {
    setTab(newTab);
    setPage(1);
    setTypeFilter('');
    setStatusFilter('');
    setSearch('');
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', newTab);
    params.delete('type');
    params.delete('status');
    params.delete('search');
    params.set('page', '1');
    window.history.pushState(null, '', `?${params.toString()}`);
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

  function handleAccessUpdate(id: string, access: 'free' | 'pro') {
    startTransition(async () => {
      const res = await updateContentAccess(id, access);
      if (res.success) {
        setFeedback({ type: 'success', msg: `Conteúdo agora é ${access === 'free' ? 'Gratuito' : 'Pro'}` });
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
      <DashboardHeader 
        total={total} 
        tab={accessFilter === 'pro' ? 'editorial' : tab} 
        title={accessFilter === 'pro' ? 'Conteúdos Pagos (Pro)' : undefined}
      />
      
      <div className="space-y-6">
        {!accessFilter && (
          <DashboardTabs tab={tab} onTabChange={handleTabChange} isAdmin={isAdmin} />
        )}

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
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
            updateUrl({ search: v, page: '1' });
          }}
          typeFilter={typeFilter}
          onTypeFilterChange={(v) => {
            setTypeFilter(v);
            setPage(1);
            updateUrl({ type: v, page: '1' });
          }}
          statusFilter={statusFilter}
          onStatusFilterChange={(v) => {
            setStatusFilter(v);
            setPage(1);
            updateUrl({ status: v, page: '1' });
          }}
          onClearFilters={() => {
            clearFilters();
            updateUrl({ type: null, status: null, search: null, page: '1' });
          }}
        />

        <DashboardTable 
          rows={rows} 
          isPending={isPending} 
          onStatusUpdate={handleStatusUpdate} 
          onAccessUpdate={handleAccessUpdate}
          isAdmin={isAdmin}
        />

        <Pagination 
          page={page} 
          total={total} 
          pageSize={20} 
          onPageChange={(p) => {
            setPage(p);
            updateUrl({ page: p.toString() });
          }} 
        />
      </div>
    </div>
  );
}

