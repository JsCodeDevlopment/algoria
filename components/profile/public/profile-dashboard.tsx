import { Award, Code } from "lucide-react";

interface ProfileDashboardProps {
  technologies: string[];
  completedProblems: number;
  solutionsOpened: number;
}

export function ProfileDashboard({
  technologies,
  completedProblems,
  solutionsOpened,
}: ProfileDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      <div className="md:col-span-2 border-2 border-border bg-background/40 p-8 shadow-sm relative overflow-hidden group">
        <div className="flex items-center gap-3 mb-6">
          <Code className="h-4 w-4 text-primary" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            Tecnologias & Skills
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {technologies &&
            technologies.map((tech: string) => (
              <span
                key={tech}
                className="bg-primary/5 text-primary border border-primary/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-primary/10 transition-colors"
              >
                {tech}
              </span>
            ))}
        </div>
      </div>

      <div className="border-2 border-border bg-muted/10 p-8 shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <Award className="h-4 w-4 text-primary" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            Métricas na Algoria
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-3xl font-black tabular-nums">
              {completedProblems}
            </p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              Resolvidos
            </p>
          </div>
          <div>
            <p className="text-3xl font-black tabular-nums">
              {solutionsOpened}
            </p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              Soluções
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
