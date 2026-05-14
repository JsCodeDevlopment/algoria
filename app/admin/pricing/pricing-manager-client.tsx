"use client";

import {
  addPricingFeature,
  getPricingFeatures,
  getPricingSummary,
  removePricingFeature,
  syncAllProContent,
  updateContentAccess,
  updateInventoryCategory,
  updatePricingFeature,
  updatePricingPlan,
} from "@/lib/actions/admin";
import { useEffect, useState, useTransition } from "react";
import {
  CATEGORY_OPTIONS,
  EDITORIAL_TYPES,
} from "../content/_components/dashboard/dashboard-types";
import { InventorySummary } from "./_components/inventory-summary";
import { InventoryTable } from "./_components/inventory-table";
import { PlanConfigCard } from "./_components/plan-config-card";

interface Plan {
  id: string;
  title: string;
  description: string | null;
  priceDisplay: string | null;
  yearlyNote: string | null;
}

interface InventoryItem {
  id: string;
  contentId: string;
  pricingCategory: string;
  contentTitle: string;
  contentType: string;
  contentSlug: string;
  metadata?: unknown;
}

interface Feature {
  id: string;
  label: string;
  planId: string;
}

interface PricingSummary {
  pro: { category: string; count: number }[];
  free: { label: string; count: number }[];
}

interface PricingManagerClientProps {
  initialPlans: Plan[];
  initialInventory: InventoryItem[];
}

export function PricingManagerClient({
  initialPlans,
  initialInventory,
}: PricingManagerClientProps) {
  const [activeTab, setActiveTab] = useState<"plans" | "inventory">("plans");
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [isPending, startTransition] = useTransition();

  const [freeFeatures, setFreeFeatures] = useState<Feature[]>([]);
  const [proFeatures, setProFeatures] = useState<Feature[]>([]);
  const [summary, setSummary] = useState<PricingSummary>({ pro: [], free: [] });

  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      const [free, pro, summ] = await Promise.all([
        getPricingFeatures("free"),
        getPricingFeatures("pro"),
        getPricingSummary(),
      ]);
      setFreeFeatures(free as Feature[]);
      setProFeatures(pro as Feature[]);
      setSummary(summ as PricingSummary);
    }
    loadData();
  }, []);

  // Filtered inventory based on algorithm category and content type
  const filteredInventory = inventory.filter((item) => {
    // Type filter
    if (typeFilter && item.contentType !== typeFilter) return false;

    // Category filter
    if (categoryFilter) {
      const meta = item.metadata as { categories?: string[] } | undefined;
      const categories = meta?.categories;
      if (!Array.isArray(categories) || !categories.includes(categoryFilter)) {
        return false;
      }
    }

    return true;
  });

  async function handleAddFeature(planId: string, label: string) {
    startTransition(async () => {
      await addPricingFeature(planId, "manual", label);
      const updated = await getPricingFeatures(planId);
      if (planId === "free") setFreeFeatures(updated as Feature[]);
      else setProFeatures(updated as Feature[]);
    });
  }

  async function handleRemoveFeature(id: string, planId: string) {
    startTransition(async () => {
      await removePricingFeature(id);
      const updated = await getPricingFeatures(planId);
      if (planId === "free") setFreeFeatures(updated as Feature[]);
      else setProFeatures(updated as Feature[]);
    });
  }

  async function handleUpdateFeature(
    id: string,
    label: string,
    planId: string,
  ) {
    // Update local state first for instant feedback
    if (planId === "free") {
      setFreeFeatures(
        freeFeatures.map((f) => (f.id === id ? { ...f, label } : f)),
      );
    } else {
      setProFeatures(
        proFeatures.map((f) => (f.id === id ? { ...f, label } : f)),
      );
    }

    startTransition(async () => {
      await updatePricingFeature(id, label);
    });
  }

  async function handleUpdatePlan(
    id: string,
    field: keyof Plan,
    value: string,
  ) {
    const updatedPlans = plans.map((p) =>
      p.id === id ? { ...p, [field]: value } : p,
    );
    setPlans(updatedPlans);

    startTransition(async () => {
      await updatePricingPlan(id, { [field]: value });
    });
  }

  async function handleUpdateCategory(id: string, category: string) {
    startTransition(async () => {
      await updateInventoryCategory(id, category);
      setInventory(
        inventory.map((item) =>
          item.id === id ? { ...item, pricingCategory: category } : item,
        ),
      );
      // Refresh summary
      const summ = await getPricingSummary();
      setSummary(summ as PricingSummary);
    });
  }

  async function handleMakeFree(contentId: string) {
    startTransition(async () => {
      await updateContentAccess(contentId, "free");
      // Update local state: remove from inventory
      setInventory(inventory.filter((item) => item.contentId !== contentId));
      // Refresh summary
      const summ = await getPricingSummary();
      setSummary(summ as PricingSummary);
    });
  }

  async function handleSync() {
    startTransition(async () => {
      const res = await syncAllProContent();
      if (res.success) {
        window.location.reload();
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("plans")}
          className={`px-6 py-3 text-sm font-bold transition-all ${
            activeTab === "plans"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Configurações dos Planos
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          className={`px-6 py-3 text-sm font-bold transition-all ${
            activeTab === "inventory"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Inventário Pro ({inventory.length})
        </button>
      </div>

      {activeTab === "plans" ? (
        <div className="space-y-8">
          <InventorySummary pro={summary.pro} free={summary.free} />

          <div className="grid gap-6 lg:grid-cols-2">
            {plans.map((plan) => (
              <PlanConfigCard
                key={plan.id}
                plan={plan}
                features={plan.id === "free" ? freeFeatures : proFeatures}
                onUpdate={handleUpdatePlan}
                onAddFeature={handleAddFeature}
                onRemoveFeature={handleRemoveFeature}
                onUpdateFeature={handleUpdateFeature}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label
                htmlFor="type-filter"
                className="text-sm font-medium text-muted-foreground"
              >
                Tipo:
              </label>
              <select
                id="type-filter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              >
                {EDITORIAL_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <label
                htmlFor="cat-filter"
                className="text-sm font-medium text-muted-foreground ml-2"
              >
                Categoria:
              </label>
              <select
                id="cat-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {(categoryFilter || typeFilter) && (
                <span className="text-xs text-muted-foreground italic">
                  Mostrando {filteredInventory.length} de {inventory.length}{" "}
                  itens
                </span>
              )}
            </div>
          </div>

          <InventoryTable
            items={filteredInventory}
            isPending={isPending}
            onUpdateCategory={handleUpdateCategory}
            onSync={handleSync}
            onMakeFree={handleMakeFree}
          />
        </div>
      )}
    </div>
  );
}
