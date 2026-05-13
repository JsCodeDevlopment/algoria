"use client";

import { Package } from "lucide-react";

interface SummaryItem {
  category?: string;
  label?: string;
  count: number;
}

interface InventorySummaryProps {
  pro: SummaryItem[];
  free: SummaryItem[];
}

export function InventorySummary({ pro, free }: InventorySummaryProps) {
  if (pro.length === 0 && free.length === 0) return null;

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-black uppercase tracking-widest text-primary">Resumo do Conteúdo (Referência)</h3>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* PRO */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-primary uppercase">Plano Pro</div>
          <div className="flex flex-wrap gap-2">
            {pro.map((s) => (
              <div key={s.category} className="flex items-center gap-2 bg-background/50 px-2 py-1 border border-primary/10">
                <span className="text-xs font-bold text-foreground">{s.count}</span>
                <span className="text-[10px] uppercase tracking-tight text-muted-foreground">{s.category}</span>
              </div>
            ))}
            {pro.length === 0 && <span className="text-[10px] italic text-muted-foreground">Nenhum conteúdo Pro</span>}
          </div>
        </div>

        {/* FREE */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-muted-foreground uppercase">Plano Free</div>
          <div className="flex flex-wrap gap-2">
            {free.map((s) => (
              <div key={s.label} className="flex items-center gap-2 bg-background/50 px-2 py-1 border border-border">
                <span className="text-xs font-bold text-foreground">{s.count}</span>
                <span className="text-[10px] uppercase tracking-tight text-muted-foreground">{s.label}</span>
              </div>
            ))}
            {free.length === 0 && <span className="text-[10px] italic text-muted-foreground">Nenhum conteúdo Free</span>}
          </div>
        </div>
      </div>

      <p className="text-[9px] text-muted-foreground italic border-t border-primary/10 pt-2">
        Use estes números como base para escrever as vantagens manuais abaixo.
      </p>
    </div>
  );
}
