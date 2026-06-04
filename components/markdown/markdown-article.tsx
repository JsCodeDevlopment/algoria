'use client';

import React, { useRef } from 'react';
import { MermaidRenderer } from './mermaid-renderer';

interface MarkdownArticleProps {
  html: string;
  className?: string;
}

export function MarkdownArticle({ html, className }: MarkdownArticleProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative w-full">
      <article 
        className={className} 
        dangerouslySetInnerHTML={{ __html: html }} 
      />
      <MermaidRenderer containerRef={containerRef} />
    </div>
  );
}
