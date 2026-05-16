import { getContentRepository } from "@/lib/content/content-repository";
import { getAllProblems } from "@/lib/content/loader";
import Link from "next/link";

interface MetricProps {
  label: string;
  value: string;
  hint: string;
  href: string;
}

function Metric({ label, value, hint, href }: MetricProps) {
  return (
    <Link
      href={href}
      className="group w-[220px] shrink-0 border-r border-border bg-background px-6 py-5 text-left transition-colors duration-300 hover:bg-primary hover:border-primary"
    >
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground transition-colors duration-300 group-hover:text-primary-foreground/70">
        {label}
      </p>
      <p className="mt-3 text-4xl font-black tracking-tighter text-foreground transition-colors duration-300 group-hover:text-primary-foreground">
        {value}
      </p>
      <p className="mt-2 line-clamp-1 text-[10px] leading-snug text-muted-foreground transition-colors duration-300 group-hover:text-primary-foreground/60">
        {hint}
      </p>
    </Link>
  );
}

export async function MetricsMarquee() {
  const [problems, counts] = await Promise.all([
    getAllProblems(),
    getContentRepository().getContentCountsByAccess(),
  ]);

  const totalSolutions = problems.reduce(
    (acc, p) => acc + p.solutions.length,
    0,
  );
  const totalByType = (type: string) =>
    (counts.free[type] || 0) + (counts.pro[type] || 0);

  const stats = [
    {
      label: "Problemas",
      value: String(totalByType("problem")),
      hint: "Temas de entrevista",
      href: "/problems",
    },
    {
      label: "Soluções",
      value: String(totalSolutions),
      hint: "Abordagens lado a lado",
      href: "#featured-problems",
    },
    {
      label: "Conceitos",
      value: String(totalByType("concept")),
      hint: "Artigos e fundamentos",
      href: "/concepts",
    },
    {
      label: "Engenharia",
      value: String(totalByType("engineering-work")),
      hint: "Guias práticos de prod",
      href: "/engineering-work",
    },
    {
      label: "Inglês",
      value: String(totalByType("interview-en")),
      hint: "Technical interviews",
      href: "/interview-en",
    },
    {
      label: "Simulados",
      value: String(totalByType("technical-test")),
      hint: "Testes técnicos reais",
      href: "/tests",
    },
    {
      label: "Cursos",
      value: String(totalByType("course")),
      hint: "Trilhas guiadas",
      href: "/course",
    },
    {
      label: "Certificados",
      value: "8",
      hint: "Disponíveis no curso",
      href: "/course",
    },
  ];

  return (
    <section
      aria-label="Escala do catálogo"
      className="relative z-10 border-t border-border bg-muted/40 overflow-hidden"
    >
      <div className="flex animate-marquee hover:[animation-play-state:paused] py-0">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex shrink-0">
            {stats.map((s) => (
              <Metric
                key={`${s.label}-${i}`}
                label={s.label}
                value={s.value}
                hint={s.hint}
                href={s.href}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
