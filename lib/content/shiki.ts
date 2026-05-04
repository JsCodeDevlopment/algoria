import { codeToHtml, type BundledLanguage } from 'shiki';

import { SHIKI_LANG } from './language';
import type { Language } from './schemas';

export interface HighlightedLine {
  /** 1-indexed line number. */
  line: number;
  /** HTML of the line content (the inner of the `<span class="line">`). */
  innerHtml: string;
  /** True if the line is just whitespace (we may still render it but skip in autoplay). */
  isBlank: boolean;
}

/**
 * Each Shiki line is `<span class="line">…</span>` where the inner `…` is
 * itself a sequence of `<span style="…">token</span>` nodes. A non-greedy
 * regex up to the first `</span>` therefore stops after the *first* token
 * (e.g. only `function` on line 1) — hence balanced matching is required.
 */
function extractShikiLineInnerHtmls(codeInner: string): string[] {
  const result: string[] = [];
  const lineOpenRe = /<span[^>]*\bclass="[^"]*\bline\b[^"]*"[^>]*>/g;
  let m: RegExpExecArray | null;
  while ((m = lineOpenRe.exec(codeInner)) !== null) {
    const contentStart = m.index + m[0].length;
    let depth = 1;
    let pos = contentStart;
    let closed = false;
    while (pos < codeInner.length && depth > 0) {
      const nextOpen = codeInner.indexOf('<span', pos);
      const nextClose = codeInner.indexOf('</span>', pos);
      if (nextClose === -1) break;
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth += 1;
        pos = nextOpen + 5;
      } else {
        depth -= 1;
        if (depth === 0) {
          result.push(codeInner.slice(contentStart, nextClose));
          lineOpenRe.lastIndex = nextClose + 7;
          closed = true;
          break;
        }
        pos = nextClose + 7;
      }
    }
    if (!closed) {
      lineOpenRe.lastIndex = m.index + 1;
    }
  }
  return result;
}

/**
 * Highlight `code` and split the result into per-line HTML chunks so the
 * player can render each line as its own row (independent background, ARIA
 * attrs, click handlers, etc.).
 *
 * Implementation — Shiki's `codeToHtml` wraps each line in
 * `<span class="line">…</span>`. We grab the inner HTML of the `<code>`
 * block and split on those wrappers using nested-span–aware extraction.
 */
export async function highlightToLines(code: string, language: Language): Promise<HighlightedLine[]> {
  const html = await codeToHtml(code, {
    lang: SHIKI_LANG[language] as BundledLanguage,
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
    cssVariablePrefix: '--shiki-',
  });

  const codeMatch = html.match(/<code[^>]*>([\s\S]*?)<\/code>/);
  if (!codeMatch) return [];
  const inner = codeMatch[1];

  const innerHtmlChunks = extractShikiLineInnerHtmls(inner);
  return innerHtmlChunks.map((innerHtml, idx) => {
    const plainText = innerHtml.replace(/<[^>]+>/g, '');
    return {
      line: idx + 1,
      innerHtml,
      isBlank: plainText.trim().length === 0,
    };
  });
}
