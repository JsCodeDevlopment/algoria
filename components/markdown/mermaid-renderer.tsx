'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

export function MermaidRenderer({ 
  containerRef,
  containerId 
}: { 
  containerRef?: React.RefObject<HTMLElement | null>;
  containerId?: string;
}) {
  const { resolvedTheme } = useTheme();
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!mountedRef.current) return;

    let container: HTMLElement | null = null;
    if (containerRef && containerRef.current) {
      container = containerRef.current;
    } else if (containerId) {
      container = document.getElementById(containerId);
    }

    if (!container) return;
    // Find all mermaid code blocks.
    // Shiki wraps code in <pre><code class="language-mermaid">.
    // Alternatively, without shiki, marked might output <pre><code class="language-mermaid">.
    // We will look for code.language-mermaid.
    const mermaidNodes = container.querySelectorAll('pre code.language-mermaid, pre.shiki code.language-mermaid');
    
    if (mermaidNodes.length === 0) return;

    let isActive = true;

    async function renderDiagrams() {
      // Dynamically import mermaid to avoid bloat on pages without diagrams
      const mermaidModule = await import('mermaid');
      const mermaid = mermaidModule.default;

      if (!isActive) return;

      // Ensure zero rounding rule is applied in mermaid configuration
      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === 'dark' ? 'dark' : 'default',
        securityLevel: 'loose',
        fontFamily: 'inherit',
        themeVariables: {
          // You can tweak colors here to match the Acite design system if needed
        }
      });

      Array.from(mermaidNodes).forEach(async (codeNode, index) => {
        const preNode = codeNode.parentElement;
        if (!preNode || preNode.tagName !== 'PRE') return;

        // Extract original code. We save it in a data attribute to allow re-rendering on theme change.
        if (!preNode.dataset.mermaidCode) {
          preNode.dataset.mermaidCode = codeNode.textContent || '';
        }
        const code = preNode.dataset.mermaidCode;
        if (!code) return;

        const id = `mermaid-svg-${index}-${Math.random().toString(36).substring(2, 9)}`;

        try {
          const { svg } = await mermaid.render(id, code);
          if (!isActive) return;

          // Check if we already injected an SVG wrapper next to this PRE
          let svgWrapper = preNode.nextElementSibling as HTMLElement;
          if (!svgWrapper || !svgWrapper.classList.contains('mermaid-wrapper')) {
            svgWrapper = document.createElement('div');
            svgWrapper.className = 'mermaid-wrapper flex justify-center my-8 p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 overflow-x-auto';
            // zero rounding rule
            svgWrapper.style.borderRadius = '0px'; 
            preNode.parentNode?.insertBefore(svgWrapper, preNode.nextSibling);
          }

          svgWrapper.innerHTML = svg;
          
          // Hide the original code block
          preNode.style.display = 'none';
        } catch (err) {
          console.error('Failed to render mermaid diagram', err);
        }
      });
    }

    renderDiagrams();

    return () => {
      isActive = false;
    };
  }, [containerRef, containerId, resolvedTheme]);

  return null;
}
