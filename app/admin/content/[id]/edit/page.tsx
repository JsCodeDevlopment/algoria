import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { getContentById } from '@/lib/actions/admin';
import { requireContributor, isAdminRole } from '@/lib/admin/auth-guard';

import { ContentEditor } from '../../content-editor';

interface PageProps {
  params: Promise<{ id: string }>;
}

const CONTRIBUTOR_TYPES = ['interview-en', 'engineering-work'];

export default async function AdminContentEditPage({ params }: PageProps) {
  const { id } = await params;
  const session = await requireContributor();

  const content = await getContentById(id);
  if (!content) redirect('/admin/content');

  // Contributor só pode editar seus próprios conteúdos E dos tipos permitidos
  if (!isAdminRole(session.role)) {
    const isOwner = content.authorId === session.userId;
    const isAllowedType = CONTRIBUTOR_TYPES.includes(content.type);
    if (!isOwner || !isAllowedType) {
      redirect('/admin/content');
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin/content" className="hover:text-foreground transition-colors">
          Conteúdos
        </Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-foreground font-medium truncate max-w-xs">
          {content.title}
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Editar Conteúdo
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Versão {content.version} · Slug: <code className="font-mono">{content.slug}</code>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Author info */}
          <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-1.5 text-xs">
            <div className="h-5 w-5 overflow-hidden rounded-full bg-muted">
              {session.image ? (
                <Image src={session.image} alt={session.name} width={20} height={20} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-muted-foreground">
                  {session.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="font-medium text-foreground">{session.name}</span>
            <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ${
              isAdminRole(session.role)
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
            }`}>
              {session.role}
            </span>
          </div>
          <Link
            href={`/admin/content/${id}/review`}
            className="flex h-9 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Ver Revisão
          </Link>
        </div>
      </div>

      {/* Editor */}
      <div className="rounded-xl border border-border bg-secondary/30 p-6">
        <ContentEditor
          mode="edit"
          initialData={{
            id: content.id,
            slug: content.slug,
            type: content.type,
            title: content.title,
            body: content.body,
            metadata: (content.metadata as Record<string, unknown>) ?? {},
          }}
        />
      </div>
    </div>
  );
}
