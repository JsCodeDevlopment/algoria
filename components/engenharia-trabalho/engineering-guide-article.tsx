'use client';

import { useEffect, useRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import {
  DidacticBarChartSchema,
  DidacticFigureSchema,
  DidacticLineChartSchema,
  DidacticMetricsSchema,
} from '@/lib/content/didactic-schemas';

import {
  DidacticBarChartView,
  DidacticFigureView,
  DidacticLineChartView,
  DidacticMetricsView,
} from './didactic-views';
import {
  annotateArticleZoomableImages,
  ArticleImageLightbox,
  attachArticleImageLightboxDelegates,
} from './article-image-lightbox';
import { MermaidRenderer } from '../markdown/mermaid-renderer';

const rootsMap = new WeakMap<HTMLElement, Root>();
const pendingUnmounts = new WeakMap<Root, number>();

function decodePayloadUtf8(b64: string): string {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function renderIntoPlaceholder(el: HTMLDivElement): Root | null {
  const variant = el.dataset.algoriaDidactic;
  const payload = el.dataset.algoriaPayload;
  if (!variant || !payload) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(decodePayloadUtf8(payload)) as unknown;
  } catch {
    return null;
  }

  let root = rootsMap.get(el);
  if (!root) {
    root = createRoot(el);
    rootsMap.set(el, root);
  } else {
    const timeoutId = pendingUnmounts.get(root);
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      pendingUnmounts.delete(root);
    }
  }

  switch (variant) {
    case 'metrics': {
      const r = DidacticMetricsSchema.safeParse(parsed);
      if (r.success) root.render(<DidacticMetricsView data={r.data} />);
      break;
    }
    case 'bar-chart': {
      const r = DidacticBarChartSchema.safeParse(parsed);
      if (r.success) root.render(<DidacticBarChartView data={r.data} />);
      break;
    }
    case 'line-chart': {
      const r = DidacticLineChartSchema.safeParse(parsed);
      if (r.success) root.render(<DidacticLineChartView data={r.data} />);
      break;
    }
    case 'figure': {
      const r = DidacticFigureSchema.safeParse(parsed);
      if (r.success) root.render(<DidacticFigureView data={r.data} />);
      break;
    }
    default:
      root.render(null);
  }

  return root;
}

const articleClassName =
  'prose prose-zinc max-w-none dark:prose-invert ' +
  'prose-h2:mt-10 prose-h2:text-2xl prose-h2:font-semibold prose-h2:tracking-tight ' +
  'prose-h3:text-lg prose-h3:font-semibold ' +
  'prose-code:text-blue-600 dark:prose-code:text-blue-400 ' +
  'prose-code:before:content-none prose-code:after:content-none ' +
  'prose-ul:my-4 prose-li:my-1 prose-table:text-sm ' +
  'prose-img:rounded-lg prose-img:border prose-img:border-border prose-img:shadow-xs';

export function EngineeringGuideArticle({ html }: { html: string }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const rootsRef = useRef<Root[]>([]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const localEntries: { el: HTMLElement; root: Root }[] = [];

    shell.querySelectorAll('[data-algoria-didactic][data-algoria-payload]').forEach((node) => {
      const el = node as HTMLDivElement;
      const root = renderIntoPlaceholder(el);
      if (root) localEntries.push({ el, root });
    });

    annotateArticleZoomableImages(shell);
    const detachLightbox = attachArticleImageLightboxDelegates(shell);

    rootsRef.current = localEntries.map((e) => e.root);

    return () => {
      detachLightbox();
      localEntries.forEach(({ el, root }) => {
        const timeoutId = window.setTimeout(() => {
          try {
            root.unmount();
            if (rootsMap.get(el) === root) {
              rootsMap.delete(el);
            }
          } catch {
            // ignore unmount errors on detached nodes
          }
          pendingUnmounts.delete(root);
        }, 0);
        pendingUnmounts.set(root, timeoutId);
      });
      if (rootsRef.current.every((r, i) => localEntries[i]?.root === r)) {
        rootsRef.current = [];
      }
    };
  }, [html]);

  return (
    <>
      <ArticleImageLightbox />
      <MermaidRenderer containerRef={shellRef} />
      <div ref={shellRef}>
        <article className={articleClassName} dangerouslySetInnerHTML={{ __html: html }} />
        <MermaidRenderer containerRef={shellRef} html={html} />
      </div>
    </>
  );
}
