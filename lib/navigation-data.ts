import {
  BookOpen,
  Briefcase,
  CircleDollarSign,
  Code2,
  GraduationCap,
  Languages,
  Map,
  Sparkles,
  Users,
} from "lucide-react";

export const NAVIGATION_ITEMS = [
  {
    href: "/problems",
    label: "Abrir catálogo",
    description: "Catálogo e code player",
    Icon: Code2,
  },
  {
    href: "/tracks",
    label: "Trilhos",
    description: "Percursos recomendados",
    Icon: Map,
  },
  {
    href: "/concepts",
    label: "Conceitos",
    description: "Resumos algorítmicos",
    Icon: BookOpen,
  },
  {
    href: "/interview-en",
    label: "Inglês entrevistas",
    description: "Preparação EN",
    Icon: Languages,
  },
  {
    href: "/engineering-work",
    label: "Engenharia no trabalho",
    description: "Roadmap em produção",
    Icon: Briefcase,
  },
  {
    href: "/course",
    label: "Curso",
    description: "Fundamentos guiados",
    Icon: GraduationCap,
  },
  {
    href: "/explorer",
    label: "Explorar",
    description: "Encontrar talentos",
    Icon: Users,
  },
  {
    href: "/tests",
    label: "Testes técnicos",
    description: "Preparação para vagas",
    Icon: Code2,
  },
  {
    href: "/pricing",
    label: "Preços",
    description: "Planos Free e Pro",
    Icon: CircleDollarSign,
  },
  {
    href: "/changelog",
    label: "Novidades",
    description: "Alterações da plataforma",
    Icon: Sparkles,
  },
] as const;
