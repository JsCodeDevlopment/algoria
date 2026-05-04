'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { create } from 'zustand';

export type ArticleImageLightboxPayload = {
  src: string;
  alt: string;
  caption?: string;
};

type ArticleImageLightboxState = {
  payload: ArticleImageLightboxPayload | null;
  open: (p: ArticleImageLightboxPayload) => void;
  close: () => void;
};

export const useArticleImageLightboxStore = create<ArticleImageLightboxState>((set) => ({
  payload: null,
  open: (payload) => set({ payload }),
  close: () => set({ payload: null }),
}));

function captionNearImage(img: HTMLImageElement): string | undefined {
  const figure = img.closest('figure');
  const cap =
    figure?.querySelector(':scope > figcaption') ?? figure?.querySelector('figcaption');
  const text = cap?.textContent?.replace(/\s+/g, ' ').trim();
  return text || undefined;
}

/** Delegação para `<img>` do artigo (Markdown + figuras hidratadas). */
export function attachArticleImageLightboxDelegates(root: HTMLElement) {
  const onClickCapture = (e: MouseEvent) => {
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

    const t = e.target;
    if (!(t instanceof Element)) return;

    const img = t.closest('article img') as HTMLImageElement | null;
    if (!img || !root.contains(img)) return;
    if (img.closest('[data-no-article-zoom]')) return;

    const src = img.currentSrc || img.src;
    if (!src) return;

    e.preventDefault();

    useArticleImageLightboxStore.getState().open({
      src,
      alt: img.alt?.trim() || 'Imagem do artigo',
      caption: captionNearImage(img),
    });
  };

  root.addEventListener('click', onClickCapture, true);

  return () => root.removeEventListener('click', onClickCapture, true);
}

/** Marca `<img>` do artigo com cursor e tooltip. */
export function annotateArticleZoomableImages(root: HTMLElement, titleUi = 'Clique para ampliar') {
  root.querySelectorAll('article img').forEach((node) => {
    const img = node as HTMLImageElement;
    if (img.closest('[data-no-article-zoom]')) return;
    img.classList.add(
      'cursor-pointer',
      'transition-opacity',
      'duration-150',
      'hover:opacity-92',
      'active:opacity-85',
      'motion-reduce:transition-none',
    );
    const hasCustomTitle = typeof img.title === 'string' && img.title.trim().length > 0;
    const hasAria = img.hasAttribute('aria-describedby') || img.hasAttribute('aria-labelledby');
    if (!hasCustomTitle && !hasAria) {
      img.title = titleUi;
    }
    if (!img.getAttribute('decoding')) {
      img.decoding = 'async';
    }
  });
}

export function ArticleImageLightbox() {
  const payload = useArticleImageLightboxStore((s) => s.payload);
  const close = useArticleImageLightboxStore((s) => s.close);

  return (
    <Dialog.Root open={Boolean(payload)} onOpenChange={(o) => !o && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] animate-in bg-black/80 backdrop-blur-[2px]" />
        <Dialog.Content
          className={
            'fixed inset-4 z-[101] mx-auto flex h-fit max-w-6xl flex-col rounded-xl border border-white/15 ' +
            'bg-zinc-950/95 p-3 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.65)] animate-in '
          }
        >
          <div className="flex shrink-0 items-start justify-between gap-3 pb-2">
            <Dialog.Title className="line-clamp-2 pr-2 text-sm font-medium leading-snug text-zinc-100">
              {payload?.caption || payload?.alt || 'Visualização da imagem'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <X className="size-4" aria-hidden />
                Fechar
              </button>
            </Dialog.Close>
          </div>
          {payload ? (
            <Dialog.Description className="sr-only">{payload.alt}</Dialog.Description>
          ) : null}
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-lg bg-black/35 p-2">
            {payload ? (
              // eslint-disable-next-line @next/next/no-img-element -- URL estática/CDN igual ao HTML do artigo
              <img
                src={payload.src}
                alt={payload.alt}
                className="max-h-[min(76dvh,calc(100dvh-8rem))] w-auto max-w-full object-contain"
                loading="eager"
                decoding="async"
              />
            ) : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
