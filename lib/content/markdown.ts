import { marked } from 'marked';

import { injectDidacticPlaceholders } from './didactic-inject';

marked.setOptions({
  gfm: true,
  breaks: false,
});

export type RenderMarkdownOptions = {
  /** Pré-processa blocos `:::didactic-*` (guias em `content/engenharia-trabalho`). */
  didacticBlocks?: boolean;
};

/**
 * Render markdown to HTML.
 *
 * We trust our own content (it's stored in-repo and reviewed via PR), so we
 * skip sanitisation. If we ever accept user-submitted markdown (Phase 6 —
 * community contributions) we must wrap this with DOMPurify or rehype-sanitize.
 */
export function renderMarkdown(input: string, options?: RenderMarkdownOptions): string {
  let md = input;
  if (options?.didacticBlocks) {
    const { markdown, errors } = injectDidacticPlaceholders(md);
    if (errors.length) {
      console.warn('[renderMarkdown didactic]', errors.join(' · '));
    }
    md = markdown;
  }
  return marked.parse(md, { async: false }) as string;
}
