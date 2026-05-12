import { revalidatePath } from 'next/cache';
import type { ContentType } from '@/lib/db/schema';

/**
 * Revalida as rotas públicas e administrativas associadas a um conteúdo.
 * Centraliza a lógica de invalidação de cache para garantir que alterações
 * no banco de dados sejam refletidas imediatamente no site.
 */
export function revalidateContentPaths(type: ContentType, slug: string, metadata?: Record<string, unknown>) {
  // Sempre revalida o painel admin
  revalidatePath('/admin/content');
  
  // Revalida a home por segurança (pode ter listas de novos conteúdos)
  revalidatePath('/');

  switch (type) {
    case 'changelog':
      revalidatePath('/changelog');
      break;
    case 'problem':
      revalidatePath('/problems');
      revalidatePath(`/problems/${slug}`);
      break;
    case 'concept':
      revalidatePath('/concepts');
      revalidatePath(`/concepts/${slug}`);
      break;
    case 'interview-en':
      revalidatePath('/interview-en');
      revalidatePath(`/interview-en/${slug}`);
      break;
    case 'engineering-work':
      revalidatePath('/engineering-work');
      revalidatePath(`/engineering-work/${slug}`);
      break;
    case 'track':
      revalidatePath('/tracks');
      revalidatePath(`/tracks/${slug}`);
      break;
    case 'course':
      revalidatePath('/course');
      revalidatePath(`/course/${slug}`);
      break;
    case 'technical-test':
      revalidatePath('/tests');
      // Como o track pode estar apenas no body (JSON), revalidamos as trilhas principais por segurança
      ['frontend', 'backend', 'devops'].forEach((t) => {
        revalidatePath(`/tests/${t}`);
        revalidatePath(`/tests/${t}/${slug}`);
      });
      break;
    case 'landing-section':
    case 'pricing-copy':
    case 'navigation':
    case 'taxonomy':
    case 'legal-page':
      // Alterações globais ou de estrutura
      revalidatePath('/', 'layout');
      revalidatePath('/admin/content', 'layout');
      break;
  }
}
