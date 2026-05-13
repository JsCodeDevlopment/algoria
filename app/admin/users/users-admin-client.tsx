'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import Image from 'next/image';

import { listUsers, updateUserRole, approveCreatorRequest, rejectCreatorRequest } from '@/lib/actions/admin';

type UserRole = 'USER' | 'CONTRIBUTOR' | 'EDITOR' | 'ADMIN';

interface UserRow {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
  creatorRequestStatus: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
}

const ROLE_BADGES: Record<UserRole, { label: string; className: string }> = {
  USER: { label: 'User', className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400' },
  CONTRIBUTOR: { label: 'Contributor', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  EDITOR: { label: 'Editor', className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  ADMIN: { label: 'Admin', className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
};

const ROLES: UserRole[] = ['USER', 'CONTRIBUTOR', 'EDITOR', 'ADMIN'];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const pageSize = 20;

  const loadUsers = useCallback((p: number, s: string) => {
    startTransition(async () => {
      const result = await listUsers({ page: p, pageSize, search: s || undefined });
      if (!result.error) {
        setUsers(result.users as UserRow[]);
        setTotal(result.total as number);
      }
    });
  }, [pageSize]);

  useEffect(() => {
    loadUsers(page, search);
  }, [page, search, loadUsers]);

  function handleSearch() {
    setPage(1);
    loadUsers(1, search);
  }

  async function handleRoleChange(userId: string, newRole: UserRole) {
    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);
      if (result.error) {
        setFeedback({ type: 'error', msg: result.error });
      } else {
        setFeedback({ type: 'success', msg: 'Papel atualizado com sucesso' });
        loadUsers(page, search);
      }
      setTimeout(() => setFeedback(null), 3000);
    });
  }

  async function handleApproveRequest(userId: string) {
    startTransition(async () => {
      const result = await approveCreatorRequest(userId);
      if (result.error) {
        setFeedback({ type: 'error', msg: result.error });
      } else {
        setFeedback({ type: 'success', msg: 'Solicitação aprovada! Usuário agora é Editor.' });
        loadUsers(page, search);
      }
      setTimeout(() => setFeedback(null), 3000);
    });
  }

  async function handleRejectRequest(userId: string) {
    startTransition(async () => {
      const result = await rejectCreatorRequest(userId);
      if (result.error) {
        setFeedback({ type: 'error', msg: result.error });
      } else {
        setFeedback({ type: 'success', msg: 'Solicitação rejeitada.' });
        loadUsers(page, search);
      }
      setTimeout(() => setFeedback(null), 3000);
    });
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Gestão de Utilizadores
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {total} utilizador{total !== 1 ? 'es' : ''} registado{total !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Procurar por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="h-9 w-64 rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <button
            onClick={handleSearch}
            className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Buscar
          </button>
        </div>
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
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Utilizador</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Papel</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status Pedido</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Registado em</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isPending && users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      Carregando...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    Nenhum utilizador encontrado.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const badge = ROLE_BADGES[u.role];
                  return (
                    <tr
                      key={u.id}
                      className="transition-colors hover:bg-accent/50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {u.image ? (
                            <Image
                              src={u.image}
                              alt={u.name}
                              width={32}
                              height={32}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="font-medium text-foreground">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${badge.className}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {u.creatorRequestStatus === 'PENDING' ? (
                          <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-600 animate-pulse">
                            Pendente
                          </span>
                        ) : u.creatorRequestStatus === 'APPROVED' ? (
                          <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-600">
                            Aprovado
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground uppercase">Nenhum</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground tabular-nums">
                        {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-2">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                            disabled={isPending}
                            className="h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
                          >
                            {ROLES.map((role) => (
                              <option key={role} value={role}>
                                {ROLE_BADGES[role].label}
                              </option>
                            ))}
                          </select>
                          {u.creatorRequestStatus === 'PENDING' && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleApproveRequest(u.id)}
                                disabled={isPending}
                                className="flex-1 rounded-md bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                              >
                                Aprovar
                              </button>
                              <button
                                onClick={() => handleRejectRequest(u.id)}
                                disabled={isPending}
                                className="flex-1 rounded-md bg-destructive/10 px-2 py-1 text-[10px] font-bold text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50"
                              >
                                Rejeitar
                              </button>
                            </div>
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
