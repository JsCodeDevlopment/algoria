import { ReactNode } from "react";
import { Brain, CloudCog, MonitorSmartphone, Server, Users } from "lucide-react";
import { EngineeringWorkPillar } from "@/lib/content/schemas";

export const PILLAR_ICON: Record<EngineeringWorkPillar, ReactNode> = {
  frontend: <MonitorSmartphone className="h-8 w-8" aria-hidden />,
  backend: <Server className="h-8 w-8" aria-hidden />,
  devops: <CloudCog className="h-8 w-8" aria-hidden />,
  softskills: <Users className="h-8 w-8" aria-hidden />,
  ia: <Brain className="h-8 w-8" aria-hidden />,
};

export const PILLAR_TITLE: Record<EngineeringWorkPillar, string> = {
  frontend: "Frontend e produto",
  backend: "Backend e APIs",
  devops: "DevOps e sistema",
  softskills: "Carreira e Soft Skills",
  ia: "Inteligência Artificial",
};

export const PILLAR_TAGLINE: Record<EngineeringWorkPillar, string> = {
  frontend: "Performance real, segurança web e SEO técnico honesto.",
  backend: "Identidade, permissões, contratos estáveis e resiliência.",
  devops: "Entrega contínua, observabilidade e segurança operacional.",
  softskills: "Liderança, comunicação e produtividade profissional.",
  ia: "LLMs, treinamento de modelos e infraestrutura para IA.",
};

export const PILLAR_COLOR: Record<EngineeringWorkPillar, string> = {
  frontend: "from-blue-500/10 to-indigo-500/10",
  backend: "from-emerald-500/10 to-teal-500/10",
  devops: "from-orange-500/10 to-amber-500/10",
  softskills: "from-purple-500/10 to-pink-500/10",
  ia: "from-fuchsia-500/10 to-violet-500/10",
};
