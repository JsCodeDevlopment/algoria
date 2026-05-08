"use client";

import { Code, Code2, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Project } from "./types";

interface ProjectsManagerProps {
  projects: Project[];
  loadingGithub: boolean;
  onAddProject: () => void;
  onRemoveProject: (index: number) => void;
  onUpdateProject: (index: number, field: keyof Project, value: any) => void;
  onFetchGithub: () => void;
}

export function ProjectsManager({
  projects,
  loadingGithub,
  onAddProject,
  onRemoveProject,
  onUpdateProject,
  onFetchGithub,
}: ProjectsManagerProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-foreground">
            <Code className="h-5 w-5" /> Projetos Externos & Open Source
          </h3>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight mt-1">
            Projetos pessoais ou importados do teu GitHub.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onFetchGithub}
            disabled={loadingGithub}
            className="h-9 rounded-none gap-2 text-[10px] uppercase font-black border-primary/30 text-primary"
          >
            {loadingGithub ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Code2 className="h-4 w-4" />
            )}
            Importar GitHub
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddProject}
            className="h-9 rounded-none gap-2 text-[10px] uppercase font-black"
          >
            <Plus className="h-4 w-4" /> Novo Projeto
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((proj, i) => (
          <div
            key={i}
            className="relative group space-y-4 border-2 border-border p-6 bg-muted/5 transition-colors hover:border-primary/30"
          >
            <button
              type="button"
              onClick={() => onRemoveProject(i)}
              className="absolute -top-3 -right-3 h-6 w-6 flex items-center justify-center bg-destructive text-white rounded-none opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-3 w-3" />
            </button>
            <Input
              placeholder="Título do Projeto"
              value={proj.title}
              onChange={(e) => onUpdateProject(i, "title", e.target.value)}
              className="rounded-none border-border font-bold uppercase tracking-tight"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Link do Repositório (GitHub)"
                value={proj.githubUrl}
                onChange={(e) => onUpdateProject(i, "githubUrl", e.target.value)}
                className="rounded-none border-border"
              />
              <Input
                placeholder="Link do Deploy / Site"
                value={proj.deployUrl}
                onChange={(e) => onUpdateProject(i, "deployUrl", e.target.value)}
                className="rounded-none border-border"
              />
            </div>
            <Input
              placeholder="Thumbnail (URL da Imagem)"
              value={proj.imageUrl || ""}
              onChange={(e) => onUpdateProject(i, "imageUrl", e.target.value)}
              className="rounded-none border-border"
            />
            <Input
              placeholder="Tecnologias (separadas por vírgula)"
              value={proj.technologies.join(", ")}
              onChange={(e) =>
                onUpdateProject(
                  i,
                  "technologies",
                  e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                )
              }
              className="rounded-none border-border"
            />
            <textarea
              placeholder="Descrição rápida do que o projeto faz"
              value={proj.description}
              onChange={(e) => onUpdateProject(i, "description", e.target.value)}
              className="w-full rounded-none border border-border bg-background px-3 py-2 text-sm h-24"
            />
          </div>
        ))}
      </div>
      <input type="hidden" name="projects" value={JSON.stringify(projects)} />
    </div>
  );
}
