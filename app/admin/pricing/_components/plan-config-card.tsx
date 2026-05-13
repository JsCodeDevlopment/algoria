"use client";

import { FormField, TextInput } from "../../content/_components/form-elements";
import { FeatureManager } from "./feature-manager";

interface Plan {
  id: string;
  title: string;
  description: string | null;
  priceDisplay: string | null;
  yearlyNote: string | null;
}

interface Feature {
  id: string;
  label: string;
  planId: string;
}

interface PlanConfigCardProps {
  plan: Plan;
  features: Feature[];
  onUpdate: (id: string, field: keyof Plan, value: string) => Promise<void>;
  onAddFeature: (planId: string, label: string) => Promise<void>;
  onRemoveFeature: (id: string, planId: string) => Promise<void>;
  onUpdateFeature: (id: string, label: string, planId: string) => Promise<void>;
}

export function PlanConfigCard({ 
  plan, 
  features, 
  onUpdate, 
  onAddFeature, 
  onRemoveFeature, 
  onUpdateFeature 
}: PlanConfigCardProps) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-6 flex flex-col h-full">
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className={`h-8 w-8 flex items-center justify-center rounded-none font-black text-xs ${
            plan.id === 'pro' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            {plan.id.toUpperCase()}
          </div>
          <h3 className="font-bold text-foreground">Configurações {plan.id === 'pro' ? 'Pro' : 'Free'}</h3>
        </div>

        <FormField label="Título do Plano">
          <TextInput 
            value={plan.title} 
            onChange={(v) => onUpdate(plan.id, "title", v)} 
          />
        </FormField>

        <FormField label="Descrição">
          <TextInput 
            value={plan.description || ""} 
            onChange={(v) => onUpdate(plan.id, "description", v)} 
          />
        </FormField>

        {plan.id === 'pro' && (
          <>
            <FormField label="Preço de Exibição">
              <TextInput 
                value={plan.priceDisplay || ""} 
                onChange={(v) => onUpdate(plan.id, "priceDisplay", v)} 
                placeholder="ex: 19€"
              />
            </FormField>
            <FormField label="Nota de Valor/Desconto">
              <TextInput 
                value={plan.yearlyNote || ""} 
                onChange={(v) => onUpdate(plan.id, "yearlyNote", v)} 
                placeholder="ex: Ou 190€/ano"
              />
            </FormField>
          </>
        )}
      </div>

      <FeatureManager 
        planId={plan.id}
        features={features}
        onAdd={onAddFeature}
        onRemove={onRemoveFeature}
        onUpdate={onUpdateFeature}
      />
    </div>
  );
}
