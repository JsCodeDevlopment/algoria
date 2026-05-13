"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextInput } from "../../content/_components/form-elements";

interface Feature {
  id: string;
  label: string;
  planId: string;
}

interface FeatureManagerProps {
  planId: string;
  features: Feature[];
  onAdd: (planId: string, label: string) => Promise<void>;
  onRemove: (id: string, planId: string) => Promise<void>;
  onUpdate: (id: string, label: string, planId: string) => Promise<void>;
}

export function FeatureManager({ 
  planId, 
  features, 
  onAdd, 
  onRemove, 
  onUpdate 
}: FeatureManagerProps) {
  const [newLabel, setNewLabel] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  async function handleAdd() {
    if (!newLabel.trim()) return;
    await onAdd(planId, newLabel.trim());
    setNewLabel("");
  }

  return (
    <div className="space-y-3 mt-6 border-t border-border pt-6">
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Vantagens Manuais</h4>
      
      <div className="space-y-2">
        {features.map((f) => (
          <div key={f.id} className="flex items-center justify-between gap-2 group min-h-[32px]">
            <div className="flex-1">
              {editingId === f.id ? (
                <div className="flex items-center gap-2">
                  <TextInput 
                    value={f.label} 
                    onChange={(v) => onUpdate(f.id, v, planId)}
                    className="h-8 text-xs"
                    autoFocus
                  />
                  <button 
                    onClick={() => setEditingId(null)}
                    className="p-1.5 bg-primary text-primary-foreground"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-foreground/80">
                  <div className="h-1 w-1 bg-primary/40" />
                  {f.label}
                </div>
              )}
            </div>
            
            {!editingId && (
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onClick={() => setEditingId(f.id)}
                  className="p-1 text-primary hover:bg-primary/10"
                >
                  <Edit2 className="h-3 w-3" />
                </button>
                <button 
                  onClick={() => onRemove(f.id, planId)}
                  className="p-1 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <TextInput 
          placeholder="Nova vantagem manual..." 
          value={newLabel} 
          onChange={setNewLabel}
          className="h-8 text-xs"
        />
        <Button onClick={handleAdd} size="sm" className="h-8 px-3">
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
