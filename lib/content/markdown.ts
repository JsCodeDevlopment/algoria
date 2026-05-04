import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: false,
});

/**
 * Render markdown to HTML.
 *
 * We trust our own content (it's stored in-repo and reviewed via PR), so we
 * skip sanitisation. If we ever accept user-submitted markdown (Phase 6 —
 * community contributions) we must wrap this with DOMPurify or rehype-sanitize.
 */
export function renderMarkdown(input: string): string {
  return marked.parse(input, { async: false }) as string;
}
