"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AVAILABLE_TECHS } from "@/lib/technologies";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export function TechFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  
  const selectedTechs = searchParams.get("tech")?.split(",").filter(Boolean) || [];

  const filteredTechs = search 
    ? AVAILABLE_TECHS.filter(t => t.toLowerCase().includes(search.toLowerCase()))
    : AVAILABLE_TECHS.slice(0, 12); // Show some defaults when not searching

  const toggleTech = (tech: string) => {
    const params = new URLSearchParams(searchParams);
    let newTechs = [...selectedTechs];
    
    if (newTechs.includes(tech)) {
      newTechs = newTechs.filter(t => t !== tech);
    } else {
      newTechs.push(tech);
    }

    if (newTechs.length > 0) {
      params.set("tech", newTechs.join(","));
    } else {
      params.delete("tech");
    }
    params.set("page", "1");

    startTransition(() => {
      router.push(`/explorer?${params.toString()}`);
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-2">
          Tecnologias
          {isPending && <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />}
        </h5>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Procurar stack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9 text-[11px] font-bold uppercase tracking-widest bg-background/40 border-border focus:border-primary/50 transition-all rounded-none"
          />
          {search && (
            <button 
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Always show selected techs first */}
        {selectedTechs.map((tech) => (
          <Badge
            key={tech}
            onClick={() => toggleTech(tech)}
            variant="default"
            className="cursor-pointer rounded-none bg-primary text-primary-foreground px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all ring-2 ring-primary/20"
          >
            {tech}
            <X size={10} className="ml-1.5" />
          </Badge>
        ))}

        {/* Show filtered techs that are NOT selected */}
        {filteredTechs
          .filter(t => !selectedTechs.includes(t))
          .map((tech) => (
            <Badge
              key={tech}
              onClick={() => toggleTech(tech)}
              variant="outline"
              className="cursor-pointer rounded-none border-border bg-muted/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all"
            >
              {tech}
            </Badge>
          ))}
      </div>

      {!search && filteredTechs.length < AVAILABLE_TECHS.length && (
        <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest italic">
          Escreve para encontrar mais de {AVAILABLE_TECHS.length} stacks...
        </p>
      )}
    </div>
  );
}
