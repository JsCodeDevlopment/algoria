"use client";

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";

const AVAILABLE_TECHS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Vue",
  "Angular",
  "Node.js",
  "Python",
  "Go",
  "Rust",
  "Java",
  "C#",
  "C++",
  "PHP",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
  "TailwindCSS",
  "Prisma",
  "Drizzle",
  "GraphQL",
  "Nest.js",
  "Express",
  "FastAPI",
  "Django",
  "Flask",
  "Spring Boot",
  "Laravel",
  "Rails",
  "React Native",
  "Flutter",
  "Ionic",
  "Swift",
  "Kotlin",
  "Kotlin",
  "Svelte",
  "Zustand",
  "Supabase",
  "N8N",
  "RabbitMQ",
].sort();

interface Props {
  initialTechs?: string[] | null;
}

export function TechSelect({ initialTechs }: Props) {
  const [selected, setSelected] = useState<string[]>(initialTechs || []);

  const toggleTech = (tech: string) => {
    if (selected.includes(tech)) {
      setSelected(selected.filter((t) => t !== tech));
    } else {
      setSelected([...selected, tech]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border border-border bg-background/50">
        {selected.length > 0 ? (
          selected.map((tech) => (
            <Badge
              key={tech}
              variant="default"
              className="rounded-none gap-1 py-1 font-bold"
            >
              {tech}
              <button
                type="button"
                onClick={() => toggleTech(tech)}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        ) : (
          <span className="text-xs text-muted-foreground italic">
            Nenhuma tecnologia selecionada...
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {AVAILABLE_TECHS.map((tech) => {
          const isSelected = selected.includes(tech);
          return (
            <button
              key={tech}
              type="button"
              onClick={() => toggleTech(tech)}
              className={`
                px-2 py-1.5 text-[10px] font-black uppercase tracking-widest border transition-all
                ${
                  isSelected
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-muted/10 border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }
              `}
            >
              {tech}
            </button>
          );
        })}
      </div>

      <input type="hidden" name="technologies" value={selected.join(",")} />
    </div>
  );
}
