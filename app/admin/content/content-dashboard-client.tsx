'use client';

import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';

import { listContents, updateContentStatus } from '@/lib/actions/admin';

type ContentStatus = 'DRAFT' | 'PENDING_REVIEW' | 'CHANGES_REQUESTED' | 'APPROVED' | 'PUBLISHED' | 'REJECTED';
type TabView = 'editorial' | 'sistema';

const SYSTEM_TYPES = ['changelog', 'legal-page', 'landing-section', 'pricing-copy', 'navigation', 'taxonomy'];

interface ContentRow {
  id: string;
  slug: string;
  type: string;
  title: string;
  status: ContentStatus;
  version: number;
  authorId: string | null;
  authorName: string | null;
  authorImage: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const STATUS_BADGES: Record<ContentStatus, { label: string; className: string }> = {
  DRAFT: { label: 'Rascunho', className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400' },
  PENDING_REVIEW: { label: 'Em Revisão', className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  CHANGES_REQUESTED: { label: 'Alterações', className: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
  APPROVED: { label: 'Aprovado', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  PUBLISHED: { label: 'Publicado', className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  REJECTED: { label: 'Rejeitado', className: 'bg-destructive/10 text-destructive' },
};

const EDITORIAL_TYPES = [
  { value: '', label: 'Todos os tipos' },
  { value: 'problem', label: 'Problemas' },
  { value: 'concept', label: 'Conceitos' },
  { value: 'interview-en', label: 'Interview EN' },
  { value: 'engineering-work', label: 'Engenharia' },
  { value: 'track', label: 'Trilhas' },
  { value: 'course', label: 'Cursos' },
  { value: 'technical-test', label: 'Simulados' },
];

const SYSTEM_TYPE_OPTIONS = [
  { value: '', label: 'Todos os tipos' },
  { value: 'changelog', label: 'Changelog' },
  { value: 'legal-page', label: 'Páginas Legais' },
  { value: 'landing-section', label: 'Landing' },
  { value: 'pricing-copy', label: 'Pricing' },
  { value: 'navigation', label: 'Navegação' },
  { value: 'taxonomy', label: 'Taxonomia' },
];

const STATUS_FILTERS = [
  { value: '', label: 'Todos os status' },
  { value: 'DRAFT', label: 'Rascunho' },
  { value: 'PENDING_REVIEW', label: 'Em Revisão' },
  { value: 'CHANGES_REQUESTED', label: 'Alterações Solicitadas' },
  { value: 'APPROVED', label: 'Aprovado' },
  { value: 'PUBLISHED', label: 'Publicado' },
  { value: 'REJECTED', label: 'Rejeitado' },
];

export default function ContentDashboardClient({ isAdmin }: { isAdmin: boolean }) {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<TabView>(searchParams.get('tab') === 'sistema' && isAdmin ? 'sistema' : 'editorial');
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') ?? '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') ?? '');
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const pageSize = 20;

  function load(p: number, s?: string) {
    startTransition(async () => {
      const result = await listContents({
        page: p,
        pageSize,
        type: typeFilter || undefined,
        status: statusFilter || undefined,
        search: s || undefined,
      });
      if (!result.error) {
        let filteredContents = result.contents as ContentRow[];
        if (!typeFilter) {
          if (tab === 'sistema') {
            filteredContents = filteredContents.filter(r => SYSTEM_TYPES.includes(r.type));
          } else {
            filteredContents = filteredContents.filter(r => !SYSTEM_TYPES.includes(r.type));
          }
        }
        setRows(filteredContents);
        setTotal(result.total as number);
      }
    });
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      load(page, search);
    }, 300);
    return () => clearTimeout(timer);
  }, [page, typeFilter, statusFilter, search, tab]);

  function switchTab(newTab: TabView) {
    setTab(newTab);
    setTypeFilter('');
    setStatusFilter('');
    setSearch('');
    setPage(1);
  }

  async function handleStatusChange(contentId: string, newStatus: ContentStatus) {
    startTransition(async () => {
      const result = await updateContentStatus(contentId, newStatus);
      if (result.error) {
        setFeedback({ type: 'error', msg: result.error });
      } else {
        setFeedback({ type: 'success', msg: 'Status atualizado' });
        load(page);
      }
      setTimeout(() => setFeedback(null), 3000);
    });
  }

  const totalPages = Math.ceil(total / pageSize);
  const typeOptions = tab === 'sistema' ? SYSTEM_TYPE_OPTIONS : EDITORIAL_TYPES;

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
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

      {/* Tabs - Only show if isAdmin */}
      {isAdmin && (
        <div className="flex gap-1 rounded-lg border border-border bg-secondary/30 p-1">
          <button
            onClick={() => switchTab('editorial')}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'editorial'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            📝 Editorial
            <span className="ml-1.5 text-xs text-muted-foreground">Criável</span>
          </button>
          <button
            onClick={() => switchTab('sistema')}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'sistema'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            ⚙️ Sistema
            <span className="ml-1.5 text-xs text-muted-foreground">Apenas edição</span>
          </button>
        </div>
      )}

      {/* System tab info */}
      {tab === 'sistema' && isAdmin && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
          <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <div>
            <strong>Conteúdos de sistema</strong> — Estes conteúdos são parte da estrutura da plataforma (changelog, páginas legais, landing, pricing). 
            Não podem ser criados, apenas editados para manter consistência.
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar por título ou slug..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
        >
          {typeOptions.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {(typeFilter || statusFilter || search) && (
          <button
            onClick={() => {
              setTypeFilter('');
              setStatusFilter('');
              setSearch('');
              setPage(1);
            }}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpar
          </button>
        )}
      </div>

      {/* Feedback */}
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

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Título</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tipo</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Autor</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Versão</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Atualizado</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isPending && rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      Carregando...
                    </div>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                        <svg className="h-7 w-7 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9.75m3 0h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm-3-3h.008v.008H9.75v-.008zm0 3h.008v.008H9.75v-.008z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Nenhum conteúdo encontrado</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {isAdmin ? 'Os conteúdos aparecerão aqui após serem migrados.' : 'Ainda não criaste nenhum conteúdo.'}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const badge = STATUS_BADGES[row.status];
                  return (
                    <tr key={row.id} className="transition-colors hover:bg-accent/50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-foreground">{row.title}</p>
                          <p className="text-xs text-muted-foreground font-mono">{row.slug}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                          {row.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 overflow-hidden rounded-full bg-muted">
                            {row.authorImage ? (
                              <img src={row.authorImage} alt={row.authorName || ''} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-muted-foreground">
                                {row.authorName?.[0] || '?'}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-foreground">{row.authorName || 'Sistema'}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{row.authorId?.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${badge.className}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 tabular-nums text-muted-foreground">v{row.version}</td>
                      <td className="px-4 py-3 tabular-nums text-muted-foreground">
                        {new Date(row.updatedAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/content/${row.id}/edit`}
                            className="inline-flex h-7 items-center rounded-md border border-border px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                          >
                            Editar
                          </Link>
                          {isAdmin && (
                            <Link
                              href={`/admin/content/${row.id}/review`}
                              className="inline-flex h-7 items-center rounded-md border border-border px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                            >
                              Revisar
                            </Link>
                          )}
                          {isAdmin && row.status === 'PENDING_REVIEW' && (
                            <button
                              onClick={() => handleStatusChange(row.id, 'PUBLISHED')}
                              disabled={isPending}
                              className="inline-flex h-7 items-center rounded-md bg-emerald-500/10 px-2.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:opacity-50"
                            >
                              Publicar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isPending}
                className="h-8 rounded-md border border-border px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isPending}
                className="h-8 rounded-md border border-border px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
