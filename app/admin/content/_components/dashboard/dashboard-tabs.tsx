'use client';

import { cn } from "@/lib/utils";

interface DashboardTabsProps {
  tab: 'editorial' | 'sistema';
  onTabChange: (tab: 'editorial' | 'sistema') => void;
  isAdmin: boolean;
}

export function DashboardTabs({ tab, onTabChange, isAdmin }: DashboardTabsProps) {
  if (!isAdmin) return null;

  return (
    <div className="flex gap-1 rounded-lg border border-border bg-secondary/30 p-1">
      <button
        onClick={() => onTabChange('editorial')}
        className={cn(
          "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors",
          tab === 'editorial'
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        📝 Editorial
        <span className="ml-1.5 text-xs text-muted-foreground">Criável</span>
      </button>
      <button
        onClick={() => onTabChange('sistema')}
        className={cn(
          "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors",
          tab === 'sistema'
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        ⚙️ Sistema
        <span className="ml-1.5 text-xs text-muted-foreground">Apenas edição</span>
      </button>
    </div>
  );
}
