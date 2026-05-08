import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  calculateTotalExperienceMonths,
  formatExperienceString,
} from "@/lib/profile/profile-utils";
import { Calendar, Code2, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

interface UserCardProps {
  user: {
    id: string;
    name: string;
    image: string | null;
    headline: string | null;
    technologies: string[] | null;
    experiences: string | null;
  };
}

export const UserCard = memo(function UserCard({ user }: UserCardProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const parsedExperiences = user.experiences
    ? JSON.parse(user.experiences)
    : [];
  const totalMonths = calculateTotalExperienceMonths(parsedExperiences);
  const expString =
    totalMonths > 0 ? formatExperienceString(totalMonths) : null;

  return (
    <Link href={`/user/${user.id}`} className="group block">
      <Card className="relative h-full overflow-hidden border-2 border-border bg-background/50 p-6 transition-all duration-300 hover:border-primary hover:shadow-[8px_8px_0_0_rgba(var(--primary-rgb),0.1)] rounded-none">
        <div className="absolute -right-4 -top-4 opacity-[0.03] transition-opacity group-hover:opacity-[0.08]">
          <Code2 size={120} />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 shrink-0 border-2 border-primary/30 p-1.5 transition-all duration-500 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]">
              <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] opacity-20" />

              <div className="relative h-full w-full bg-muted overflow-hidden flex items-center justify-center border border-primary/10">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    fill
                    className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-125"
                  />
                ) : (
                  <span className="text-2xl font-black text-primary/40 group-hover:text-primary transition-colors">
                    {initials}
                  </span>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tighter text-foreground transition-colors group-hover:text-primary leading-none">
                {user.name}
              </h3>
              {expString && (
                <div className="mt-2 flex items-center gap-1.5">
                  <Calendar size={10} className="text-primary" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary/80">
                    {expString}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80 leading-relaxed border-l-2 border-primary/20 pl-3">
              {user.headline || "Explorador Algoria"}
            </p>
          </div>

          <div className="h-px bg-border/50" />

          <div className="flex flex-wrap gap-1.5 h-[60px] overflow-hidden content-start">
            {user.technologies && user.technologies.length > 0 ? (
              user.technologies.slice(0, 6).map((tech) => (
                <Badge
                  key={tech}
                  variant="outline"
                  className="rounded-none border-border bg-muted/30 px-2 py-0 text-[9px] font-black uppercase tracking-widest text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-primary/70"
                >
                  {tech}
                </Badge>
              ))
            ) : (
              <span className="text-[10px] font-medium italic text-muted-foreground/40 mt-1">
                Nenhuma tecnologia listada
              </span>
            )}
            {user.technologies && user.technologies.length > 6 && (
              <span className="text-[9px] font-black text-muted-foreground/40 self-center ml-1">
                +{user.technologies.length - 6}
              </span>
            )}
          </div>

          <div className="flex items-center justify-end pt-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
              Ver Perfil
              <ExternalLink size={12} />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
});
