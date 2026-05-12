import { Button } from "@/components/ui/button";
import { TechnicalTest } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";

interface Props {
  questions: TechnicalTest["questions"];
  answers: Record<string, string>;
  activeTab: number | "challenge";
  setActiveTab: (tab: number | "challenge") => void;
  allTestsPassed: boolean;
  onGiveUp: () => void;
  onFinish: () => void;
}

export function TestNavigation({
  questions,
  answers,
  activeTab,
  setActiveTab,
  allTestsPassed,
  onGiveUp,
  onFinish,
}: Props) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 border-b-4 border-primary bg-muted/10 p-6">
      <div className="space-y-4 w-full lg:w-auto">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-primary" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
            Navegação do Simulado
          </h3>
        </div>
        <nav className="flex flex-wrap gap-2">
          {questions.map((q, i) => {
            const isAnswered = !!answers[q.id];
            const isActive = activeTab === i;
            return (
              <button
                key={q.id}
                onClick={() => setActiveTab(i)}
                className={cn(
                  "h-10 w-10 border-2 font-black text-xs transition-all cursor-pointer flex items-center justify-center",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-[3px_3px_0_0_rgba(0,0,0,0.1)]"
                    : isAnswered
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 hover:border-emerald-500"
                      : "border-border hover:border-primary/50 bg-background text-muted-foreground",
                )}
              >
                {i + 1}
              </button>
            );
          })}
          <button
            onClick={() => setActiveTab("challenge")}
            className={cn(
              "px-6 h-10 border-2 font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center",
              activeTab === "challenge"
                ? "border-primary bg-primary text-primary-foreground shadow-[3px_3px_0_0_rgba(0,0,0,0.1)]"
                : allTestsPassed
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 hover:border-emerald-500"
                  : "border-border hover:border-primary/50 bg-background text-muted-foreground",
            )}
          >
            Parte Prática
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-3 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-border/50">
        <Button
          variant="outline"
          onClick={onGiveUp}
          className="flex-1 lg:flex-none rounded-none font-black uppercase tracking-widest text-destructive hover:bg-destructive hover:text-white border-destructive/30 text-[10px] h-12 px-6"
        >
          <LogOut className="mr-2 h-4 w-4" /> Desistir
        </Button>
        <Button
          variant="default"
          onClick={onFinish}
          className="flex-1 lg:flex-none rounded-none font-black uppercase tracking-widest text-[10px] h-12 px-10 shadow-[4px_4px_0_0_rgba(var(--primary-rgb),0.2)]"
        >
          Finalizar Teste
        </Button>
      </div>
    </div>
  );
}
