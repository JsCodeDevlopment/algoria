import { getPricingPlans, getPricingInventory } from "@/lib/actions/admin";
import { PricingManagerClient } from "./pricing-manager-client";

export default async function AdminPricingPage() {
  const plans = await getPricingPlans();
  const inventory = await getPricingInventory();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Planos & Preços
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie os textos dos planos, benefícios manuais e o catálogo de conteúdos Pro.
        </p>
      </div>

      <PricingManagerClient 
        initialPlans={JSON.parse(JSON.stringify(plans))} 
        initialInventory={JSON.parse(JSON.stringify(inventory))} 
      />
    </div>
  );
}
