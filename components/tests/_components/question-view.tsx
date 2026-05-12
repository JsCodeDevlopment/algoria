import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TechnicalTest } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";

interface Props {
  question: TechnicalTest["questions"][0];
  index: number;
  total: number;
  selectedOptionId: string | undefined;
  onSelect: (optionId: string) => void;
  onNext: () => void;
}

export function QuestionView({ question, index, total, selectedOptionId, onSelect, onNext }: Props) {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-2 border-primary/20 bg-primary/5 p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <span className="text-8xl font-black">{index + 1}</span>
        </div>
        <div className="relative z-10">
          <div className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            Questão Teórica {index + 1} de {total}
          </div>
          <h2 className="text-2xl md:text-3xl font-black leading-tight tracking-tight text-foreground">
            {question.question}
          </h2>
        </div>
      </div>

      <div className="grid gap-4">
        {question.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className={cn(
                "w-full text-left p-6 border-2 transition-all cursor-pointer flex items-center gap-6",
                isSelected
                  ? "border-primary bg-primary/5 shadow-[4px_4px_0_0_rgba(var(--primary-rgb),0.2)]"
                  : "border-border hover:border-primary/40 bg-background",
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center border-2 text-xs font-black uppercase",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground text-muted-foreground",
                )}
              >
                {opt.id}
              </div>
              <span className="font-bold text-lg leading-relaxed">
                {opt.text}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-border/50">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          * Seleciona uma opção para salvar automaticamente
        </p>
        <Button
          variant="outline"
          onClick={onNext}
          className="rounded-none font-black uppercase tracking-widest h-12 px-8"
        >
          {index < total - 1 ? "Próxima Pergunta" : "Ir para o Desafio"}{" "}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
