'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Props {
  statement: React.ReactNode;
  strategies: React.ReactNode;
}

/** Enunciado + soluções em separadores (fluxo §7 do plano de produto). */
export function ProblemStudyTabs({ statement, strategies }: Props) {
  return (
    <Tabs defaultValue="statement" className="w-full">
      <TabsList className="flex w-full flex-wrap h-auto gap-1 p-1">
        <TabsTrigger value="statement" className="flex-1 min-w-[8rem]">
          Enunciado
        </TabsTrigger>
        <TabsTrigger value="strategies" className="flex-1 min-w-[8rem]">
          Soluções
        </TabsTrigger>
      </TabsList>
      <TabsContent value="statement" className="mt-6">
        {statement}
      </TabsContent>
      <TabsContent value="strategies" className="mt-6">
        {strategies}
      </TabsContent>
    </Tabs>
  );
}
