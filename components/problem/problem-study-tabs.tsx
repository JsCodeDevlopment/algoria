'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

interface Props {
  statement: React.ReactNode;
  strategies: React.ReactNode;
  onTabVisited?: (tab: string) => void;
}

export function ProblemStudyTabs({ statement, strategies, onTabVisited }: Props) {
  const [, setVisited] = useState<Set<string>>(new Set(['statement']));

  const handleValueChange = (value: string) => {
    setVisited((prev) => {
      const next = new Set(prev);
      next.add(value);
      return next;
    });
    onTabVisited?.(value);
  };

  return (
    <Tabs defaultValue="statement" className="w-full" onValueChange={handleValueChange}>
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
