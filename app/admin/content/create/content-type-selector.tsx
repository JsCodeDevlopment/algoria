"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ALL_TYPES = [
  {
    value: "interview-en",
    label: "Interview EN",
    description:
      "Vocabulário técnico, frases e simulações de entrevistas em inglês para engenheiros de software.",
    location: "Academy → Interview English",
    icon: "🌍",
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "hover:border-blue-500/50",
  },
  {
    value: "engineering-work",
    label: "Engenharia",
    description:
      "Guias práticos sobre processos, cultura, carreira e boas práticas no dia-a-dia de engenharia.",
    location: "Academy → Engineering Work",
    icon: "🛠️",
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "hover:border-amber-500/50",
  },
  {
    value: "problem",
    label: "Problema",
    description:
      "Desafios de algoritmos e estruturas de dados com exemplos, constraints e soluções anotadas.",
    location: "Problemas (DSA Playground)",
    icon: "🧩",
    color: "from-emerald-500/20 to-green-500/20",
    borderColor: "hover:border-emerald-500/50",
    adminOnly: true,
  },
  {
    value: "concept",
    label: "Conceito",
    description:
      "Mini-guias teóricos sobre fundamentos de computação: arrays, grafos, complexidade, etc.",
    location: "Conceitos (Sidebar e Academy)",
    icon: "💡",
    color: "from-violet-500/20 to-purple-500/20",
    borderColor: "hover:border-violet-500/50",
    adminOnly: true,
  },
  {
    value: "course",
    label: "Curso",
    description:
      "Trilhas de aprendizado estruturadas com módulos, exercícios MCQ e certificado de conclusão.",
    location: "Academy → Cursos",
    icon: "🎓",
    color: "from-pink-500/20 to-rose-500/20",
    borderColor: "hover:border-pink-500/50",
    adminOnly: true,
  },
  {
    value: "technical-test",
    label: "Simulado Técnico",
    description:
      "Avaliações técnicas com quiz + desafio de código para medir conhecimento prático.",
    location: "Simulados Técnicos",
    icon: "📝",
    color: "from-teal-500/20 to-cyan-500/20",
    borderColor: "hover:border-teal-500/50",
    adminOnly: true,
  },
];

interface ContentTypeSelectorProps {
  userName: string;
  userRole: string;
  userImage: string | null;
  isAdmin: boolean;
}

export function ContentTypeSelector({
  userName,
  userRole,
  userImage,
  isAdmin,
}: ContentTypeSelectorProps) {
  const router = useRouter();
  const allowedTypes = ALL_TYPES.filter((t) => !t.adminOnly || isAdmin);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/admin/content"
          className="hover:text-foreground transition-colors"
        >
          Conteúdos
        </Link>
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
        <span className="text-foreground font-medium">Novo Conteúdo</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          O que vamos criar hoje?
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Cada tipo de conteúdo possui um formulário específico adaptado à sua
          estrutura. Selecione o tipo para começar.
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm">
        <div className="h-6 w-6 overflow-hidden rounded-full bg-muted">
          {userImage ? (
            <Image
              src={userImage}
              alt={userName}
              width={24}
              height={24}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-muted-foreground">
              {userName[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <span className="text-muted-foreground">Autenticado como</span>
        <span className="font-medium text-foreground">{userName}</span>
        <span
          className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
            isAdmin
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
          }`}
        >
          {userRole}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allowedTypes.map((type) => (
          <button
            key={type.value}
            onClick={() =>
              router.push(`/admin/content/editor?type=${type.value}`)
            }
            className={`group relative flex flex-col items-start gap-4 rounded-2xl border-2 border-border bg-card p-6 text-left transition-all ${type.borderColor} hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98]`}
          >
            <div
              className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${type.color} opacity-0 transition-opacity group-hover:opacity-100`}
            />

            <div className="relative flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl transition-all group-hover:bg-primary/20 group-hover:scale-110">
                {type.icon}
              </div>
              <div>
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                  {type.label}
                </h3>
                {type.adminOnly && (
                  <span className="inline-block rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                    ADMIN
                  </span>
                )}
              </div>
            </div>

            <p className="relative text-sm text-muted-foreground leading-relaxed">
              {type.description}
            </p>

            <div className="relative flex items-center gap-1.5 rounded-lg bg-secondary/80 px-2.5 py-1.5 text-[11px] text-muted-foreground">
              <svg
                className="h-3 w-3 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
              {type.location}
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-center pt-2">
        <Link
          href="/admin/content"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Voltar para a listagem
        </Link>
      </div>
    </div>
  );
}
