'use client';

import { useTheme } from 'next-themes';
import React, { useEffect } from 'react';

interface MermaidRendererProps {
  containerRef: React.RefObject<HTMLElement | null>;
  html?: string; // Used as a trigger to re-render when content updates
}

export function MermaidRenderer({ containerRef, html }: MermaidRendererProps) {
  const { resolvedTheme } = useTheme();

  useEffect(() => {

    const container = containerRef.current;
    if (!container) return;

    let active = true;
    const injectedDivs: HTMLDivElement[] = [];

    const renderDiagrams = async () => {
      try {
        const preElements = Array.from(container.querySelectorAll('pre')).filter((pre) => {
          const code = pre.querySelector('code');
          return code && (code.classList.contains('language-mermaid') || code.classList.contains('lang-mermaid'));
        });

        if (preElements.length === 0) return;

        const mermaid = (await import('mermaid')).default;

        const isDark = resolvedTheme === 'dark';
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'loose',
          fontFamily: 'var(--font-geist-sans), sans-serif',
          themeVariables: {
            fontFamily: 'var(--font-geist-sans), sans-serif',
            primaryColor: isDark ? '#1e293b' : '#f1f5f9',
            primaryTextColor: isDark ? '#f8fafc' : '#020617',
            primaryBorderColor: isDark ? '#334155' : '#cbd5e1',
            lineColor: isDark ? '#64748b' : '#94a3b8',
            secondaryColor: isDark ? '#0f172a' : '#f8fafc',
            tertiaryColor: isDark ? '#1e293b' : '#f1f5f9',
          },
        });

        for (let i = 0; i < preElements.length; i++) {
          if (!active) break;

          const pre = preElements[i];
          const codeEl = pre.querySelector('code');
          if (!codeEl) continue;

          let rawCode = pre.getAttribute('data-mermaid-code');
          if (!rawCode) {
            rawCode = codeEl.textContent || '';
            pre.setAttribute('data-mermaid-code', rawCode);
          }

          const wrapperId = pre.getAttribute('data-mermaid-wrapper-id') || `mermaid-wrapper-${i}-${Math.random().toString(36).substr(2, 9)}`;
          pre.setAttribute('data-mermaid-wrapper-id', wrapperId);

          let wrapper = container.querySelector(`#${wrapperId}`) as HTMLDivElement | null;
          if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.id = wrapperId;
            wrapper.className = 'mermaid-diagram-wrapper w-full border border-border bg-slate-950/20 dark:bg-slate-950/40 p-6 overflow-x-auto flex flex-col justify-center items-center my-6 rounded-none transition-colors';
            pre.parentNode?.insertBefore(wrapper, pre.nextSibling);
          }

          injectedDivs.push(wrapper);

          pre.style.display = 'none';

          const diagramId = `mermaid-svg-${i}-${Math.random().toString(36).substr(2, 9)}`;
          try {
            wrapper.innerHTML = '<span class="text-xs text-zinc-500 font-mono tracking-wider">Compilando diagrama...</span>';
            
            const cleanedCode = rawCode
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&amp;/g, '&')
              .trim();

            const { svg } = await mermaid.render(diagramId, cleanedCode);
            if (active) {
              wrapper.innerHTML = svg;
              const svgEl = wrapper.querySelector('svg');
              if (svgEl) {
                svgEl.style.maxWidth = '100%';
                svgEl.style.height = 'auto';
                svgEl.querySelectorAll('rect, polygon, path').forEach((shape) => {
                  shape.setAttribute('rx', '0');
                  shape.setAttribute('ry', '0');
                });
              }
            }
          } catch (err) {
            console.error('[Mermaid compile error]', err);
            if (active) {
              wrapper.innerHTML = `
                <div class="w-full text-left border border-red-500/20 bg-red-500/5 p-4 text-xs font-mono rounded-none text-red-500 mb-4">
                  <div class="font-bold mb-1">Erro de renderização do diagrama</div>
                  <pre class="whitespace-pre-wrap overflow-x-auto text-[10px] opacity-80">${err instanceof Error ? err.message : String(err)}</pre>
                </div>
              `;
              pre.style.display = 'block';
            }
          }
        }
      } catch (err) {
        console.error('Failed to run mermaid rendering:', err);
      }
    };

    renderDiagrams();

    return () => {
      active = false;
      injectedDivs.forEach((div) => {
        div.remove();
      });
      const preElements = container.querySelectorAll('pre');
      preElements.forEach((pre) => {
        if (pre.getAttribute('data-mermaid-code')) {
          pre.removeAttribute('data-mermaid-wrapper-id');
          pre.removeAttribute('data-mermaid-code');
          pre.style.display = '';
        }
      });
    };
  }, [html, resolvedTheme, containerRef]);

  return null;
}
