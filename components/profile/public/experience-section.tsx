import type { Experience } from "@/components/profile/profile-sections";
import { Briefcase, ExternalLink, Link2 } from "lucide-react";
import Image from "next/image";

interface ExperienceSectionProps {
  experiences: Experience[];
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date
      .toLocaleDateString("pt-PT", { month: "short", year: "numeric" })
      .replace(".", "");
  };

  const getRoleDuration = (
    startDateStr: string,
    endDateStr: string,
    isCurrent: boolean,
  ) => {
    if (!startDateStr) return "";
    const startDate = new Date(startDateStr);
    const endDate = isCurrent
      ? new Date()
      : endDateStr
        ? new Date(endDateStr)
        : new Date();

    const months =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth()) +
      1;
    if (months <= 0) return "";

    const years = Math.floor(months / 12);
    const remMonths = months % 12;

    let durationStr = "";
    if (years > 0) durationStr += `${years}a `;
    if (remMonths > 0) durationStr += `${remMonths}m`;
    else if (years === 0) durationStr = `${remMonths}m`;

    return durationStr;
  };

  const getTotalDuration = (exp: Experience) => {
    let minDate: Date | null = null;
    let maxDate: Date | null = null;
    let hasCurrent = false;

    for (const role of exp.roles) {
      if (role.startDate) {
        const d = new Date(role.startDate);
        if (!minDate || d < minDate) minDate = d;
      }
      if (role.current) {
        hasCurrent = true;
      } else if (role.endDate) {
        const d = new Date(role.endDate);
        if (!maxDate || d > maxDate) maxDate = d;
      }
    }

    if (!minDate) return null;
    const finalMaxDate = hasCurrent ? new Date() : maxDate || new Date();

    let months = (finalMaxDate.getFullYear() - minDate.getFullYear()) * 12;
    months += finalMaxDate.getMonth() - minDate.getMonth();
    months += 1;
    if (months <= 0) return null;

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    const parts = [];
    if (years > 0) parts.push(`${years} ${years === 1 ? "ano" : "anos"}`);
    if (remainingMonths > 0)
      parts.push(
        `${remainingMonths} ${remainingMonths === 1 ? "mês" : "meses"}`,
      );

    return parts.join(" e ");
  };

  return (
    <div className="space-y-8 mb-20">
      <div className="flex items-center gap-4 px-2">
        <div className="h-[2px] flex-1 bg-border" />
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-3 shrink-0">
          <Briefcase className="h-4 w-4" /> Experiência Profissional
        </h2>
        <div className="h-[2px] flex-1 bg-border" />
      </div>

      <div className="space-y-12">
        {experiences.map((exp, idx) => {
          const totalDuration = getTotalDuration(exp);
          return (
            <div
              key={idx}
              className="relative pl-8 md:pl-12 border-l-2 border-border ml-4 md:ml-6 group hover:border-primary transition-colors pb-4"
            >
              <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-none border-2 border-border bg-background group-hover:border-primary group-hover:bg-primary transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.05)]" />

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">
                    {exp.company}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                      <Link2 className="h-3.3" /> {exp.location}
                    </p>
                    {totalDuration && (
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/70">
                        • {totalDuration} no total
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                {exp.roles.map((role, rIdx) => {
                  const durationStr = getRoleDuration(
                    role.startDate,
                    role.endDate,
                    role.current,
                  );
                  const periodStr = role.current
                    ? `${formatDate(role.startDate)} — Presente`
                    : `${formatDate(role.startDate)} — ${formatDate(role.endDate)}`;

                  return (
                    <div key={rIdx} className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                        <h4 className="text-lg font-black uppercase tracking-tight text-primary/90">
                          {role.title}
                        </h4>
                        <div className="flex items-center gap-2 shrink-0">
                          {durationStr && (
                            <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2 py-1">
                              {durationStr}
                            </span>
                          )}
                          <span className="font-mono text-[10px] font-bold bg-muted px-3 py-1 uppercase tracking-widest">
                            {periodStr}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap max-w-5xl">
                        {role.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {exp.projects && exp.projects.length > 0 && (
                <div className="mt-12 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-px bg-border flex-1" />
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 shrink-0">
                      Projetos em Destaque na {exp.company}
                    </h5>
                    <div className="h-px bg-border flex-1" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {exp.projects.map((p, pIdx) => (
                      <div
                        key={pIdx}
                        className="group/iproj border-2 border-border bg-background/40 overflow-hidden hover:border-primary transition-all duration-300 shadow-sm relative flex flex-col"
                      >
                        {p.imageUrl && (
                          <div className="relative h-52 w-full border-b-2 border-border overflow-hidden">
                            <Image
                              src={p.imageUrl}
                              alt={p.title}
                              fill
                              className="object-cover grayscale group-hover/iproj:grayscale-0 group-hover/iproj:scale-105 transition-all duration-700 ease-in-out"
                            />
                          </div>
                        )}
                        <div className="p-6 flex-1">
                          <h6 className="font-black uppercase tracking-tight text-base group-hover/iproj:text-primary transition-colors mb-3">
                            {p.title}
                          </h6>
                          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed font-medium">
                            {p.description}
                          </p>
                        </div>

                        {p.link && (
                          <div className="px-6 py-4 border-t border-border bg-muted/5 flex justify-end">
                            <a
                              href={p.link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors group/link"
                            >
                              Visitar Projeto
                              <ExternalLink className="h-3 w-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
