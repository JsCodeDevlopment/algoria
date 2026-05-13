import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { requireContributor, isAdminRole } from '@/lib/admin/auth-guard';

import { ContentEditor } from '../content-editor';

const TYPE_LABELS: Record<string, string> = {
  'interview-en': 'Interview EN',
  'engineering-work': 'Engenharia',
  problem: 'Problema',
  concept: 'Conceito',
  course: 'Curso',
  'technical-test': 'Simulado Técnico',
  changelog: 'Changelog',
  track: 'Trilha',
};

const CONTRIBUTOR_TYPES = ['interview-en', 'engineering-work'];

interface PageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function AdminContentEditorPage({ searchParams }: PageProps) {
  const session = await requireContributor();
  const { type } = await searchParams;

  // Se não tem tipo definido, redireciona para seleção
  if (!type) {
    redirect('/admin/content/create');
  }

  // Valida permissão por tipo
  if (!isAdminRole(session.role) && !CONTRIBUTOR_TYPES.includes(type)) {
    redirect('/admin/content/create');
  }

  const label = TYPE_LABELS[type] || type;

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
        <Link href="/admin/content/create" className="hover:text-foreground transition-colors">
          Novo
        </Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-foreground font-medium">{label}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Criar {label}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Preencha os campos abaixo. Pode salvar como rascunho ou publicar diretamente.
          </p>
        </div>
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
      </div>

      {/* Editor */}
      <div className="rounded-xl border border-border bg-secondary/30 p-6">
        <ContentEditor mode="create" initialData={{ type }} />
      </div>
    </div>
  );
}
