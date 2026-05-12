import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TechnicalTest } from "@/lib/content/schemas";
import { authClient } from "@/lib/auth-client";

interface Props {
  test: TechnicalTest;
  onStart: () => void;
  session: typeof authClient.$Infer.Session | null | undefined;
}

export function IntroStep({ test, onStart, session }: Props) {
  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-muted/20 border-2 border-border p-8">
        <h2 className="mb-4 text-xl font-black uppercase tracking-widest">
          Instruções
        </h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {test.description}
        </p>
        <ul className="space-y-3 text-sm font-medium">
          <li className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-primary" /> Parte 1:{" "}
            {test.questions.length} perguntas de escolha múltipla.
          </li>
          <li className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-primary" /> Parte 2:
            Desafio de código com casos de teste.
          </li>
          <li className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-primary" /> Podes navegar
            livremente entre as secções.
          </li>
          <li className="flex items-center gap-2 text-destructive">
            <ChevronRight className="h-4 w-4" /> Em caso de desistência, o
            teu progresso será perdido.
          </li>
        </ul>
      </div>
      {!session && (
        <div className="bg-amber-500/10 border-2 border-amber-500/30 p-4 mb-4 text-sm font-medium text-amber-600 flex items-center gap-3">
          <div className="h-2 w-2 bg-amber-500 rounded-full animate-pulse" />
          Atenção: Estás a realizar o teste como convidado. O teu progresso
          não será guardado no teu perfil.
        </div>
      )}
      <Button
        size="lg"
        onClick={onStart}
        className="w-full rounded-none font-black uppercase cursor-pointer tracking-widest h-14"
      >
        Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}
