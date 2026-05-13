import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import { ReviewActions } from "@/app/admin/content/[id]/review/review-actions";
import { getContentById, getReviewComments } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/admin/auth-guard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ContentReviewPage({ params }: PageProps) {
  const { id } = await params;
  await requireAdmin();

  const content = await getContentById(id);
  if (!content) redirect("/admin/content");

  const comments = await getReviewComments(id);

  const STATUS_LABELS: Record<string, { label: string; className: string }> = {
    DRAFT: {
      label: "Rascunho",
      className: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    },
    PENDING_REVIEW: {
      label: "Em Revisão",
      className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    CHANGES_REQUESTED: {
      label: "Alterações Solicitadas",
      className: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    },
    APPROVED: {
      label: "Aprovado",
      className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    PUBLISHED: {
      label: "Publicado",
      className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    REJECTED: {
      label: "Rejeitado",
      className: "bg-destructive/10 text-destructive",
    },
  };

  const status = STATUS_LABELS[content.status] ?? {
    label: content.status,
    className: "",
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/admin/content"
          className="hover:text-foreground transition-colors"
        >
          Conteúdos
        </Link>
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
        <span className="text-foreground font-medium truncate max-w-xs">
          {content.title}
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {content.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            <span className="font-mono text-muted-foreground">
              {content.slug}
            </span>
            <span className="text-border">•</span>
            <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {content.type}
            </span>
            <span className="text-border">•</span>
            <span
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${status.className}`}
            >
              {status.label}
            </span>
            <span className="text-border">•</span>
            <span className="text-muted-foreground tabular-nums">
              v{content.version}
            </span>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Content preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-secondary/30 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Conteúdo
            </h2>
            {content.body ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-foreground font-mono bg-background rounded-lg p-4 border border-border overflow-x-auto">
                  {content.body}
                </pre>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Sem corpo de conteúdo.
              </p>
            )}
          </div>

          {/* Metadata */}
          {content.metadata &&
            Object.keys(content.metadata as Record<string, unknown>).length >
              0 && (
              <div className="rounded-xl border border-border bg-secondary/30 p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  Metadados
                </h2>
                <pre className="whitespace-pre-wrap text-sm font-mono text-muted-foreground bg-background rounded-lg p-4 border border-border overflow-x-auto">
                  {JSON.stringify(content.metadata, null, 2)}
                </pre>
              </div>
            )}
        </div>

        {/* Sidebar: Actions + Comments */}
        <div className="space-y-6">
          {/* Actions */}
          <ReviewActions contentId={id} currentStatus={content.status} />

          {/* Comments */}
          <div className="rounded-xl border border-border bg-secondary/30 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Comentários de Revisão ({comments.length})
            </h2>

            {comments.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                Nenhum comentário ainda.
              </p>
            ) : (
              <div className="space-y-4">
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className={`rounded-lg border p-3 ${
                      c.resolved
                        ? "border-emerald-500/20 bg-emerald-500/5"
                        : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {c.authorImage ? (
                        <Image
                          src={c.authorImage}
                          alt={c.authorName}
                          width={20}
                          height={20}
                          className="h-5 w-5 rounded-full"
                        />
                      ) : (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                          {c.authorName.charAt(0)}
                        </div>
                      )}
                      <span className="text-xs font-medium text-foreground">
                        {c.authorName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(c.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {c.resolved && (
                        <span className="ml-auto inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                          Resolvido
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground">{c.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info panel */}
          <div className="rounded-xl border border-border bg-secondary/30 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Informações
            </h2>
            <dl className="space-y-4 text-sm">
              <div className="pb-3 border-b border-border">
                <dt className="text-muted-foreground mb-1.5">Autor</dt>
                <dd className="flex items-center gap-2">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-muted">
                    {content.authorImage ? (
                      <Image src={content.authorImage} alt={content.authorName || ''} width={32} height={32} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
                        {content.authorName?.[0] || '?'}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{content.authorName || 'Sistema'}</p>
                    <p className="text-[10px] text-muted-foreground font-mono truncate">{content.authorId}</p>
                  </div>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Criado em</dt>
                <dd className="mt-0.5 font-medium text-foreground tabular-nums">
                  {new Date(content.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Última atualização</dt>
                <dd className="mt-0.5 font-medium text-foreground tabular-nums">
                  {new Date(content.updatedAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </dd>
              </div>
              {content.publishedAt && (
                <div>
                  <dt className="text-muted-foreground">Publicado em</dt>
                  <dd className="mt-0.5 font-medium text-foreground tabular-nums">
                    {new Date(content.publishedAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-muted-foreground">ID</dt>
                <dd className="mt-0.5 font-mono text-xs text-muted-foreground break-all">
                  {content.id}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
