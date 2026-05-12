"use client";

import { ChevronDown, ChevronUp, PlusCircle } from "lucide-react";
import { useState } from "react";
import { TextInput } from "../../form-elements";

interface TopicSelectorProps {
  value: string;
  onChange: (v: string) => void;
  existingTopics: string[];
}

export function TopicSelector({
  value,
  onChange,
  existingTopics,
}: TopicSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredTopics = existingTopics.filter((t) =>
    t.toLowerCase().includes(search.toLowerCase()),
  );

  const canCreate =
    search &&
    !existingTopics.some((t) => t.toLowerCase() === search.toLowerCase());

  return (
    <div className="relative">
      <div className="relative">
        <TextInput
          value={isOpen ? search : value}
          onChange={(v) => {
            setSearch(v);
            if (!isOpen) setIsOpen(true);
          }}
          placeholder="Buscar ou criar categoria/tópico..."
        />
        <div className="absolute right-3 top-2.5 flex items-center gap-2">
          <button type="button" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-[100] mt-1 w-full rounded-lg border border-primary/30 bg-[#0a0a0a]/50 p-1 shadow-[0_20px_50px_rgba(0,0,0,1)] animate-in fade-in zoom-in-95 ring-1 ring-primary/20">
          <div className="max-h-[200px] overflow-y-auto bg-[#0a0a0a]/50">
            {filteredTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => {
                  onChange(topic);
                  setSearch("");
                  setIsOpen(false);
                }}
                className="flex w-full items-center px-3 py-2.5 text-sm font-bold text-white hover:bg-primary hover:text-primary-foreground rounded-md text-left transition-all"
              >
                {topic}
              </button>
            ))}

            {canCreate && (
              <button
                type="button"
                onClick={() => {
                  onChange(search);
                  setSearch("");
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-md text-left border-t border-border mt-1"
              >
                <PlusCircle className="h-4 w-4" />
                Criar &quot;{search}&quot;
              </button>
            )}

            {filteredTopics.length === 0 && !canCreate && (
              <div className="p-3 text-xs text-muted-foreground text-center">
                Digite para criar um novo tópico
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
