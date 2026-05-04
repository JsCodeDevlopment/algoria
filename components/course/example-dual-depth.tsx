'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Props {
  title: string;
  simpleHtml: string;
  deepHtml: string;
  code?: string;
}

/** Exemplo com duas densidades narrativas: introdutório vs intenção “curso premium”. */
export function ExampleDualDepth({ title, simpleHtml, deepHtml, code }: Props) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-5 space-y-3">
      <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{title}</h3>
      <Tabs defaultValue="simple">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="simple" className="text-xs uppercase tracking-wide">
            Leitura simples
          </TabsTrigger>
          <TabsTrigger value="deep" className="text-xs uppercase tracking-wide">
            Explicação profunda
          </TabsTrigger>
        </TabsList>
        <TabsContent value="simple" className="mt-3">
          <div
            className="prose prose-sm prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: simpleHtml }}
          />
        </TabsContent>
        <TabsContent value="deep" className="mt-3">
          <div
            className="prose prose-sm prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:before:content-none prose-code:after:content-none"
            dangerouslySetInnerHTML={{ __html: deepHtml }}
          />
        </TabsContent>
      </Tabs>
      {code ? (
        <pre className="text-xs leading-relaxed overflow-x-auto rounded-lg bg-zinc-950 text-zinc-50 p-3 font-mono border border-zinc-800">
          <code>{code}</code>
        </pre>
      ) : null}
    </div>
  );
}
