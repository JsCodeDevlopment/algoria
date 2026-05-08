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
    <div className="border-2 border-border bg-background p-6 md:p-8 space-y-4">
      <h3 className="text-lg font-black uppercase tracking-tight text-foreground">{title}</h3>
      <Tabs defaultValue="simple">
        <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-transparent border-b border-border">
          <TabsTrigger
            value="simple"
            className="text-[10px] font-black uppercase tracking-widest rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
          >
            Leitura Simples
          </TabsTrigger>
          <TabsTrigger
            value="deep"
            className="text-[10px] font-black uppercase tracking-widest rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
          >
            Explicação Profunda
          </TabsTrigger>
        </TabsList>
        <TabsContent value="simple" className="mt-6">
          <div
            className="prose prose-sm prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: simpleHtml }}
          />
        </TabsContent>
        <TabsContent value="deep" className="mt-6">
          <div
            className="prose prose-sm prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-code:text-primary dark:prose-code:text-primary-foreground prose-code:bg-primary/10 prose-code:px-1 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none"
            dangerouslySetInnerHTML={{ __html: deepHtml }}
          />
        </TabsContent>
      </Tabs>
      {code && (
        <div className="mt-6">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">
            <div className="h-1 w-1 bg-primary" /> Referência em Código
          </div>
          <pre className="text-xs leading-relaxed overflow-x-auto bg-zinc-950 text-zinc-50 p-4 font-mono border-2 border-border">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
