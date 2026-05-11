import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getDashboardStats } from '@/lib/actions/admin';
import { requireContributor, isAdminRole } from '@/lib/admin/auth-guard';

export default async function AdminDashboardPage() {
  const session = await requireContributor();
  const isAdmin = isAdminRole(session.role);

  if (!isAdmin) {
    redirect('/admin/content');
  }

  const stats = await getDashboardStats();

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Não foi possível carregar os dados do dashboard.</p>
      </div>
    );
  }

  const allCards = [
    {
      title: 'Total de Utilizadores',
      value: stats.totalUsers,
      icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      href: '/admin/users',
      adminOnly: true,
    },
    {
      title: 'Conteúdos Totais',
      value: stats.totalContents,
      icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      href: '/admin/content',
    },
    {
      title: 'Pendentes de Revisão',
      value: stats.pendingReview,
      icon: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      href: '/admin/content?status=PENDING_REVIEW',
    },
    {
      title: 'Publicados',
      value: stats.publishedContents,
      icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'text-primary',
      bg: 'bg-primary/10',
      href: '/admin/content?status=PUBLISHED',
    },
  ];

  const cards = allCards.filter(c => !c.adminOnly || isAdmin);

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visão geral do estado da plataforma Algoria.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group relative overflow-hidden rounded-xl border border-border bg-secondary/30 p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {card.title}
                </p>
                <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">
                  {card.value}
                </p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bg} transition-transform group-hover:scale-110`}>
                <svg
                  className={`h-6 w-6 ${card.color}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                </svg>
              </div>
            </div>
            {/* Subtle gradient line */}
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>

      {/* Role Distribution */}
      <div className="rounded-xl border border-border bg-secondary/30 p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Distribuição de Papéis
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Breakdown dos utilizadores por nível de acesso.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.roleDistribution.map((role) => {
            const roleConfig: Record<string, { label: string; color: string }> = {
              USER: { label: 'Utilizadores', color: 'bg-slate-500' },
              CONTRIBUTOR: { label: 'Contribuidores', color: 'bg-blue-500' },
              EDITOR: { label: 'Editores', color: 'bg-amber-500' },
              ADMIN: { label: 'Administradores', color: 'bg-emerald-500' },
            };
            const config = roleConfig[role.role] ?? { label: role.role, color: 'bg-slate-500' };
            const percentage = stats.totalUsers > 0 ? Math.round((role.count / stats.totalUsers) * 100) : 0;

            return (
              <div key={role.role} className="rounded-lg border border-border/50 p-4">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${config.color}`} />
                  <span className="text-sm font-medium text-foreground">{config.label}</span>
                </div>
                <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">
                  {role.count}
                </p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className={`h-full rounded-full ${config.color} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{percentage}% do total</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border bg-secondary/30 p-6">
        <h2 className="text-lg font-semibold text-foreground">Ações Rápidas</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Link
            href="/admin/users"
            className="flex items-center gap-3 rounded-lg border border-border/50 p-4 transition-colors hover:bg-accent"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Gerir Utilizadores</p>
              <p className="text-xs text-muted-foreground">Papéis e permissões</p>
            </div>
          </Link>
          <Link
            href="/admin/content"
            className="flex items-center gap-3 rounded-lg border border-border/50 p-4 transition-colors hover:bg-accent"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Gerir Conteúdos</p>
              <p className="text-xs text-muted-foreground">Criar e aprovar</p>
            </div>
          </Link>
          <Link
            href="/admin/content?status=PENDING_REVIEW"
            className="flex items-center gap-3 rounded-lg border border-border/50 p-4 transition-colors hover:bg-accent"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Revisões Pendentes</p>
              <p className="text-xs text-muted-foreground">Avaliar submissões</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
