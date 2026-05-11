'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { requestCreatorRole } from '@/lib/actions/user';
import { Check, Sparkles } from 'lucide-react';

export function BecomeCreatorButton({ status }: { status: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED' }) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleRequest = () => {
    startTransition(async () => {
      const result = await requestCreatorRole();
      if (result.error) {
        setFeedback({ type: 'error', msg: result.error });
      } else {
        setFeedback({ type: 'success', msg: 'Solicitação enviada!' });
      }
    });
  };

  if (status === 'PENDING') {
    return (
      <div className="flex w-full items-center justify-center gap-2 border-2 border-amber-500/20 bg-amber-500/5 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-amber-600">
        <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
        Solicitação em Análise
      </div>
    );
  }

  if (status === 'APPROVED') {
    return (
      <div className="flex w-full items-center justify-center gap-2 border-2 border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
        <Check className="h-3 w-3" />
        Criador Aprovado
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleRequest}
        disabled={isPending || status === 'PENDING'}
        className="w-full h-12 rounded-none font-black uppercase tracking-widest text-[10px] border-2 border-primary gap-2 bg-primary hover:bg-primary/90"
      >
        <Sparkles className="h-3.5 w-3.5" />
        {isPending ? 'Enviando...' : 'Me Tornar Criador'}
      </Button>
      {feedback && (
        <p className={`text-[9px] font-bold uppercase text-center ${feedback.type === 'success' ? 'text-emerald-600' : 'text-destructive'}`}>
          {feedback.msg}
        </p>
      )}
    </div>
  );
}
