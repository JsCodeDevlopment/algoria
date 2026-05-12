'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { addReviewComment, updateContentStatus } from '@/lib/actions/admin';

interface ReviewActionsProps {
  contentId: string;
  currentStatus: string;
}

export function ReviewActions({ contentId, currentStatus }: ReviewActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [comment, setComment] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  function showFeedback(type: 'success' | 'error', msg: string) {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3000);
  }

  function handleStatusChange(newStatus: string) {
    startTransition(async () => {
      const result = await updateContentStatus(contentId, newStatus as never);
      if (result.error) {
        showFeedback('error', result.error);
      } else {
        showFeedback('success', 'Status atualizado');
        router.refresh();
      }
    });
  }

  function handleAddComment() {
    if (!comment.trim()) return;
    startTransition(async () => {
      const result = await addReviewComment(contentId, comment.trim());
      if (result.error) {
        showFeedback('error', result.error);
      } else {
        setComment('');
        showFeedback('success', 'Comentário adicionado');
        router.refresh();
      }
    });
  }

  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-6 space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Ações de Revisão
      </h2>

      {/* Feedback */}
      {feedback && (
        <div
          className={`rounded-lg px-3 py-2 text-xs font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'bg-destructive/10 text-destructive'
          }`}
        >
          {feedback.msg}
        </div>
      )}

      {/* Action buttons based on current status */}
      <div className="space-y-2">
        {currentStatus === 'PENDING_REVIEW' && (
          <>
            <button
              onClick={() => handleStatusChange('PUBLISHED')}
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Aprovar e Publicar
            </button>
            <button
              onClick={() => handleStatusChange('CHANGES_REQUESTED')}
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-600 dark:text-amber-400 transition-colors hover:bg-amber-500/20 disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Solicitar Alterações
            </button>
            <button
              onClick={() => handleStatusChange('REJECTED')}
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              Rejeitar
            </button>
          </>
        )}

        {currentStatus === 'DRAFT' && (
          <button
            onClick={() => handleStatusChange('PENDING_REVIEW')}
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            Enviar para Revisão
          </button>
        )}

        {currentStatus === 'CHANGES_REQUESTED' && (
          <button
            onClick={() => handleStatusChange('PENDING_REVIEW')}
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            Reenviar para Revisão
          </button>
        )}

        {currentStatus === 'APPROVED' && (
          <button
            onClick={() => handleStatusChange('PUBLISHED')}
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            Publicar
          </button>
        )}

        {currentStatus === 'PUBLISHED' && (
          <button
            onClick={() => handleStatusChange('DRAFT')}
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
          >
            Despublicar
          </button>
        )}
      </div>

      {/* Comment form */}
      <div className="border-t border-border pt-4">
        <label className="block text-xs font-medium text-muted-foreground mb-2">
          Adicionar comentário
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Escreva um comentário para o autor..."
          rows={3}
          className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
        <button
          onClick={handleAddComment}
          disabled={isPending || !comment.trim()}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
          Comentar
        </button>
      </div>
    </div>
  );
}
