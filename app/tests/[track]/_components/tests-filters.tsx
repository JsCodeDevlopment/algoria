"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

interface TestsFiltersProps {
  track: string;
  availableLevels: string[];
  availableTopics: string[];
  availableDifficulties: string[];
}

export function TestsFilters({
  track,
  availableLevels,
  availableTopics,
  availableDifficulties,
}: TestsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentLevel = searchParams.get("level");
  const currentTopic = searchParams.get("topic");
  const currentDifficulty = searchParams.get("difficulty");
  const currentQ = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(currentQ);
  const [prevQ, setPrevQ] = useState(currentQ);

  // Sync state with URL when it changes externally (e.g. back button)
  // We do this during render to avoid cascading effects and lint errors
  if (currentQ !== prevQ) {
    setPrevQ(currentQ);
    setSearchTerm(currentQ);
  }

  const updateFilters = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      let hasChanges = false;

      Object.entries(updates).forEach(([key, value]) => {
        const currentValue = params.get(key);
        const newValue = value === "all" ? undefined : value;

        if (newValue === undefined) {
          if (params.has(key)) {
            params.delete(key);
            hasChanges = true;
          }
        } else if (currentValue !== newValue) {
          params.set(key, newValue);
          hasChanges = true;
        }
      });

      if (!hasChanges) return;

      startTransition(() => {
        router.push(`/tests/${track}?${params.toString()}`);
      });
    },
    [track, searchParams, router],
  );

  useEffect(() => {
    // Only trigger if searchTerm is different from what's in the URL
    const urlSearchTerm = searchParams.get("q") || "";
    if (searchTerm === urlSearchTerm) return;

    const delayDebounceFn = setTimeout(() => {
      updateFilters({ q: searchTerm || undefined });
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, updateFilters, searchParams]);

  const clearFilters = () => {
    setSearchTerm("");
    if (searchParams.toString() !== "") {
      router.push(`/tests/${track}`);
    }
  };

  const hasActiveFilters =
    currentLevel || currentTopic || currentDifficulty || searchTerm;

  return (
    <div className="space-y-6 mb-12">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Procurar por título ou tecnologia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-12 rounded-none border-2 border-border bg-background/50 focus:bg-background transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="h-12 rounded-none text-[10px] font-black uppercase tracking-widest text-destructive hover:bg-destructive/5"
          >
            Limpar Filtros
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">
            Sénioridade
          </label>
          <select
            value={currentLevel || "all"}
            onChange={(e) => updateFilters({ level: e.target.value })}
            className="h-11 w-full bg-background border-2 border-border px-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-primary transition-all appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='C19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1rem",
            }}
          >
            <option value="all">Todos os Níveis</option>
            {availableLevels.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">
            Tópico / Área
          </label>
          <select
            value={currentTopic || "all"}
            onChange={(e) => updateFilters({ topic: e.target.value })}
            className="h-11 w-full bg-background border-2 border-border px-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-primary transition-all appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='C19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1rem",
            }}
          >
            <option value="all">Todos os Tópicos</option>
            {availableTopics.sort().map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">
            Dificuldade
          </label>
          <select
            value={currentDifficulty || "all"}
            onChange={(e) => updateFilters({ difficulty: e.target.value })}
            className="h-11 w-full bg-background border-2 border-border px-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-primary transition-all appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='C19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1rem",
            }}
          >
            <option value="all">Todas as Dificuldades</option>
            {availableDifficulties.map((d) => (
              <option key={d} value={d}>
                {d.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isPending && (
        <div className="flex items-center gap-2 text-[9px] font-bold text-primary animate-pulse uppercase tracking-[0.3em]">
          <div className="h-1.5 w-1.5 rounded-none bg-primary" /> Atualizando
          resultados...
        </div>
      )}
    </div>
  );
}
