import { BookOpen, Code, Code2, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import type { Project } from "@/components/profile/profile-sections";

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 px-2">
        <div className="h-[2px] flex-1 bg-border" />
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-3 shrink-0">
          <BookOpen className="h-4 w-4" /> Projetos & Open Source
        </h2>
        <div className="h-[2px] flex-1 bg-border" />
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((proj, idx) => (
            <Card
              key={idx}
              className="group border-2 border-border bg-background/40 hover:border-primary transition-all duration-500 rounded-none overflow-hidden flex flex-col shadow-[8px_8px_0_0_rgba(0,0,0,0.03)] hover:shadow-[12px_12px_0_0_rgba(var(--primary-rgb),0.08)] relative"
            >
              <div className="absolute top-3 left-3 z-20 pointer-events-none">
                <span className="font-mono text-[9px] font-black uppercase tracking-widest bg-primary text-primary-foreground px-2 py-0.5 shadow-sm">
                  #{String(idx + 1).padStart(2, "0")}
                </span>
              </div>

              {proj.imageUrl && (
                <div className="relative h-56 w-full border-b-2 border-border overflow-hidden">
                  <Image
                    src={proj.imageUrl}
                    alt={proj.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out"
                  />
                </div>
              )}

              <div className="p-8 flex flex-col flex-1">
                <h3 className="font-black uppercase tracking-tighter text-2xl group-hover:text-primary transition-colors leading-none mb-4">
                  {proj.title}
                </h3>

                <p className="text-sm text-muted-foreground flex-1 leading-relaxed font-medium">
                  {proj.description}
                </p>

                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-border">
                    {proj.technologies.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[9px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {(proj.githubUrl || proj.deployUrl) && (
                <div className="grid grid-cols-2 border-t border-border">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-muted border-r border-border ${
                        !proj.deployUrl ? "col-span-2 border-r-0" : ""
                      }`}
                    >
                      <Code2 className="h-4 w-4" /> Repositório
                    </a>
                  )}
                  {proj.deployUrl && (
                    <a
                      href={proj.deployUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-primary hover:text-primary-foreground ${
                        !proj.githubUrl ? "col-span-2" : ""
                      }`}
                    >
                      <ExternalLink className="h-4 w-4" /> Live Demo
                    </a>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border opacity-50">
          <Code className="h-12 w-12 mb-4" />
          <p className="text-xs font-black uppercase tracking-[0.2em]">
            Nenhum projeto externo listado
          </p>
        </div>
      )}
    </div>
  );
}
