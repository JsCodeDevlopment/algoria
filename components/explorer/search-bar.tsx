"use client";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce"; // I'll check if this exists or create it
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const currentQuery = searchParams.get("q") || "";
    if (debouncedQuery === currentQuery) return;

    const params = new URLSearchParams(searchParams);
    if (debouncedQuery) {
      params.set("q", debouncedQuery);
    } else {
      params.delete("q");
    }
    params.set("page", "1");

    startTransition(() => {
      router.push(`/explorer?${params.toString()}`);
    });
  }, [debouncedQuery, router, searchParams]);

  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
        <Search size={18} />
      </div>
      <Input
        placeholder="PROCURAR POR NOME OU HEADLINE..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-14 pl-12 pr-12 rounded-none border-2 border-border bg-background/50 font-black uppercase tracking-widest text-sm focus-visible:ring-0 focus-visible:border-primary transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.05)]"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={18} />
        </button>
      )}
      {isPending && (
        <div className="absolute -bottom-1 left-0 h-0.5 bg-primary animate-pulse w-full" />
      )}
    </div>
  );
}
